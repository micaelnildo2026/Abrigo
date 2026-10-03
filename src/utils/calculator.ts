import { InspectionChecklist, ShelterStatus } from '../types/shelter';

export interface EvaluationResult {
  overallScore: number; // 0 - 100
  status: ShelterStatus;
  hasCriticalVeto: boolean;
  vetoReason?: string;
  calculatedCapacity: number;
  scoresBreakdown: {
    structural: number; // 0 - 30
    habitability: number; // 0 - 20
    sanitation: number; // 0 - 20
    accessibility: number; // 0 - 15
    logistics: number; // 0 - 15
  };
  recommendedActions: string[];
}

export function evaluateShelterChecklist(checklist: InspectionChecklist): EvaluationResult {
  const actions: string[] = [];
  let hasCriticalVeto = false;
  let vetoReason = '';

  // 1. Verificações de Veto Crítico (Eliminatório por Norma de Segurança da Defesa Civil)
  if (checklist.structuralDamage) {
    hasCriticalVeto = true;
    vetoReason = 'Presença de patologias estruturais graves (trincas ativas ou recalque diferencial em pilares/vigas).';
    actions.push('Interdição preventiva imediata e contratação de perícia estrutural com ensaio esclerométrico.');
  }

  if (checklist.floodRiskZone) {
    hasCriticalVeto = true;
    vetoReason = 'Edificação localizada em cota de cota de inundação ou várzea de rio vulnerável.';
    actions.push('Desqualificação para abrigo permanente por incompatibilidade de cota topográfica de segurança.');
  }

  if (!checklist.landslideSafeDistance) {
    hasCriticalVeto = true;
    vetoReason = 'Proximidade imediata a talude instável com risco de escorregamento de massa.';
    actions.push('Vistoria geotécnica urgente para estabilização de encosta antes de qualquer destinação.');
  }

  // 2. Pontuação Estrutural (Máx 30 pts)
  let structuralScore = 0;
  if (!checklist.structuralDamage) structuralScore += 14;
  if (!checklist.floodRiskZone) structuralScore += 8;
  if (checklist.landslideSafeDistance) structuralScore += 4;
  if (checklist.roofCondition === 'EXCELENTE') structuralScore += 4;
  else if (checklist.roofCondition === 'BOM') structuralScore += 3;
  else if (checklist.roofCondition === 'REGULAR') {
    structuralScore += 1;
    actions.push('Revisar calhas e telhas com pequenas infiltrações.');
  } else {
    actions.push('Substituir telhamento danificado que inviabiliza permanência em dias de chuva.');
  }

  // 3. Pontuação de Habitabilidade & Espaço (Máx 20 pts)
  // Base humanitária SPHERE: 3,5m² a 4,0m² cobertos por pessoa abrigada
  const calculatedCapacity = Math.max(10, Math.floor(checklist.coveredAreaM2 / 3.8));
  let habitabilityScore = 0;
  if (checklist.coveredAreaM2 >= 800) habitabilityScore += 7;
  else if (checklist.coveredAreaM2 >= 400) habitabilityScore += 5;
  else habitabilityScore += 3;

  if (checklist.ceilingHeightMeters >= 4.0) habitabilityScore += 5;
  else if (checklist.ceilingHeightMeters >= 2.8) habitabilityScore += 3;

  if (checklist.crossVentilation) habitabilityScore += 4;
  else actions.push('Instalar exaustores ou ventiladores industriais para circulação de ar.');

  if (checklist.thermalComfort === 'BOM') habitabilityScore += 4;
  else if (checklist.thermalComfort === 'REGULAR') habitabilityScore += 2;
  else actions.push('Providenciar isolamento térmico temporário ou climatização móvel.');

  // 4. Pontuação de Saneamento & Água (Máx 20 pts)
  // SPHERE: min 1 vaso para cada 20 a 25 pessoas; reserva hídrica de 15L a 20L/pessoa/dia
  let sanitationScore = 0;
  const totalToilets = checklist.toiletMaleCount + checklist.toiletFemaleCount;
  const toiletsRatio = totalToilets > 0 ? calculatedCapacity / totalToilets : 999;

  if (toiletsRatio <= 25) sanitationScore += 6;
  else if (toiletsRatio <= 40) {
    sanitationScore += 4;
    actions.push('Instalar módulos de sanitários químicos complementares em pátio externo.');
  } else {
    sanitationScore += 1;
    actions.push('Relação sanitária deficiente: urgente aluguel de baterias de banheiros móveis com pia.');
  }

  if (checklist.showerCount >= 6) sanitationScore += 4;
  else if (checklist.showerCount >= 2) sanitationScore += 2;
  else actions.push('Adequar vestiários com duchas para higienização diária dos abrigados.');

  const waterPerPerson = calculatedCapacity > 0 ? checklist.waterStorageLiters / calculatedCapacity : 0;
  if (waterPerPerson >= 30) sanitationScore += 6;
  else if (waterPerPerson >= 15) sanitationScore += 4;
  else {
    sanitationScore += 1;
    actions.push('Instalar caixas d’água provisórias extras ou rota contínua de caminhão-pipa.');
  }

  if (checklist.sewerSystemWorking) sanitationScore += 4;
  else {
    actions.push('Desentupir e revisar sistema de esgotamento/fossa antes do recebimento de pessoas.');
  }

  // 5. Pontuação de Acessibilidade NBR 9050 (Máx 15 pts)
  let accessibilityScore = 0;
  if (checklist.hasAccessRamp) accessibilityScore += 4;
  else actions.push('Construir rampa de acesso suave com corrimão duplo no acesso principal.');

  if (checklist.wideDoorsNBR9050) accessibilityScore += 4;
  else actions.push('Ampliar vãos de portas de circulação para no mínimo 80cm.');

  if (checklist.accessibleRestroom) accessibilityScore += 4;
  else actions.push('Adaptar pelo menos um sanitário unissex PcD com barras de apoio e giro para cadeira de rodas.');

  if (checklist.singleLevelOrElevator) accessibilityScore += 3;

  // 6. Pontuação de Logística, Energia & Apoio (Máx 15 pts)
  let logisticsScore = 0;
  if (checklist.hasBackupGenerator) logisticsScore += 4;
  else actions.push('Programar conexão para gerador móvel de emergência (falta de luz comum em temporais).');

  if (checklist.industrialKitchen) logisticsScore += 4;
  else actions.push('Montar estrutura de apoio nutricional ou firmar parceria para marmitas prontas.');

  if (checklist.ambulanceAccessDock) logisticsScore += 3;
  else actions.push('Desobstruir portão lateral para embarque/desembarque de macas e viaturas.');

  if (checklist.internetAndTelecom) logisticsScore += 2;
  if (checklist.avcbFireDepartmentValid) logisticsScore += 2;
  else actions.push('Renovar/regularizar Auto de Vistoria do Corpo de Bombeiros (AVCB) e recarregar extintores.');

  const rawScore = structuralScore + habitabilityScore + sanitationScore + accessibilityScore + logisticsScore;
  const overallScore = hasCriticalVeto ? Math.min(rawScore, 42) : Math.round(rawScore);

  let status: ShelterStatus = 'INAPTO';
  if (!hasCriticalVeto) {
    if (overallScore >= 80) {
      status = 'APTO_IMEDIATO';
    } else if (overallScore >= 60) {
      status = 'APTO_COM_RESSALVAS';
    }
  }

  return {
    overallScore,
    status,
    hasCriticalVeto,
    vetoReason: hasCriticalVeto ? vetoReason : undefined,
    calculatedCapacity,
    scoresBreakdown: {
      structural: structuralScore,
      habitability: habitabilityScore,
      sanitation: sanitationScore,
      accessibility: accessibilityScore,
      logistics: logisticsScore,
    },
    recommendedActions: actions,
  };
}
