import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonIcon, IonToggle, ToastController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { addIcons } from 'ionicons';
import { personCircleOutline, createOutline, documentTextOutline, locationOutline, cardOutline, chatbubbleEllipsesOutline, heartOutline, moonOutline, الإشعاراتOutline, chevronForwardOutline, logOutOutline } from 'ionicons/icons';

@Component({
  selector: 'app-profile',
  template: `
<ion-content [fullscreen]="true" class="profile-content">
  <div class="page-header"><h1>Ø­Ø³Ø§Ø¨ÙŠ</h1></div>

  <div class="profile-card">
    <div class="avatar"><ion-icon name="person-circle-outline"></ion-icon></div>
    <h2>{{ user?.full_name || 'User' }}</h2>
    <p>{{ user?.email }}</p>
    <p class="phone" *ngIf="user?.phone">{{ user?.phone }}</p>
  </div>

  <div class="menu-section">
    <button class="menu-item" *ngFor="let item of menuItems" (click)="item.action()">
      <div class="menu-icon"><ion-icon [name]="item.icon"></ion-icon></div>
      <span class="menu-label">{{ item.label }}</span>
      <ion-icon name="chevron-forward-outline" class="menu-arrow"></ion-icon>
    </button>
  </div>

  <div class="toggle-section">
    <div class="toggle-item">
      <span><ion-icon name="moon-outline"></ion-icon>Ø§Ù„ÙˆØ¶Ø¹ Ø§Ù„Ø¯Ø§ÙƒÙ†</span>
      <ion-toggle [(ngModel)]="darkMode" (ionChange)="toggleDarkMode()"></ion-toggle>
    </div>
    <div class="toggle-item">
      <span><ion-icon name="الإشعارات-outline"></ion-iconØ§Ù„Ø¥Ø´Ø¹Ø§Ø±Ø§Øª</span>
      <ion-toggle [(ngModel)]="الإشعارات"></ion-toggle>
    </div>
  </div>

  <div class="logout-section">
    <button class="logout-btn" (click)="logout()">
      <ion-icon name="log-out-outline"></ion-icon>
      ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø®Ø±ÙˆØ¬
    </button>
  </div>

  <div class="version">App version 1.0.0</div>
  <div style="height:100px;"></div>
</ion-content>`,
  styles: [`
.profile-content { --background: #0a0a0a; }
.page-header { padding: 18px 20px 10px; h1 { color: #fff; font-size: 22px; font-weight: 900; margin: 0; } }
.profile-card { text-align: center; padding: 14px 16px 28px;
  .avatar { width: 84px; height: 84px; border-radius: 50%; margin: 0 auto 12px;
    background: linear-gradient(145deg, #1c1c1c, #0a0a0a); border: 2px solid #dc2626;
    display: flex; align-items: center; justify-content: center;
    ion-icon { font-size: 50px; color: #71717a; }
  }
  h2 { color: #fff; font-size: 19px; font-weight: 800; margin: 0 0 4px; }
  p { color: #71717a; font-size: 13.5px; margin: 0; }
  .phone { margin-top: 3px; }
}
.menu-section { padding: 0 20px 16px; display: flex; flex-direction: column; gap: 8px; }
.menu-item {
  width: 100%; background: #141414; border: 1px solid rgba(255,255,255,0.05);
  border-radius: 14px; padding: 13px 15px; display: flex; align-items: center; gap: 12px;
  .menu-icon { width: 38px; height: 38px; border-radius: 11px; background: rgba(220,38,38,0.12);
    display: flex; align-items: center; justify-content: center;
    ion-icon { font-size: 19px; color: #ef4444; }
  }
  .menu-label { flex: 1; color: #f4f4f5; font-size: 14px; text-align: right; }
  .menu-arrow { color: #52525b; font-size: 16px; }
}
.toggle-section { margin: 8px 20px 18px; background: #141414; border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 4px 16px;
  .toggle-item { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.05);
    span { display: flex; align-items: center; gap: 8px; color: #f4f4f5; font-size: 14px; ion-icon { font-size: 18px; color: #71717a; } }
    &:last-child { border: none; }
  }
  ion-toggle { --background-checked: rgba(220,38,38,0.4); --handle-background-checked: #dc2626; }
}
.logout-section { padding: 0 20px 16px; }
.logout-btn {
  width: 100%; height: 50px; border-radius: 14px;
  background: rgba(220,38,38,0.1); border: 1px solid rgba(220,38,38,0.25);
  color: #ef4444; font-size: 14.5px; font-weight: 700;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  ion-icon { font-size: 18px; }
}
.version { text-align: center; color: #3f3f46; font-size: 11.5px; padding-bottom: 16px; }
  `],
  standalone: true,
  imports: [IonContent, IonIcon, IonToggle, CommonModule, FormsModule],
})
export class ProfilePage {
  darkMode = true;
  الإشعارات = true;

  menuItems = [
    { icon: 'create-outline', label: 'ØªØ¹Ø¯ÙŠÙ„ Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª', action: () => {} },
    { icon: 'document-text-outline', label: 'ÙˆØ«Ø§Ø¦Ù‚ÙŠ', action: () => {} },
    { icon: 'location-outline', label: 'Ø¹Ù†Ø§ÙˆÙŠÙ†ÙŠ', action: () => {} },
    { icon: 'card-outline', label: 'Ù…Ø¯ÙÙˆØ¹Ø§ØªÙŠ', action: () => this.router.navigate(['/payments']) },
    { icon: 'chatbubble-ellipses-outline', label: 'Contact Us', action: () => this.router.navigate(['/chat']) },
    { icon: 'heart-outline', label: 'Ø§Ù„Ù…ÙØ¶Ù„Ø©', action: () => this.router.navigate(['/favorites']) },
  ];

  constructor(public auth: AuthService, private router: Router, private toast: ToastController) {
    addIcons({ personCircleOutline, createOutline, documentTextOutline, locationOutline, cardOutline, chatbubbleEllipsesOutline, heartOutline, moonOutline, الإشعاراتOutline, chevronForwardOutline, logOutOutline });
  }

  get user() { return this.auth.currentUser(); }

  toggleDarkMode() { document.body.classList.toggle('light-mode', !this.darkMode); }

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}

