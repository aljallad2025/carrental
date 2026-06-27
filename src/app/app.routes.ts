import { Routes } from '@angular/router';
import { authGuard, authActionGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'splash', pathMatch: 'full' },
  {
    path: 'splash',
    loadComponent: () => import('./pages/splash/splash.page').then(m => m.SplashPage)
  },
  {
    path: 'onboarding',
    loadComponent: () => import('./pages/onboarding/onboarding.page').then(m => m.OnboardingPage)
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./pages/auth/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./pages/auth/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'auth/forgot-password',
    loadComponent: () => import('./pages/auth/forgot-password/forgot-password.page').then(m => m.ForgotPasswordPage)
  },
  {
    path: 'tabs',
    loadComponent: () => import('./pages/tabs/tabs.page').then(m => m.TabsPage),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage) },
      { path: 'cars/rental', loadComponent: () => import('./pages/cars/rental-list/rental-list.page').then(m => m.RentalListPage) },
      { path: 'cars/sale', loadComponent: () => import('./pages/cars/sale-list/sale-list.page').then(m => m.SaleListPage) },
      { path: 'my-bookings', loadComponent: () => import('./pages/my-bookings/my-bookings.page').then(m => m.MyBookingsPage), canActivate: [authActionGuard] },
      { path: 'profile', loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage), canActivate: [authActionGuard] },
    ]
  },
  { path: 'cars/:id', loadComponent: () => import('./pages/cars/car-detail/car-detail.page').then(m => m.CarDetailPage), canActivate: [authGuard] },
  { path: 'booking/rental/:id', loadComponent: () => import('./pages/booking/rental-booking/rental-booking.page').then(m => m.RentalBookingPage), canActivate: [authActionGuard] },
  { path: 'booking/purchase/:id', loadComponent: () => import('./pages/booking/car-purchase/car-purchase.page').then(m => m.CarPurchasePage), canActivate: [authActionGuard] },
  { path: 'payments', loadComponent: () => import('./pages/payments/payments.page').then(m => m.PaymentsPage), canActivate: [authActionGuard] },
  { path: 'chat', loadComponent: () => import('./pages/chat/chat.page').then(m => m.ChatPage), canActivate: [authActionGuard] },
  { path: 'favorites', loadComponent: () => import('./pages/favorites/favorites.page').then(m => m.FavoritesPage), canActivate: [authActionGuard] },
];
