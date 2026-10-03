import React from 'react';
import { BuildingShelter } from '../types/shelter';
import { ShieldCheck, AlertTriangle, XCircle, Users, Droplets, Building2 } from 'lucide-react';

interface OverviewStatsProps {
  shelters: BuildingShelter[];
  onFilterStatus?: (status: string) => void;
}

export const OverviewStats: React.FC<OverviewStatsProps> = ({ shelters, onFilterStatus }) => {
  const totalBuildings = shelters.length;
  const aptos = shelters.filter(s => s.status === 'APTO_IMEDIATO').length;
  const comRessalvas = shelters.filter(s => s.status === 'APTO_COM_RESSALVAS').length;
  const inaptos = shelters.filter(s => s.status === 'INAPTO').length;

  const totalCapacity = shelters
    .filter(s => s.status !== 'INAPTO')
    .reduce((acc, curr) => acc + curr.capacityPersons, 0);

  const totalWaterLitres = shelters
    .filter(s => s.status !== 'INAPTO')
    .reduce((acc, curr) => acc + curr.facilities.waterTanksLiters, 0);

  const totalUsefulArea = shelters
    .filter(s => s.status !== 'INAPTO')
    .reduce((acc, curr) => acc + curr.usefulAreaM2, 0);

  return (
    <div className="space-y-6">
      {/* Editorial context banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider">
            <span>Macro Norte Engenharia</span>
            <span aria-hidden="true">·</span>
            <span>Sistema Integrado de Defesa Civil</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Avaliação e Triagem de Prédios para Uso como Abrigos
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Protocolo de auditoria técnica prévia para identificação de edificações seguras,
            garantindo estabilidade estrutural, acessibilidade (NBR 9050), capacidade habitacional
            digna e autonomia hídrica/elétrica para populações afetadas por desastres.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-5 pointer-events-none hidden lg:block">
          <Building2 className="w-96 h-96 text-white" />
        </div>
      </div>

      {/* Grid of high-precision metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Edificações */}
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-500 mb-1">Total de Prédios</div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {totalBuildings}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Cadastrados na rede
          </div>
        </div>

        {/* Aptos Imediatos */}
        <button
          type="button"
          onClick={() => onFilterStatus && onFilterStatus('APTO_IMEDIATO')}
          className="bg-white border border-slate-200 hover:border-emerald-300 rounded-xl p-4 text-left transition-colors group cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-medium text-emerald-700 mb-1">
            <span>Apto Imediato</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 font-mono tabular-nums group-hover:scale-105 transition-transform">
            {aptos}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Classe A (IAA ≥ 80%)
          </div>
        </button>

        {/* Aptos com Ressalvas */}
        <button
          type="button"
          onClick={() => onFilterStatus && onFilterStatus('APTO_COM_RESSALVAS')}
          className="bg-white border border-slate-200 hover:border-amber-300 rounded-xl p-4 text-left transition-colors group cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-medium text-amber-700 mb-1">
            <span>Com Ressalvas</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-700 font-mono tabular-nums group-hover:scale-105 transition-transform">
            {comRessalvas}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Classe B (60% a 79%)
          </div>
        </button>

        {/* Inaptos / Vetados */}
        <button
          type="button"
          onClick={() => onFilterStatus && onFilterStatus('INAPTO')}
          className="bg-white border border-slate-200 hover:border-rose-300 rounded-xl p-4 text-left transition-colors group cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-medium text-rose-700 mb-1">
            <span>Inaptos / Risco</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-700 font-mono tabular-nums group-hover:scale-105 transition-transform">
            {inaptos}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Interdição / Vetado
          </div>
        </button>

        {/* Capacidade Habitacional */}
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
            <span>Capacidade Apta</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {totalCapacity.toLocaleString('pt-BR')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Pessoas (3,8m²/hab)
          </div>
        </div>

        {/* Reserva Hídrica */}
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
            <span>Reserva Hídrica</span>
            <Droplets className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {(totalWaterLitres / 1000).toFixed(0)}k L
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Autonomia de ~3 dias
          </div>
        </div>
      </div>
    </div>
  );
};
