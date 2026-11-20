import { Injectable, inject } from '@angular/core';
import {
  Auth,
  authState,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signOut,
  User,
  ConfirmationResult
} from '@angular/fire/auth';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);

  currentUser$: Observable<User | null> = authState(this.auth);
  isAuthenticated$: Observable<boolean> = this.currentUser$.pipe(map(u => !!u));

  recaptchaVerifier: RecaptchaVerifier | null = null;

  get currentUser(): User | null {
    return this.auth.currentUser;
  }

  async signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(this.auth, provider);
  }

  async signInWithPhone(phoneNumber: string): Promise<ConfirmationResult> {
    if (!this.recaptchaVerifier) {
      this.recaptchaVerifier = new RecaptchaVerifier(this.auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {}
      });
    }
    return await signInWithPhoneNumber(this.auth, phoneNumber, this.recaptchaVerifier);
  }

  async confirmOtp(result: ConfirmationResult, otp: string): Promise<void> {
    await result.confirm(otp);
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);
  }

  async getIdToken(): Promise<string> {
    const user = this.auth.currentUser;
    if (!user) return '';
    return await user.getIdToken();
  }
}
