import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  template: `<ion-app><ion-router-outlet></ion-router-outlet></ion-app>`,
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  // Routes where the hardware back button should exit the app instead of
  // navigating further back (there's nowhere meaningful left to go).
  private readonly exitRoutes = ['/splash', '/onboarding', '/auth/login', '/tabs/home'];

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.auth.initialize();

    // Capacitor's hardwareBackButton event fires on every Android back-press.
    // Without this listener, Ionic falls through to Capacitor's default
    // behaviour, which exits the app from almost any screen.
    App.addListener('backButton', ({ canGoBack }) => {
      const url = this.router.url;

      if (this.exitRoutes.includes(url)) {
        // At a root-level screen: confirm exit instead of leaving silently.
        if (url === '/tabs/home') {
          App.exitApp();
        } else if (url === '/auth/login') {
          App.exitApp();
        } else {
          App.exitApp();
        }
        return;
      }

      if (canGoBack) {
        window.history.back();
      } else {
        // No browser history left but we're not on an exit route (e.g. deep
        // link landed mid-stack) — send the user somewhere safe instead of
        // closing the app.
        this.router.navigateByUrl('/tabs/home');
      }
    });
  }
}
