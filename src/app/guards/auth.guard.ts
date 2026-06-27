import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Lets guests browse (tabs/home, car details, etc). Only blocks visitors
// with no session and no guest mode (shouldn't normally happen, but covers
// deep links opened before onboarding/login).
export const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn() || auth.isGuest()) return true;
  return router.createUrlTree(['/auth/login']);
};

// Use on routes that require a real account: booking, payments, chat,
// favorites, profile. Guests get redirected to login to create an account.
export const authActionGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn()) return true;
  return router.createUrlTree(['/auth/login']);
};
