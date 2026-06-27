import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { addIcons } from 'ionicons';
import { cardOutline, walletOutline } from 'ionicons/icons';

@Component({
  selector: 'app-payments',
  template: `
<ion-header class="ion-no-border"><ion-toolbar class="speed-toolbar"><ion-buttons slot="start"><ion-back-button text="" defaultHref="/tabs/profile"></ion-back-button></ion-buttons><ion-title>My Payments</ion-title></ion-toolbar></ion-header>
<ion-content [fullscreen]="true" class="pay-content">
  <div class="payments-list" *ngIf="payments.length">
    <div class="pay-item" *ngFor="let p of payments">
      <div class="pay-icon"><ion-icon name="card-outline"></ion-icon></div>
      <div class="pay-info">
        <h4>Payment</h4>
        <p>{{ p.created_at | date:'dd/MM/yyyy' }}</p>
      </div>
      <div class="pay-amount" [class.paid]="p.status==='paid'">{{ p.amount | number }} SAR</div>
    </div>
  </div>
  <div *ngIf="payments.length === 0" class="empty-state">
    <ion-icon name="wallet-outline"></ion-icon>
    <h3>No payments found</h3>
  </div>
  <div style="height:100px;"></div>
</ion-content>`,
  styles: [`
.pay-content { --background: #0a0a0a; }
.speed-toolbar { --background: #0a0a0a; --color: #fff; --border-color: rgba(255,255,255,0.06); }
.payments-list { padding: 16px 20px; display: flex; flex-direction: column; gap: 10px; }
.pay-item { background: #141414; border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 14px; display: flex; align-items: center; gap: 12px;
  .pay-icon { width: 42px; height: 42px; border-radius: 12px; background: rgba(220,38,38,0.12); display: flex; align-items: center; justify-content: center; ion-icon { font-size: 19px; color: #ef4444; } }
  .pay-info { flex: 1; h4 { color: #fff; font-size: 14.5px; font-weight: 800; margin: 0 0 3px; } p { color: #71717a; font-size: 12px; margin: 0; } }
  .pay-amount { color: #ef4444; font-size: 15px; font-weight: 800; &.paid { color: #22c55e; } }
}
.empty-state { text-align: center; padding: 70px 20px; color: #52525b; ion-icon { font-size: 50px; margin-bottom: 12px; color: #27272a; } h3 { color: #71717a; font-size: 15px; font-weight: 600; } }
  `],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons, IonIcon, CommonModule],
})
export class PaymentsPage implements OnInit {
  payments: any[] = [];

  constructor(private bookingService: BookingService, private auth: AuthService) {
    addIcons({ cardOutline, walletOutline });
  }

  async ngOnInit() {
    const user = this.auth.currentUser();
    if (user) this.payments = await this.bookingService.getPayments(user.id);
  }
}
