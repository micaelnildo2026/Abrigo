import React from 'react';
import { X, BookOpen, ExternalLink, BarChart3, Database, ShieldAlert, Award } from 'lucide-react';

interface ResearchSourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResearchSourcesModal: React.FC<ResearchSourcesModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-rose-700" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Fontes Científicas & Estatísticas Consolidadas (2020–2026)
              </h3>
              <p className="text-xs text-slate-500">
                Dados quantitativos oficiais sobre Joinville (SC) e Rio Grande do Sul
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-8 text-xs sm:text-sm text-slate-800">
          {/* Comparative Numbers Table 2020-2026 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
              <BarChart3 className="w-4 h-4 text-rose-700" />
              <span>Série Temporal e Dados Numéricos Comparativos (2020 a 2026)</span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Região / Ano</th>
                    <th className="py-2.5 px-3">Evento Hidrológico</th>
                    <th className="py-2.5 px-3 text-right">Precipitação / Cota</th>
                    <th className="py-2.5 px-3 text-right">Deslocados</th>
                    <th className="py-2.5 px-3">Abrigos & Infraestrutura</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  {/* Joinville 2020 */}
                  <tr>
                    <td className="py-2 px-3 font-sans font-medium text-slate-900">Joinville (Fev/2020)</td>
                    <td className="py-2 px-3 font-sans text-slate-600">Enxurrada e maré alta</td>
                    <td className="py-2 px-3 text-right text-rose-700 font-bold">565 mm (146% da média)</td>
                    <td className="py-2 px-3 text-right">~1.200 desalojados</td>
                    <td className="py-2 px-3 font-sans text-slate-600">23 bairros com pontos de alagamento</td>
                  </tr>
                  {/* Joinville 2022 */}
                  <tr>
                    <td className="py-2 px-3 font-sans font-medium text-slate-900">Joinville (Nov/2022)</td>
                    <td className="py-2 px-3 font-sans text-slate-600">Decreto de Calamidade</td>
                    <td className="py-2 px-3 text-right text-rose-700 font-bold">340 mm em 48h</td>
                    <td className="py-2 px-3 text-right">145 desabrigados diretos</td>
                    <td className="py-2 px-3 font-sans text-slate-600">3 abrigos ativados (Morro do Meio e Vila Nova)</td>
                  </tr>
                  {/* RS 2023 */}
                  <tr>
                    <td className="py-2 px-3 font-sans font-medium text-slate-900">RS (Set/2023)</td>
                    <td className="py-2 px-3 font-sans text-slate-600">Ciclone Vale do Taquari</td>
                    <td className="py-2 px-3 text-right text-rose-700 font-bold">Rio Taquari: 29,6 m</td>
                    <td className="py-2 px-3 text-right">25.000 desalojados</td>
                    <td className="py-2 px-3 font-sans text-slate-600">54 mortes em Muçum e Roca Sales</td>
                  </tr>
                  {/* RS 2024 */}
                  <tr className="bg-rose-50/50">
                    <td className="py-2 px-3 font-sans font-bold text-rose-950">RS (Maio/2024)</td>
                    <td className="py-2 px-3 font-sans font-semibold text-rose-900">Mega-catástrofe climática</td>
                    <td className="py-2 px-3 text-right text-rose-800 font-bold">Guaíba: 5,35 m</td>
                    <td className="py-2 px-3 text-right text-rose-800 font-bold">581.643 desalojados / 81.285 abrigados</td>
                    <td className="py-2 px-3 font-sans font-semibold text-rose-900">980 abrigos operados em 117 municípios</td>
                  </tr>
                  {/* Joinville 2024 */}
                  <tr>
                    <td className="py-2 px-3 font-sans font-medium text-slate-900">Joinville (Dez/2024)</td>
                    <td className="py-2 px-3 font-sans text-slate-600">Tempestade orográfica severa</td>
                    <td className="py-2 px-3 text-right text-rose-700 font-bold">120 mm em 3h</td>
                    <td className="py-2 px-3 text-right">37 ocorrências de resgate</td>
                    <td className="py-2 px-3 font-sans text-slate-600">Escola Morro do Meio ativada como abrigo</td>
                  </tr>
                  {/* Joinville/RS 2025-2026 */}
                  <tr className="bg-slate-50">
                    <td className="py-2 px-3 font-sans font-medium text-slate-900">RS & SC (2025–2026)</td>
                    <td className="py-2 px-3 font-sans text-slate-600">Operação Pós-Desastre / CHAs</td>
                    <td className="py-2 px-3 text-right text-slate-700 font-bold">Obras de diques / EBAPs</td>
                    <td className="py-2 px-3 text-right">Transição habitacional</td>
                    <td className="py-2 px-3 font-sans text-slate-600">Centros Humanitários OIM / Compra Assistida</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Demographic & Vulnerability Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-4 h-4 text-blue-600" />
                <span>Joinville (SC) em Números (IBGE / Defesa Civil)</span>
              </div>
              <ul className="space-y-1 text-xs text-slate-700 leading-relaxed">
                <li>• <strong>População Total:</strong> 616.323 habitantes (Maior município de SC).</li>
                <li>• <strong>Vulnerabilidade a Inundações:</strong> 13,7% dos domicílios situados em áreas com suscetibilidade média ou alta a inundações e enxurradas (*Água e Saneamento / SNIS*).</li>
                <li>• <strong>Bacias Críticas:</strong> Rio Cachoeira (Centro, Anita Garibaldi), Rio Águas Vermelhas (Vila Nova, Morro do Meio) e Rio Cubatão (Pirabeiraba, Jardim Paraíso).</li>
                <li>• <strong>Fator Agravante:</strong> Maré astronômica da Baía da Babitonga associada a chuvas orográficas da Serra do Mar.</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-4 h-4 text-rose-600" />
                <span>Rio Grande do Sul em Números (IPH / Defesa Civil)</span>
              </div>
              <ul className="space-y-1 text-xs text-slate-700 leading-relaxed">
                <li>• <strong>Municípios Afetados:</strong> 478 de 497 (96,2% do território estadual).</li>
                <li>• <strong>Volume de Água:</strong> Mais de 14 trilhões de litros de água na bacia do Guaíba.</li>
                <li>• <strong>Pessoas Afetadas:</strong> 2.398.255 cidadãos.</li>
                <li>• <strong>Pico de Desabrigados:</strong> 81.285 pessoas em 980 abrigos públicos provisórios.</li>
                <li>• <strong>Falha Estrutural Crítica:</strong> 19 de 23 Casas de Bombas de Porto Alegre inoperantes e diques de Canoas/São Leopoldo transbordados.</li>
              </ul>
            </div>
          </div>

          {/* Research & Institutional Sources */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Fontes Institucionais e Bases de Pesquisa Científica</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 border border-slate-200 rounded-lg space-y-1">
                <div className="font-bold text-slate-900">1. Defesa Civil de Joinville (Seprot / PMJ)</div>
                <p className="text-slate-500 text-[11px]">
                  Relatório Histórico de Desastres Naturais e Cartografia de Áreas de Risco (Decretos de Emergência nº 50.133 e nº 51.842).
                </p>
              </div>

              <div className="p-3 border border-slate-200 rounded-lg space-y-1">
                <div className="font-bold text-slate-900">2. Epagri/Ciram (Santa Catarina)</div>
                <p className="text-slate-500 text-[11px]">
                  Centro de Informações de Recursos Ambientais e de Hidrometeorologia de Santa Catarina: monitoramento pluviométrico contínuo.
                </p>
              </div>

              <div className="p-3 border border-slate-200 rounded-lg space-y-1">
                <div className="font-bold text-slate-900">3. IPH-UFRGS (Instituto de Pesquisas Hidráulicas)</div>
                <p className="text-slate-500 text-[11px]">
                  Repositório de Informações Geográficas para Suporte à Decisão RS 2024: modelo numérico de elevação do Guaíba e bacias afluentes.
                </p>
              </div>

              <div className="p-3 border border-slate-200 rounded-lg space-y-1">
                <div className="font-bold text-slate-900">4. Defesa Civil do Estado do Rio Grande do Sul</div>
                <p className="text-slate-500 text-[11px]">
                  Boletins diários consolidados de calamidade pública, acolhimento em abrigos e resgates humanitários.
                </p>
              </div>

              <div className="p-3 border border-slate-200 rounded-lg space-y-1">
                <div className="font-bold text-slate-900">5. ACNUR / OIM (Nações Unidas)</div>
                <p className="text-slate-500 text-[11px]">
                  Operação Centros Humanitários de Acolhimento (CHAs): Padrões internacionais de triagem e acomodação de refugiados climáticos.
                </p>
              </div>

              <div className="p-3 border border-slate-200 rounded-lg space-y-1">
                <div className="font-bold text-slate-900">6. Fiocruz & CEMADEN</div>
                <p className="text-slate-500 text-[11px]">
                  Observatório de Clima e Saúde e Centro Nacional de Monitoramento e Alertas de Desastres Naturais (alertas hidrológicos e epidemiológicos).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
