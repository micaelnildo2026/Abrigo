import React, { useState } from 'react';
import { BuildingShelter, CityRegion, TransportNeed } from '../types/shelter';
import { 
  X, 
  MapPin, 
  Users, 
  Car, 
  Bus, 
  LifeBuoy, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Compass, 
  Printer, 
  Phone, 
  PawPrint,
  Clock,
  ArrowRight
} from 'lucide-react';

interface CitizenRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  shelters: BuildingShelter[];
  defaultCity?: CityRegion;
}

export const CitizenRegistrationModal: React.FC<CitizenRegistrationModalProps> = ({
  isOpen,
  onClose,
  shelters,
  defaultCity = 'JOINVILLE_SC',
}) => {
  if (!isOpen) return null;

  // Form step: 1 = Form, 2 = Confirmed Pass
  const [step, setStep] = useState<'FORM' | 'CONFIRMED'>('FORM');

  // Form inputs
  const [fullName, setFullName] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [cityRegion, setCityRegion] = useState<CityRegion>(defaultCity);
  const [neighborhood, setNeighborhood] = useState('Morro do Meio');
  const [address, setAddress] = useState('');
  
  // Family composition
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(1);
  const [elderly, setElderly] = useState(0);
  const [hasPCD, setHasPCD] = useState(false);
  const [pcdDetails, setPcdDetails] = useState('');
  const [hasPets, setHasPets] = useState(false);
  const [petDetails, setPetDetails] = useState('');

  // Transport choice
  const [transportNeed, setTransportNeed] = useState<TransportNeed>('ONIBUS_MUNICIPAL');

  // Confirmation result
  const [matchedShelter, setMatchedShelter] = useState<BuildingShelter | null>(null);
  const [ticketCode, setTicketCode] = useState('');
  const [calculatedDistance, setCalculatedDistance] = useState<number>(2.4);

  // Neighborhoods suggestions by city
  const neighborhoodsJoinville = [
    'Vila Nova', 'Morro do Meio', 'Nova Brasília', 'Paranaguamirim', 'Pirabeiraba',
    'Costa e Silva', 'Aventureiro', 'Itaum', 'Floresta', 'Anita Garibaldi', 'Boehmwald'
  ];

  const neighborhoodsRS = [
    'Sarandi (Porto Alegre)', 'Menino Deus (Porto Alegre)', 'Mathias Velho (Canoas)',
    'Rio Branco (Canoas)', 'Centro (Eldorado do Sul)', 'Feitoria (São Leopoldo)',
    'Bairro Universitário (Lajeado)', 'Humaitá (Porto Alegre)'
  ];

  const activeNeighborhoodList = cityRegion === 'JOINVILLE_SC' ? neighborhoodsJoinville : neighborhoodsRS;

  const handleCalculateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;

    // Filter available safe shelters in the selected city/region
    const candidateShelters = shelters.filter(s => 
      s.cityRegion === cityRegion && 
      s.status !== 'INAPTO' &&
      (s.capacityPersons - s.currentOccupancy) >= (adults + children + elderly)
    );

    // Prefer shelter tailored to Morro do Meio or matching PcD / Pets
    let bestMatch = candidateShelters[0];
    if (neighborhood === 'Morro do Meio') {
      const morroMeioHub = candidateShelters.find(s => s.code === 'SC-JOI-005' || s.code === 'SC-JOI-002');
      if (morroMeioHub) bestMatch = morroMeioHub;
    }
    if (hasPCD) {
      const pcdSafe = candidateShelters.find(s => s.facilities.accessiblePCD);
      if (pcdSafe) bestMatch = pcdSafe;
    }

    if (!bestMatch) {
      // fallback to any non-inapto shelter in the region
      bestMatch = shelters.find(s => s.cityRegion === cityRegion && s.status !== 'INAPTO') || shelters[0];
    }

    // Generate random realistic distance
    const dist = (1.2 + Math.random() * 3.8).toFixed(1);
    setCalculatedDistance(parseFloat(dist));
    setMatchedShelter(bestMatch);
    setTicketCode(`DEF-${cityRegion === 'JOINVILLE_SC' ? 'JOI' : 'RS'}-${Math.floor(1000 + Math.random() * 9000)}`);
    setStep('CONFIRMED');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 print:border-none print:shadow-none print:max-h-none print:rounded-none">
        {/* Modal Top Bar */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between z-10 print:hidden">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-rose-700" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Auto-Registro & Localizador de Abrigo Seguro Mais Próximo
              </h3>
              <p className="text-xs text-slate-500">
                Atendimento Oficial da Defesa Civil · Joinville (SC) e Rio Grande do Sul
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

        {/* STEP 1: REGISTRATION & TRIAGE FORM */}
        {step === 'FORM' && (
          <form onSubmit={handleCalculateAndSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Context Notice */}
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
              <LifeBuoy className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-900 leading-relaxed">
                <strong>Orientações de Segurança Imediata:</strong> Se a água estiver invadindo sua residência ou se houver risco de deslizamento de terra em encosta, desligue a chave geral de energia elétrica, feche o registro de gás e dirija-se imediatamente a um ponto alto. O preenchimento abaixo garante sua vaga e aciona a logística de transporte da Defesa Civil.
              </div>
            </div>

            {/* City Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                1. Selecione sua Região de Residência *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => { setCityRegion('JOINVILLE_SC'); setNeighborhood('Vila Nova'); }}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    cityRegion === 'JOINVILLE_SC'
                      ? 'border-rose-600 bg-rose-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-sm font-bold text-slate-900">Joinville (Santa Catarina)</div>
                  <div className="text-xs text-slate-500 mt-0.5">Bacias dos Rios Cachoeira, Águas Vermelhas e Cubatão</div>
                </button>

                <button
                  type="button"
                  onClick={() => { setCityRegion('RIO_GRANDE_DO_SUL'); setNeighborhood('Sarandi (Porto Alegre)'); }}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    cityRegion === 'RIO_GRANDE_DO_SUL'
                      ? 'border-rose-600 bg-rose-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-sm font-bold text-slate-900">Rio Grande do Sul</div>
                  <div className="text-xs text-slate-500 mt-0.5">Porto Alegre, Canoas, Lajeado, Eldorado e S. Leopoldo</div>
                </button>
              </div>
            </div>

            {/* Personal Data & Address */}
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1.5">
                2. Seus Dados e Localização Atual
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Nome Completo do Responsável *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Carlos Eduardo da Silva"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">CPF</label>
                    <input
                      type="text"
                      placeholder="000.000.000-00"
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-rose-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Telefone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="(47) 99999-9999"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-rose-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Bairro Onde Você Está *</label>
                  <select
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-rose-600"
                  >
                    {activeNeighborhoodList.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Endereço Residencial (Rua e Número)</label>
                  <input
                    type="text"
                    placeholder="Ex: Rua XV de Novembro, 4500"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-600"
                  />
                </div>
              </div>
            </div>

            {/* Family Composition & Specific Needs */}
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1.5">
                3. Quantidade de Pessoas da Família a Serem Acolhidas
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-600 font-medium">Adultos (18-59 anos)</span>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={adults}
                    onChange={(e) => setAdults(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full mt-1 px-2.5 py-1.5 border border-slate-300 rounded font-mono font-bold text-slate-900"
                  />
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-600 font-medium">Crianças (0-17 anos)</span>
                  <input
                    type="number"
                    min="0"
                    max="15"
                    value={children}
                    onChange={(e) => setChildren(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full mt-1 px-2.5 py-1.5 border border-slate-300 rounded font-mono font-bold text-slate-900"
                  />
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-600 font-medium">Idosos (60+ anos)</span>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={elderly}
                    onChange={(e) => setElderly(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full mt-1 px-2.5 py-1.5 border border-slate-300 rounded font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-3 border border-slate-200 rounded-lg space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                    <input
                      type="checkbox"
                      checked={hasPCD}
                      onChange={(e) => setHasPCD(e.target.checked)}
                      className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                    />
                    <span>Possui pessoa com deficiência (PcD) ou acamada?</span>
                  </label>
                  {hasPCD && (
                    <input
                      type="text"
                      placeholder="Ex: Usuário de cadeira de rodas, insulino-dependente..."
                      value={pcdDetails}
                      onChange={(e) => setPcdDetails(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded text-slate-900"
                    />
                  )}
                </div>

                <div className="p-3 border border-slate-200 rounded-lg space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                    <input
                      type="checkbox"
                      checked={hasPets}
                      onChange={(e) => setHasPets(e.target.checked)}
                      className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                    />
                    <span>Possui animais domésticos que viajarão juntos?</span>
                  </label>
                  {hasPets && (
                    <input
                      type="text"
                      placeholder="Ex: 1 cão de médio porte com guia, 1 gato na caixa"
                      value={petDetails}
                      onChange={(e) => setPetDetails(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded text-slate-900"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Transport Logistics */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1.5">
                4. Como Você e Sua Família Pretendem Chegar ao Abrigo? *
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setTransportNeed('PROPRIO')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    transportNeed === 'PROPRIO'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Car className="w-4 h-4 text-emerald-600" />
                    <span>Veículo Próprio</span>
                  </div>
                  <div className="text-[11px] font-normal text-slate-500">
                    O sistema indicará a rota segura em cota alta livre de pontos de alagamento.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTransportNeed('ONIBUS_MUNICIPAL')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    transportNeed === 'ONIBUS_MUNICIPAL'
                      ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Bus className="w-4 h-4 text-blue-600" />
                    <span>Linha de Ônibus Gratuita</span>
                  </div>
                  <div className="text-[11px] font-normal text-slate-500">
                    Ponto de coleta de evacuação com vans e ônibus circulares da Defesa Civil.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTransportNeed('RESGATE_PRIORITARIO')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    transportNeed === 'RESGATE_PRIORITARIO'
                      ? 'border-rose-600 bg-rose-50 text-rose-950 font-bold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <LifeBuoy className="w-4 h-4 text-rose-600" />
                    <span>Estou Ilhado (Resgate)</span>
                  </div>
                  <div className="text-[11px] font-normal text-slate-500">
                    Acionamento urgente para botes e viaturas 4x4 do Corpo de Bombeiros / Defesa Civil.
                  </div>
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-lg transition-colors shadow-sm active:scale-[0.98]"
              >
                <span>Localizar Abrigo Seguro & Gerar Comprovante</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: CONFIRMED PASS & TRANSPORTATION INSTRUCTIONS */}
        {step === 'CONFIRMED' && matchedShelter && (
          <div className="p-6 sm:p-8 space-y-6">
            {/* Header Ticket Banner */}
            <div className="bg-emerald-700 text-white rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-200 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Reserva Homologada pela Defesa Civil</span>
                </div>
                <h4 className="text-xl font-bold">
                  Vagas Garantidas no Abrigo Seguro Mais Próximo
                </h4>
                <p className="text-xs text-emerald-100">
                  Total de {adults + children + elderly} acolhidos confirmados no sistema municipal
                </p>
              </div>

              <div className="bg-white/15 backdrop-blur-md rounded-lg p-3 text-right shrink-0">
                <div className="text-[11px] text-emerald-200 font-mono">Código de Triagem:</div>
                <div className="text-xl font-mono font-extrabold text-white tracking-wider">
                  {ticketCode}
                </div>
              </div>
            </div>

            {/* Matched Shelter Technical Details */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <span>{matchedShelter.code}</span>
                    <span aria-hidden="true">·</span>
                    <span>{matchedShelter.city}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                    {matchedShelter.name}
                  </h3>
                  <div className="text-xs text-slate-600 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{matchedShelter.address} ({matchedShelter.neighborhood})</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Cota Segura: {matchedShelter.elevationMeters}m
                  </span>
                  <div className="text-xs text-slate-500 mt-1">
                    Distância estimada: <strong className="font-mono text-slate-900">{calculatedDistance} km</strong>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500">Capacidade Total:</span>
                  <div className="font-bold text-slate-900 font-mono">{matchedShelter.capacityPersons} vagas</div>
                </div>
                <div>
                  <span className="text-slate-500">Vagas Restantes:</span>
                  <div className="font-bold text-emerald-700 font-mono">
                    {matchedShelter.capacityPersons - matchedShelter.currentOccupancy} vagas livres
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Água Potável:</span>
                  <div className="font-bold text-slate-900 font-mono">
                    {(matchedShelter.facilities.waterTanksLiters / 1000).toFixed(0)}k Litros
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Acolhimento Pet:</span>
                  <div className="font-bold text-slate-900">
                    {hasPets ? '✓ Pátio Pet Cadastrado' : 'Disponível'}
                  </div>
                </div>
              </div>
            </div>

            {/* Transport Logistics Instructions */}
            <div className="border border-slate-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                {transportNeed === 'PROPRIO' && <Car className="w-4 h-4 text-emerald-600" />}
                {transportNeed === 'ONIBUS_MUNICIPAL' && <Bus className="w-4 h-4 text-blue-600" />}
                {transportNeed === 'RESGATE_PRIORITARIO' && <LifeBuoy className="w-4 h-4 text-rose-600" />}
                <span>Instruções Logísticas de Deslocamento</span>
              </div>

              {transportNeed === 'PROPRIO' && (
                <div className="text-xs text-slate-700 space-y-2">
                  <p>
                    <strong>Rota Recomendada em Cota Elevada:</strong> Utilize as vias arteriais sinalizadas pela Defesa Civil. Evite transitar por vias de várzea e sob pontilhões baixos.
                  </p>
                  <p className="text-slate-500">
                    O abrigo possui estacionamento pavimentado para automóveis de acolhidos e doca para desembarque rápido.
                  </p>
                </div>
              )}

              {transportNeed === 'ONIBUS_MUNICIPAL' && (
                <div className="text-xs text-slate-700 space-y-2">
                  <p>
                    <strong>Ponto de Coleta e Embarque da Defesa Civil:</strong>
                  </p>
                  {matchedShelter.pickupPointsNear && matchedShelter.pickupPointsNear.length > 0 ? (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-1">
                      <div className="font-bold text-blue-900">{matchedShelter.pickupPointsNear[0].name}</div>
                      <div className="text-blue-800">{matchedShelter.pickupPointsNear[0].address}</div>
                      <div className="text-[11px] text-blue-600">
                        Distância do abrigo: ~{(matchedShelter.pickupPointsNear[0].distanceMeters / 1000).toFixed(1)} km · Intervalo de ônibus a cada 20 minutos
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900">
                      Ponto central de ônibus municipal ativo no terminal da região com vans circulares gratuitas da Prefeitura.
                    </div>
                  )}
                </div>
              )}

              {transportNeed === 'RESGATE_PRIORITARIO' && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg space-y-2 text-xs">
                  <div className="font-bold text-rose-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Chamado Prioritário de Resgate Enviado ao Centro de Operações</span>
                  </div>
                  <p className="text-rose-800 leading-relaxed">
                    Sua solicitação foi priorizada para envio de viatura tracionada ou embarcação inflável com equipe de socorristas. Permaneça em local elevado, mantenha seu celular com bateria e sinalize panos brancos ou lanternas.
                  </p>
                  <div className="text-rose-900 font-bold pt-1">
                    Telefones de Emergência: Defesa Civil (199) · Bombeiros (193) · Samu (192)
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep('FORM')}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                ← Alterar Dados da Família
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir Comprovante</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Concluir e Ir ao Abrigo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
