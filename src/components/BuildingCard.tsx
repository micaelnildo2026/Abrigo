import React, { useState } from 'react';
import { BuildingShelter } from '../types/shelter';
import { 
  Building, 
  MapPin, 
  Users, 
  Droplet, 
  Zap, 
  Accessibility, 
  Utensils, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  ChevronRight,
  FileCheck
} from 'lucide-react';

interface BuildingCardProps {
  shelter: BuildingShelter;
  onSelect: (shelter: BuildingShelter) => void;
  onGenerateReport: (shelter: BuildingShelter) => void;
}

export const BuildingCard: React.FC<BuildingCardProps> = ({
  shelter,
  onSelect,
  onGenerateReport,
}) => {
  const [imageError, setImageError] = useState(false);

  // Status visual cues with unboxed typography
  const statusConfig = {
    APTO_IMEDIATO: {
      text: 'Apto Imediato',
      textColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      icon: CheckCircle2,
    },
    APTO_COM_RESSALVAS: {
      text: 'Apto c/ Ressalvas',
      textColor: 'text-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      icon: AlertCircle,
    },
    INAPTO: {
      text: 'Inapto / Risco',
      textColor: 'text-rose-700',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      icon: XCircle,
    },
  }[shelter.status];

  const StatusIcon = statusConfig.icon;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-all flex flex-col justify-between group shadow-xs">
      <div>
        {/* Image Slot with Fallback Container */}
        <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
          {!imageError ? (
            <img
              src={shelter.imageUrl}
              alt={shelter.name}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 p-4">
              <Building className="w-10 h-10 mb-2 text-slate-400" />
              <span className="text-xs font-medium text-slate-500">{shelter.name}</span>
            </div>
          )}

          {/* Floating IAA Score Gauge */}
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs border border-slate-200/80 rounded-lg px-2.5 py-1 shadow-sm flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">IAA</span>
            <span className={`text-sm font-bold font-mono tabular-nums ${
              shelter.overallScore >= 80 ? 'text-emerald-700' :
              shelter.overallScore >= 60 ? 'text-amber-700' : 'text-rose-700'
            }`}>
              {shelter.overallScore}%
            </span>
          </div>

          {/* Status Label (Clean unboxed design) */}
          <div className={`absolute bottom-3 left-3 px-2.5 py-1 rounded-md text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 ${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor} shadow-xs`}>
            <StatusIcon className="w-3.5 h-3.5 shrink-0" />
            <span>{statusConfig.text}</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-4">
          {/* Header & Meta */}
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <span className="font-mono text-slate-600">{shelter.code}</span>
              <span aria-hidden="true">·</span>
              <span className="truncate">{shelter.type}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-rose-700 transition-colors line-clamp-1">
              {shelter.name}
            </h3>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 truncate">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
              <span>{shelter.neighborhood} · Cota {shelter.elevationMeters}m</span>
            </p>
          </div>

          {/* Critical Veto Banner if Inapto */}
          {shelter.hasCriticalVeto && shelter.vetoReason && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 leading-snug">
              <span className="font-semibold">Veto Técnico: </span>
              {shelter.vetoReason}
            </div>
          )}

          {/* Capacity and Area Grid */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
            <div className="bg-slate-50 rounded-lg p-2.5">
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>Capacidade</span>
              </div>
              <div className="text-sm font-bold text-slate-900 font-mono tabular-nums mt-0.5">
                {shelter.status === 'INAPTO' ? '0' : shelter.capacityPersons}
                <span className="text-[11px] font-normal text-slate-500 ml-1">vagas</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-2.5">
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <Droplet className="w-3.5 h-3.5 text-blue-500" />
                <span>Água Reserva</span>
              </div>
              <div className="text-sm font-bold text-slate-900 font-mono tabular-nums mt-0.5">
                {(shelter.facilities.waterTanksLiters / 1000).toFixed(0)}k
                <span className="text-[11px] font-normal text-slate-500 ml-1">litros</span>
              </div>
            </div>
          </div>

          {/* Quick Facility Indicators */}
          <div className="flex items-center gap-3 text-xs text-slate-600 pt-1">
            <div 
              title={shelter.facilities.generatorInstalled ? "Gerador instalado e testado" : "Sem gerador de emergência"}
              className={`flex items-center gap-1 ${shelter.facilities.generatorInstalled ? "text-emerald-700 font-medium" : "text-slate-400"}`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Gerador</span>
            </div>

            <div 
              title={shelter.facilities.accessiblePCD ? "Acessibilidade plena NBR 9050" : "Acessibilidade parcial ou nula"}
              className={`flex items-center gap-1 ${shelter.facilities.accessiblePCD ? "text-emerald-700 font-medium" : "text-slate-400"}`}
            >
              <Accessibility className="w-3.5 h-3.5" />
              <span>PcD</span>
            </div>

            <div 
              title={shelter.facilities.kitchenEquipped ? "Cozinha estruturada p/ refeições" : "Sem cozinha equipada"}
              className={`flex items-center gap-1 ${shelter.facilities.kitchenEquipped ? "text-emerald-700 font-medium" : "text-slate-400"}`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Cozinha</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onGenerateReport(shelter)}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 transition-colors"
        >
          <FileCheck className="w-3.5 h-3.5 text-slate-400" />
          <span>Laudo Técnico</span>
        </button>

        <button
          type="button"
          onClick={() => onSelect(shelter)}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap active:scale-[0.98]"
        >
          <span>Ficha Técnica</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
