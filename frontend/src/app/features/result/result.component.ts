import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DiagnosisService } from '../../services/diagnosis.service';
import { DiagnosisResponse } from '../../models/diagnosis.model';

type TabKey = 'symptoms' | 'cultural' | 'chemical' | 'biological';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="screen">
      <!-- Header -->
      <header class="header">
        <button class="back-btn" routerLink="/scan">← Scan</button>
        <h1 class="header-title">Result</h1>
        <button class="share-btn" (click)="share()" *ngIf="result">Share</button>
      </header>

      <!-- Loading -->
      <div class="loading-state" *ngIf="loading">
        <div class="spinner"></div>
        <p>Loading result...</p>
      </div>

      <!-- Error -->
      <div class="error-state" *ngIf="!loading && !result">
        <span class="error-icon">⚠️</span>
        <p>Could not load diagnosis result.</p>
        <button class="retry-btn" routerLink="/scan">Go back to Scan</button>
      </div>

      <!-- Result content -->
      <div class="content" *ngIf="!loading && result">
        <!-- Healthy special message -->
        <div class="healthy-card" *ngIf="result.isHealthy">
          <span class="healthy-icon">🌱</span>
          <h2 class="healthy-title">Your crop looks healthy!</h2>
          <p class="healthy-sub">No disease detected. Keep up the good farming practices.</p>
        </div>

        <!-- Disease Info Card -->
        <div class="disease-card">
          <h2 class="disease-name">{{ result.diseaseName }}</h2>
          <div class="badges-row">
            <span class="confidence-badge" [class]="confidenceClass">
              {{ (result.confidence * 100).toFixed(0) }}% confidence
            </span>
            <span class="severity-badge" [class]="'severity-' + result.severity.toLowerCase()">
              {{ result.severity }}
            </span>
            <span class="crop-badge">🌾 {{ result.cropDetected }}</span>
          </div>
          <p class="model-used">Analyzed by {{ result.modelUsed }}</p>
        </div>

        <!-- Tabs -->
        <div class="tabs-container">
          <div class="tabs-header">
            <button
              *ngFor="let tab of tabs"
              class="tab-btn"
              [class.active]="activeTab === tab.key"
              (click)="activeTab = tab.key"
            >{{ tab.label }}</button>
          </div>

          <div class="tab-content">
            <ul class="item-list">
              <li *ngFor="let item of getTabItems()" class="item-li">{{ item }}</li>
              <li class="empty-li" *ngIf="getTabItems().length === 0">No data available</li>
            </ul>
          </div>
        </div>

        <!-- Prevention (always visible) -->
        <div class="prevention-section" *ngIf="result.prevention?.length">
          <h3 class="prevention-title">🛡️ Prevention</h3>
          <ul class="item-list">
            <li *ngFor="let item of result.prevention" class="item-li">{{ item }}</li>
          </ul>
        </div>

        <!-- Timestamp -->
        <p class="timestamp">Diagnosed on {{ formatDate(result.timestamp) }}</p>
      </div>
    </div>
  `,
  styles: [`
    .screen {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      max-width: 480px;
      margin: 0 auto;
      background: #f4faf5;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background: #fff;
      border-bottom: 1px solid #e2eed4;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .back-btn {
      background: none; border: none;
      font-size: 14px; color: #1f7a45;
      font-weight: 600; cursor: pointer; padding: 0;
    }

    .header-title { font-size: 18px; font-weight: 700; color: #111; margin: 0; }

    .share-btn {
      background: none; border: none;
      font-size: 14px; color: #1f7a45;
      font-weight: 600; cursor: pointer;
    }

    .loading-state {
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      gap: 16px; flex: 1; padding: 60px 20px;
      color: #6b7280;
    }

    .spinner {
      width: 36px; height: 36px;
      border: 4px solid #e2eed4;
      border-top-color: #1f7a45;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .error-state {
      display: flex; flex-direction: column;
      align-items: center; gap: 12px;
      padding: 60px 20px; color: #6b7280;
      text-align: center;
    }

    .error-icon { font-size: 40px; }

    .retry-btn {
      padding: 11px 24px;
      background: #1f7a45; color: #fff;
      border: none; border-radius: 10px;
      font-size: 14px; font-weight: 600;
      cursor: pointer; margin-top: 8px;
    }

    .content { flex: 1; padding: 20px 16px 40px; display: flex; flex-direction: column; gap: 16px; }

    .healthy-card {
      background: linear-gradient(135deg, #dcfce7, #bbf7d0);
      border: 1px solid #86efac;
      border-radius: 20px;
      padding: 24px;
      text-align: center;
    }

    .healthy-icon { font-size: 40px; display: block; margin-bottom: 8px; }
    .healthy-title { font-size: 20px; font-weight: 700; color: #15803d; margin: 0 0 6px; }
    .healthy-sub { font-size: 14px; color: #166534; margin: 0; }

    .disease-card {
      background: #fff;
      border: 1px solid #e2eed4;
      border-radius: 20px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }

    .disease-name { font-size: 22px; font-weight: 800; color: #111; margin: 0 0 12px; }

    .badges-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }

    .confidence-badge {
      font-size: 13px; font-weight: 700;
      padding: 4px 12px; border-radius: 999px;
    }

    .confidence-high { background: #dcfce7; color: #15803d; }
    .confidence-medium { background: #fef9c3; color: #854d0e; }
    .confidence-low { background: #fee2e2; color: #991b1b; }

    .severity-badge {
      font-size: 12px; font-weight: 700;
      padding: 4px 12px; border-radius: 999px;
      text-transform: uppercase; letter-spacing: 0.04em;
    }

    .severity-mild { background: #fef9c3; color: #854d0e; }
    .severity-moderate { background: #ffedd5; color: #9a3412; }
    .severity-severe { background: #fee2e2; color: #991b1b; }
    .severity-healthy { background: #dcfce7; color: #166534; }

    .crop-badge {
      font-size: 13px; font-weight: 600;
      background: #f0fdf4; color: #15803d;
      padding: 4px 12px; border-radius: 999px;
      border: 1px solid #bbf7d0;
    }

    .model-used { font-size: 12px; color: #9ca3af; margin: 0; }

    .tabs-container {
      background: #fff;
      border: 1px solid #e2eed4;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }

    .tabs-header {
      display: flex;
      border-bottom: 1px solid #e2eed4;
      background: #f9fafb;
    }

    .tab-btn {
      flex: 1; padding: 13px 4px;
      background: none; border: none;
      font-size: 12px; font-weight: 600;
      color: #6b7280; cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: color 0.15s, border-color 0.15s;
    }

    .tab-btn.active { color: #1f7a45; border-bottom-color: #1f7a45; }

    .tab-content { padding: 16px; min-height: 100px; }

    .item-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }

    .item-li {
      font-size: 14px; color: #374151; line-height: 1.6;
      padding-left: 20px; position: relative;
    }

    .item-li::before {
      content: '•'; position: absolute; left: 6px; color: #1f7a45; font-weight: 700;
    }

    .empty-li { color: #9ca3af; font-size: 14px; }

    .prevention-section {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 16px;
      padding: 16px;
    }

    .prevention-title { font-size: 15px; font-weight: 700; color: #15803d; margin: 0 0 12px; }

    .timestamp { font-size: 12px; color: #9ca3af; text-align: center; }
  `]
})
export class ResultComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private diagnosisService = inject(DiagnosisService);

  result: DiagnosisResponse | null = null;
  loading = true;
  activeTab: TabKey = 'symptoms';

  tabs: { key: TabKey; label: string }[] = [
    { key: 'symptoms', label: 'Symptoms' },
    { key: 'cultural', label: 'Cultural' },
    { key: 'chemical', label: 'Chemical' },
    { key: 'biological', label: 'Biological' }
  ];

  get confidenceClass(): string {
    if (!this.result) return '';
    const c = this.result.confidence;
    if (c >= 0.8) return 'confidence-badge confidence-high';
    if (c >= 0.6) return 'confidence-badge confidence-medium';
    return 'confidence-badge confidence-low';
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.loading = false; return; }

    // Try localStorage first (fastest / offline)
    const cached = localStorage.getItem('last_diagnosis');
    if (cached) {
      try {
        const parsed: DiagnosisResponse = JSON.parse(cached);
        if (parsed.id === id) {
          this.result = parsed;
          this.loading = false;
          return;
        }
      } catch {}
    }

    // Fallback: fetch from API (returns DiagnosisHistoryItem — cast to response)
    this.diagnosisService.getHistoryById(id).subscribe({
      next: (item) => {
        // Map history item to full response shape (backend returns full data for single item)
        this.result = item as unknown as DiagnosisResponse;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  getTabItems(): string[] {
    if (!this.result) return [];
    switch (this.activeTab) {
      case 'symptoms': return this.result.symptoms || [];
      case 'cultural': return this.result.culturalControl || [];
      case 'chemical': return this.result.chemicalControl || [];
      case 'biological': return this.result.biologicalControl || [];
    }
  }

  formatDate(timestamp: string): string {
    return new Date(timestamp).toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  async share(): Promise<void> {
    const text = `AgroConnect Diagnosis: ${this.result?.diseaseName} (${this.result?.cropDetected}) — ${(this.result!.confidence * 100).toFixed(0)}% confidence`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'AgroConnect Diagnosis', text });
      } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      alert('Result copied to clipboard!');
    }
  }
}
