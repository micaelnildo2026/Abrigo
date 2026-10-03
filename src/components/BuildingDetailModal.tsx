import React, { useState } from 'react';
import { BuildingShelter } from '../types/shelter';
import { 
  X, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  Check, 
  AlertCircle, 
  Users, 
  Droplet, 
  Zap, 
  Scale, 
  Printer, 
  Wrench
} from 'lucide-react';

interface BuildingDetailModalProps {
  shelter: BuildingShelter | null;
  onClose: () => void;
  onOpenReport: (shelter: BuildingShelter) => void;
  onUpdateOccupancy: (id: string, newOccupancy: number) => void;
}

export const BuildingDetailModal: React.FC<BuildingDetailModalProps> = ({
  shelter,
  onClose,
  onOpenReport,
  onUpdateOccupancy,
}) => {
  if (!shelter) return null;

  const [occupancyInput, setOccupancyInput] = useState(shelter.currentOccupancy);

  const handleSaveOccupancy = () => {
    onUpdateOccupancy(shelter.id, occupancyInput);
  };

  const occupancyPercent = shelter.capacityPersons > 0
    ? Math.min(100, Math.round((shelter.currentOccupancy / shelter.capacityPersons) * 100))
    : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-slate-100 rounded text-slate-700">
              {shelter.code}
            </span>
            <span className="text-sm text-slate-500">{shelter.type}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenReport(shelter)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Laudo</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Main Title & General Classification */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {shelter.name}
              </h2>
              <p className="text-sm text-slate-600 flex items-center gap-1.5 mt-1">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{shelter.address} ({shelter.neighborhood}) · Cota Altimétrica: {shelter.elevationMeters}m</span>
              </p>
            </div>

            {/* Status and Score Badge */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <div className="text-xs text-slate-500">Índice IAA</div>
                <div className={`text-2xl font-bold font-mono tabular-nums ${
                  shelter.overallScore >= 80 ? 'text-emerald-700' :
                  shelter.overallScore >= 60 ? 'text-amber-700' : 'text-rose-700'
                }`}>
                  {shelter.overallScore}%
                </div>
              </div>

              <div className={`px-3 py-2 rounded-xl text-xs font-semibold border ${
                shelter.status === 'APTO_IMEDIATO'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : shelter.status === 'APTO_COM_RESSALVAS'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}>
                {shelter.status === 'APTO_IMEDIATO' && 'APTO IMEDIATO (CLASSE A)'}
                {shelter.status === 'APTO_COM_RESSALVAS' && 'APTO COM RESSALVAS (CLASSE B)'}
                {shelter.status === 'INAPTO' && 'INAPTO / REJEITADO (CLASSE C)'}
              </div>
            </div>
          </div>

          {/* Critical Veto Alert */}
          {shelter.hasCriticalVeto && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
              <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1 text-sm text-rose-900">
                <div className="font-bold">Veto Crítico de Segurança Estrutural / Geotécnica</div>
                <p className="text-xs text-rose-800 leading-relaxed">
                  {shelter.vetoReason} Este prédio está proibido para abrigamento humano de emergência até
                  execução e aprovação pericial das obras corretivas.
                </p>
              </div>
            </div>
          )}

          {/* Operational Occupancy Bar */}
          {shelter.status !== 'INAPTO' && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Controle de Ocupação em Tempo Real
                  </div>
                  <div className="text-sm text-slate-600">
                    Capacidade calculada: <strong className="font-mono">{shelter.capacityPersons}</strong> pessoas (Base SPHERE: 3,8m² cobertos/pessoa)
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max={shelter.capacityPersons * 2}
                    value={occupancyInput}
                    onChange={(e) => setOccupancyInput(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-24 px-3 py-1 text-sm font-mono border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                  <button
                    onClick={handleSaveOccupancy}
                    className="px-3 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    Atualizar
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs text-slate-500 font-mono mb-1">
                  <span>{shelter.currentOccupancy} abrigados</span>
                  <span>{occupancyPercent}% ocupado</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      occupancyPercent > 90 ? 'bg-rose-600' :
                      occupancyPercent > 70 ? 'bg-amber-500' : 'bg-emerald-600'
                    }`}
                    style={{ width: `${occupancyPercent}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Technical Scores Breakdown (5 Dimensions) */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Desempenho por Dimensão Técnica da Metodologia Macro Norte
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="text-[11px] text-slate-500 font-medium">1. Estrutural & Solo</div>
                <div className="text-lg font-bold font-mono tabular-nums text-slate-900 mt-1">
                  {shelter.scoresBreakdown.structural}
                  <span className="text-xs text-slate-400 font-normal"> / 30 pts</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {shelter.lastInspection.checklist.structuralDamage ? 'Trincas críticas' : 'Estrutura íntegra'}
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="text-[11px] text-slate-500 font-medium">2. Habitabilidade</div>
                <div className="text-lg font-bold font-mono tabular-nums text-slate-900 mt-1">
                  {shelter.scoresBreakdown.habitability}
                  <span className="text-xs text-slate-400 font-normal"> / 20 pts</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Área útil: {shelter.usefulAreaM2}m²
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="text-[11px] text-slate-500 font-medium">3. Saneamento & Água</div>
                <div className="text-lg font-bold font-mono tabular-nums text-slate-900 mt-1">
                  {shelter.scoresBreakdown.sanitation}
                  <span className="text-xs text-slate-400 font-normal"> / 20 pts</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {shelter.facilities.toiletsTotal} sanitários · {shelter.facilities.showersTotal} duchas
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="text-[11px] text-slate-500 font-medium">4. NBR 9050 (PcD)</div>
                <div className="text-lg font-bold font-mono tabular-nums text-slate-900 mt-1">
                  {shelter.scoresBreakdown.accessibility}
                  <span className="text-xs text-slate-400 font-normal"> / 15 pts</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {shelter.facilities.accessiblePCD ? 'Acessível NBR 9050' : 'Inadequado para cadeirantes'}
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="text-[11px] text-slate-500 font-medium">5. Logística & Energia</div>
                <div className="text-lg font-bold font-mono tabular-nums text-slate-900 mt-1">
                  {shelter.scoresBreakdown.logistics}
                  <span className="text-xs text-slate-400 font-normal"> / 15 pts</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {shelter.facilities.generatorInstalled ? 'Com gerador próprio' : 'Sem gerador'}
                </div>
              </div>
            </div>
          </div>

          {/* Technical Notes & Inspection Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase">
                <FileText className="w-4 h-4 text-slate-500" />
                <span>Parecer Técnico do Perito</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                "{shelter.lastInspection.technicalNotes}"
              </p>
              <div className="text-xs text-slate-500 space-y-1 pt-1">
                <div>Responsável Técnico: <strong className="text-slate-800">{shelter.lastInspection.inspectorName}</strong></div>
                <div>Registro Profissional: <span className="font-mono text-slate-700">{shelter.lastInspection.creaRegister}</span></div>
                <div>Data da Vistoria: <span className="font-mono text-slate-700">{shelter.lastInspection.date}</span></div>
              </div>
            </div>

            {/* Action Items / Remediation */}
            <div className="border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase">
                <Wrench className="w-4 h-4 text-rose-600" />
                <span>Ações Requeridas para Conformidade</span>
              </div>

              {shelter.lastInspection.requiredActions.length > 0 ? (
                <ul className="space-y-2">
                  {shelter.lastInspection.requiredActions.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Nenhuma inconformidade impeditiva. Edificação 100% pronta para ativação imediata.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Fechar
          </button>
          <button
            type="button"
            onClick={() => onOpenReport(shelter)}
            className="px-4 py-2 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg transition-colors shadow-xs"
          >
            Gerar Parecer Oficial
          </button>
        </div>
      </div>
    </div>
  );
};
