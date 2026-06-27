import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonInput, IonButton, IonIcon, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons, IonSpinner, ToastController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { addIcons } from 'ionicons';
import { lockOpenOutline, mailOutline } from 'ionicons/icons';

@Component({
  selector: 'app-forgot-password',
  template: `
<ion-header class="ion-no-border"><ion-toolbar class="speed-toolbar"><ion-buttons slot="start"><ion-back-button text="" defaultHref="/auth/login"></ion-back-button></ion-buttons><ion-title>Forgot Password</ion-title></ion-toolbar></ion-header>
<ion-content [fullscreen]="true" class="forgot-content">
  <div class="forgot-wrapper">
    <div class="icon-badge"><ion-icon name="lock-open-outline"></ion-icon></div>
    <h2>Reset Password</h2>
    <p>Enter your email and we'll send you a reset link</p>
    <div class="input-group">
      <ion-icon name="mail-outline"></ion-icon>
      <ion-input [(ngModel)]="email" type="email" placeholder="Email Address" dir="ltr"></ion-input>
    </div>
    <ion-button expand="block" (click)="reset()" [disabled]="loading" class="reset-btn">
      <ion-spinner *ngIf="loading" name="crescent"></ion-spinner>
      <span *ngIf="!loading">Send Reset Link</span>
    </ion-button>
  </div>
</ion-content>`,
  styles: [`
.speed-toolbar { --background: #0a0a0a; --color: #fff; --border-color: rgba(255,255,255,0.06); }
.forgot-content { --background: #0a0a0a; }
.forgot-wrapper { padding: 40px 24px; text-align: center; }
.icon-badge {
  width: 76px; height: 76px; margin: 0 auto 24px; border-radius: 22px;
  background: linear-gradient(145deg, #dc2626 0%, #991b1b 100%);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 14px 32px rgba(220, 38, 38, 0.4);
  ion-icon { font-size: 36px; color: #fff; }
}
h2 { color: #fff; font-size: 21px; font-weight: 800; margin-bottom: 10px; }
p { color: #71717a; font-size: 13.5px; margin-bottom: 30px; line-height: 1.7; }
.input-group {
  display: flex; align-items: center; gap: 10px;
  background: #1c1c1c; border: 1px solid rgba(255,255,255,0.06);
  border-radius: 14px; padding: 13px 16px; margin-bottom: 22px; text-align: right;
  ion-icon { font-size: 18px; color: #71717a; }
  ion-input { --color: #f4f4f5; --placeholder-color: #52525b; font-size: 14px; }
}
.reset-btn {
  height: 54px; font-size: 15.5px; font-weight: 800;
  --background: linear-gradient(135deg, #dc2626, #991b1b);
  --background-activated: #7f1d1d; --border-radius: 14px;
  --box-shadow: 0 10px 26px rgba(220,38,38,0.4);
}
  `],
  standalone: true,
  imports: [IonContent, IonInput, IonButton, IonIcon, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons, IonSpinner, FormsModule, CommonModule],
})
export class ForgotPasswordPage {
  email = '';
  loading = false;

  constructor(private auth: AuthService, private toast: ToastController) {
    addIcons({ lockOpenOutline, mailOutline });
  }

  async reset() {
    this.loading = true;
    try {
      await this.auth.resetPassword(this.email);
      const t = await this.toast.create({ message: 'Reset link sent successfully', duration: 3000, color: 'success', position: 'top' });
      await t.present();
    } catch (err: any) {
      const t = await this.toast.create({ message: err.message, duration: 3000, color: 'danger', position: 'top' });
      await t.present();
    } finally { this.loading = false; }
  }
}
