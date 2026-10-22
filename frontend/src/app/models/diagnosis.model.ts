export interface DiagnosisRequest {
  cropType: string;
  location: string;
  notes?: string;
  imageUrl?: string;
}

export interface DiagnosisResult {
  diseaseName: string;
  confidence: number;
  symptoms: string[];
  recommendations: string[];
  source: string;
}
