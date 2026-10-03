import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  Layers, 
  ShieldCheck, 
  BookOpen, 
  Droplet,
  Users,
  Activity,
  Waves,
  Building2,
  Calendar
} from 'lucide-react';

interface RSDisasterAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RSDisasterAnalysisModal: React.FC<RSDisasterAnalysisModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [activeRegion, setActiveRegion] = useState<'ALL' | 'JOINVILLE' | 'RS'>('ALL');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Estudo de Caso & Fundamentação Teórica: Joinville (SC) e Rio Grande do Sul (2020–2026)
              </h2>
              <p className="text-xs text-slate-500">
                Evidências empíricas consolidadas (Defesa Civil SC/RS, IPH-UFRGS, EPAGRI/CIRAM, OIM/ACNUR e CEMADEN)
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

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-8 text-slate-800 text-xs sm:text-sm">
          {/* Segmented Filter for View */}
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Filtrar Análise por Território:
            </span>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
              <button
                onClick={() => setActiveRegion('ALL')}
                className={`px-3 py-1 font-semibold rounded-md transition-colors ${
                  activeRegion === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Visão Integrada (Região Sul)
              </button>
              <button
                onClick={() => setActiveRegion('JOINVILLE')}
                className={`px-3 py-1 font-semibold rounded-md transition-colors ${
                  activeRegion === 'JOINVILLE' ? 'bg-white text-rose-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Joinville (SC)
              </button>
              <button
                onClick={() => setActiveRegion('RS')}
                className={`px-3 py-1 font-semibold rounded-md transition-colors ${
                  activeRegion === 'RS' ? 'bg-white text-rose-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Rio Grande do Sul
              </button>
            </div>
          </div>

          {/* Section 1: Dados Reais 2020-2026 */}
          <div className="space-y-4">
            <div className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rose-600" />
              <span>1. Linha do Tempo & Dados Estatísticos Reais (2020 a 2026)</span>
            </div>

            {/* Joinville Real Context */}
            {(activeRegion === 'ALL' || activeRegion === 'JOINVILLE') && (
              <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">Joinville / SC (616.323 habitantes - Censo IBGE)</span>
                    <span className="text-[11px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-semibold">
                      Classificação ICM: Faixa A (2026)
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">Bacias do Rio Cachoeira, Cubatão do Norte e Babitonga</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-white border border-slate-200 rounded-lg">
                    <div className="font-semibold text-slate-900">Junho/2020: Ciclone Bomba</div>
                    <p className="text-slate-600 mt-1">
                      Ventos &gt; 120 km/h; destelhamento em massa de escolas e ginásios; 80% da cidade sem energia. Abrigos sem geradores sofreram descontinuidade no atendimento.
                    </p>
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded-lg">
                    <div className="font-semibold text-slate-900">Nov/Dez 2022: Cheia Histórica</div>
                    <p className="text-slate-600 mt-1">
                      Mais de <strong>400 mm de chuva em 48h</strong>. Situação de emergência com <strong>145 desabrigados</strong> acolhidos na E.M. Dr. Ruben Roberto Schmidlin (Morro do Meio).
                    </p>
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded-lg">
                    <div className="font-semibold text-slate-900">Out/Nov 2023: Maré de Sizígia</div>
                    <p className="text-slate-600 mt-1">
                      Maré de 1,9m na Baía da Babitonga represou o Rio Cachoeira, alagando o Centro Histórico e Mercado Municipal. 131 municípios em SC afetados.
                    </p>
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded-lg">
                    <div className="font-semibold text-slate-900">Janeiro/2024: Crise do Ácido</div>
                    <p className="text-slate-600 mt-1">
                      Vazamento de ácido sulfônico na Serra Dona Francisca / Rio Seco paralisou a ETA Cubatão (75% da água de Joinville), provando a urgência de reserva hídrica em abrigos.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Rio Grande do Sul Real Context */}
            {(activeRegion === 'ALL' || activeRegion === 'RS') && (
              <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">Rio Grande do Sul (Bacias do Guaíba, Jacuí, Sinos e Taquari)</span>
                    <span className="text-[11px] font-mono bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-semibold">
                      478 municípios em Emergência/Calamidade
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">2,39 milhões de pessoas afetadas</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-white border border-slate-200 rounded-lg">
                    <div className="text-slate-500 text-[11px]">Cota Recorde Guaíba</div>
                    <div className="text-lg font-bold font-mono text-rose-700 mt-0.5">5,35 m</div>
                    <div className="text-[10px] text-slate-400">Superou enchente de 1941 (4,76m)</div>
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded-lg">
                    <div className="text-slate-500 text-[11px]">Desalojados no Pico</div>
                    <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">581.643</div>
                    <div className="text-[10px] text-slate-400">Em casas de parentes/amigos</div>
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded-lg">
                    <div className="text-slate-500 text-[11px]">Desabrigados em Abrigos</div>
                    <div className="text-lg font-bold font-mono text-rose-700 mt-0.5">81.285</div>
                    <div className="text-[10px] text-slate-400">980 abrigos operados</div>
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded-lg">
                    <div className="text-slate-500 text-[11px]">Danos Econômicos (BID/CNM)</div>
                    <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">&gt; R$ 90 bi</div>
                    <div className="text-[10px] text-slate-400">Maior perda da história do RS</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: As Quatro Respostas Estruturadas */}
          <div className="space-y-6">
            {/* 1. SOLUÇÃO */}
            <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-xs">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-sm uppercase tracking-wider mb-2">
                <ShieldCheck className="w-5 h-5 text-rose-600" />
                <span>1. Solução: Plataforma de Engenharia Diagnóstica e Triagem Preditiva</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                A solução elimina o erro crítico de abrir abrigos em cotas inundáveis ou sem autonomia hidrossanitária. O sistema calcula o <strong>Índice de Adequabilidade para Abrigo (IAA)</strong> fundamentado nas normas brasileiras <strong>NBR 9050</strong>, <strong>NBR 13434</strong> e no padrão humanitário <strong>SPHERE</strong>:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-900">Veto Hidrológico & Maré de Sizígia</div>
                  <p className="text-slate-600 mt-1">
                    Em <strong>Joinville</strong>, veta edifícios em cotas &lt; 4m próximos ao Rio Cachoeira (ex.: Ginásio Abel Schulz). No <strong>RS</strong>, veta prédios abaixo da cota 7m em Porto Alegre vulneráveis ao colapso de Casas de Bombas (como o Ginásio Tesourinha).
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-900">Padrão Humanitário SPHERE</div>
                  <p className="text-slate-600 mt-1">
                    Garante 3,5m² a 3,8m² de área útil por pessoa abrigada, relação de 1 banheiro para cada 20 acolhidos e reserva mínima de 15L a 20L de água potável/pessoa/dia, evitando surtos infecciosos.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-900">Autonomia Energética Obrigatória</div>
                  <p className="text-slate-600 mt-1">
                    Exigência de gerador a diesel ou chave reversora com engate rápido para gerador móvel, protegendo contra os apagões do Ciclone Bomba (SC) e das inundações de Porto Alegre.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. IMPLEMENTAÇÃO */}
            <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-xs">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm uppercase tracking-wider mb-2">
                <Layers className="w-5 h-5 text-rose-600" />
                <span>2. Implementação Operacional em 4 Fases Integradas</span>
              </div>

              <div className="space-y-3 mt-3">
                <div className="flex items-start gap-3 text-xs">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <strong className="text-slate-900">Fase 1: Auditoria Cadastral Preventiva (Tempo de Paz / Estiagem):</strong>
                    <p className="text-slate-600 mt-0.5">
                      Engenheiros do CREA-SC e CREA-RS realizam vistorias de campo com o checklist mobile em 100% das escolas públicas, ginásios e pavilhões. Emissão de Laudo Técnico com ART e catálogo de adequações imediatas.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <strong className="text-slate-900">Fase 2: Acionamento Preditivo Antecipado (48h a 72h antes do evento):</strong>
                    <p className="text-slate-600 mt-0.5">
                      Integração de dados com CEMADEN, EPAGRI/CIRAM (marés em Joinville) e IPH-UFRGS (cotas no RS). Disparo de ordens de pré-ativação apenas para edificações <strong>Classe A (Apto Imediato)</strong>, pré-posicionando geradores móveis e caminhões-tanque.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <strong className="text-slate-900">Fase 3: Acolhimento Humanitário Estruturado (Emergência Ativa):</strong>
                    <p className="text-slate-600 mt-0.5">
                      Check-in informatizado de famílias com triagem médica, separação de dormitórios familiares, lactários e espaço pet dedicado (experiência dos Centros Humanitários de Acolhimento da OIM em Canoas e Porto Alegre).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <strong className="text-slate-900">Fase 4: Desmobilização Digna e Desocupação Escolar:</strong>
                    <p className="text-slate-600 mt-0.5">
                      Transição ágil das famílias para benefícios habitacionais ("Estadia Solidária" de R$ 1.000/mês ou "Aluguel Social" em Joinville) e moradias modulares definitivas, liberando escolas municipais para retorno das aulas.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. CUSTO */}
            <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-xs">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm uppercase tracking-wider mb-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <span>3. Análise Econômica: Custo da Inação vs. Investimento Preventivo</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-xs">
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
                  <div className="font-bold text-rose-900 text-sm">Custo Reativo Caótico (Sem Planejamento)</div>
                  <ul className="space-y-1 text-rose-800 list-disc list-inside">
                    <li><strong>R$ 2.400 a R$ 3.500 / mês por abrigado</strong> em compras de pânico (aluguel emergencial de geradores inflacionados, tendas provisórias e água envasada).</li>
                    <li><strong>Perda média de R$ 1,2 a R$ 2,5 milhões por prédio público inundado</strong> que servia como abrigo e precisou ser abandonado.</li>
                    <li>Altos custos hospitalares com tratamento de leptospirose e doenças de veiculação hídrica pós-enchente.</li>
                  </ul>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                  <div className="font-bold text-emerald-900 text-sm">Custo da Solução Preventiva Macro Norte</div>
                  <ul className="space-y-1 text-emerald-800 list-disc list-inside">
                    <li><strong>R$ 80 a R$ 120 por m² de área de abrigo</strong> para obras preventivas (chaves reversoras para gerador móvel, caixas d'água extras e rampas NBR 9050).</li>
                    <li><strong>R$ 450 a R$ 750 / mês por pessoa acolhida</strong> utilizando cozinhas industriais públicas já estruturadas e redes regulares.</li>
                    <li><strong>ROI Humanitário e Financeiro:</strong> Cada R$ 1,00 investido em prevenção de abrigos poupa R$ 7,80 em custos de emergência e reconstrução (*Banco Mundial / UNDRR*).</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 4. ESCALA */}
            <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-xs">
              <div className="flex items-center gap-2 text-blue-800 font-bold text-sm uppercase tracking-wider mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span>4. Modelo de Escala Integrado: Joinville e Rio Grande do Sul</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                A tecnologia funciona como um ecossistema federativo multi-nível (SaaS Governamental na nuvem), integrando os sistemas de Defesa Civil municipais e estaduais:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="font-bold text-slate-900">Joinville & Norte Catarinense</div>
                  <p className="text-slate-600 mt-1">
                    Integração com a Defesa Civil de Joinville (COMPDEC) e AMUNESC. O Centro Expoville atua como macro-hub de acolhimento e centro logístico para Joinville, Araquari e Guaramirim.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="font-bold text-slate-900">Bacias Críticas do RS</div>
                  <p className="text-slate-600 mt-1">
                    Rede consorciada entre Região Metropolitana de Porto Alegre (Granpal) e municípios do Vale do Taquari (Lajeado, Estrela, Muçum), redistribuindo desabrigados de cidades baixas para cidades altas.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="font-bold text-slate-900">Nível Estadual e Federal</div>
                  <p className="text-slate-600 mt-1">
                    Interconexão com o CIGERD (Santa Catarina), a Sala de Situação da Defesa Civil do RS e o Sistema Integrado de Informações sobre Desastres (S2iD) do Governo Federal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
          >
            Fechar Estudo Técnico
          </button>
        </div>
      </div>
    </div>
  );
};
