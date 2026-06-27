import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonIcon, IonSkeletonText } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarsService } from '../../../services/cars.service';
import { Car } from '../../../models/car.model';
import { addIcons } from 'ionicons';
import { searchOutline, carSportOutline, calendarOutline, speedometerOutline, settingsOutline } from 'ionicons/icons';

@Component({
  selector: 'app-sale-list',
  template: `
<ion-content [fullscreen]="true" class="sale-content">
  <div class="page-header"><h1>Cars for Sale</h1></div>

  <div class="search-bar">
    <ion-icon name="search-outline"></ion-icon>
    <input type="text" placeholder="Search for a car..." [(ngModel)]="searchQuery" (input)="search($event)" />
  </div>

  <div class="cars-list" *ngIf="!loading">
    <div class="car-item" *ngFor="let car of cars" (click)="goToCar(car)">
      <div class="car-thumb">
        <img *ngIf="hasValidImage(car)" [src]="car.image_url" [alt]="car.make + ' ' + car.model" />
        <div *ngIf="!hasValidImage(car)" class="car-fallback"><ion-icon name="car-sport-outline"></ion-icon></div>
      </div>
      <div class="car-info">
        <h4>{{ car.make }} {{ car.model }}</h4>
        <div class="specs">
          <span><ion-icon name="calendar-outline"></ion-icon>{{ car.year }}</span>
          <span><ion-icon name="speedometer-outline"></ion-icon>{{ car.mileage?.toLocaleString() }} km</span>
          <span><ion-icon name="settings-outline"></ion-icon>{{ car.transmission === 'automatic' ? 'Auto' : 'Manual' }}</span>
        </div>
        <div class="price">{{ car.sale_price | number }} SAR</div>
      </div>
    </div>
  </div>

  <div class="cars-list" *ngIf="loading">
    <div class="car-item skeleton" *ngFor="let i of [1,2,3]">
      <ion-skeleton-text animated class="car-thumb-skel"></ion-skeleton-text>
      <div class="car-info">
        <ion-skeleton-text animated style="width:70%;height:16px;"></ion-skeleton-text>
        <ion-skeleton-text animated style="width:50%;height:12px;margin-top:8px;"></ion-skeleton-text>
      </div>
    </div>
  </div>

  <div class="empty-state" *ngIf="!loading && !cars.length">
    <ion-icon name="car-sport-outline"></ion-icon>
    <p>No cars for sale right now</p>
  </div>

  <div style="height:100px;"></div>
</ion-content>`,
  styles: [`
.sale-content { --background: #0a0a0a; }
.page-header { padding: 18px 20px 14px; h1 { color: #fff; font-size: 22px; font-weight: 900; margin: 0; } }
.search-bar { display: flex; align-items: center; gap: 10px; margin: 0 20px 16px; background: #1c1c1c; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 12px 16px;
  ion-icon { font-size: 18px; color: #71717a; }
  input { flex: 1; background: transparent; border: none; color: #f4f4f5; font-size: 14px; outline: none; text-align: right; &::placeholder { color: #52525b; } }
}
.cars-list { padding: 0 20px; display: flex; flex-direction: column; gap: 12px; }
.car-item {
  background: #141414; border: 1px solid rgba(255,255,255,0.05); border-radius: 18px; padding: 12px;
  display: flex; gap: 14px; cursor: pointer;
  .car-thumb { width: 96px; height: 80px; border-radius: 14px; overflow: hidden; flex-shrink: 0; background: #1c1c1c; }
  .car-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .car-fallback { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; ion-icon { font-size: 30px; color: #3f3f46; } }
  .car-thumb-skel { width: 96px; height: 80px; border-radius: 14px; --background: #1c1c1c; flex-shrink: 0; }
  .car-info { flex: 1; min-width: 0; }
  h4 { color: #fff; font-size: 15px; font-weight: 800; margin: 0 0 6px; }
  .specs { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 8px;
    span { display: flex; align-items: center; gap: 3px; color: #71717a; font-size: 11px; }
    ion-icon { font-size: 12px; }
  }
  .price { color: #ef4444; font-size: 17px; font-weight: 900; }
}
.empty-state { text-align: center; padding: 60px 20px; color: #52525b;
  ion-icon { font-size: 48px; margin-bottom: 10px; color: #27272a; }
  p { font-size: 14px; }
}
  `],
  standalone: true,
  imports: [IonContent, IonIcon, IonSkeletonText, CommonModule, FormsModule],
})
export class SaleListPage implements OnInit {
  cars: Car[] = [];
  loading = true;
  searchQuery = '';

  constructor(private carsService: CarsService, private router: Router) {
    addIcons({ searchOutline, carSportOutline, calendarOutline, speedometerOutline, settingsOutline });
  }

  async ngOnInit() {
    this.loading = true;
    try { this.cars = await this.carsService.getSaleCars(); }
    finally { this.loading = false; }
  }

  async search(event: any) {
    this.searchQuery = event.target.value;
    this.cars = await this.carsService.getSaleCars({}, this.searchQuery);
  }

  hasValidImage(car: Car): boolean {
    return !!car.image_url && /\.(jpe?g|png|webp|avif)$/i.test(car.image_url);
  }

  goToCar(car: Car) { this.router.navigate(['/cars', car.id]); }
}
