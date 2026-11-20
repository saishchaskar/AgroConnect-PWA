export interface DiagnosisResponse {
  id: string;
  diseaseName: string;
  cropDetected: string;
  confidence: number;
  isHealthy: boolean;
  symptoms: string[];
  culturalControl: string[];
  chemicalControl: string[];
  biologicalControl: string[];
  prevention: string[];
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'HEALTHY';
  modelUsed: string;
  timestamp: string;
  imageUrl?: string;
}

export interface DiagnosisHistoryItem {
  id: string;
  diseaseName: string;
  cropDetected: string;
  confidence: number;
  isHealthy: boolean;
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'HEALTHY';
  timestamp: string;
  location?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoUrl?: string;
  createdAt: string;
}
