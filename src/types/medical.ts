
export interface Medicine {
  name: string;
  effect: string;
  price: string;
}

export interface Pharmacy {
  name: string;
  distance: string;
  address: string;
  lat: number;
  lng: number;
}

export interface AlternativeDisease {
  name: string;
  probability: string;
  description: string;
}

export interface MedicalRecommendation {
  symptoms: string;
  disease: string;
  description: string;
  alternativeDiseases: AlternativeDisease[];
  medicines: Medicine[];
  pharmacies: Pharmacy[];
}
