import React, { useState } from 'react';
import { BuildingShelter } from '../types/shelter';
import { 
  Users, 
  Droplet, 
  Utensils, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface CrisisSimulatorProps {
  shelters: BuildingShelter[];
  onSelectShelter: (shelter: BuildingShelter) => void;
}

export const CrisisSimulator: React.FC<CrisisSimulatorProps> = ({
  shelters,
  onSelectShelter,
}) => {
  const [affectedCount, setAffectedCount] = useState<number>(1200);
  const [selectedScenario, setSelectedScenario] = useState<string>('enchente_chuvas');

  const presetScenarios = [
    {
      id: 'enchente_chuvas',
      title: 'Transbordamento do Rio Norte (Enchente Sazonal)',
      count: 1200,
      description: 'Bairros ribeirinhos alagados. Necessidade prioritária de abrigos em cotas acima de 780m.',
    },
    {
      id: 'deslizamento_serra',
      title: 'Deslizamento em Encostas (Serra Leste)',
      count: 650,
      description: 'Evacuação preventiva de 180 famílias em encostas com trincas de solo após 120mm de chuva.',
    },
    {
      id: 'tempestade_severa',
      title: 'Vendaval e Destelhamentos Urbanos',
      count: 2400,
      description: 'Danos massivos a coberturas residenciais na zona norte e corte de energia geral.',
    },
  ];

  const handleApplyScenario = (count: number, id: string) => {
    setAffectedCount(count);
    setSelectedScenario(id);
  };

  // Only consider safe, non-inapto shelters
  const eligibleShelters = shelters
    .filter(s => s.status !== 'INAPTO')
    .sort((a, b) => {
      // Prioritize Class A, then higher IAA score
      if (a.status === 'APTO_IMEDIATO' && b.status !== 'APTO_IMEDIATO') return -1;
      if (a.status !== 'APTO_IMEDIATO' && b.status === 'APTO_IMEDIATO') return 1;
      return b.overallScore - a.overallScore;
    });

  // Calculate allocation pipeline
  let remainingNeeded = affectedCount;
  const allocation = eligibleShelters.map((s) => {
    if (remainingNeeded <= 0) {
      return { shelter: s, allocated: 0, percentOccupied: 0, activated: false };
    }
    const alloc = Math.min(remainingNeeded, s.capacityPersons);
    remainingNeeded -= alloc;
    return {
      shelter: s,
      allocated: alloc,
      percentOccupied: Math.round((alloc / s.capacityPersons) * 100),
      activated: alloc > 0,
    };
  });

  const totalMobilizedCapacity = allocation.reduce((acc, curr) => acc + curr.allocated, 0);
  const deficit = Math.max(0, affectedCount - totalMobilizedCapacity);

  // Humanitarian daily supplies calculation based on SPHERE standards:
  // - 15 Liters of water per person per day (drinking + basic hygiene)
  // - 3 meals per person per day
  // - 1 family hygiene kit for every 4 people
  const dailyWaterNeedsLitres = affectedCount * 15;
  const dailyMealsCount = affectedCount * 3;
  const hygieneKitsCount = Math.ceil(affectedCount / 4);

  return (
    <div className="space-y-6">
      {/* Simulator Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 uppercase tracking-wider">
              <span>Módulo de Contingência & Apoio à Decisão</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">
              Simulador de Demanda e Alocação de Desabrigados
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Algoritmo de triagem rápida que mobiliza prioritariamente edificações Classe A (Apto Imediato)
              e estima a logística humanitária essencial para acolhimento digno.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center gap-4 shrink-0">
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Demanda Estimada</div>
              <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                {affectedCount.toLocaleString('pt-BR')}
                <span className="text-xs font-normal text-slate-500 ml-1">pessoas</span>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-200" />

            <div>
              <div className="text-[11px] text-slate-500 font-medium">Capacidade Mobilizada</div>
              <div className={`text-2xl font-bold font-mono tabular-nums ${deficit > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                {totalMobilizedCapacity.toLocaleString('pt-BR')}
              </div>
            </div>
          </div>
        </div>

        {/* Preset Crisis Scenarios */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Cenários de Desastre Pré-Configurados
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {presetScenarios.map((sc) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => handleApplyScenario(sc.count, sc.id)}
                className={`p-3 rounded-lg text-left border transition-all ${
                  selectedScenario === sc.id
                    ? 'border-rose-600 bg-rose-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span>{sc.title}</span>
                  <span className="font-mono text-rose-700 font-bold">{sc.count} hab</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  {sc.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Demand Slider */}
        <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
          <div className="flex justify-between text-xs text-slate-600 font-medium">
            <span>Ajuste Manual do Volume de População Acometida:</span>
            <span className="font-bold text-slate-900 font-mono">{affectedCount} indivíduos</span>
          </div>
          <input
            type="range"
            min="100"
            max="4000"
            step="50"
            value={affectedCount}
            onChange={(e) => {
              setAffectedCount(parseInt(e.target.value));
              setSelectedScenario('custom');
            }}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-700"
          />
        </div>
      </div>

      {/* Humanitarian Resource Estimation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700">
            <Droplet className="w-4 h-4 text-blue-500" />
            <span>Água Potável Requerida</span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums mt-1">
            {dailyWaterNeedsLitres.toLocaleString('pt-BR')} L/dia
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            15L por pessoa/dia (consumo, cocção e higiene básica)
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700">
            <Utensils className="w-4 h-4 text-amber-500" />
            <span>Alimentação Diária</span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums mt-1">
            {dailyMealsCount.toLocaleString('pt-BR')} refeições
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            3 refeições balanceadas/dia por pessoa acolhida
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
            <Users className="w-4 h-4 text-emerald-500" />
            <span>Kits de Higiene Familiar</span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums mt-1">
            {hygieneKitsCount.toLocaleString('pt-BR')} unidades
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            1 kit padrão Defesa Civil para cada núcleo familiar (4 pessoas)
          </div>
        </div>
      </div>

      {/* Deficit Alert if any */}
      {deficit > 0 && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-sm text-rose-900">
            <div className="font-bold">Déficit de Vagas em Abrigos Seguros: {deficit} pessoas desassistidas!</div>
            <p className="text-xs text-rose-800 leading-relaxed">
              A capacidade total das edificações aprovadas ({totalMobilizedCapacity} vagas) é insuficiente
              para o cenário simulado. É imperativo inspecionar e adequar rapidamente edificações com ressalvas
              ou requisitar ginásios esportivos em municípios vizinhos via consórcio intermunicipal.
            </p>
          </div>
        </div>
      )}

      {/* Shelter Activation Priority Order Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Ordem de Mobilização Prioritária dos Prédios
            </h3>
            <p className="text-xs text-slate-500">
              Classificação por segurança estrutural, índice IAA e proximidade
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {allocation.map(({ shelter, allocated, percentOccupied, activated }, index) => (
            <div
              key={shelter.id}
              className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                activated ? 'bg-white' : 'bg-slate-50/50 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs font-mono shrink-0 ${
                  activated ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  0{index + 1}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-slate-500">{shelter.code}</span>
                    <span className="text-sm font-bold text-slate-900">{shelter.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      shelter.status === 'APTO_IMEDIATO' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      IAA {shelter.overallScore}%
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {shelter.neighborhood} · Cota {shelter.elevationMeters}m · Capacidade total: {shelter.capacityPersons} vagas
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0">
                <div className="text-right">
                  <div className="text-xs text-slate-500">Alocação Recomendada</div>
                  <div className="text-base font-bold font-mono text-slate-900 tabular-nums">
                    {allocated} / {shelter.capacityPersons}
                    <span className="text-xs font-normal text-slate-500 ml-1">({percentOccupied}%)</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectShelter(shelter)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
                >
                  <span>Ver Ficha</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
