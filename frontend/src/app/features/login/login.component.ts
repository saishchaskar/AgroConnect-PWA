import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ConfirmationResult } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-bg">
      <div class="login-card">
        <!-- Brand -->
        <div class="brand">
          <div class="brand-mark">🌿</div>
          <h1 class="brand-name">AgroConnect</h1>
          <p class="brand-sub">AI-powered crop disease diagnosis</p>
        </div>

        <!-- Google Sign-In -->
        <button class="google-btn" (click)="signInWithGoogle()" [disabled]="loading">
          <svg class="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>{{ loading ? 'Signing in...' : 'Continue with Google' }}</span>
        </button>

        <!-- Divider -->
        <div class="divider">
          <span class="divider-line"></span>
          <span class="divider-text">or</span>
          <span class="divider-line"></span>
        </div>

        <!-- Phone Auth -->
        <div class="phone-section" *ngIf="!otpSent">
          <div class="input-group">
            <input
              type="tel"
              [(ngModel)]="phoneNumber"
              placeholder="+91 9876543210"
              class="text-input"
              [disabled]="loading"
            />
          </div>
          <button class="primary-btn" (click)="sendOtp()" [disabled]="loading || !phoneNumber.trim()">
            {{ loading ? 'Sending...' : 'Send OTP' }}
          </button>
        </div>

        <div class="phone-section" *ngIf="otpSent">
          <p class="otp-hint">OTP sent to {{ phoneNumber }}</p>
          <div class="input-group">
            <input
              type="number"
              [(ngModel)]="otp"
              placeholder="Enter 6-digit OTP"
              class="text-input otp-input"
              maxlength="6"
              [disabled]="loading"
            />
          </div>
          <button class="primary-btn" (click)="verifyOtp()" [disabled]="loading || otp.length < 6">
            {{ loading ? 'Verifying...' : 'Verify OTP' }}
          </button>
          <button class="text-btn" (click)="resetPhoneFlow()">Change number</button>
        </div>

        <!-- Error -->
        <p class="error-text" *ngIf="errorMsg">{{ errorMsg }}</p>
      </div>

      <!-- Invisible recaptcha mount point -->
      <div id="recaptcha-container"></div>
    </div>
  `,
  styles: [`
    .login-bg {
      min-height: 100vh;
      background: linear-gradient(145deg, #e8f5e9 0%, #f4faf5 50%, #e0f2e9 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px 16px;
    }

    .login-card {
      background: #fff;
      border-radius: 24px;
      border: 1px solid #e2eed4;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      padding: 36px 28px;
      width: 100%;
      max-width: 400px;
    }

    .brand {
      text-align: center;
      margin-bottom: 32px;
    }

    .brand-mark {
      font-size: 48px;
      display: block;
      margin-bottom: 8px;
    }

    .brand-name {
      font-size: 28px;
      font-weight: 800;
      color: #1f7a45;
      margin: 0 0 4px;
    }

    .brand-sub {
      font-size: 14px;
      color: #6b7280;
      margin: 0;
    }

    .google-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 13px 20px;
      border: 1.5px solid #d1d5db;
      border-radius: 12px;
      background: #fff;
      font-size: 15px;
      font-weight: 600;
      color: #111827;
      cursor: pointer;
      transition: background 0.2s, box-shadow 0.2s;
    }

    .google-btn:hover:not(:disabled) {
      background: #f9fafb;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .google-btn:disabled { opacity: 0.6; cursor: not-allowed; }

    .google-icon { width: 20px; height: 20px; flex-shrink: 0; }

    .divider {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 24px 0;
    }

    .divider-line {
      flex: 1;
      height: 1px;
      background: #e5e7eb;
    }

    .divider-text {
      font-size: 13px;
      color: #9ca3af;
    }

    .phone-section { display: flex; flex-direction: column; gap: 12px; }

    .input-group { display: flex; flex-direction: column; }

    .text-input {
      width: 100%;
      padding: 13px 16px;
      border: 1.5px solid #d1d5db;
      border-radius: 12px;
      font-size: 15px;
      outline: none;
      transition: border-color 0.2s;
      background: #f9fafb;
    }

    .text-input:focus { border-color: #1f7a45; background: #fff; }
    .text-input:disabled { opacity: 0.6; }

    .otp-input { letter-spacing: 4px; font-size: 20px; text-align: center; }

    .primary-btn {
      width: 100%;
      padding: 13px;
      background: linear-gradient(135deg, #1f7a45, #4eaa69);
      color: #fff;
      border: none;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.1s;
    }

    .primary-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
    .primary-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

    .text-btn {
      background: none;
      border: none;
      color: #1f7a45;
      font-size: 14px;
      cursor: pointer;
      text-align: center;
      text-decoration: underline;
    }

    .otp-hint {
      font-size: 13px;
      color: #6b7280;
      text-align: center;
      margin: 0;
    }

    .error-text {
      color: #dc2626;
      font-size: 13px;
      text-align: center;
      margin-top: 12px;
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  phoneNumber = '';
  otp = '';
  otpSent = false;
  loading = false;
  errorMsg = '';
  private confirmationResult: ConfirmationResult | null = null;

  async signInWithGoogle(): Promise<void> {
    this.loading = true;
    this.errorMsg = '';
    try {
      await this.authService.signInWithGoogle();
      this.router.navigate(['/scan']);
    } catch (err: any) {
      this.errorMsg = err.message || 'Google sign-in failed. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  async sendOtp(): Promise<void> {
    if (!this.phoneNumber.trim()) return;
    this.loading = true;
    this.errorMsg = '';
    try {
      this.confirmationResult = await this.authService.signInWithPhone(this.phoneNumber.trim());
      this.otpSent = true;
    } catch (err: any) {
      this.errorMsg = err.message || 'Failed to send OTP. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  async verifyOtp(): Promise<void> {
    if (!this.confirmationResult || this.otp.length < 6) return;
    this.loading = true;
    this.errorMsg = '';
    try {
      await this.authService.confirmOtp(this.confirmationResult, this.otp);
      this.router.navigate(['/scan']);
    } catch (err: any) {
      this.errorMsg = err.message || 'Invalid OTP. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  resetPhoneFlow(): void {
    this.otpSent = false;
    this.otp = '';
    this.confirmationResult = null;
    this.errorMsg = '';
  }
}
