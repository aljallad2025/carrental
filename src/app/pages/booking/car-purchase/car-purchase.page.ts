import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonInput, IonBackButton, IonButtons, IonSpinner, IonIcon, ToastController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { CarsService } from '../../../services/cars.service';
import { BookingService } from '../../../services/booking.service';
import { AuthService } from '../../../services/auth.service';
import { Car } from '../../../models/car.model';
import { addIcons } from 'ionicons';
import { carSportOutline, cashOutline, calendarOutline, businessOutline } from 'ionicons/icons';

@Component({
  selector: 'app-car-purchase',
  template: `
<ion-header class="ion-no-border"><ion-toolbar class="speed-toolbar"><ion-buttons slot="start"><ion-back-button text="" defaultHref="/tabs/home"></ion-back-button></ion-buttons><ion-title>Purchase Car</ion-title></ion-toolbar></ion-header>
<ion-content [fullscreen]="true" class="purchase-content" *ngIf="car">
  <div class="purchase-wrapper">
    <div class="car-summary">
      <div class="car-thumb">
        <img *ngIf="hasValidImage()" [src]="car.image_url" [alt]="car.make" />
        <div *ngIf="!hasValidImage()" class="car-fallback"><ion-icon name="car-sport-outline"></ion-icon></div>
      </div>
      <div><h3>{{ car.make }} {{ car.model }}</h3><p class="sale-price">{{ car.sale_price | number }} <small>SAR</small></p></div>
    </div>

    <div class="section-card">
      <h4><ion-icon name="cash-outline"></ion-icon>Payment Method</h4>
      <div class="pay-options">
        <div class="pay-opt" [class.active]="payMethod==='cash'" (click)="payMethod='cash'"><ion-icon name="cash-outline"></ion-icon>Cash</div>
        <div class="pay-opt" [class.active]="payMethod==='installment'" (click)="payMethod='installment'"><ion-icon name="calendar-outline"></ion-icon>Installments</div>
        <div class="pay-opt" [class.active]="payMethod==='finance'" (click)="payMethod='finance'"><ion-icon name="business-outline"></ion-icon>Financing</div>
      </div>
    </div>

    <div class="section-card" *ngIf="payMethod==='installment'">
      <h4><ion-icon name="calendar-outline"></ion-icon>Installment Options</h4>
      <div class="input-group"><label>Down Payment (SAR)</label><input type="number" [(ngModel)]="downPayment" /></div>
      <div class="input-group"><label>Number of Monthly Installments</label>
        <select [(ngModel)]="installmentMonths">
          <option value="12">12 months</option><option value="24">24 months</option><option value="36">36 months</option><option value="48">48 months</option>
        </select>
      </div>
      <div class="monthly-amount" *ngIf="monthlyInstallment > 0">Monthly installment: <strong>{{ monthlyInstallment | number }} SAR</strong></div>
    </div>

    <ion-button expand="block" (click)="confirm()" [disabled]="loading" class="confirm-btn">
      <ion-spinner *ngIf="loading" name="crescent"></ion-spinner>
      <span *ngIf="!loading">Confirm Purchase</span>
    </ion-button>
    <div style="height:40px;"></div>
  </div>
</ion-content>`,
  styles: [`
.purchase-content { --background: #0a0a0a; }
.speed-toolbar { --background: #0a0a0a; --color: #fff; --border-color: rgba(255,255,255,0.06); }
.purchase-wrapper { padding: 16px 20px 0; }
.car-summary {
  display: flex; align-items: center; gap: 14px;
  background: #141414; border: 1px solid rgba(255,255,255,0.05); border-radius: 18px; padding: 14px; margin-bottom: 18px;
  .car-thumb { width: 80px; height: 66px; border-radius: 14px; overflow: hidden; flex-shrink: 0; background: #1c1c1c; }
  .car-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .car-fallback { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; ion-icon { font-size: 28px; color: #3f3f46; } }
  h3 { color: #fff; font-size: 16px; font-weight: 800; margin: 0 0 4px; }
  .sale-price { color: #ef4444; font-size: 20px; font-weight: 900; margin: 0; small { font-size: 12px; color: #71717a; font-weight: 600; } }
}
.section-card {
  background: #141414; border: 1px solid rgba(255,255,255,0.05); border-radius: 18px; padding: 16px; margin-bottom: 14px;
  h4 { display: flex; align-items: center; gap: 8px; color: #fff; font-size: 14.5px; font-weight: 800; margin: 0 0 14px; ion-icon { font-size: 17px; color: #ef4444; } }
}
.pay-options { display: flex; gap: 8px;
  .pay-opt { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center; padding: 12px 6px;
    background: #1c1c1c; border-radius: 12px; border: 1px solid rgba(255,255,255,0.06); color: #a1a1aa; font-size: 12px; font-weight: 600; cursor: pointer;
    ion-icon { font-size: 19px; color: #71717a; }
    &.active { border-color: #dc2626; background: rgba(220,38,38,0.1); color: #fff; ion-icon { color: #ef4444; } }
  }
}
.input-group { margin-bottom: 12px;
  label { color: #71717a; font-size: 12px; display: block; margin-bottom: 6px; }
  input, select { background: #1c1c1c; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 11px 12px; color: #f4f4f5; width: 100%; font-size: 14px; }
}
.monthly-amount { color: #22c55e; font-size: 13.5px; margin-top: 8px; strong { font-size: 17px; } }
.confirm-btn { height: 54px; font-size: 15px; font-weight: 800;
  --background: linear-gradient(135deg, #dc2626, #991b1b); --background-activated: #7f1d1d;
  --border-radius: 14px; --box-shadow: 0 10px 26px rgba(220,38,38,0.4);
}
  `],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonInput, IonBackButton, IonButtons, IonSpinner, IonIcon, FormsModule, CommonModule],
})
export class CarPurchasePage implements OnInit {
  car: Car | null = null;
  payMethod: 'cash' | 'installment' | 'finance' = 'cash';
  downPayment = 0;
  installmentMonths = 12;
  loading = false;

  constructor(private route: ActivatedRoute, private router: Router, private carsService: CarsService, private bookingService: BookingService, private auth: AuthService, private toast: ToastController) {
    addIcons({ carSportOutline, cashOutline, calendarOutline, businessOutline });
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.car = await this.carsService.getCarById(id);
  }

  hasValidImage(): boolean {
    return !!this.car?.image_url && /\.(jpe?g|png|webp|avif)$/i.test(this.car.image_url);
  }

  get monthlyInstallment(): number {
    if (!this.car?.sale_price || !this.downPayment) return 0;
    return (this.car.sale_price - this.downPayment) / this.installmentMonths;
  }

  async confirm() {
    const user = this.auth.currentUser();
    if (!user || !this.car) return;
    this.loading = true;
    try {
      await this.bookingService.createRentalBooking({
        car_id: this.car.id, customer_id: user.id,
        full_name: user.full_name, email: user.email, phone: user.phone,
        total_amount: this.car.sale_price!, status: 'pending',
        notes: `Purchase request — payment method: ${this.payMethod}` + (this.payMethod === 'installment' ? `, down payment: ${this.downPayment}, months: ${this.installmentMonths}` : ''),
      });
      const t = await this.toast.create({ message: 'Purchase request sent!', duration: 2000, color: 'success', position: 'top' });
      await t.present();
      this.router.navigate(['/tabs/my-bookings']);
    } catch (err: any) {
      const t = await this.toast.create({ message: err.message, duration: 3000, color: 'danger', position: 'top' });
      await t.present();
    } finally { this.loading = false; }
  }
}
