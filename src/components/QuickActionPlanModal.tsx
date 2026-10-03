import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Printer, 
  PhoneCall, 
  Users, 
  Droplet, 
  Zap, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface QuickActionPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickActionPlanModal: React.FC<QuickActionPlanModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [activePhase, setActivePhase] = useState<number>(1);

  const phases = [
    {
      step: 1,
      title: 'Fase 0h a 2h: Alerta Preditivo & Triagem de Abrigos',
      objective: 'Ativar apenas edificações homologadas em cotas seguras antes do transbordamento das vias.',
      items: [
        'Disparo do Alerta Vermelho de emergência integrado com Epagri/Ciram (Joinville) ou CEMADEN/IPH-UFRGS (RS).',
        'Acionamento compulsório dos Abrigos Classe A homologados (E.M. Carlos Heins Funke em Joinville, Centro Vida em POA, ULBRA em Canoas).',
        'Emissão de VETO para ginásios ou escolas em cotas de várzea (ex.: Ginásio Tesourinha em POA e Abel Schulz no Centro de Joinville).',
        'Publicação do link público de auto-registro e rotas seguras para os cidadãos no WhatsApp e rádio comunitária.'
      ]
    },
    {
      step: 2,
      title: 'Fase 2h a 6h: Logística de Transporte & Resgate de Ilhados',
      objective: 'Mobilizar frota de ônibus gratuita e botes para retirar famílias de áreas de alto risco.',
      items: [
        'Abertura dos Pontos de Coleta da Defesa Civil (Terminal Norte em Joinville, Terminal Triângulo em Porto Alegre).',
        'Despacho de ônibus circulares gratuitos com intervalo máximo de 20 minutos ligando bairros baixos aos abrigos altos.',
        'Envio de botes infláveis e caminhões 4x4 do Corpo de Bombeiros para atender chamados de resgate prioritário (acamados, PcD, idosos e animais).',
        'Bloqueio preventivo de vias inundáveis pela guarda de trânsito para impedir travessia de carros de passeio.'
      ]
    },
    {
      step: 3,
      title: 'Fase 6h a 12h: Triagem Humanitária & Check-in Digno',
      objective: 'Garantir recepção com direitos humanos, evitando superlotação e separação de famílias.',
      items: [
        'Recepção e cadastro digital rápido com emissão da pulseira de triagem por núcleo familiar.',
        'Triagem médica na entrada: medição de sinais vitais, isolamento profilático de casos respiratórios e oferta de vacina antitetânica/leptospirose.',
        'Distribuição em cubículos modulares com colchões higienizados e cobertores térmicos (mínimo de 3,8m² por pessoa).',
        'Acomodação dos animais domésticos no canil/gatil seguro anexo ao pátio do abrigo com ração e água.'
      ]
    },
    {
      step: 4,
      title: 'Fase 12h a 24h: Autonomia de Suprimentos & Energia',
      objective: 'Assegurar fornecimento ininterrupto de água tratada, energia e refeições quentes.',
      items: [
        'Acionamento do grupo gerador a diesel ou engate rápido da concessionária (Celesc/CEEE Equatorial) para manter luz e freezers ativos.',
        'Ativação da cozinha escolar/comunitária com 3 refeições balanceadas diárias por pessoa acolhida.',
        'Verificação contínua do reservatório de água potável (garantia de 15 a 20 litros/pessoa/dia); contratação de caminhão-pipa reserva se necessário.',
        'Distribuição do Kit de Higiene Familiar (sabonete, pasta de dentes, absorventes, fraldas e cloro para desinfecção).'
      ]
    },
    {
      step: 5,
      title: 'Fase 24h a 72h: Vigilância Sanitária & Transição Habitacional',
      objective: 'Prevenir surtos epidêmicos e preparar a liberação tempestiva dos prédios públicos.',
      items: [
        'Monitoramento epidemiológico diário (Fiocruz/COE) para detecção precoce de febre ou diarreia aguda.',
        'Cadastro socioeconômico das famílias nos programas de benefício temporário (Aluguel Social / "Estadia Solidária" de R$ 1.000/mês).',
        'Vistoria pericial de retorno às residências após rebaixamento do nível das águas com laudo de estabilidade da fundação.',
        'Desinfecção terminal das salas de aula para retorno do calendário letivo sem prejuízo à educação municipal.'
      ]
    }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 print:border-none print:shadow-none print:max-h-none print:rounded-none">
        {/* Top Bar */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between z-10 print:hidden">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-rose-700" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Plano de Ação Rápido de Contingência & Operação de Abrigos
              </h3>
              <p className="text-xs text-slate-500">
                Protocolo Operacional Padrão (POP) para Defesa Civil de Joinville (SC) e Rio Grande do Sul
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Ordem de Operação</span>
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
        <div className="p-6 sm:p-8 space-y-8 text-slate-800">
          {/* Visual Evidence Section: Problem vs Solution */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                  Evidências Fotográficas do Desastre vs. A Solução Técnica
                </h4>
                <p className="text-xs text-slate-500">
                  Registros documentais das enchentes em Joinville e no RS e os padrões de resposta
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {/* Image 1: Morro do Meio Joinville Problem */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <div className="h-40 overflow-hidden relative">
                  <img
                    src="/src/assets/images/morro_do_meio_flood_1791053206147.jpg"
                    alt="Alagamento no Morro do Meio em Joinville SC"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-rose-600/90 text-white text-[10px] font-bold">
                    O PROBLEMA: MORRO DO MEIO (JOINVILLE)
                  </div>
                </div>
                <div className="p-2.5 space-y-1">
                  <div className="text-xs font-bold text-slate-900">Cheia do Rio Águas Vermelhas &amp; Maré</div>
                  <div className="text-[11px] text-slate-500 leading-snug">
                    Rua Minas Gerais e Rua Pitiguaras sob lâmina d'água de até 1,20m. Botes dos Bombeiros Voluntários retirando moradores ilhados.
                  </div>
                </div>
              </div>

              {/* Image 2: Problem RS */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <div className="h-40 overflow-hidden relative">
                  <img
                    src="/src/assets/images/rs_flood_problem_1791052713170.jpg"
                    alt="Enchente histórica no Rio Grande do Sul"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-rose-600/90 text-white text-[10px] font-bold">
                    O PROBLEMA: RS (2024)
                  </div>
                </div>
                <div className="p-2.5 space-y-1">
                  <div className="text-xs font-bold text-slate-900">Enchente Histórica do Guaíba (5,35m)</div>
                  <div className="text-[11px] text-slate-500 leading-snug">
                    Mais de 81 mil pessoas desabrigadas e ginásios improvisados em cotas baixas inundados por refluxo de bombas.
                  </div>
                </div>
              </div>

              {/* Image 3: Safe Shelter in High Elevation (Joinville) */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <div className="h-40 overflow-hidden relative">
                  <img
                    src="/src/assets/images/joinville_shelter_safe_1791053220504.jpg"
                    alt="Escola polo segura em Joinville SC"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-600/90 text-white text-[10px] font-bold">
                    A SOLUÇÃO: ABRIGO EM COTA ALTA
                  </div>
                </div>
                <div className="p-2.5 space-y-1">
                  <div className="text-xs font-bold text-slate-900">Polo Vila Nova / Costa e Silva (Cota &gt;16m)</div>
                  <div className="text-[11px] text-slate-500 leading-snug">
                    Rampas NBR 9050, grupo gerador próprio, doca de ambulâncias e recepção segura de quem sai do Morro do Meio.
                  </div>
                </div>
              </div>

              {/* Image 4: Shelter Interior Dignity */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <div className="h-40 overflow-hidden relative">
                  <img
                    src="/src/assets/images/shelter_interior_family_1791053232576.jpg"
                    alt="Interior com módulos familiares SPHERE"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-600/90 text-white text-[10px] font-bold">
                    A SOLUÇÃO: DIGNIDADE FAMILIAR
                  </div>
                </div>
                <div className="p-2.5 space-y-1">
                  <div className="text-xs font-bold text-slate-900">Padrão SPHERE &amp; Não-Separação</div>
                  <div className="text-[11px] text-slate-500 leading-snug">
                    Módulos familiares de 4m² por pessoa, camas higienizadas, área lúdica infantil e posto de triagem médica.
                  </div>
                </div>
              </div>

              {/* Image 5: Pet Shelter Welfare */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <div className="h-40 overflow-hidden relative">
                  <img
                    src="/src/assets/images/shelter_pet_care_1791053251902.jpg"
                    alt="Abrigo anexo para animais domésticos"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-purple-600/90 text-white text-[10px] font-bold">
                    A SOLUÇÃO: BEM-ESTAR ANIMAL
                  </div>
                </div>
                <div className="p-2.5 space-y-1">
                  <div className="text-xs font-bold text-slate-900">Canil/Gatil Anexo com Triagem Veterinária</div>
                  <div className="text-[11px] text-slate-500 leading-snug">
                    Baias modulares separadas dos dormitórios humanos, controle de zoonoses e convivência diária com tutores.
                  </div>
                </div>
              </div>

              {/* Image 6: Rescue Logistics */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <div className="h-40 overflow-hidden relative">
                  <img
                    src="/src/assets/images/rescue_logistics_1791052743717.jpg"
                    alt="Logística de resgate e evacuação"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-blue-600/90 text-white text-[10px] font-bold">
                    A SOLUÇÃO: LOGÍSTICA DE EVACUAÇÃO
                  </div>
                </div>
                <div className="p-2.5 space-y-1">
                  <div className="text-xs font-bold text-slate-900">Transbordo Coordenado &amp; Ônibus Gratuitos</div>
                  <div className="text-[11px] text-slate-500 leading-snug">
                    Deslocamento planejado retirando acamados, idosos e famílias antes do pico da maré astronômica.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Protocol Steps (0h to 72h) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Cronograma de Ação Operacional: Da Emissão do Alerta ao Acolhimento
              </h4>
            </div>

            {/* Stepper Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {phases.map((p) => (
                <button
                  key={p.step}
                  onClick={() => setActivePhase(p.step)}
                  className={`p-2.5 rounded-lg text-left border transition-all text-xs ${
                    activePhase === p.step
                      ? 'border-rose-700 bg-rose-50 text-rose-950 font-bold shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                  }`}
                >
                  <div className="font-mono text-[10px] text-rose-700 uppercase">Etapa 0{p.step}</div>
                  <div className="truncate mt-0.5">{p.title.split(':')[0]}</div>
                </button>
              ))}
            </div>

            {/* Active Phase Card */}
            {phases.map((p) => {
              if (p.step !== activePhase) return null;
              return (
                <div key={p.step} className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div>
                      <span className="text-xs font-mono font-bold text-rose-700 uppercase tracking-wider">
                        Protocolo de Resposta Imediata
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 mt-0.5">{p.title}</h3>
                    </div>
                    <div className="px-3 py-1 rounded bg-slate-200 text-slate-800 text-xs font-semibold">
                      Objetivo Estratégico
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 font-medium leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                    <strong>Diretriz:</strong> {p.objective}
                  </p>

                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Ações Obrigatórias do Posto de Comando:
                    </div>
                    <ul className="space-y-2">
                      {p.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Emergency Contacts Block */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-900 text-white rounded-xl p-4">
            <div>
              <div className="text-slate-400 text-[11px]">Defesa Civil (Joinville e RS)</div>
              <div className="text-xl font-bold font-mono text-white mt-0.5">Ligue 199</div>
              <div className="text-[10px] text-slate-400">Atendimento 24h a desastres</div>
            </div>
            <div>
              <div className="text-slate-400 text-[11px]">Corpo de Bombeiros Militar</div>
              <div className="text-xl font-bold font-mono text-white mt-0.5">Ligue 193</div>
              <div className="text-[10px] text-slate-400">Resgate aquático e encostas</div>
            </div>
            <div>
              <div className="text-slate-400 text-[11px]">Atendimento Médico (SAMU)</div>
              <div className="text-xl font-bold font-mono text-white mt-0.5">Ligue 192</div>
              <div className="text-[10px] text-slate-400">Suporte pré-hospitalar</div>
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
            Fechar Plano de Ação
          </button>
        </div>
      </div>
    </div>
  );
};
