import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { DiagnosisService } from '../../services/diagnosis.service';
import { DiagnosisHistoryItem, UserProfile } from '../../models/diagnosis.model';
import { BottomNavComponent } from '../../shared/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, BottomNavComponent],
  template: `
    <div class="screen">
      <!-- Header -->
      <header class="header">
        <div class="header-brand">
          <span class="brand-icon">🌿</span>
          <span class="brand-text">AgroConnect</span>
        </div>
        <div class="header-right">
          <div class="avatar" *ngIf="profile">{{ getInitial(profile.displayName) }}</div>
          <button class="sign-out-btn" (click)="signOut()">Sign out</button>
        </div>
      </header>

      <div class="content">
        <!-- Welcome -->
        <div class="welcome-card">
          <p class="welcome-label">Welcome back 👋</p>
          <h2 class="welcome-name">{{ profile?.displayName || 'Farmer' }}</h2>
          <p class="welcome-sub">Ready to protect your crops?</p>
        </div>

        <!-- CTA -->
        <button class="cta-card" routerLink="/scan">
          <div class="cta-icon">📷</div>
          <div class="cta-content">
            <h3 class="cta-title">Identify Crop Disease</h3>
            <p class="cta-desc">Scan a crop image for instant AI diagnosis</p>
          </div>
          <span class="cta-arrow">→</span>
        </button>

        <!-- Stats row -->
        <div class="stats-row">
          <div class="stat-item">
            <span class="stat-num">450+</span>
            <span class="stat-label">Diseases</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num">AI</span>
            <span class="stat-label">Powered</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num">⚡</span>
            <span class="stat-label">Instant</span>
          </div>
        </div>

        <!-- Recent Diagnoses -->
        <div class="section">
          <div class="section-header">
            <h3 class="section-title">Recent Diagnoses</h3>
            <a routerLink="/history" class="view-all-link">View All →</a>
          </div>

          <div class="loading-state" *ngIf="historyLoading">
            <div class="spinner"></div>
          </div>

          <div class="empty-state" *ngIf="!historyLoading && recentHistory.length === 0">
            <span class="empty-icon">🌱</span>
            <p>No diagnoses yet. Scan a crop to get started!</p>
          </div>

          <div class="history-list" *ngIf="!historyLoading && recentHistory.length > 0">
            <div
              class="history-card"
              *ngFor="let item of recentHistory"
              (click)="goToResult(item.id)"
            >
              <div class="history-info">
                <span class="disease-name">{{ item.diseaseName }}</span>
                <span class="crop-name">🌾 {{ item.cropDetected }}</span>
              </div>
              <div class="history-meta">
                <span class="severity-badge" [class]="'severity-' + item.severity.toLowerCase()">{{ item.severity }}</span>
                <span class="time-ago">{{ getRelativeTime(item.timestamp) }}</span>
              </div>
            </div>
          </div>
        </div>

        <p class="powered-by">Powered by Gemini AI ✨</p>
      </div>

      <app-bottom-nav></app-bottom-nav>
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

    .header-brand { display: flex; align-items: center; gap: 8px; }
    .brand-icon { font-size: 22px; }
    .brand-text { font-size: 18px; font-weight: 800; color: #1f7a45; }

    .header-right { display: flex; align-items: center; gap: 10px; }

    .avatar {
      width: 34px; height: 34px;
      background: linear-gradient(135deg, #1f7a45, #4eaa69);
      border-radius: 50%;
      color: #fff;
      font-weight: 700;
      font-size: 14px;
      display: grid;
      place-items: center;
    }

    .sign-out-btn {
      font-size: 13px;
      color: #6b7280;
      background: none;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 6px 12px;
      cursor: pointer;
    }

    .content { flex: 1; padding: 20px 16px 100px; display: flex; flex-direction: column; gap: 16px; }

    .welcome-card {
      background: linear-gradient(135deg, #1f7a45, #4eaa69);
      border-radius: 20px;
      padding: 24px;
      color: #fff;
    }

    .welcome-label { font-size: 14px; opacity: 0.85; margin: 0 0 4px; }
    .welcome-name { font-size: 24px; font-weight: 800; margin: 0 0 4px; }
    .welcome-sub { font-size: 14px; opacity: 0.8; margin: 0; }

    .cta-card {
      display: flex;
      align-items: center;
      gap: 16px;
      background: #fff;
      border: 1px solid #e2eed4;
      border-radius: 20px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      cursor: pointer;
      text-align: left;
      width: 100%;
      transition: transform 0.15s, box-shadow 0.15s;
    }

    .cta-card:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(31,122,69,0.12); }

    .cta-icon { font-size: 36px; }

    .cta-content { flex: 1; }

    .cta-title { font-size: 17px; font-weight: 700; color: #111; margin: 0 0 4px; }
    .cta-desc { font-size: 13px; color: #6b7280; margin: 0; }

    .cta-arrow { font-size: 20px; color: #1f7a45; font-weight: 700; }

    .stats-row {
      display: flex;
      background: #fff;
      border: 1px solid #e2eed4;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }

    .stat-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px;
      gap: 4px;
    }

    .stat-num { font-size: 20px; font-weight: 800; color: #1f7a45; }
    .stat-label { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }

    .stat-divider { width: 1px; background: #e2eed4; margin: 12px 0; }

    .section { display: flex; flex-direction: column; gap: 12px; }

    .section-header { display: flex; justify-content: space-between; align-items: center; }
    .section-title { font-size: 17px; font-weight: 700; color: #111; margin: 0; }
    .view-all-link { font-size: 14px; color: #1f7a45; text-decoration: none; font-weight: 600; }

    .loading-state { display: flex; justify-content: center; padding: 24px; }

    .spinner {
      width: 28px; height: 28px;
      border: 3px solid #e2eed4;
      border-top-color: #1f7a45;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .empty-state {
      text-align: center;
      padding: 32px 20px;
      color: #6b7280;
      font-size: 14px;
    }

    .empty-icon { font-size: 32px; display: block; margin-bottom: 8px; }

    .history-list { display: flex; flex-direction: column; gap: 10px; }

    .history-card {
      background: #fff;
      border: 1px solid #e2eed4;
      border-radius: 14px;
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      box-shadow: 0 1px 4px rgba(0,0,0,0.04);
      transition: transform 0.1s;
    }

    .history-card:hover { transform: translateX(2px); }

    .history-info { display: flex; flex-direction: column; gap: 4px; }
    .disease-name { font-size: 15px; font-weight: 600; color: #111; }
    .crop-name { font-size: 13px; color: #6b7280; }

    .history-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }

    .severity-badge {
      font-size: 11px;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 999px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .severity-mild { background: #fef9c3; color: #854d0e; }
    .severity-moderate { background: #ffedd5; color: #9a3412; }
    .severity-severe { background: #fee2e2; color: #991b1b; }
    .severity-healthy { background: #dcfce7; color: #166534; }

    .time-ago { font-size: 12px; color: #9ca3af; }

    .powered-by { text-align: center; font-size: 12px; color: #9ca3af; margin-top: 8px; }
  `]
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private diagnosisService = inject(DiagnosisService);
  private router = inject(Router);

  profile: UserProfile | null = null;
  recentHistory: DiagnosisHistoryItem[] = [];
  historyLoading = true;

  ngOnInit(): void {
    this.loadProfile();
    this.loadHistory();
  }

  private loadProfile(): void {
    this.diagnosisService.getUserProfile().subscribe({
      next: (p) => { this.profile = p; },
      error: () => {
        // Fallback to Firebase user data
        const user = this.authService.currentUser;
        if (user) {
          this.profile = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || 'Farmer',
            photoUrl: user.photoURL || undefined,
            createdAt: new Date().toISOString()
          };
        }
      }
    });
  }

  private loadHistory(): void {
    this.diagnosisService.getHistory().subscribe({
      next: (items) => {
        this.recentHistory = items.slice(0, 3);
        this.historyLoading = false;
      },
      error: () => { this.historyLoading = false; }
    });
  }

  getInitial(name: string): string {
    return name ? name[0].toUpperCase() : 'F';
  }

  getRelativeTime(timestamp: string): string {
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  }

  goToResult(id: string): void {
    this.router.navigate(['/result', id]);
  }

  async signOut(): Promise<void> {
    await this.authService.signOut();
    this.router.navigate(['/login']);
  }
}
