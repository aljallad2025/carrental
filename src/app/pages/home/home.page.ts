import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonRefresher, IonRefresherContent, IonSkeletonText, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { CarsService } from '../../services/cars.service';
import { AuthService } from '../../services/auth.service';
import { Car } from '../../models/car.model';
import { addIcons } from 'ionicons';
import {
  notificationsOutline, searchOutline, flash, arrowForwardOutline,
  speedometerOutline, peopleOutline, settingsOutline, carSportOutline,
} from 'ionicons/icons';

interface Category { label: string; value: string; icon: string; }

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonRefresher, IonRefresherContent, IonSkeletonText, IonIcon, CommonModule],
})
export class HomePage implements OnInit {
  featuredCars: Car[] = [];
  popularCars: Car[] = [];
  loading = true;
  selectedCategory: string | null = null;

  categories: Category[] = [
    { label: 'Sedan', value: 'sedan', icon: 'car-sport-outline' },
    { label: 'SUV', value: 'suv', icon: 'car-sport-outline' },
    { label: 'Luxury', value: 'luxury', icon: 'car-sport-outline' },
    { label: 'Sports', value: 'sports', icon: 'car-sport-outline' },
    { label: 'Economy', value: 'economy', icon: 'car-sport-outline' },
  ];

  constructor(private carsService: CarsService, private auth: AuthService, private router: Router) {
    addIcons({ notificationsOutline, searchOutline, flash, arrowForwardOutline, speedometerOutline, peopleOutline, settingsOutline, carSportOutline });
  }

  get currentUser() { return this.auth.currentUser(); }
  get isGuest() { return this.auth.isGuest(); }

  async ngOnInit() { await this.loadData(); }

  async loadData() {
    this.loading = true;
    try {
      [this.featuredCars, this.popularCars] = await Promise.all([
        this.carsService.getFeaturedCars(),
        this.carsService.getPopularCars(),
      ]);
    } finally { this.loading = false; }
  }

  async refresh(event: any) {
    await this.loadData();
    event.target.complete();
  }

  selectCategory(cat: string) {
    this.selectedCategory = this.selectedCategory === cat ? null : cat;
    this.router.navigate(['/tabs/cars/rental'], { queryParams: { category: this.selectedCategory } });
  }

  // Guards against bad/placeholder image_url rows (e.g. an accidental
  // non-car photo uploaded from the admin panel) so the UI never shows junk.
  hasValidImage(car: Car): boolean {
    return !!car.image_url && /\.(jpe?g|png|webp|avif)$/i.test(car.image_url);
  }

  goToCar(car: Car) { this.router.navigate(['/cars', car.id]); }
  goToSearch() { this.router.navigate(['/tabs/cars/rental']); }
  goToNotifications() {}
}
