export type ShelterStatus = 'APTO_IMEDIATO' | 'APTO_COM_RESSALVAS' | 'INAPTO';

export type BuildingType = 
  | 'Escola Municipal' 
  | 'Escola Estadual' 
  | 'Ginásio Poliesportivo' 
  | 'Centro de Eventos / Pavilhão' 
  | 'Centro Comunitário' 
  | 'Complexo Esportivo';

export interface InspectionChecklist {
  // 1. Estrutural & Geotécnico (30%)
  structuralDamage: boolean; // se true = trincas/fissuras graves (CRÍTICO)
  floodRiskZone: boolean; // se true = em cota de alagamento (CRÍTICO)
  roofCondition: 'EXCELENTE' | 'BOM' | 'REGULAR' | 'RUIM_COM_VAZAMENTOS';
  landslideSafeDistance: boolean; // área livre de encosta instável
  
  // 2. Capacidade & Habitabilidade (20%)
  coveredAreaM2: number;
  ceilingHeightMeters: number;
  crossVentilation: boolean;
  thermalComfort: 'BOM' | 'REGULAR' | 'INSUFICIENTE';
  
  // 3. Saneamento & Hidráulica (20%)
  toiletMaleCount: number;
  toiletFemaleCount: number;
  showerCount: number;
  waterStorageLiters: number;
  sewerSystemWorking: boolean;
  
  // 4. Acessibilidade (15%)
  hasAccessRamp: boolean;
  wideDoorsNBR9050: boolean;
  accessibleRestroom: boolean;
  singleLevelOrElevator: boolean;
  
  // 5. Logística, Energia & Apoio (15%)
  hasBackupGenerator: boolean;
  industrialKitchen: boolean;
  ambulanceAccessDock: boolean;
  internetAndTelecom: boolean;
  avcbFireDepartmentValid: boolean;
}

export interface InspectionRecord {
  date: string;
  inspectorName: string;
  creaRegister: string;
  checklist: InspectionChecklist;
  technicalNotes: string;
  requiredActions: string[];
}

export type CityRegion = 'JOINVILLE_SC' | 'RIO_GRANDE_DO_SUL';

export interface BuildingShelter {
  id: string;
  code: string; // Ex: MN-ABR-001
  cityRegion: CityRegion;
  city: string; // Ex: Joinville, Porto Alegre, Canoas, etc.
  name: string;
  type: BuildingType;
  neighborhood: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  elevationMeters: number;
  imageUrl: string;
  capacityPersons: number; // calculado com base em 3.5 a 4.0 m² por pessoa
  usefulAreaM2: number;
  currentOccupancy: number; // para monitoramento em tempo real
  status: ShelterStatus;
  overallScore: number; // 0 a 100 (IAA - Índice de Adequabilidade de Abrigo)
  scoresBreakdown: {
    structural: number;
    habitability: number;
    sanitation: number;
    accessibility: number;
    logistics: number;
  };
  hasCriticalVeto: boolean;
  vetoReason?: string;
  lastInspection: InspectionRecord;
  facilities: {
    toiletsTotal: number;
    showersTotal: number;
    waterTanksLiters: number;
    generatorInstalled: boolean;
    kitchenEquipped: boolean;
    accessiblePCD: boolean;
    firePermitValid: boolean;
    hasPetArea?: boolean;
  };
  pickupPointsNear?: {
    name: string;
    address: string;
    distanceMeters: number;
  }[];
}

export type TransportNeed = 'PROPRIO' | 'ONIBUS_MUNICIPAL' | 'RESGATE_PRIORITARIO';

export interface CitizenRegistration {
  id: string;
  fullName: string;
  cpf: string;
  phone: string;
  cityRegion: CityRegion;
  neighborhood: string;
  address: string;
  familyMembersCount: number;
  adultsCount: number;
  childrenCount: number;
  elderlyCount: number;
  hasPCD: boolean;
  pcdDetails?: string;
  hasPets: boolean;
  petDetails?: string;
  transportNeed: TransportNeed;
  status: 'PENDENTE' | 'CONFIRMADO' | 'EM_TRANSITO' | 'ACOLHIDO';
  assignedShelterId?: string;
  registeredAt: string;
  distanceKm?: number;
}


export interface CrisisSimulationScenario {
  name: string;
  description: string;
  estimatedAffectedPeople: number;
  priorityNeighborhoods: string[];
  riskType: 'Inundação Fluvial' | 'Deslizamento de Encosta' | 'Tempestade Severa / Vendaval';
}
