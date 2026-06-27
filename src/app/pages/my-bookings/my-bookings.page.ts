import { Component, OnInit } from '@angular/core';
import { IonContent, IonSegment, IonSegmentButton, IonLabel, IonIcon, IonSkeletonText } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { Booking } from '../../models/car.model';
import { addIcons } from 'ionicons';
import { carSportOutline, calendarOutline, listCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-my-bookings',
  template: `
<ion-content [fullscreen]="true" class="bookings-content">
  <div class="page-header"><h1>حجوزاتي</h1></div>

  <ion-segment [(ngModel)]="activeTab" (ionChange)="loadBookings()" mode="md" class="status-segment">
    <ion-segment-button value="active"><ion-label>نشطة</ion-label></ion-segment-button>
    <ion-segment-button value="pending"><ion-label>قادمة</ion-label></ion-segment-button>
    <ion-segment-button value="completed"><ion-label>منتهية</ion-label></ion-segment-button>
    <ion-segment-button value="cancelled"><ion-label>ملغاة</ion-label></ion-segment-button>
  </ion-segment>

  <div class="bookings-list" *ngIf="!loading">
    <div class="booking-card" *ngFor="let b of bookings">
      <div class="booking-header">
        <div class="car-thumb">
          <img *ngIf="hasValidImage(b)" [src]="b.car?.image_url" [alt]="b.car?.make" />
          <div *ngIf="!hasValidImage(b)" class="car-fallback"><ion-icon name="car-sport-outline"></ion-icon></div>
        </div>
        <div class="booking-info">
          <h4>{{ b.car?.make }} {{ b.car?.model }}</h4>
          <p><ion-icon name="calendar-outline"></ion-icon>{{ b.start_date | date:'dd/MM/yyyy' }} → {{ b.end_date | date:'dd/MM/yyyy' }}</p>
        </div>
        <span class="status" [class]="b.status">{{ statusLabel(b.status) }}</span>
      </div>
      <div class="booking-footer">
        <span class="price">{{ b.total_amount | number }} <small>ر.س</small></span>
        <div class="btns">
          <button *ngIf="b.status === 'active'" class="action-btn primary" (click)="extend(b)">تمديد</button>
          <button *ngIf="b.status !== 'cancelled' && b.status !== 'completed'" class="action-btn danger" (click)="cancel(b)">إلغاء</button>
        </div>
      </div>
    </div>
    <div *ngIf="bookings.length === 0" class="empty-state">
      <ion-icon name="list-circle-outline"></ion-icon>
      <h3>No bookings found</h3>
    </div>
  </div>

  <div class="bookings-list" *ngIf="loading">
    <div class="booking-card skeleton" *ngFor="let i of [1,2]">
      <div class="booking-header">
        <ion-skeleton-text animated class="car-thumb-skel"></ion-skeleton-text>
        <div class="booking-info">
          <ion-skeleton-text animated style="width:60%;height:14px;"></ion-skeleton-text>
          <ion-skeleton-text animated style="width:40%;height:11px;margin-top:6px;"></ion-skeleton-text>
        </div>
      </div>
    </div>
  </div>

  <div style="height:100px;"></div>
</ion-content>`,
  styles: [`
.bookings-content { --background: #0a0a0a; }
.page-header { padding: 18px 20px 14px; h1 { color: #fff; font-size: 22px; font-weight: 900; margin: 0; } }
.status-segment { margin: 0 20px 16px; --background: #1c1c1c; border-radius: 12px; padding: 4px; width: calc(100% - 40px);
  ion-segment-button { --color: #71717a; --color-checked: #fff; --background-checked: #dc2626; --indicator-color: transparent; border-radius: 9px; min-height: 36px; font-size: 12px; }
}
.bookings-list { padding: 0 20px; display: flex; flex-direction: column; gap: 12px; }
.booking-card { background: #141414; border: 1px solid rgba(255,255,255,0.05); border-radius: 18px; padding: 14px; }
.booking-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px;
  .car-thumb { width: 64px; height: 56px; border-radius: 12px; overflow: hidden; flex-shrink: 0; background: #1c1c1c; }
  .car-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .car-fallback { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; ion-icon { font-size: 24px; color: #3f3f46; } }
  .car-thumb-skel { width: 64px; height: 56px; border-radius: 12px; --background: #1c1c1c; flex-shrink: 0; }
  .booking-info { flex: 1; min-width: 0;
    h4 { color: #fff; font-size: 14.5px; font-weight: 800; margin: 0 0 4px; }
    p { display: flex; align-items: center; gap: 4px; color: #71717a; font-size: 11.5px; margin: 0; ion-icon { font-size: 13px; } }
  }
}
.status { padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 700; flex-shrink: 0;
  &.active { background: rgba(34,197,94,0.15); color: #22c55e; }
  &.pending { background: rgba(245,158,11,0.15); color: #f59e0b; }
  &.completed { background: rgba(99,102,241,0.15); color: #818cf8; }
  &.cancelled { background: rgba(239,68,68,0.15); color: #ef4444; }
}
.booking-footer { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 12px;
  .price { color: #ef4444; font-size: 17px; font-weight: 900; small { color: #71717a; font-size: 11px; font-weight: 600; } }
  .btns { display: flex; gap: 8px; }
  .action-btn { padding: 8px 14px; border-radius: 10px; border: none; font-size: 12.5px; font-weight: 700; cursor: pointer;
    &.primary { background: rgba(220,38,38,0.15); color: #ef4444; }
    &.danger { background: rgba(255,255,255,0.06); color: #a1a1aa; }
  }
}
.empty-state { text-align: center; padding: 70px 20px; color: #52525b;
  ion-icon { font-size: 50px; margin-bottom: 12px; color: #27272a; }
  h3 { color: #71717a; font-size: 15px; font-weight: 600; }
}
  `],
  standalone: true,
  imports: [IonContent, IonSegment, IonSegmentButton, IonLabel, IonIcon, IonSkeletonText, CommonModule, FormsModule],
})
export class MyBookingsPage implements OnInit {
  bookings: Booking[] = [];
  loading = true;
  activeTab = 'active';

  constructor(private bookingService: BookingService, private auth: AuthService) {
    addIcons({ carSportOutline, calendarOutline, listCircleOutline });
  }

  async ngOnInit() { await this.loadBookings(); }

  async loadBookings() {
    const user = this.auth.currentUser();
    if (!user) return;
    this.loading = true;
    this.bookings = await this.bookingService.getCustomerBookings(user.id, this.activeTab);
    this.loading = false;
  }

  hasValidImage(b: Booking): boolean {
    return !!b.car?.image_url && /\.(jpe?g|png|webp|avif)$/i.test(b.car.image_url);
  }

  statusLabel(status: string) {
    const map: any = { active: 'نشط', pending: 'قادم', completed: 'منتهي', cancelled: 'ملغى' };
    return map[status] || status;
  }

  async cancel(b: Booking) { await this.bookingService.cancelBooking(b.id); await this.loadBookings(); }
  async extend(b: Booking) {}
}
