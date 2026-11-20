import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isAuthenticated = await firstValueFrom(authService.isAuthenticated$);
  if (isAuthenticated) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};
