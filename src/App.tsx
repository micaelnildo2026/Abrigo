import React, { useState, useMemo } from 'react';
import { BuildingShelter } from './types/shelter';
import { INITIAL_SHELTERS } from './data/initialShelters';
import { Header } from './components/Header';
import { OverviewStats } from './components/OverviewStats';
import { BuildingCard } from './components/BuildingCard';
import { BuildingDetailModal } from './components/BuildingDetailModal';
import { InteractiveMap } from './components/InteractiveMap';
import { InspectionFormModal } from './components/InspectionFormModal';
import { CrisisSimulator } from './components/CrisisSimulator';
import { OfficialReportModal } from './components/OfficialReportModal';
import { RSDisasterAnalysisModal } from './components/RSDisasterAnalysisModal';
import { CitizenRegistrationModal } from './components/CitizenRegistrationModal';
import { ResearchSourcesModal } from './components/ResearchSourcesModal';
import { QuickActionPlanModal } from './components/QuickActionPlanModal';
import { ShelterRequirementsGuideModal } from './components/ShelterRequirementsGuideModal';
import { Map3D } from './components/Map3D';
import { CityRegion } from './types/shelter';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  ShieldCheck, 
  Plus, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Building,
  Info,
  LifeBuoy,
  BookOpen,
  MapPin,
  Car,
  Rotate3d,
  Layers,
  Clock,
  Compass
} from 'lucide-react';

export default function App() {
  const [shelters, setShelters] = useState<BuildingShelter[]>(INITIAL_SHELTERS);
  const [activeTab, setActiveTab] = useState<'overview' | 'buildings' | 'map' | 'plan' | 'simulator'>('overview');
  const [mapMode, setMapMode] = useState<'2D' | '3D'>('3D');
  
  // Filtering & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedRegion, setSelectedRegion] = useState<'ALL' | CityRegion>('ALL');
  const [sortBy, setSortBy] = useState<'score' | 'capacity' | 'elevation'>('score');

  // Modal states
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingShelter | null>(null);
  const [reportBuilding, setReportBuilding] = useState<BuildingShelter | null>(null);
  const [isNewInspectionOpen, setIsNewInspectionOpen] = useState(false);
  const [isRSAnalysisOpen, setIsRSAnalysisOpen] = useState(false);
  const [isCitizenModalOpen, setIsCitizenModalOpen] = useState(false);
  const [isSourcesModalOpen, setIsSourcesModalOpen] = useState(false);
  const [isActionPlanModalOpen, setIsActionPlanModalOpen] = useState(false);
  const [isRequirementsGuideOpen, setIsRequirementsGuideOpen] = useState(false);

  // Filtered & sorted shelters
  const filteredShelters = useMemo(() => {
    return shelters
      .filter((s) => {
        const matchesSearch = 
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.city.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesStatus = selectedStatus === 'ALL' || s.status === selectedStatus;
        const matchesType = selectedType === 'ALL' || s.type === selectedType;
        const matchesRegion = selectedRegion === 'ALL' || s.cityRegion === selectedRegion;

        return matchesSearch && matchesStatus && matchesType && matchesRegion;
      })
      .sort((a, b) => {
        if (sortBy === 'score') return b.overallScore - a.overallScore;
        if (sortBy === 'capacity') return b.capacityPersons - a.capacityPersons;
        if (sortBy === 'elevation') return b.elevationMeters - a.elevationMeters;
        return 0;
      });
  }, [shelters, searchQuery, selectedStatus, selectedType, selectedRegion, sortBy]);

  // Handler for saving a new inspection
  const handleSaveNewShelter = (newShelter: BuildingShelter) => {
    setShelters(prev => [newShelter, ...prev]);
    setSelectedBuilding(newShelter);
  };

  // Handler for updating real-time occupancy
  const handleUpdateOccupancy = (id: string, newOccupancy: number) => {
    setShelters(prev => prev.map(s => s.id === id ? { ...s, currentOccupancy: newOccupancy } : s));
    if (selectedBuilding && selectedBuilding.id === id) {
      setSelectedBuilding(prev => prev ? { ...prev, currentOccupancy: newOccupancy } : null);
    }
  };

  const handleOpenGeneralReport = () => {
    // Open report for first available shelter or default
    setReportBuilding(shelters[0]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans selection:bg-rose-600 selection:text-white">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewInspection={() => setIsNewInspectionOpen(true)}
        onOpenReportModal={handleOpenGeneralReport}
        onOpenRSAnalysis={() => setIsRSAnalysisOpen(true)}
        onOpenCitizenRegistration={() => setIsCitizenModalOpen(true)}
        onOpenSourcesModal={() => setIsSourcesModalOpen(true)}
        onOpenActionPlanModal={() => setIsActionPlanModalOpen(true)}
        onOpenRequirementsGuide={() => setIsRequirementsGuideOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation Tabs (Mobile Quick Switch) */}
        <div className="flex md:hidden items-center justify-between border-b border-slate-200 pb-2 text-xs font-semibold text-slate-600 overflow-x-auto gap-3">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2 border-b-2 whitespace-nowrap ${activeTab === 'overview' ? 'border-rose-700 text-rose-700 font-bold' : 'border-transparent'}`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('buildings')}
            className={`pb-2 border-b-2 whitespace-nowrap ${activeTab === 'buildings' ? 'border-rose-700 text-rose-700 font-bold' : 'border-transparent'}`}
          >
            Prédios
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`pb-2 border-b-2 whitespace-nowrap ${activeTab === 'map' ? 'border-rose-700 text-rose-700 font-bold' : 'border-transparent'}`}
          >
            Mapa 2D/3D
          </button>
          <button
            onClick={() => setActiveTab('plan')}
            className={`pb-2 border-b-2 whitespace-nowrap ${activeTab === 'plan' ? 'border-rose-700 text-rose-700 font-bold' : 'border-transparent'}`}
          >
            Plano Rápido
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`pb-2 border-b-2 whitespace-nowrap ${activeTab === 'simulator' ? 'border-rose-700 text-rose-700 font-bold' : 'border-transparent'}`}
          >
            Simulador
          </button>
        </div>

        {/* Tab 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Citizen Emergency Assist Banner */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-xl p-6 shadow-md border border-blue-800 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
                  <LifeBuoy className="w-4 h-4 text-sky-400" />
                  <span>Atendimento Humanitário & Defesa Civil 24h</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Precisa de Abrigo Seguro ou Transporte para Evacuação?
                </h2>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  Sistema de auto-registro para famílias em áreas de alagamento ou deslizamento em <strong>Joinville (SC)</strong> e no <strong>Rio Grande do Sul</strong>. Localize o abrigo homologado mais próximo, reserve vagas para idosos/crianças/pets e solicite resgate ou linha de ônibus gratuita.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsCitizenModalOpen(true)}
                  className="px-5 py-3 text-xs sm:text-sm font-extrabold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-md active:scale-[0.98] text-center"
                >
                  Localizar Meu Abrigo & Transporte →
                </button>
                <button
                  type="button"
                  onClick={() => setIsSourcesModalOpen(true)}
                  className="px-4 py-3 text-xs font-semibold text-sky-200 bg-white/10 hover:bg-white/20 rounded-xl transition-colors border border-sky-400/30 text-center"
                >
                  Fontes & Dados (2020-2026)
                </button>
              </div>
            </div>

            <OverviewStats
              shelters={filteredShelters}
              onFilterStatus={(status) => {
                setSelectedStatus(status);
                setActiveTab('buildings');
              }}
            />

            {/* Special Rio Grande do Sul Case Study Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 border border-rose-900/60 rounded-xl p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Estudo de Caso Região Sul · Enchentes Maio/2024</span>
                </div>
                <h3 className="text-base font-bold text-white">
                  Diagnóstico e Lições Aprendidas na Maior Tragédia Climática do Rio Grande do Sul
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Análise pericial dos 980 abrigos operados, falha em abrigos improvisados inundados (como o Ginásio Tesourinha em Porto Alegre) e plano integrado de <strong>Solução, Implementação, Custo e Escala</strong>.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsRSAnalysisOpen(true)}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-700 hover:bg-rose-600 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
              >
                Abrir Estudo Completo RS
              </button>
            </div>

            {/* Quick explanation of Methodology */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                <Info className="w-4 h-4 text-rose-700" />
                <span>Metodologia Macro Norte de Triagem Estrutural & Habitabilidade</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                O <strong>Índice de Adequabilidade para Abrigo (IAA)</strong> avalia cinco dimensões fundamentais com critérios de veto imediato.
                Qualquer falha estrutural severa (trincas ativas em vigas/pilares) ou localização em cota de inundação fluvial classifica a edificação automaticamente como <strong>Inapta</strong>, garantindo total segurança às famílias acolhidas.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100 text-xs">
                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <div>
                    <strong className="text-slate-900">Classe A (Apto Imediato):</strong> IAA ≥ 80%, zero inconformidades críticas, atende NBR 9050 e SPHERE. Ativação em até 2 horas.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <div>
                    <strong className="text-slate-900">Classe B (Com Ressalvas):</strong> IAA 60% a 79%, exige adequações operacionais simples (ex: gerador móvel ou sanitários químicos).
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-600 mt-1.5 shrink-0" />
                  <div>
                    <strong className="text-slate-900">Classe C (Inapto / Risco):</strong> IAA &lt; 60% ou risco geotécnico/estrutural proibitivo. Vetado para acolhimento humano.
                  </div>
                </div>
              </div>
            </div>

            {/* Multidisciplinary Guidelines Banner (Jovens, Idosos, PcD, Cozinha, Higiene, Pets) */}
            <div className="bg-slate-900 text-white rounded-xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Caderno de Encargos &amp; Diretrizes Multidisciplinares</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  O que o Prédio Precisa Ter: Jovens, Idosos, PcD, Alimentação, Higiene e Animais?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Consulte os parâmetros físicos obrigatórios, normas de engenharia (NBR 9050, ANVISA RDC 216 e Manual SPHERE) e os vetos inegociáveis para garantir acolhimento digno e seguro a todos os públicos.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsRequirementsGuideOpen(true)}
                className="px-5 py-2.5 text-xs font-bold text-white bg-rose-700 hover:bg-rose-600 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm active:scale-[0.98]"
              >
                Abrir Guia de Diretrizes Técnicas →
              </button>
            </div>

            {/* Top Shelters Spotlight */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Edificações Prioritárias e Prontidão de Acolhimento
                  </h2>
                  <p className="text-xs text-slate-500">
                    Prédios públicos com laudo atualizado e capacidade imediata
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('buildings')}
                  className="text-xs font-semibold text-rose-700 hover:text-rose-800 transition-colors"
                >
                  Ver todos os {shelters.length} prédios →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shelters.slice(0, 3).map((shelter) => (
                  <BuildingCard
                    key={shelter.id}
                    shelter={shelter}
                    onSelect={(s) => setSelectedBuilding(s)}
                    onGenerateReport={(s) => setReportBuilding(s)}
                  />
                ))}
              </div>
            </div>

            {/* Embedded Geospatial Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Visão Cartográfica dos Abrigos e Mancha de Inundação
                  </h3>
                  <p className="text-xs text-slate-500">
                    Distribuição espacial de cotas e distâncias seguras
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('map')}
                  className="text-xs font-semibold text-rose-700 hover:text-rose-800 transition-colors"
                >
                  Expandir mapa completo →
                </button>
              </div>

              <InteractiveMap
                shelters={shelters}
                onSelectShelter={(s) => setSelectedBuilding(s)}
              />
            </div>
          </div>
        )}

        {/* Tab 2: BUILDINGS & TRIAGE */}
        {activeTab === 'buildings' && (
          <div className="space-y-6">
            {/* Control Bar: Search, Filters & Sorting */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nome, código, bairro ou rua..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-700"
                  />
                </div>

                {/* Region Segmented Filter */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs overflow-x-auto">
                  <button
                    onClick={() => setSelectedRegion('ALL')}
                    className={`px-3 py-1.5 font-medium rounded-md whitespace-nowrap transition-colors ${
                      selectedRegion === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Todas as Regiões
                  </button>
                  <button
                    onClick={() => setSelectedRegion('JOINVILLE_SC')}
                    className={`px-3 py-1.5 font-medium rounded-md whitespace-nowrap transition-colors ${
                      selectedRegion === 'JOINVILLE_SC' ? 'bg-white text-blue-800 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Joinville (SC)
                  </button>
                  <button
                    onClick={() => setSelectedRegion('RIO_GRANDE_DO_SUL')}
                    className={`px-3 py-1.5 font-medium rounded-md whitespace-nowrap transition-colors ${
                      selectedRegion === 'RIO_GRANDE_DO_SUL' ? 'bg-white text-rose-800 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Rio Grande do Sul
                  </button>
                </div>

                {/* Status Segmented Buttons */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs overflow-x-auto">
                  <button
                    onClick={() => setSelectedStatus('ALL')}
                    className={`px-3 py-1.5 font-medium rounded-md whitespace-nowrap transition-colors ${
                      selectedStatus === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Todos ({shelters.length})
                  </button>
                  <button
                    onClick={() => setSelectedStatus('APTO_IMEDIATO')}
                    className={`px-3 py-1.5 font-medium rounded-md whitespace-nowrap transition-colors ${
                      selectedStatus === 'APTO_IMEDIATO' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Aptos Imediatos
                  </button>
                  <button
                    onClick={() => setSelectedStatus('APTO_COM_RESSALVAS')}
                    className={`px-3 py-1.5 font-medium rounded-md whitespace-nowrap transition-colors ${
                      selectedStatus === 'APTO_COM_RESSALVAS' ? 'bg-white text-amber-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Com Ressalvas
                  </button>
                  <button
                    onClick={() => setSelectedStatus('INAPTO')}
                    className={`px-3 py-1.5 font-medium rounded-md whitespace-nowrap transition-colors ${
                      selectedStatus === 'INAPTO' ? 'bg-white text-rose-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Inaptos
                  </button>
                </div>

                {/* New Inspection Action */}
                <button
                  onClick={() => setIsNewInspectionOpen(true)}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg shadow-xs transition-colors shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nova Vistoria</span>
                </button>
              </div>

              {/* Secondary Filters Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Tipologia:</span>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="px-2 py-1 border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none"
                    >
                      <option value="ALL">Todas as Tipologias</option>
                      <option value="Escola Municipal">Escolas Municipais</option>
                      <option value="Escola Estadual">Escolas Estaduais</option>
                      <option value="Ginásio Poliesportivo">Ginásios Poliesportivos</option>
                      <option value="Centro de Eventos / Pavilhão">Pavilhões / Eventos</option>
                      <option value="Complexo Esportivo">Complexos Esportivos</option>
                      <option value="Centro Comunitário">Centros Comunitários</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-500">Ordenar por:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-2 py-1 border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none"
                  >
                    <option value="score">Pontuação IAA (Decrescente)</option>
                    <option value="capacity">Capacidade de Pessoas</option>
                    <option value="elevation">Cota Altimétrica (Mais alta)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Buildings Grid */}
            {filteredShelters.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredShelters.map((shelter) => (
                  <BuildingCard
                    key={shelter.id}
                    shelter={shelter}
                    onSelect={(s) => setSelectedBuilding(s)}
                    onGenerateReport={(s) => setReportBuilding(s)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
                <Building className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">
                  Nenhum prédio encontrado com estes filtros
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Tente alterar os termos de busca ou redefinir a classificação de aptidão selecionada.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedStatus('ALL');
                    setSelectedType('ALL');
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: MAP (2D & 3D WebGL Switcher) */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            {/* Map Mode Selector */}
            <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-rose-700" />
                <div>
                  <span className="text-xs font-bold text-slate-900">Modo de Visualização Geoespacial</span>
                  <div className="text-[11px] text-slate-500">Alternância entre relevo tridimensional e malha vetorial</div>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => setMapMode('3D')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                    mapMode === '3D' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Rotate3d className="w-3.5 h-3.5" />
                  <span>Simulador 3D Altimétrico (WebGL)</span>
                </button>
                <button
                  onClick={() => setMapMode('2D')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                    mapMode === '2D' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Mapa 2D Cartográfico</span>
                </button>
              </div>
            </div>

            {/* Active Map View */}
            {mapMode === '3D' ? (
              <Map3D
                shelters={shelters}
                onSelectShelter={(s) => setSelectedBuilding(s)}
              />
            ) : (
              <InteractiveMap
                shelters={shelters}
                onSelectShelter={(s) => setSelectedBuilding(s)}
              />
            )}

            {/* Summary list below map */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <div className="text-sm font-bold text-slate-900">
                Resumo Altimétrico e Risco Hídrico por Setor Urbano (Joinville e RS)
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                As cotas de segurança para abrigos temporários foram fixadas considerando as cotas de cheia histórica: no <strong>Rio Grande do Sul</strong> (Guaíba 5,35m e Rio Taquari 34m), prédios abaixo de 7m ou em zonas com risco de refluxo de estações de bombeamento são vetados. Em <strong>Joinville (SC)</strong>, o efeito conjunto de maré astronômica e extravasamento dos rios Cachoeira e Águas Vermelhas exige cotas de segurança superiores a 10 metros para permanência prolongada.
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: QUICK ACTION PLAN */}
        {activeTab === 'plan' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-700 uppercase tracking-wider">
                    <Clock className="w-4 h-4 text-rose-700" />
                    <span>Protocolo Operacional Padrão (POP)</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">
                    Plano de Ação Rápido de Contingência & Operação de Abrigos
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Roteiro tático de pronta-resposta de 0h a 72h para Defesa Civil de Joinville (SC) e Rio Grande do Sul
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsActionPlanModalOpen(true)}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-lg transition-colors shadow-xs whitespace-nowrap self-start sm:self-auto"
                >
                  Abrir Ordem de Operação Formal →
                </button>
              </div>

              {/* Real Photo Evidence Grid */}
              <div className="pt-4 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Evidências Fotográficas do Desastre vs. A Solução Técnica
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Photo 1: Morro do Meio */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                    <div className="h-40 overflow-hidden relative">
                      <img
                        src="/src/assets/images/morro_do_meio_flood_1791053206147.jpg"
                        alt="Enchente no Bairro Morro do Meio Joinville"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold">
                        O PROBLEMA: MORRO DO MEIO (JOINVILLE)
                      </span>
                    </div>
                    <div className="p-3 space-y-1">
                      <div className="text-xs font-bold text-slate-900">Cheia do Rio Águas Vermelhas &amp; Maré</div>
                      <div className="text-[11px] text-slate-500 leading-snug">
                        Ruas Minas Gerais e Pitiguaras ilhadas com até 1,20m de água. Resgate por botes dos Bombeiros.
                      </div>
                    </div>
                  </div>

                  {/* Photo 2: RS 2024 */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                    <div className="h-40 overflow-hidden relative">
                      <img
                        src="/src/assets/images/rs_flood_problem_1791052713170.jpg"
                        alt="Enchente RS 2024"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold">
                        O PROBLEMA: RS (2024)
                      </span>
                    </div>
                    <div className="p-3 space-y-1">
                      <div className="text-xs font-bold text-slate-900">Enchente do Guaíba (5,35m)</div>
                      <div className="text-[11px] text-slate-500 leading-snug">
                        Ruas submersas e 81 mil pessoas desabrigadas em maio de 2024.
                      </div>
                    </div>
                  </div>

                  {/* Photo 3: Safe Shelter Joinville */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                    <div className="h-40 overflow-hidden relative">
                      <img
                        src="/src/assets/images/joinville_shelter_safe_1791053220504.jpg"
                        alt="Abrigo Seguro em Cota Alta Joinville"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold">
                        A SOLUÇÃO: COTA ALTA (JOINVILLE)
                      </span>
                    </div>
                    <div className="p-3 space-y-1">
                      <div className="text-xs font-bold text-slate-900">Polo Vila Nova / Costa e Silva (&gt;16m)</div>
                      <div className="text-[11px] text-slate-500 leading-snug">
                        Edificação imune a cheias, acessibilidade NBR 9050, gerador e recepção dos acolhidos.
                      </div>
                    </div>
                  </div>

                  {/* Photo 4: Shelter Interior SPHERE */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                    <div className="h-40 overflow-hidden relative">
                      <img
                        src="/src/assets/images/shelter_interior_family_1791053232576.jpg"
                        alt="Acomodação Digna Familiar"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold">
                        A SOLUÇÃO: DIGNIDADE FAMILIAR
                      </span>
                    </div>
                    <div className="p-3 space-y-1">
                      <div className="text-xs font-bold text-slate-900">Padrão SPHERE &amp; Espaço Infantil</div>
                      <div className="text-[11px] text-slate-500 leading-snug">
                        Cubículos de 4m² por pessoa, camas higienizadas, lactário, brinquedoteca e triagem médica.
                      </div>
                    </div>
                  </div>

                  {/* Photo 5: Shelter Pet Care */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                    <div className="h-40 overflow-hidden relative">
                      <img
                        src="/src/assets/images/shelter_pet_care_1791053251902.jpg"
                        alt="Acolhimento Animal Pet"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-purple-600 text-white text-[10px] font-bold">
                        A SOLUÇÃO: BEM-ESTAR ANIMAL
                      </span>
                    </div>
                    <div className="p-3 space-y-1">
                      <div className="text-xs font-bold text-slate-900">Canil/Gatil Anexo com Veterinário</div>
                      <div className="text-[11px] text-slate-500 leading-snug">
                        Baias modulares arejadas, caixas de transporte, vacinação emergencial e acesso dos tutores.
                      </div>
                    </div>
                  </div>

                  {/* Photo 6: Rescue Logistics */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                    <div className="h-40 overflow-hidden relative">
                      <img
                        src="/src/assets/images/rescue_logistics_1791052743717.jpg"
                        alt="Logística de Resgate"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-bold">
                        A SOLUÇÃO: LOGÍSTICA DE RESGATE
                      </span>
                    </div>
                    <div className="p-3 space-y-1">
                      <div className="text-xs font-bold text-slate-900">Transbordo &amp; Ônibus Gratuitos</div>
                      <div className="text-[11px] text-slate-500 leading-snug">
                        Despacho coordenado de viaturas 4x4 e botes resgatando famílias do Morro do Meio e RS.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Phases */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 text-xs">1. Horas 0h a 6h: Alerta &amp; Evacuação</div>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    <li>Ativação de abrigos Classe A em cotas altas.</li>
                    <li>Ônibus circulares gratuitos da Defesa Civil.</li>
                    <li>Veto a prédios em cotas baixas.</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 text-xs">2. Horas 6h a 24h: Recepção &amp; Suprimentos</div>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    <li>Triagem médica na entrada e canil/gatil.</li>
                    <li>15L de água potável/pessoa/dia.</li>
                    <li>Gerador de emergência em funcionamento.</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 text-xs">3. Horas 24h a 72h: Desmobilização Digna</div>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    <li>Vigilância sanitária contra leptospirose.</li>
                    <li>Cadastro no Aluguel Social (R$ 1.000/mês).</li>
                    <li>Desinfecção de escolas para volta das aulas.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: CRISIS SIMULATOR */}
        {activeTab === 'simulator' && (
          <CrisisSimulator
            shelters={shelters}
            onSelectShelter={(s) => setSelectedBuilding(s)}
          />
        )}
      </main>

      {/* Clean Technical Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Macro Norte Engenharia do Amanhã</span>
            <span aria-hidden="true">·</span>
            <span>Sistema de Gestão de Risco e Defesa Civil</span>
          </div>
          <div>
            <span>Normas técnicas aplicadas: NBR 9050 · NBR 13434 · Manual SPHERE Internacional</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <BuildingDetailModal
        shelter={selectedBuilding}
        onClose={() => setSelectedBuilding(null)}
        onOpenReport={(s) => {
          setSelectedBuilding(null);
          setReportBuilding(s);
        }}
        onUpdateOccupancy={handleUpdateOccupancy}
      />

      <OfficialReportModal
        shelter={reportBuilding}
        onClose={() => setReportBuilding(null)}
      />

      <InspectionFormModal
        isOpen={isNewInspectionOpen}
        onClose={() => setIsNewInspectionOpen(false)}
        onSave={handleSaveNewShelter}
      />

      <RSDisasterAnalysisModal
        isOpen={isRSAnalysisOpen}
        onClose={() => setIsRSAnalysisOpen(false)}
      />

      <CitizenRegistrationModal
        isOpen={isCitizenModalOpen}
        onClose={() => setIsCitizenModalOpen(false)}
        shelters={shelters}
        defaultCity="JOINVILLE_SC"
      />

      <ResearchSourcesModal
        isOpen={isSourcesModalOpen}
        onClose={() => setIsSourcesModalOpen(false)}
      />

      <QuickActionPlanModal
        isOpen={isActionPlanModalOpen}
        onClose={() => setIsActionPlanModalOpen(false)}
      />

      <ShelterRequirementsGuideModal
        isOpen={isRequirementsGuideOpen}
        onClose={() => setIsRequirementsGuideOpen(false)}
      />
    </div>
  );
}
