
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
  type: 'pharmacy' | 'convenience_store' | 'online_store';
  distance?: string; // 온라인 스토어는 거리가 없음
  address?: string; // 온라인 스토어는 주소가 없음
  lat?: number; // 온라인 스토어는 좌표가 없음
  lng?: number; // 온라인 스토어는 좌표가 없음
  phone?: string;
  operatingHours: string;
  isOpen: boolean;
  currentStatus: string; // '운영 중', '영업 종료' 등
  url?: string; // 온라인 스토어 링크
  deliveryInfo?: string; // 배송 정보
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
