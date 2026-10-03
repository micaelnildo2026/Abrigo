import React from 'react';
import { BuildingShelter } from '../types/shelter';
import { Printer, X, ShieldCheck, AlertTriangle, XCircle } from 'lucide-react';

interface OfficialReportModalProps {
  shelter: BuildingShelter | null;
  onClose: () => void;
}

export const OfficialReportModal: React.FC<OfficialReportModalProps> = ({
  shelter,
  onClose,
}) => {
  if (!shelter) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 print:border-none print:shadow-none print:max-h-none print:rounded-none">
        {/* Modal Controls (Hidden in print) */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between z-10 print:hidden">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Visualização de Impressão / Documento Pericial
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Salvar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Printable Document Body */}
        <div className="p-8 sm:p-12 space-y-8 font-sans text-slate-900">
          {/* Document Header matching "Macro Norte Engenharia do Amanhã" */}
          <div className="border-b-2 border-slate-900 pb-6 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-rose-700 text-white font-black flex items-center justify-center text-sm tracking-tighter">
                  MN
                </div>
                <div>
                  <div className="text-sm font-extrabold tracking-tight text-slate-900 uppercase">
                    Macro Norte
                  </div>
                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest -mt-0.5">
                    Engenharia do Amanhã
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-500 space-y-0.5 font-mono">
                <div>Departamento de Engenharia Diagnóstica e Resiliência Urbana</div>
                <div>Protocolo: {shelter.code}-DEF-CIVIL-2026</div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-mono text-slate-500">Data de Emissão:</div>
              <div className="text-xs font-bold text-slate-900 font-mono">
                {new Date().toLocaleDateString('pt-BR')}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Conforme NBR 9050 & SPHERE</div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight text-slate-900">
              Laudo Técnico de Avaliação Estrutural e Habitabilidade para Abrigo Temporário
            </h1>
            <p className="text-xs text-slate-600 max-w-xl mx-auto">
              Instrumento pericial prévio para classificação de edificações públicas em atendimento
              ao plano de contingência municipal de proteção e defesa civil.
            </p>
          </div>

          {/* Identification Section */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 text-xs">
            <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
              1. Identificação da Edificação Vistoriada
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 pt-1">
              <div>
                <span className="text-slate-500">Nome:</span>{' '}
                <strong className="text-slate-900">{shelter.name}</strong>
              </div>
              <div>
                <span className="text-slate-500">Tipologia:</span>{' '}
                <strong className="text-slate-900">{shelter.type}</strong>
              </div>
              <div>
                <span className="text-slate-500">Endereço:</span>{' '}
                <span className="text-slate-800">{shelter.address}</span>
              </div>
              <div>
                <span className="text-slate-500">Bairro / Cota:</span>{' '}
                <span className="text-slate-800">{shelter.neighborhood} (Cota: {shelter.elevationMeters}m)</span>
              </div>
              <div>
                <span className="text-slate-500">Área Útil Coberta:</span>{' '}
                <span className="font-mono font-bold text-slate-900">{shelter.usefulAreaM2} m²</span>
              </div>
              <div>
                <span className="text-slate-500">Capacidade Homologada:</span>{' '}
                <span className="font-mono font-bold text-slate-900">{shelter.capacityPersons} pessoas</span>
              </div>
            </div>
          </div>

          {/* Scoring & Dimension Matrix Table */}
          <div className="space-y-3">
            <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              2. Matriz de Avaliação Técnica Multidimensional (IAA)
            </div>

            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2 px-3">Dimensão Técnica</th>
                  <th className="py-2 px-3 text-right">Peso Máx.</th>
                  <th className="py-2 px-3 text-right">Pontuação Obtida</th>
                  <th className="py-2 px-3">Status de Conformidade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-2 px-3 font-medium">1. Estabilidade Estrutural & Geotécnica</td>
                  <td className="py-2 px-3 text-right font-mono">30 pts</td>
                  <td className="py-2 px-3 text-right font-mono font-bold">{shelter.scoresBreakdown.structural}</td>
                  <td className="py-2 px-3">
                    {shelter.lastInspection.checklist.structuralDamage ? 'VETO CRÍTICO (Trincas Graves)' : 'Conforme'}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">2. Capacidade & Habitabilidade (SPHERE)</td>
                  <td className="py-2 px-3 text-right font-mono">20 pts</td>
                  <td className="py-2 px-3 text-right font-mono font-bold">{shelter.scoresBreakdown.habitability}</td>
                  <td className="py-2 px-3">Pé-direito e ventilação avaliados</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">3. Saneamento, Água & Higiene</td>
                  <td className="py-2 px-3 text-right font-mono">20 pts</td>
                  <td className="py-2 px-3 text-right font-mono font-bold">{shelter.scoresBreakdown.sanitation}</td>
                  <td className="py-2 px-3">{shelter.facilities.toiletsTotal} sanitários · {shelter.facilities.waterTanksLiters}L reserva</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">4. Acessibilidade Universal (NBR 9050)</td>
                  <td className="py-2 px-3 text-right font-mono">15 pts</td>
                  <td className="py-2 px-3 text-right font-mono font-bold">{shelter.scoresBreakdown.accessibility}</td>
                  <td className="py-2 px-3">{shelter.facilities.accessiblePCD ? 'Atende NBR 9050' : 'Inadequado para PcD'}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">5. Logística, Energia & Combate a Incêndio</td>
                  <td className="py-2 px-3 text-right font-mono">15 pts</td>
                  <td className="py-2 px-3 text-right font-mono font-bold">{shelter.scoresBreakdown.logistics}</td>
                  <td className="py-2 px-3">{shelter.facilities.generatorInstalled ? 'Gerador Próprio' : 'Exige gerador móvel'}</td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                <tr>
                  <td className="py-2.5 px-3">Índice de Adequabilidade de Abrigo (IAA)</td>
                  <td className="py-2.5 px-3 text-right font-mono">100 pts</td>
                  <td className="py-2.5 px-3 text-right font-mono text-sm">{shelter.overallScore} pts</td>
                  <td className="py-2.5 px-3 uppercase text-rose-700">
                    {shelter.status.replace(/_/g, ' ')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Technical Opinion / Conclusão Pericial */}
          <div className="space-y-2">
            <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              3. Parecer Técnico Conclusivo
            </div>

            <div className={`p-4 rounded-lg border text-xs leading-relaxed ${
              shelter.status === 'APTO_IMEDIATO'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : shelter.status === 'APTO_COM_RESSALVAS'
                ? 'bg-amber-50 border-amber-200 text-amber-950'
                : 'bg-rose-50 border-rose-200 text-rose-950'
            }`}>
              <div className="font-bold mb-1">
                {shelter.status === 'APTO_IMEDIATO' && 'PARECER: EDIFICAÇÃO APTA PARA ABRIGAMENTO IMEDIATO'}
                {shelter.status === 'APTO_COM_RESSALVAS' && 'PARECER: EDIFICAÇÃO APTA COM RESSALVAS OPERACIONAIS'}
                {shelter.status === 'INAPTO' && 'PARECER: EDIFICAÇÃO INAPTA / INTERDITADA PARA USO COMO ABRIGO'}
              </div>
              <p>{shelter.lastInspection.technicalNotes}</p>
              {shelter.hasCriticalVeto && (
                <p className="mt-2 font-bold text-rose-800">
                  Motivo Impeditivo: {shelter.vetoReason}
                </p>
              )}
            </div>
          </div>

          {/* Remediation Action Plan */}
          {shelter.lastInspection.requiredActions.length > 0 && (
            <div className="space-y-2">
              <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                4. Plano de Intervenção e Ações Corretivas Prioritárias
              </div>
              <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                {shelter.lastInspection.requiredActions.map((act, i) => (
                  <li key={i}>{act}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Signatures & Accreditation */}
          <div className="pt-8 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs">
            <div className="space-y-1">
              <div className="h-10 border-b border-slate-400 mx-auto w-48 mb-2" />
              <div className="font-bold text-slate-900">{shelter.lastInspection.inspectorName}</div>
              <div className="text-slate-500 font-mono">{shelter.lastInspection.creaRegister}</div>
              <div className="text-[10px] text-slate-400">Engenheiro Civil Perito - Macro Norte</div>
            </div>

            <div className="space-y-1">
              <div className="h-10 border-b border-slate-400 mx-auto w-48 mb-2" />
              <div className="font-bold text-slate-900">Coordenadoria Municipal de Proteção e Defesa Civil</div>
              <div className="text-slate-500 font-mono">COMPDEC / Homologação</div>
              <div className="text-[10px] text-slate-400">Plano Municipal de Contingência</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
