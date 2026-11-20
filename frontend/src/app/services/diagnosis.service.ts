import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DiagnosisResponse, DiagnosisHistoryItem, UserProfile } from '../models/diagnosis.model';

@Injectable({ providedIn: 'root' })
export class DiagnosisService {
  private http = inject(HttpClient);
  private apiBaseUrl = environment.apiBaseUrl;

  diagnose(image: File, cropType?: string, location?: string): Observable<DiagnosisResponse> {
    const formData = new FormData();
    formData.append('image', image);
    if (cropType) formData.append('cropType', cropType);
    if (location) formData.append('location', location);
    return this.http.post<DiagnosisResponse>(`${this.apiBaseUrl}/api/diagnose`, formData);
  }

  getHistory(): Observable<DiagnosisHistoryItem[]> {
    return this.http.get<DiagnosisHistoryItem[]>(`${this.apiBaseUrl}/api/history`);
  }

  getHistoryById(id: string): Observable<DiagnosisHistoryItem> {
    return this.http.get<DiagnosisHistoryItem>(`${this.apiBaseUrl}/api/history/${id}`);
  }

  deleteHistory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/api/history/${id}`);
  }

  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiBaseUrl}/api/user/profile`);
  }
}
