import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent, IonInput, IonButton, IonIcon, IonSpinner, ToastController, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { addIcons } from 'ionicons';
import { personAddOutline, personOutline, mailOutline, phonePortraitOutline, lockClosedOutline, eyeOutline, eyeOffOutline, cardOutline, documentTextOutline, arrowForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonContent, IonInput, IonButton, IonIcon, IonSpinner, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons, FormsModule, CommonModule],
})
export class RegisterPage {
  fullName = '';
  email = '';
  phone = '';
  password = '';
  confirmPassword = '';
  showPassword = false;
  showConfirmPassword = false;
  idCardFile: File | null = null;
  licenseFile: File | null = null;
  loading = false;

  constructor(private auth: AuthService, private router: Router, private toast: ToastController) {
    addIcons({ personAddOutline, personOutline, mailOutline, phonePortraitOutline, lockClosedOutline, eyeOutline, eyeOffOutline, cardOutline, documentTextOutline, arrowForwardOutline });
  }

  onFileChange(event: any, type: 'id' | 'license') {
    const file = event.target.files[0];
    if (type === 'id') this.idCardFile = file;
    else this.licenseFile = file;
  }

  async register() {
    if (this.password !== this.confirmPassword) {
      const t = await this.toast.create({ message: 'Passwords do not match', duration: 2000, color: 'danger', position: 'top' });
      await t.present(); return;
    }
    this.loading = true;
    try {
      const data = await this.auth.register(this.email, this.password, this.fullName, this.phone);
      if (data.user && this.idCardFile) {
        const url = await this.auth.uploadFile('documents', `${data.user.id}/id_card`, this.idCardFile);
        await this.auth.updateProfile({ cpr_image_url: url });
      }
      if (data.user && this.licenseFile) {
        const url = await this.auth.uploadFile('documents', `${data.user.id}/license`, this.licenseFile);
        await this.auth.updateProfile({ license_image_url: url });
      }
      this.router.navigate(['/tabs/home']);
    } catch (err: any) {
      const t = await this.toast.create({ message: err.message, duration: 3000, color: 'danger', position: 'top' });
      await t.present();
    } finally { this.loading = false; }
  }

  goToLogin() { this.router.navigate(['/auth/login']); }
  continueAsGuest() { this.auth.continueAsGuest(); }
}
