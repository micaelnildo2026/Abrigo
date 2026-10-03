import React, { useState } from 'react';
import { 
  X, 
  Baby, 
  UserCheck, 
  Accessibility, 
  Utensils, 
  Droplet, 
  PawPrint, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  BookOpen,
  Printer,
  ChevronRight,
  Info,
  Scale
} from 'lucide-react';

interface ShelterRequirementsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CategoryTab = 'JOVENS' | 'IDOSOS' | 'PCD' | 'ALIMENTACAO' | 'HIGIENE' | 'ANIMAIS';

export const ShelterRequirementsGuideModal: React.FC<ShelterRequirementsGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [activeCategory, setActiveCategory] = useState<CategoryTab>('JOVENS');

  const categories = [
    { id: 'JOVENS' as const, label: 'Jovens & Crianças', icon: Baby, count: 'ECA / SPHERE' },
    { id: 'IDOSOS' as const, label: 'Pessoas Idosas (60+)', icon: UserCheck, count: 'Estatuto Idoso' },
    { id: 'PCD' as const, label: 'Pessoas com Deficiência (PcD)', icon: Accessibility, count: 'NBR 9050' },
    { id: 'ALIMENTACAO' as const, label: 'Alimentação & Cozinha', icon: Utensils, count: 'RDC 216 / ANVISA' },
    { id: 'HIGIENE' as const, label: 'Higiene & Saneamento', icon: Droplet, count: 'Padrão SPHERE' },
    { id: 'ANIMAIS' as const, label: 'Animais & Bem-Estar Pet', icon: PawPrint, count: 'CFMV / Zoonoses' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 print:border-none print:shadow-none print:max-h-none print:rounded-none">
        {/* Modal Top Bar */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between z-10 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-700 flex items-center justify-center text-white">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Diretrizes Técnicas de Edificações para Abrigos Temporários
              </h3>
              <p className="text-xs text-slate-500">
                Requisitos estruturais, operacionais e de dignidade humana conforme NBR 9050, SPHERE e Defesa Civil
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Guia</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Navigation Pills */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 overflow-x-auto print:hidden">
          <div className="flex items-center gap-2 min-w-max">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-rose-700 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isActive ? 'bg-rose-800 text-rose-100' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-800">
          {/* TAB 1: JOVENS E CRIANÇAS */}
          {activeCategory === 'JOVENS' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-rose-700 text-xs font-bold uppercase tracking-wider">
                    <Baby className="w-4 h-4" />
                    <span>Salvaguarda Infantil & Espaço Seguro de Desenvolvimento</span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mt-1">
                    Características para Acolher Jovens, Crianças e Bebês
                  </h4>
                </div>
                <div className="text-xs font-mono px-3 py-1 bg-rose-50 text-rose-800 rounded-lg border border-rose-200 self-start sm:self-auto">
                  Normas: ECA · UNICEF · SPHERE Padrão 4.2
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>1. Instalações Físicas & Proteção Mecânica</span>
                  </div>
                  <ul className="text-xs text-slate-700 space-y-2 leading-relaxed">
                    <li>• <strong>Tomadas e Fiação Protegidas:</strong> Tomadas devem estar a no mínimo 1,30m do chão ou possuir tampas de segurança plásticas com trava para prevenir choques elétricos.</li>
                    <li>• <strong>Guarda-Corpos e Janelas:</strong> Janelas em pavimentos superiores precisam de travas de abertura limitada (máximo 10 cm) ou telas de proteção reforçadas.</li>
                    <li>• <strong>Piso Seguro:</strong> Ausência de desníveis abruptos ou pisos excessivamente lisos que causem traumatismos em quedas de bebês e crianças em fase de engatinhar.</li>
                    <li>• <strong>Iluminação Noturna Contínua:</strong> Luz de vigília suave nos corredores e acessos aos sanitários para reduzir pânico infantil e garantir segurança contra abusos.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span>2. Espaços Funcionais Dedicados</span>
                  </div>
                  <ul className="text-xs text-slate-700 space-y-2 leading-relaxed">
                    <li>• <strong>Espaço Amigo da Criança (Lúdico):</strong> Sala delimitada e arejada equipada com tatames emborrachados, brinquedos laváveis, livros e materiais de desenho, coordenada por educadores/voluntários.</li>
                    <li>• <strong>Lactário & Fraldário Higienizado:</strong> Ponto privativo com bancada acolchoada lavável, água corrente tratada, pia exclusiva e ponto de energia para esterilização de mamadeiras e aquecimento de leite.</li>
                    <li>• <strong>Área de Apoio Pedagógico para Jovens:</strong> Espaço com mesas, tomadas para carregamento de computadores e sinal Wi-Fi da Defesa Civil para manutenção das rotinas escolares.</li>
                    <li>• <strong>Banheiro Infantil ou Redutor:</strong> Pelo menos um sanitário adaptado com bacia de menor porte ou redutor de assento e degrau seguro para lavatório.</li>
                  </ul>
                </div>
              </div>

              {/* Protocol Alert */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>Protocolo Humanitário Crítico: Não-Separação Familiar</span>
                </div>
                <p className="text-amber-800 leading-relaxed">
                  É terminantemente proibido pela Defesa Civil e Ministério Público abrigar crianças desacompanhadas ou separadas de seus pais/responsáveis legais. Em dormitórios coletivos de ginásios, devem ser instaladas divisórias modulares (biombos ou lonas) com área mínima de 3,5m² a 4,0m² por membro familiar, garantindo intimidade e segurança.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: PESSOAS IDOSAS */}
          {activeCategory === 'IDOSOS' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-rose-700 text-xs font-bold uppercase tracking-wider">
                    <UserCheck className="w-4 h-4" />
                    <span>Atenção Geriátrica, Conforto Térmico & Farmácia</span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mt-1">
                    Características para Acolher Pessoas Idosas (60+ Anos)
                  </h4>
                </div>
                <div className="text-xs font-mono px-3 py-1 bg-rose-50 text-rose-800 rounded-lg border border-rose-200 self-start sm:self-auto">
                  Normas: Estatuto do Idoso · NBR 9050 · MS / Saúde
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>1. Arquitetura, Leitos & Circulação Segura</span>
                  </div>
                  <ul className="text-xs text-slate-700 space-y-2 leading-relaxed">
                    <li>• <strong>Alocação Compulsória no Pavimento Térreo:</strong> Idosos jamais devem ser instalados em mezaninos ou pavimentos superiores acessíveis apenas por escadas.</li>
                    <li>• <strong>Proibição de Beliches:</strong> Leitos devem ser baixos (45 a 50 cm de altura com colchão denso D-33), facilitando o sentar e levantar sem risco de queda noturna. Proibido leito em segundo pavimento de beliche.</li>
                    <li>• <strong>Proximidade Imediata dos Sanitários:</strong> A distância máxima de caminhada do leito do idoso até o vaso sanitário não deve ultrapassar <strong>20 metros</strong>, livre de degraus ou fiações soltas no trajeto.</li>
                    <li>• <strong>Corrimãos e Barras de Apoio:</strong> Corredores de circulação devem possuir corrimãos contínuos em ambos os lados na altura de 92 cm e 70 cm (NBR 9050).</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span>2. Saúde, Medicamentos & Climatização</span>
                  </div>
                  <ul className="text-xs text-slate-700 space-y-2 leading-relaxed">
                    <li>• <strong>Refrigerador Exclusivo para Medicamentos:</strong> Conservação ininterrupta (entre +2°C e +8°C) para insulinas, colírios especiais e anticoagulantes, conectado obrigatoriamente à rede estabilizada do gerador a diesel.</li>
                    <li>• <strong>Isolamento Acústico & Calmaria:</strong> Ala de repouso distante de quadras poliesportivas e docas de carga, prevenindo quadros de desorientação cognitiva e pânico em idosos com demência ou Alzheimer.</li>
                    <li>• <strong>Conforto Térmico Rigoroso:</strong> Idosos possuem termorregulação debilitada. O prédio deve dispor de cobertores térmicos, vedação contra correntes de vento úmido e aquecedores/ventiladores adequados.</li>
                    <li>• <strong>Estação de Enfermagem para Aferição:</strong> Ponto diário de controle de pressão arterial (PA) e glicemia capilar com prontuário individualizado.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PCD (PESSOAS COM DEFICIÊNCIA) */}
          {activeCategory === 'PCD' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-rose-700 text-xs font-bold uppercase tracking-wider">
                    <Accessibility className="w-4 h-4" />
                    <span>Acessibilidade Universal & Equipamentos Médicos</span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mt-1">
                    Características para Acolher Pessoas com Deficiência (PcD)
                  </h4>
                </div>
                <div className="text-xs font-mono px-3 py-1 bg-rose-50 text-rose-800 rounded-lg border border-rose-200 self-start sm:self-auto">
                  Normas: NBR 9050 · Lei Brasileira de Inclusão nº 13.146
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>1. Dimensionamento Geométrico & Acessos (NBR 9050)</span>
                  </div>
                  <ul className="text-xs text-slate-700 space-y-2 leading-relaxed">
                    <li>• <strong>Rampas com Inclinação Máxima de 8,33%:</strong> Acesso principal sem degraus ou com rampa suave de piso antiderrapante, largura livre mínima de 1,20m e patamar a cada 50m de desnível.</li>
                    <li>• <strong>Portas e Vãos com Mínimo de 80 cm:</strong> Todas as passagens (dormitórios, banheiros e refeitório) devem permitir passagem desimpedida de cadeira de rodas, macas e andadores (ideal 90 cm).</li>
                    <li>• <strong>Área de Manobra 360°:</strong> Diâmetro livre de giro de no mínimo <strong>1,50 m</strong> dentro dos quartos e nos sanitários acessíveis.</li>
                    <li>• <strong>Piso Tátil e Sinalização Braille:</strong> Sinalização direcional e de alerta no piso para orientação de pessoas cegas ou com baixa visão, além de avisos sonoros de emergência.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span>2. Sanitário Adaptado & Suporte Vital</span>
                  </div>
                  <ul className="text-xs text-slate-700 space-y-2 leading-relaxed">
                    <li>• <strong>Bacia Sanitária com Barras de Transferência:</strong> Altura de 43 a 45 cm, barras tubulares de aço inox na parede lateral e traseira com capacidade para suportar 150 kg de carga direta.</li>
                    <li>• <strong>Boxe de Chuveiro Acessível:</strong> Dimensões mínimas de 90x95 cm, piso sem desnível (sem soleira alta), banco articulado retrátil impermeável e ducha manual com desviador.</li>
                    <li>• <strong>Circuito Elétrico para Suporte à Vida:</strong> Tomadas sinalizadas em vermelho conectadas ininterruptamente ao gerador para respiradores mecânicos, concentradores de oxigênio, CPAP e recarga de baterias de cadeiras motorizadas.</li>
                    <li>• <strong>Doca de Ambulância Acessível:</strong> Vaga coberta e nivelada para desembarque de macas diretamente para a ala médica do abrigo.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ALIMENTAÇÃO & COZINHA */}
          {activeCategory === 'ALIMENTACAO' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-rose-700 text-xs font-bold uppercase tracking-wider">
                    <Utensils className="w-4 h-4" />
                    <span>Segurança Alimentar, Cocção & Armazenamento</span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mt-1">
                    Características para Estrutura de Alimentação & Cozinha
                  </h4>
                </div>
                <div className="text-xs font-mono px-3 py-1 bg-rose-50 text-rose-800 rounded-lg border border-rose-200 self-start sm:self-auto">
                  Normas: ANVISA RDC nº 216 · NBR 14518 · SPHERE
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>1. Cozinha Industrial & Fluxo Unidirecional</span>
                  </div>
                  <ul className="text-xs text-slate-700 space-y-2 leading-relaxed">
                    <li>• <strong>Fluxo sem Cruzamento:</strong> Circuito linear que separa a entrada de alimentos brutos, pré-preparo, cocção térmica, montagem de pratos e descarte de restos/lavagem de panelas.</li>
                    <li>• <strong>Superfícies Inertes e Laváveis:</strong> Bancadas, pias e mesas em aço inoxidável ou cerâmica clara lavável. Proibição estrita de madeira ou superfícies porosas que acumulam fungos.</li>
                    <li>• <strong>Água Corrente Tratada & Cubas Profundas:</strong> Duas ou mais cubas em inox com água potável pressurizada para higienização separada de carnes, hortaliças e utensílios pesados.</li>
                    <li>• <strong>Exaustão e Gás Canalizado Exterior:</strong> Coifa mecânica sobre os fogões industriais e central de botijões P-45 localizada do lado de fora do prédio com válvula de corte rápido.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span>2. Despensa, Refrigeração & Refeitório</span>
                  </div>
                  <ul className="text-xs text-slate-700 space-y-2 leading-relaxed">
                    <li>• <strong>Cadeia de Frio com Backup Elétrico:</strong> Freezers e geladeiras conectados à chave do gerador diesel. Perdas de carne e laticínios por falta de luz representam grave risco de intoxicação coletiva.</li>
                    <li>• <strong>Despensa Seca Elevada:</strong> Alimentos não-perecíveis acondicionados em estrados plásticos elevados a pelo menos 15 cm do piso e 50 cm das paredes, com telas milimétricas contra roedores e insetos.</li>
                    <li>• <strong>Refeitório Coberto Dimensionado:</strong> Mesas e bancos com distanciamento adequado, permitindo alimentação em turnos com capacidade para servir <strong>3 refeições quentes diárias</strong> (café, almoço e jantar).</li>
                    <li>• <strong>Estação Pré-Refeitório de Lavagem de Mãos:</strong> Pelo menos 1 torneira com sabonete bactericida e álcool gel para cada 50 comensais na entrada do salão.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MATERIAL DE HIGIENE & SANEAMENTO */}
          {activeCategory === 'HIGIENE' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-rose-700 text-xs font-bold uppercase tracking-wider">
                    <Droplet className="w-4 h-4" />
                    <span>WASH (Água, Saneamento & Higiene) & Prevenção Epidemiológica</span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mt-1">
                    Características para Higiene Pessoal, Água & Esgotamento
                  </h4>
                </div>
                <div className="text-xs font-mono px-3 py-1 bg-rose-50 text-rose-800 rounded-lg border border-rose-200 self-start sm:self-auto">
                  Normas: Manual SPHERE · Ministério da Saúde · Fiocruz
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>1. Proporções Mínimas de Aparelhos Sanitários</span>
                  </div>
                  <ul className="text-xs text-slate-700 space-y-2 leading-relaxed">
                    <li>• <strong>Vasos Sanitários:</strong> Mínimo de <strong>1 bacia para cada 20 pessoas</strong>, rigorosamente separados por gênero (50% masculino / 50% feminino) com trancas internas que garantam privacidade e proteção.</li>
                    <li>• <strong>Chuveiros com Água Quente:</strong> Mínimo de <strong>1 chuveiro para cada 30 a 50 pessoas</strong> com estrado higiênico antiderrapante e ralos com fechamento anti-odores.</li>
                    <li>• <strong>Volume de Água Potável:</strong> <strong>15 a 20 litros por pessoa/dia</strong> (sendo 3 a 5L exclusivos para beber e cozinhar). O reservatório predial deve suprir 72h de consumo sem abastecimento externo.</li>
                    <li>• <strong>Esgotamento Operante:</strong> Rede de esgoto com caixas de gordura e fossas limpas e com refluxo impedido por válvulas de retenção contra inundações.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span>2. Gestão de Resíduos & Kit de Higiene Familiar</span>
                  </div>
                  <ul className="text-xs text-slate-700 space-y-2 leading-relaxed">
                    <li>• <strong>Composição do Kit Individual/Familiar:</strong> Sabonete em barra e líquido, escova e creme dental, absorventes íntimos higiênicos (garantia de dignidade menstrual), papel higiênico folha dupla, toalhas de banho individuais e fraldas descartáveis (infantis e geriátricas).</li>
                    <li>• <strong>Lixeiras com Acionamento por Pedal:</strong> Lixeiras estanques de 100L a 200L com tampa acionada por pedal para evitar contato manual, com descarte diário de resíduos sólidos.</li>
                    <li>• <strong>Tanques de Lavagem de Roupas:</strong> Mínimo de 1 tanque para cada 50 pessoas com varal ventilado para secagem de roupas e lençóis.</li>
                    <li>• <strong>Profilaxia Contra Leptospirose & Hepatite:</strong> Estoque de hipoclorito de sódio a 2,5% para cloração de água e desinfecção terminal diária de banheiros e pisos com água sanitária.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ANIMAIS & BEM-ESTAR PET */}
          {activeCategory === 'ANIMAIS' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-rose-700 text-xs font-bold uppercase tracking-wider">
                    <PawPrint className="w-4 h-4" />
                    <span>Manejo de Cães, Gatos & Prevenção de Zoonoses</span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mt-1">
                    Características para Acolher Animais Domésticos (Pets)
                  </h4>
                </div>
                <div className="text-xs font-mono px-3 py-1 bg-rose-50 text-rose-800 rounded-lg border border-rose-200 self-start sm:self-auto">
                  Normas: CFMV · Defesa Civil Nacional · Vigilância em Zoonoses
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>1. Espaço Físico & Segregação dos Dormitórios</span>
                  </div>
                  <ul className="text-xs text-slate-700 space-y-2 leading-relaxed">
                    <li>• <strong>Área Coberta Anexa (Pátio / Galpão Lateral):</strong> O alojamento de animais deve ser coberto, ventilado e protegido do sol e chuva, localizado em anexo ou pátio lateral cercado, <strong>nunca misturado no mesmo dormitório coletivo humano</strong> para evitar crises asmáticas, mordeduras e zoonoses.</li>
                    <li>• <strong>Baias e Canis Modulares:</strong> Cercados metálicos ou caixas de transporte rígidas com identificação do nome do animal e número do leito/tutor.</li>
                    <li>• <strong>Gatil Silencioso e Separado:</strong> Gatos estressam-se com latidos contínuos. O abrigo deve disponibilizar sala ou corredor exclusivo para felinos com caixas de areia sanitária.</li>
                    <li>• <strong>Ponto Hidráulico de Lavagem de Baias:</strong> Torneira com mangueira e ralo sifonado para higienização e remoção de dejetos pelo menos 2 vezes ao dia com detergente neutro e desinfetante próprio.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span>2. Triagem Veterinária, Ração & Vínculo com Tutores</span>
                  </div>
                  <ul className="text-xs text-slate-700 space-y-2 leading-relaxed">
                    <li>• <strong>Posto de Triagem Veterinária na Recepção:</strong> Avaliação clínica de ectoparasitas (pulgas, carrapatos), sarna, escoriações por enchentes, vermifugação e aplicação de vacina antirrábica.</li>
                    <li>• <strong>Quarentena para Animais Doentes ou Agressivos:</strong> Espaço isolado com distanciamento seguro para acolhimento de animais feridos ou com suspeita de leptospirose/esporotricose.</li>
                    <li>• <strong>Estoque de Ração Seca Fechada:</strong> Sacos de ração para cães e gatos armazenados em tambores vedados contra umidade, baratas e roedores.</li>
                    <li>• <strong>Acesso e Horários de Convivência dos Tutores:</strong> Horários pré-fixados para que as famílias possam alimentar, passear de coleira e cuidar de seus animais, reduzindo o estresse psicológico do pós-desastre.</li>
                  </ul>
                </div>
              </div>

              {/* Lesson from RS Floods */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-emerald-700" />
                  <span>Lição da Tragédia do Rio Grande do Sul (2024)</span>
                </div>
                <p className="text-emerald-800 leading-relaxed">
                  Na enchente histórica de maio de 2024 no RS, <strong>mais de 20.000 animais domésticos foram resgatados</strong>. Muitos cidadãos inicialmente recusaram-se a deixar suas casas ilhadas com medo de abandonarem seus animais. Abrigos com infraestrutura pet homologada tiveram adesão de evacuação <strong>80% mais rápida</strong> e reduziram significativamente incidentes de mordeduras ou zoonoses quando operados de forma compartimentada.
                </p>
              </div>
            </div>
          )}

          {/* Quick Technical Specs Summary Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden pt-2">
            <div className="bg-slate-100 px-4 py-2.5 font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Scale className="w-4 h-4 text-rose-700" />
              <span>Matriz Paramétrica Resumida de Requisitos para Engenheiros de Vistoria</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Grupo / Dimensão</th>
                    <th className="py-2.5 px-3">Parâmetro Físico Mínimo</th>
                    <th className="py-2.5 px-3">Equipamento / Infraestrutura Crítica</th>
                    <th className="py-2.5 px-3">Veto Inegociável da Defesa Civil</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-sans">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Jovens & Crianças</td>
                    <td className="py-2.5 px-3 text-slate-700">3,5 m² por pessoa · Tomadas &gt;1,30m</td>
                    <td className="py-2.5 px-3 text-slate-600">Espaço lúdico · Fraldário aquecido · Luz de vigília</td>
                    <td className="py-2.5 px-3 text-rose-700 font-semibold">Janelas sem trava · Separação dos pais</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Pessoas Idosas (60+)</td>
                    <td className="py-2.5 px-3 text-slate-700">Distância vaso sanitário &le; 20m · Piso antiderrapante</td>
                    <td className="py-2.5 px-3 text-slate-600">Leito térreo (45-50cm) · Geladeira para insulina</td>
                    <td className="py-2.5 px-3 text-rose-700 font-semibold">Acesso exclusivo por escada · Beliches</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Pessoas com Deficiência (PcD)</td>
                    <td className="py-2.5 px-3 text-slate-700">Rampas &le; 8,33% · Portas &ge; 80cm · Giro 1,50m</td>
                    <td className="py-2.5 px-3 text-slate-600">Sanitário NBR 9050 · Tomadas 24h gerador</td>
                    <td className="py-2.5 px-3 text-rose-700 font-semibold">Soleiras altas &gt; 2cm · Sem rampa</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Alimentação & Cozinha</td>
                    <td className="py-2.5 px-3 text-slate-700">Fluxo unidirecional · Despensa +15cm solo</td>
                    <td className="py-2.5 px-3 text-slate-600">Bancadas inox · Freezers em gerador · Coifa</td>
                    <td className="py-2.5 px-3 text-rose-700 font-semibold">Bancadas de madeira porosa · Sem água potável</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Material de Higiene</td>
                    <td className="py-2.5 px-3 text-slate-700">1 vaso/20 pessoas · 1 chuveiro/30-50 pessoas</td>
                    <td className="py-2.5 px-3 text-slate-600">15-20L água/dia · Kit individual · Lixeira a pedal</td>
                    <td className="py-2.5 px-3 text-rose-700 font-semibold">Banheiros sem divisão por sexo · Esgoto rompido</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Animais Domésticos</td>
                    <td className="py-2.5 px-3 text-slate-700">Área anexa ventilada e coberta · Ponto hidráulico</td>
                    <td className="py-2.5 px-3 text-slate-600">Baias modulares · Gatil separado · Triagem vet.</td>
                    <td className="py-2.5 px-3 text-rose-700 font-semibold">Animal solto no dormitório humano · Sem água</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-b-2xl print:hidden">
          <div className="text-xs text-slate-500">
            Guia elaborado pela Macro Norte Engenharia do Amanhã em conformidade com o Protocolo SPHERE e CREA.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Imprimir Laudo de Diretrizes
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
            >
              Fechar Guia
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
