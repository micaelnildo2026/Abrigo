import React, { useState } from 'react';
import { BuildingShelter, BuildingType, InspectionChecklist } from '../types/shelter';
import { evaluateShelterChecklist } from '../utils/calculator';
import { X, Check, AlertTriangle, ShieldCheck, XCircle, Calculator, Building, Save } from 'lucide-react';

interface InspectionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newShelter: BuildingShelter) => void;
}

const defaultChecklist: InspectionChecklist = {
  structuralDamage: false,
  floodRiskZone: false,
  roofCondition: 'BOM',
  landslideSafeDistance: true,
  coveredAreaM2: 750,
  ceilingHeightMeters: 4.2,
  crossVentilation: true,
  thermalComfort: 'BOM',
  toiletMaleCount: 6,
  toiletFemaleCount: 6,
  showerCount: 4,
  waterStorageLiters: 15000,
  sewerSystemWorking: true,
  hasAccessRamp: true,
  wideDoorsNBR9050: true,
  accessibleRestroom: true,
  singleLevelOrElevator: true,
  hasBackupGenerator: false,
  industrialKitchen: true,
  ambulanceAccessDock: true,
  internetAndTelecom: true,
  avcbFireDepartmentValid: true,
};

export const InspectionFormModal: React.FC<InspectionFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState<BuildingType>('Escola Municipal');
  const [cityRegion, setCityRegion] = useState<'JOINVILLE_SC' | 'RIO_GRANDE_DO_SUL'>('JOINVILLE_SC');
  const [neighborhood, setNeighborhood] = useState('');
  const [address, setAddress] = useState('');
  const [elevationMeters, setElevationMeters] = useState(25);
  const [inspectorName, setInspectorName] = useState('Eng. Lucas Mendonça');
  const [creaRegister, setCreaRegister] = useState('CREA-SC 084.219-D');
  const [technicalNotes, setTechnicalNotes] = useState('');
  const [checklist, setChecklist] = useState<InspectionChecklist>(defaultChecklist);

  // Live evaluation preview
  const liveEval = evaluateShelterChecklist(checklist);

  const handleCheckboxChange = (field: keyof InspectionChecklist, value: boolean) => {
    setChecklist(prev => ({ ...prev, [field]: value }));
  };

  const handleNumberChange = (field: keyof InspectionChecklist, value: number) => {
    setChecklist(prev => ({ ...prev, [field]: Math.max(0, value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Pick a matching generated image asset based on building type
    let chosenImage = '/src/assets/images/school_shelter_1791051402107.jpg';
    if (type.includes('Ginásio')) chosenImage = '/src/assets/images/gymnasium_shelter_1791051387707.jpg';
    else if (type.includes('Pavilhão') || type.includes('Eventos')) chosenImage = '/src/assets/images/pavilion_shelter_1791051412119.jpg';
    else if (type.includes('Esportivo') || type.includes('Comunitário')) chosenImage = '/src/assets/images/sports_center_1791051424131.jpg';

    const newCode = `MN-ABR-${Math.floor(100 + Math.random() * 900)}`;

    const newShelter: BuildingShelter = {
      id: `bld-${Date.now()}`,
      code: newCode,
      cityRegion,
      city: cityRegion === 'JOINVILLE_SC' ? 'Joinville, SC' : 'Porto Alegre, RS',
      name: name.trim(),
      type,
      neighborhood: neighborhood.trim() || 'Centro',
      address: address.trim() || 'Endereço Urbano Cadastrado',
      coordinates: {
        lat: cityRegion === 'JOINVILLE_SC' ? -26.30 + (Math.random() - 0.5) * 0.05 : -30.03 + (Math.random() - 0.5) * 0.05,
        lng: cityRegion === 'JOINVILLE_SC' ? -48.85 + (Math.random() - 0.5) * 0.05 : -51.20 + (Math.random() - 0.5) * 0.05,
      },
      elevationMeters,
      imageUrl: chosenImage,
      capacityPersons: liveEval.calculatedCapacity,
      usefulAreaM2: checklist.coveredAreaM2,
      currentOccupancy: 0,
      status: liveEval.status,
      overallScore: liveEval.overallScore,
      scoresBreakdown: liveEval.scoresBreakdown,
      hasCriticalVeto: liveEval.hasCriticalVeto,
      vetoReason: liveEval.vetoReason,
      lastInspection: {
        date: new Date().toISOString().split('T')[0],
        inspectorName: inspectorName.trim() || 'Engenheiro Responsável',
        creaRegister: creaRegister.trim() || 'CREA Ativo',
        checklist,
        technicalNotes: technicalNotes.trim() || 'Vistoria técnica realizada conforme protocolo de habitabilidade emergencial.',
        requiredActions: liveEval.recommendedActions,
      },
      facilities: {
        toiletsTotal: checklist.toiletMaleCount + checklist.toiletFemaleCount,
        showersTotal: checklist.showerCount,
        waterTanksLiters: checklist.waterStorageLiters,
        generatorInstalled: checklist.hasBackupGenerator,
        kitchenEquipped: checklist.industrialKitchen,
        accessiblePCD: checklist.accessibleRestroom && checklist.hasAccessRamp,
        firePermitValid: checklist.avcbFireDepartmentValid,
      },
    };

    onSave(newShelter);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between z-10">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-rose-700" />
              <span>Nova Vistoria Técnica de Edificação</span>
            </h3>
            <p className="text-xs text-slate-500">
              Protocolo Macro Norte para Avaliação de Prédios como Abrigos
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Live Score Banner */}
          <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            liveEval.status === 'APTO_IMEDIATO'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : liveEval.status === 'APTO_COM_RESSALVAS'
              ? 'bg-amber-50 border-amber-200 text-amber-950'
              : 'bg-rose-50 border-rose-200 text-rose-950'
          }`}>
            <div className="space-y-0.5">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Resultado Instantâneo do Cálculo
              </div>
              <div className="text-lg font-bold flex items-center gap-2">
                {liveEval.status === 'APTO_IMEDIATO' && <ShieldCheck className="w-5 h-5 text-emerald-600" />}
                {liveEval.status === 'APTO_COM_RESSALVAS' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                {liveEval.status === 'INAPTO' && <XCircle className="w-5 h-5 text-rose-600" />}

                <span>
                  {liveEval.status === 'APTO_IMEDIATO' && 'Classificação: Apto Imediato (Classe A)'}
                  {liveEval.status === 'APTO_COM_RESSALVAS' && 'Classificação: Apto com Ressalvas (Classe B)'}
                  {liveEval.status === 'INAPTO' && 'Classificação: Inapto / Risco Impeditivo'}
                </span>
              </div>
              {liveEval.hasCriticalVeto ? (
                <p className="text-xs text-rose-800 font-medium">{liveEval.vetoReason}</p>
              ) : (
                <p className="text-xs text-slate-600">
                  Capacidade calculada: <strong className="font-mono">{liveEval.calculatedCapacity} pessoas</strong> (3,8m² por pessoa)
                </p>
              )}
            </div>

            <div className="text-right shrink-0">
              <div className="text-xs text-slate-500 font-medium">Índice IAA</div>
              <div className="text-3xl font-bold font-mono tabular-nums">
                {liveEval.overallScore}%
              </div>
            </div>
          </div>

          {/* Section 1: Dados Cadastrais */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              1. Identificação da Edificação Pública
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Nome do Edifício *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Escola Municipal Monteiro Lobato"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Tipologia da Estrutura</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as BuildingType)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-600 bg-white"
                >
                  <option value="Escola Municipal">Escola Municipal</option>
                  <option value="Escola Estadual">Escola Estadual</option>
                  <option value="Ginásio Poliesportivo">Ginásio Poliesportivo</option>
                  <option value="Centro de Eventos / Pavilhão">Centro de Eventos / Pavilhão</option>
                  <option value="Centro Comunitário">Centro Comunitário</option>
                  <option value="Complexo Esportivo">Complexo Esportivo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Bairro / Setor</label>
                <input
                  type="text"
                  placeholder="Ex: Parque das Nações"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Endereço Completo</label>
                <input
                  type="text"
                  placeholder="Ex: Rua São Paulo, 120"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Cota Altimétrica (Metros)</label>
                <input
                  type="number"
                  value={elevationMeters}
                  onChange={(e) => setElevationMeters(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-600 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Critérios Eliminatórios Estruturais & Geotécnicos */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              2. Avaliação de Estabilidade Estrutural & Geotécnica (Peso 30%)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.structuralDamage}
                  onChange={(e) => handleCheckboxChange('structuralDamage', e.target.checked)}
                  className="mt-0.5 rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                />
                <div>
                  <span className="font-semibold text-rose-800">Trincas ativas ou recalque em pilares/vigas [VETO CRÍTICO]</span>
                  <p className="text-slate-500 text-[11px] mt-0.5">Se marcado, o prédio é imediatamente considerado INAPTO.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.floodRiskZone}
                  onChange={(e) => handleCheckboxChange('floodRiskZone', e.target.checked)}
                  className="mt-0.5 rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                />
                <div>
                  <span className="font-semibold text-rose-800">Localizado em cota de inundação fluvial [VETO CRÍTICO]</span>
                  <p className="text-slate-500 text-[11px] mt-0.5">Edificações em várzea não podem abrigar refugiados climáticos.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.landslideSafeDistance}
                  onChange={(e) => handleCheckboxChange('landslideSafeDistance', e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <div>
                  <span className="font-semibold text-slate-800">Distância segura de encostas e taludes instáveis</span>
                  <p className="text-slate-500 text-[11px] mt-0.5">Livre de risco de deslizamento de terra ou queda de blocos.</p>
                </div>
              </label>

              <div className="p-3 rounded-lg border border-slate-200 space-y-1">
                <span className="font-semibold text-slate-800">Estado de Conservação do Telhado</span>
                <select
                  value={checklist.roofCondition}
                  onChange={(e) => setChecklist(prev => ({ ...prev, roofCondition: e.target.value as any }))}
                  className="w-full mt-1 px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white"
                >
                  <option value="EXCELENTE">Excelente (Lajes impermeabilizadas e telhas novas)</option>
                  <option value="BOM">Bom (Sem goteiras perceptíveis)</option>
                  <option value="REGULAR">Regular (Infiltrações leves em pontos periféricos)</option>
                  <option value="RUIM_COM_VAZAMENTOS">Ruim (Vazamentos extensos durante chuvas fortes)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Habitabilidade & Saneamento */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              3. Habitabilidade, Capacidade & Saneamento (SPHERE Guidelines)
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Área Coberta Útil (m²)</label>
                <input
                  type="number"
                  value={checklist.coveredAreaM2}
                  onChange={(e) => handleNumberChange('coveredAreaM2', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Pé-direito Médio (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={checklist.ceilingHeightMeters}
                  onChange={(e) => setChecklist(prev => ({ ...prev, ceilingHeightMeters: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Total Vasos Sanitários</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Masc"
                    value={checklist.toiletMaleCount}
                    onChange={(e) => handleNumberChange('toiletMaleCount', parseInt(e.target.value) || 0)}
                    className="w-1/2 px-2 py-1.5 border border-slate-300 rounded-lg font-mono text-slate-900"
                  />
                  <input
                    type="number"
                    placeholder="Fem"
                    value={checklist.toiletFemaleCount}
                    onChange={(e) => handleNumberChange('toiletFemaleCount', parseInt(e.target.value) || 0)}
                    className="w-1/2 px-2 py-1.5 border border-slate-300 rounded-lg font-mono text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Reserva Água (Litros)</label>
                <input
                  type="number"
                  step="1000"
                  value={checklist.waterStorageLiters}
                  onChange={(e) => handleNumberChange('waterStorageLiters', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <label className="flex items-center gap-2 p-2.5 border rounded-lg hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.crossVentilation}
                  onChange={(e) => handleCheckboxChange('crossVentilation', e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span>Ventilação Cruzada Natural</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 border rounded-lg hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.sewerSystemWorking}
                  onChange={(e) => handleCheckboxChange('sewerSystemWorking', e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span>Rede de Esgoto Operante</span>
              </label>

              <div className="flex items-center gap-2 p-2 border rounded-lg">
                <span className="text-slate-500">Duchas:</span>
                <input
                  type="number"
                  value={checklist.showerCount}
                  onChange={(e) => handleNumberChange('showerCount', parseInt(e.target.value) || 0)}
                  className="w-16 px-2 py-1 border border-slate-300 rounded text-slate-900 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Acessibilidade & Apoio */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              4. Acessibilidade (NBR 9050) & Infraestrutura de Apoio
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <label className="flex items-center gap-2 p-2.5 border rounded-lg hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.hasAccessRamp}
                  onChange={(e) => handleCheckboxChange('hasAccessRamp', e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span>Rampa de Acesso NBR 9050</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 border rounded-lg hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.accessibleRestroom}
                  onChange={(e) => handleCheckboxChange('accessibleRestroom', e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span>Sanitário Adaptado PcD</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 border rounded-lg hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.hasBackupGenerator}
                  onChange={(e) => handleCheckboxChange('hasBackupGenerator', e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span>Gerador de Emergência</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 border rounded-lg hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.industrialKitchen}
                  onChange={(e) => handleCheckboxChange('industrialKitchen', e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span>Cozinha Industrial Equipada</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 border rounded-lg hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.ambulanceAccessDock}
                  onChange={(e) => handleCheckboxChange('ambulanceAccessDock', e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span>Doca de Viaturas / Ambulância</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 border rounded-lg hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.avcbFireDepartmentValid}
                  onChange={(e) => handleCheckboxChange('avcbFireDepartmentValid', e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span>AVCB Bombeiros Válido</span>
              </label>
            </div>
          </div>

          {/* Section 5: Responsabilidade Técnica */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              5. Dados do Perito e Observações Técnicas
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Engenheiro(a) Vistoriador(a)</label>
                <input
                  type="text"
                  value={inspectorName}
                  onChange={(e) => setInspectorName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Registro CREA / CAU</label>
                <input
                  type="text"
                  value={creaRegister}
                  onChange={(e) => setCreaRegister(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-slate-600 font-medium mb-1">Parecer Descritivo e Recomendações</label>
                <textarea
                  rows={3}
                  placeholder="Descreva detalhes estruturais, estado das instalações elétricas/hidráulicas e intervenções recomendadas..."
                  value={technicalNotes}
                  onChange={(e) => setTechnicalNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-slate-50 px-6 py-4 border-t border-slate-200 -mx-6 -mb-6 flex justify-end gap-3 rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg transition-colors shadow-xs active:scale-[0.98]"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Salvar Vistoria na Plataforma</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
