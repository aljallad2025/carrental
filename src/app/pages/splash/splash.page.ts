import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { addIcons } from 'ionicons';
import { flash } from 'ionicons/icons';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon],
})
export class SplashPage implements OnInit {
  constructor(private router: Router, private auth: AuthService) {
    addIcons({ flash });
  }

  async ngOnInit() {
    // Give the splash animation a moment to play, then route based on session state.
    await this.auth.initialize();
    setTimeout(() => {
      const seenOnboarding = localStorage.getItem('onboarding_done') === 'true';
      if (this.auth.isLoggedIn() || this.auth.isGuest()) {
        this.router.navigate(['/tabs/home']);
      } else if (seenOnboarding) {
        this.router.navigate(['/auth/login']);
      } else {
        this.router.navigate(['/onboarding']);
      }
    }, 1600);
  }
}
