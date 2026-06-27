import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { Car } from '../../models/car.model';
import { addIcons } from 'ionicons';
import { heartOutline, heart, locationOutline } from 'ionicons/icons';

@Component({
  selector: 'app-car-card',
  template: `
<div class="car-card" [class.list-mode]="mode === 'list'" (click)="cardClick.emit(car)">
  <div class="car-image">
    <span class="emoji">🚗</span>
    <button class="fav-btn" (click)="favClick.emit(car); $event.stopPropagation()">
      <ion-icon [name]="isFavorite ? 'heart' : 'heart-outline'" [style.color]="isFavorite ? '#ef4444' : '#9ca3af'"></ion-icon>
    </button>
    <span class="availability" [class.unavailable]="!car.is_available">
      {{ car.is_available ? 'متاح' : 'محجوز' }}
    </span>
  </div>
  <div class="car-body">
    <h4>{{ car.name }}</h4>
    <div class="car-specs">
      <span>⭐ {{ car.rating }}</span>
      <span>👤 {{ car.seats }}</span>
      <span>{{ car.transmission === 'automatic' ? '⚙️ أوتو' : '🔧 يدوي' }}</span>
      <span>⛽ {{ fuelLabel }}</span>
    </div>
    <div class="location" *ngIf="car.location">
      <ion-icon name="location-outline"></ion-icon>
      {{ car.location }}
    </div>
    <div class="car-price">
      <span class="price" *ngIf="car.daily_price">{{ car.daily_price }} ر.س<small>/يوم</small></span>
      <span class="price sale" *ngIf="car.sale_price && !car.daily_price">{{ car.sale_price | number }} ر.س</span>
    </div>
  </div>
</div>`,
  styles: [`
.car-card { background: #111827; border-radius: 16px; overflow: hidden; cursor: pointer; transition: transform 0.2s; &:active { transform: scale(0.98); } &.list-mode { display: flex; .car-image { width: 120px; flex-shrink: 0; border-radius: 0; } } }
.car-image { background: #1f2937; padding: 20px; text-align: center; position: relative; .emoji { font-size: 52px; } .fav-btn { position: absolute; top: 8px; left: 8px; background: rgba(0,0,0,0.4); border: none; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; ion-icon { font-size: 16px; } } .availability { position: absolute; top: 8px; right: 8px; background: rgba(16,185,129,0.9); color: #fff; font-size: 11px; padding: 3px 8px; border-radius: 6px; font-weight: 700; &.unavailable { background: rgba(239,68,68,0.9); } } }
.car-body { padding: 12px; h4 { color: #fff; font-size: 14px; font-weight: 700; margin: 0 0 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } .car-specs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 6px; span { color: #9ca3af; font-size: 11px; } } .location { display: flex; align-items: center; gap: 4px; color: #6b7280; font-size: 12px; margin-bottom: 8px; ion-icon { font-size: 12px; } } .car-price { .price { color: #0891b2; font-size: 16px; font-weight: 800; small { font-size: 11px; color: #6b7280; } &.sale { color: #f59e0b; } } } }`],
  standalone: true,
  imports: [CommonModule, IonIcon],
})
export class CarCardComponent {
  @Input() car!: Car;
  @Input() mode: 'grid' | 'list' = 'grid';
  @Input() isFavorite = false;
  @Output() cardClick = new EventEmitter<Car>();
  @Output() favClick = new EventEmitter<Car>();

  constructor() { addIcons({ heartOutline, heart, locationOutline }); }

  get fuelLabel() {
    const map: any = { petrol: 'بنزين', diesel: 'ديزل', electric: 'كهرباء', hybrid: 'هجين' };
    return map[this.car.fuel_type] || this.car.fuel_type;
  }
}
