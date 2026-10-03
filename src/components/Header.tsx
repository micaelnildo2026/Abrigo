import React from 'react';
import { ShieldCheck, Plus, FileText, BellRing } from 'lucide-react';

interface HeaderProps {
  activeTab: 'overview' | 'buildings' | 'map' | 'plan' | 'simulator';
  setActiveTab: (tab: 'overview' | 'buildings' | 'map' | 'plan' | 'simulator') => void;
  onOpenNewInspection: () => void;
  onOpenReportModal: () => void;
  onOpenRSAnalysis: () => void;
  onOpenCitizenRegistration: () => void;
  onOpenSourcesModal: () => void;
  onOpenActionPlanModal: () => void;
  onOpenRequirementsGuide?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewInspection,
  onOpenReportModal,
  onOpenRSAnalysis,
  onOpenCitizenRegistration,
  onOpenSourcesModal,
  onOpenActionPlanModal,
  onOpenRequirementsGuide,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark with brand emblem */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-700 flex items-center justify-center text-white font-black text-base shadow-sm tracking-tighter">
              MN
            </div>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); setActiveTab('overview'); }}
              className="text-lg font-bold tracking-tight text-slate-900 flex items-baseline gap-1.5"
            >
              <span>Macro Norte</span>
              <span className="text-xs font-semibold tracking-wider text-rose-700 uppercase">Engenharia</span>
            </a>
          </div>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('overview')}
              className={`transition-colors pb-1 border-b-2 ${
                activeTab === 'overview'
                  ? 'border-rose-600 text-slate-900 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('buildings')}
              className={`transition-colors pb-1 border-b-2 ${
                activeTab === 'buildings'
                  ? 'border-rose-600 text-slate-900 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Prédios & Triagem
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`transition-colors pb-1 border-b-2 ${
                activeTab === 'map'
                  ? 'border-rose-600 text-slate-900 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Mapa 2D / 3D
            </button>
            <button
              onClick={() => setActiveTab('plan')}
              className={`transition-colors pb-1 border-b-2 ${
                activeTab === 'plan'
                  ? 'border-rose-600 text-slate-900 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Plano de Ação Rápido
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className={`transition-colors pb-1 border-b-2 ${
                activeTab === 'simulator'
                  ? 'border-rose-600 text-slate-900 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Simulador de Crise
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCitizenRegistration}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs transition-colors whitespace-nowrap active:scale-[0.98]"
              title="Encontrar Abrigo Mais Próximo e Solicitar Transporte"
            >
              <span>Encontrar Abrigo / Transporte</span>
            </button>

            {onOpenRequirementsGuide && (
              <button
                onClick={onOpenRequirementsGuide}
                className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                title="Diretrizes para Jovens, Idosos, PcD, Alimentação, Higiene e Animais"
              >
                <span>Diretrizes Multidisciplinares</span>
              </button>
            )}

            <button
              onClick={onOpenActionPlanModal}
              className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200"
              title="Plano de Ação Imediato"
            >
              <span>Protocolo POP</span>
            </button>

            <button
              onClick={onOpenSourcesModal}
              className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
              title="Fontes de Pesquisa e Dados 2020-2026"
            >
              <span>Fontes 2020–2026</span>
            </button>

            <button
              onClick={onOpenNewInspection}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg shadow-sm transition-all whitespace-nowrap active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Nova Vistoria</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
