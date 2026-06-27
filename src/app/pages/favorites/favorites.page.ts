import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CarsService } from '../../services/cars.service';
import { AuthService } from '../../services/auth.service';
import { Car } from '../../models/car.model';
import { addIcons } from 'ionicons';
import { carSportOutline, heartOutline } from 'ionicons/icons';

@Component({
  selector: 'app-favorites',
  template: `
<ion-header class="ion-no-border"><ion-toolbar class="speed-toolbar"><ion-buttons slot="start"><ion-back-button text="" defaultHref="/tabs/profile"></ion-back-button></ion-buttons><ion-title>Favorites</ion-title></ion-toolbar></ion-header>
<ion-content [fullscreen]="true" class="fav-content">
  <div class="cars-grid" *ngIf="cars.length">
    <div class="car-item" *ngFor="let car of cars" (click)="goToCar(car)">
      <div class="car-thumb">
        <img *ngIf="hasValidImage(car)" [src]="car.image_url" [alt]="car.make" />
        <div *ngIf="!hasValidImage(car)" class="car-fallback"><ion-icon name="car-sport-outline"></ion-icon></div>
      </div>
      <h4>{{ car.make }} {{ car.model }}</h4>
      <p><strong>{{ car.daily_rate }}</strong> SAR / day</p>
    </div>
  </div>
  <div *ngIf="cars.length === 0 && !loading" class="empty-state">
    <ion-icon name="heart-outline"></ion-icon>
    <h3>No favorite cars found</h3>
  </div>
  <div style="height:100px;"></div>
</ion-content>`,
  styles: [`
.fav-content { --background: #0a0a0a; }
.speed-toolbar { --background: #0a0a0a; --color: #fff; --border-color: rgba(255,255,255,0.06); }
.cars-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 16px 20px; }
.car-item { background: #141414; border: 1px solid rgba(255,255,255,0.05); border-radius: 18px; padding: 12px; cursor: pointer;
  .car-thumb { height: 90px; border-radius: 14px; overflow: hidden; margin-bottom: 8px; background: #1c1c1c; }
  .car-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .car-fallback { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; ion-icon { font-size: 30px; color: #3f3f46; } }
  h4 { color: #fff; font-size: 13.5px; font-weight: 800; margin: 0 0 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  p { color: #a1a1aa; font-size: 11.5px; margin: 0; strong { color: #ef4444; font-size: 14px; font-weight: 900; } }
}
.empty-state { text-align: center; padding: 70px 20px; color: #52525b; ion-icon { font-size: 50px; margin-bottom: 12px; color: #27272a; } h3 { color: #71717a; font-size: 15px; font-weight: 600; } }
  `],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons, IonIcon, CommonModule],
})
export class FavoritesPage implements OnInit {
  cars: Car[] = [];
  loading = true;

  constructor(private carsService: CarsService, private auth: AuthService, private router: Router) {
    addIcons({ carSportOutline, heartOutline });
  }

  async ngOnInit() {
    const user = this.auth.currentUser();
    if (user) { this.cars = await this.carsService.getFavorites(user.id); }
    this.loading = false;
  }

  hasValidImage(car: Car): boolean {
    return !!car.image_url && /\.(jpe?g|png|webp|avif)$/i.test(car.image_url);
  }

  goToCar(car: Car) { this.router.navigate(['/cars', car.id]); }
}
