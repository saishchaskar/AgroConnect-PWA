import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="bottom-nav">
      <a routerLink="/home" routerLinkActive="active" class="nav-item">
        <span class="icon">🏠</span>
        <span>Home</span>
      </a>
      <a routerLink="/scan" routerLinkActive="active" class="nav-item scan-item">
        <span class="icon">📷</span>
        <span>Scan</span>
      </a>
      <a routerLink="/history" routerLinkActive="active" class="nav-item">
        <span class="icon">📋</span>
        <span>History</span>
      </a>
      <button type="button" class="nav-item logout-item" (click)="logout()">
        <span class="icon">🚪</span>
        <span>Logout</span>
      </button>
    </nav>
  `,
  styles: [`
    .bottom-nav {
      position: fixed; bottom: 0; left: 0; right: 0; height: 64px;
      background: #ffffff; border-top: 1px solid #e2e8f0;
      display: flex; justify-content: space-around; align-items: center;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05); z-index: 100;
    }
    .nav-item {
      display: flex; flex-direction: column; align-items: center; gap: 2px;
      text-decoration: none; color: #64748b; font-size: 0.75rem; font-weight: 500;
      background: none; border: none; cursor: pointer; padding: 6px 12px;
    }
    .nav-item .icon { font-size: 1.2rem; }
    .nav-item.active { color: #1b4332; font-weight: 700; }
    .scan-item.active { color: #2d6a4f; }
  `]
})
export class BottomNavComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  async logout(): Promise<void> {
    await this.authService.signOut();
    await this.router.navigate(['/login']);
  }
}
