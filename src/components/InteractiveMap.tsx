import React, { useState } from 'react';
import { BuildingShelter, CityRegion } from '../types/shelter';
import { 
  Layers, 
  MapPin, 
  AlertTriangle, 
  ShieldCheck, 
  XCircle, 
  Eye, 
  Compass, 
  Waves,
  Mountain
} from 'lucide-react';

interface InteractiveMapProps {
  shelters: BuildingShelter[];
  onSelectShelter: (shelter: BuildingShelter) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  shelters,
  onSelectShelter,
}) => {
  const [selectedCity, setSelectedCity] = useState<CityRegion>('JOINVILLE_SC');
  const [selectedPin, setSelectedPin] = useState<BuildingShelter | null>(shelters[0] || null);
  const [showFloodOverlay, setShowFloodOverlay] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'APTO' | 'INAPTO'>('ALL');

  const isJoinville = selectedCity === 'JOINVILLE_SC';

  const cityShelters = shelters.filter(s => s.cityRegion === selectedCity);
  const filteredShelters = cityShelters.filter(s => {
    if (statusFilter === 'APTO') return s.status === 'APTO_IMEDIATO' || s.status === 'APTO_COM_RESSALVAS';
    if (statusFilter === 'INAPTO') return s.status === 'INAPTO';
    return true;
  });

  // Dynamic bounds for Joinville vs RS
  const minLat = isJoinville ? -26.36 : -30.15;
  const maxLat = isJoinville ? -26.20 : -29.35;
  const minLng = isJoinville ? -48.94 : -52.10;
  const maxLng = isJoinville ? -48.80 : -51.00;

  const getCanvasCoords = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 740 + 30;
    // invert Y for canvas
    const y = ((maxLat - lat) / (maxLat - minLat)) * 440 + 30;
    return { x, y };
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      {/* Top Map Toolbar */}
      <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Compass className="w-4 h-4 text-rose-600" />
            <span>Mapeamento Geoespacial de Abrigos e Zonas de Risco</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Análise topográfica com cota de inundação e raio de segurança
          </p>
        </div>

        {/* Filter Controls (Segmented functional buttons) */}
        <div className="flex flex-wrap items-center gap-2">
          {/* City / Region Switch */}
          <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setSelectedCity('JOINVILLE_SC')}
              className={`px-3 py-1 rounded-md transition-colors ${
                selectedCity === 'JOINVILLE_SC' ? 'bg-rose-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Joinville (Morro do Meio)
            </button>
            <button
              onClick={() => setSelectedCity('RIO_GRANDE_DO_SUL')}
              className={`px-3 py-1 rounded-md transition-colors ${
                selectedCity === 'RIO_GRANDE_DO_SUL' ? 'bg-rose-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rio Grande do Sul
            </button>
          </div>

          <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-lg text-xs font-medium">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos ({cityShelters.length})
            </button>
            <button
              onClick={() => setStatusFilter('APTO')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === 'APTO' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Aptos ({cityShelters.filter(s => s.status !== 'INAPTO').length})
            </button>
            <button
              onClick={() => setStatusFilter('INAPTO')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === 'INAPTO' ? 'bg-white text-rose-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Inaptos ({cityShelters.filter(s => s.status === 'INAPTO').length})
            </button>
          </div>

          <button
            onClick={() => setShowFloodOverlay(!showFloodOverlay)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              showFloodOverlay
                ? 'bg-blue-50 text-blue-800 border-blue-200'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Waves className="w-3.5 h-3.5 text-blue-600" />
            <span>Mancha de Inundação</span>
          </button>
        </div>
      </div>

      {/* Map Interactive Area */}
      <div className="relative bg-slate-950 min-h-[460px] overflow-hidden select-none">
        {/* SVG Graphic Map */}
        <svg 
          viewBox="0 0 800 500" 
          className="w-full h-[460px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
        >
          <defs>
            {/* Grid pattern */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            </pattern>

            {/* Flood zone gradient */}
            <linearGradient id="floodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.15" />
            </linearGradient>
          </defs>

          {/* Grid Background */}
          <rect width="800" height="500" fill="url(#grid)" />

          {/* Topographical contours (Hills & Elevations) */}
          <path
            d="M 50,450 Q 200,320 400,380 T 750,300"
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <path
            d="M 20,250 Q 250,150 480,200 T 780,120"
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Simulated River Vector (Rio Norte) */}
          <path
            d="M 680,20 Q 580,180 520,280 T 430,480"
            fill="none"
            stroke="#0284c7"
            strokeWidth="24"
            strokeLinecap="round"
            strokeOpacity="0.5"
          />
          <path
            d="M 680,20 Q 580,180 520,280 T 430,480"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="8"
            strokeLinecap="round"
            strokeOpacity="0.85"
          />

          {/* River Label */}
          <text x="440" y="240" fill="#7dd3fc" fontSize="11" fontWeight="600" letterSpacing="1">
            {isJoinville
              ? 'BACIA DO RIO ÁGUAS VERMELHAS / MORRO DO MEIO & RIO CACHOEIRA'
              : 'CALHA DO GUAÍBA / RIO JACUÍ (COTA 5,35m)'}
          </text>

          {/* Flood Plain Hazard Layer (Mancha de Inundação) */}
          {showFloodOverlay && (
            <g>
              <path
                d="M 600,0 Q 520,150 460,260 Q 400,370 360,500 L 520,500 Q 570,380 620,260 T 750,0 Z"
                fill="url(#floodGrad)"
                stroke="#0ea5e9"
                strokeWidth="1"
                strokeDasharray="6 3"
              />
              <text x="340" y="380" fill="#38bdf8" fontSize="10" fontWeight="600" opacity="0.9">
                {isJoinville
                  ? 'MANCHA CRÍTICA: VÁRZEA DO MORRO DO MEIO / RUA MINAS GERAIS & VILA NOVA'
                  : 'MANCHA DE INUNDAÇÃO CRÍTICA (REFLUXO EBAPs / DIQUES)'}
              </text>
            </g>
          )}

          {/* Safe Elevation Indicators */}
          <g transform="translate(100, 80)">
            <circle cx="0" cy="0" r="4" fill="#10b981" opacity="0.6" />
            <text x="10" y="4" fill="#a7f3d0" fontSize="10" fontFamily="sans-serif">
              {isJoinville
                ? 'Zona Segura / Vila Nova Alto e Costa e Silva (Cotas > 15m)'
                : 'Zona Segura / Planalto RS (Cotas > 20m)'}
            </text>
          </g>

          {/* Plot Each Shelter Marker */}
          {filteredShelters.map((shelter) => {
            const { x, y } = getCanvasCoords(shelter.coordinates.lat, shelter.coordinates.lng);
            const isSelected = selectedPin?.id === shelter.id;

            let pinColor = '#10b981'; // Green Apto
            if (shelter.status === 'APTO_COM_RESSALVAS') pinColor = '#f59e0b'; // Amber
            if (shelter.status === 'INAPTO') pinColor = '#f43f5e'; // Red

            return (
              <g
                key={shelter.id}
                className="cursor-pointer transition-transform duration-200"
                onClick={() => setSelectedPin(shelter)}
                transform={`translate(${x}, ${y})`}
              >
                {/* Influence Radius Circle for Selected Pin */}
                {isSelected && (
                  <circle
                    cx="0"
                    cy="0"
                    r="45"
                    fill={pinColor}
                    fillOpacity="0.15"
                    stroke={pinColor}
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    className="animate-pulse"
                  />
                )}

                {/* Base Marker Shadow & Core */}
                <circle cx="0" cy="0" r={isSelected ? "14" : "10"} fill="#0f172a" stroke={pinColor} strokeWidth={isSelected ? "3" : "2"} />
                <circle cx="0" cy="0" r={isSelected ? "7" : "5"} fill={pinColor} />

                {/* Building Code Label */}
                <text
                  x="0"
                  y="-16"
                  fill="#f8fafc"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                  className="pointer-events-none drop-shadow-md font-mono"
                >
                  {shelter.code}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Building Floating Overlay Card */}
        {selectedPin && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-xl border border-slate-200 text-slate-900 z-20">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                  <span>{selectedPin.code}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedPin.type}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 line-clamp-1 mt-0.5">
                  {selectedPin.name}
                </h4>
                <div className="text-xs text-slate-500 mt-0.5">
                  {selectedPin.neighborhood} · Cota {selectedPin.elevationMeters}m
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  selectedPin.status === 'APTO_IMEDIATO' ? 'bg-emerald-100 text-emerald-800' :
                  selectedPin.status === 'APTO_COM_RESSALVAS' ? 'bg-amber-100 text-amber-800' :
                  'bg-rose-100 text-rose-800'
                }`}>
                  IAA {selectedPin.overallScore}%
                </span>
              </div>
            </div>

            {selectedPin.hasCriticalVeto ? (
              <div className="mt-2 text-xs text-rose-700 bg-rose-50 p-2 rounded border border-rose-200">
                {selectedPin.vetoReason}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs bg-slate-50 p-2 rounded-lg">
                <div>
                  <span className="text-slate-500">Capacidade:</span>{' '}
                  <strong className="text-slate-900 font-mono">{selectedPin.capacityPersons} vagas</strong>
                </div>
                <div>
                  <span className="text-slate-500">Água:</span>{' '}
                  <strong className="text-slate-900 font-mono">{(selectedPin.facilities.waterTanksLiters / 1000).toFixed(0)}k L</strong>
                </div>
              </div>
            )}

            <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-500">
                {selectedPin.facilities.generatorInstalled ? '✓ Gerador ativo' : '✗ Sem gerador'}
              </span>
              <button
                onClick={() => onSelectShelter(selectedPin)}
                className="px-3 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
              >
                Abrir Ficha Completa
              </button>
            </div>
          </div>
        )}

        {/* Map Legend (Bottom Right) */}
        <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md rounded-lg p-3 text-[11px] text-slate-300 border border-slate-800 space-y-1.5 hidden sm:block">
          <div className="font-semibold text-white uppercase text-[10px] tracking-wider mb-1">
            Legenda Operacional
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Apto Imediato (IAA ≥ 80%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Apto c/ Ressalvas (60-79%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Inapto / Risco Crítico</span>
          </div>
          <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
            <span className="w-4 h-1.5 bg-sky-400 rounded-sm" />
            <span>Calha do Rio & Várzea</span>
          </div>
        </div>
      </div>
    </div>
  );
};
