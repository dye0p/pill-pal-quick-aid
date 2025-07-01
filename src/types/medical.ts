
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

export interface MedicalRecommendation {
  disease: string;
  description: string;
  medicines: Medicine[];
  pharmacies: Pharmacy[];
}
