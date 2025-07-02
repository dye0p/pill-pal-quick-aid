
export type RiskLevel = 'high' | 'medium' | 'low';

export interface Medicine {
  name: string;
  effect: string;
  price: string;
  contraindications?: string[]; // 금기사항 (알레르기 성분 등)
  interactions?: string[]; // 상호작용 약물
}

export interface SalesLocation {
  id: string;
  name: string;
  type: 'pharmacy' | 'convenience_store';
  distance: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  operatingHours: string;
  isOpen: boolean;
  currentStatus: string; // '운영 중', '영업 종료' 등
}

export interface AlternativeDisease {
  name: string;
  probability: string;
  description: string;
}

export interface UserProfile {
  height?: number; // cm
  weight?: number; // kg
  allergies: string[]; // 알레르기 성분
  conditions: string[]; // 기저질환
  medications: string[]; // 현재 복용 약물
}

export interface RiskAssessment {
  level: RiskLevel;
  title: string;
  description: string;
  action: string;
  emergency?: {
    message: string;
    hospitals: EmergencyHospital[];
  };
}

export interface EmergencyHospital {
  name: string;
  distance: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
}

export interface MedicalRecommendation {
  symptoms: string;
  riskAssessment: RiskAssessment;
  disease?: string;
  description?: string;
  alternativeDiseases?: AlternativeDisease[];
  medicines?: Medicine[];
  salesLocations?: SalesLocation[];
  personalizedWarnings?: string[];
}
