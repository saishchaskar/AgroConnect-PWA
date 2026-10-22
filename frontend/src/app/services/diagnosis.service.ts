import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DiagnosisRequest, DiagnosisResult } from '../models/diagnosis.model';

@Injectable({ providedIn: 'root' })
export class DiagnosisService {
  analyzeCrop(payload: DiagnosisRequest): Observable<DiagnosisResult> {
    return of({
      diseaseName: 'Leaf Blight',
      confidence: 0.94,
      symptoms: ['Yellowing of leaves', 'Brown lesions', 'Uneven crop growth'],
      recommendations: [
        'Inspect the field for early symptoms and isolate affected plants',
        'Apply recommended fungicide based on the crop and infection stage',
        'Improve irrigation and drainage to limit disease spread'
      ],
      source: 'AI diagnosis mock response'
    });
  }
}
