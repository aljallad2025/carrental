import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent, IonInput, IonButton, IonIcon, IonSegment, IonSegmentButton, IonLabel, IonSpinner, ToastController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, phonePortraitOutline, eyeOutline, eyeOffOutline, carSport, personOutline, arrowForwardOutline, flash } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonInput, IonButton, IonIcon, IonSegment, IonSegmentButton, IonLabel, IonSpinner, FormsModule, CommonModule],
})
export class LoginPage {
  loginType: 'email' | 'phone' = 'email';
  email = '';
  phone = '';
  password = '';
  showPassword = false;
  loading = false;
  // Fixed, original illustration — not pulled from the live fleet, so the
  // login screen always looks the same regardless of what's in the cars table.
  heroCarImage = 'assets/images/hero-car.svg';

  constructor(private auth: AuthService, private router: Router, private toast: ToastController) {
    addIcons({ mailOutline, lockClosedOutline, phonePortraitOutline, eyeOutline, eyeOffOutline, carSport, personOutline, arrowForwardOutline, flash });
  }

  async login() {
    this.loading = true;
    try {
      if (this.loginType === 'email') {
        await this.auth.loginWithEmail(this.email, this.password);
      } else {
        await this.auth.loginWithPhone(this.phone, this.password);
      }
      this.router.navigate(['/tabs/home']);
    } catch (err: any) {
      const t = await this.toast.create({ message: err.message || 'Login failed', duration: 3000, color: 'danger', position: 'top' });
      await t.present();
    } finally {
      this.loading = false;
    }
  }

  goToRegister() { this.router.navigate(['/auth/register']); }
  goToForgot() { this.router.navigate(['/auth/forgot-password']); }
  continueAsGuest() { this.auth.continueAsGuest(); }
}
