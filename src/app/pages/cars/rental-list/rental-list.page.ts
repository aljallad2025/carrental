import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonSearchbar, IonIcon, IonButton, IonSegment, IonSegmentButton, IonLabel, IonSkeletonText, IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { CarsService, CarFilter } from '../../../services/cars.service';
import { AuthService } from '../../../services/auth.service';
import { Car } from '../../../models/car.model';
import { addIcons } from 'ionicons';
import { gridOutline, listOutline, filterOutline, heartOutline, heart } from 'ionicons/icons';

@Component({
  selector: 'app-rental-list',
  templateUrl: './rental-list.page.html',
  styleUrls: ['./rental-list.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, IonTitle, IonSearchbar, IonIcon, IonButton, IonSegment, IonSegmentButton, IonLabel, IonSkeletonText, IonRefresher, IonRefresherContent, FormsModule, CommonModule],
})
export class RentalListPage implements OnInit {
  cars: Car[] = [];
  loading = true;
  viewMode: 'grid' | 'list' = 'grid';
  searchQuery = '';
  filters: CarFilter = {};
  favorites = new Set<string>();

  constructor(private carsService: CarsService, private auth: AuthService, private router: Router, private route: ActivatedRoute) {
    addIcons({ gridOutline, listOutline, filterOutline, heartOutline, heart });
  }

  async ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['category']) this.filters.category = params['category'];
      this.loadCars();
    });
  }

  async loadCars() {
    this.loading = true;
    try { this.cars = await this.carsService.getRentalCars(this.filters, this.searchQuery); }
    finally { this.loading = false; }
  }

  async search(event: any) {
    this.searchQuery = event.detail.value;
    await this.loadCars();
  }

  async refresh(event: any) { await this.loadCars(); event.target.complete(); }

  async toggleFavorite(car: Car, event: Event) {
    event.stopPropagation();
    const user = this.auth.currentUser();
    if (!user) return;
    const isFav = await this.carsService.toggleFavorite(car.id, user.id);
    if (isFav) this.favorites.add(car.id);
    else this.favorites.delete(car.id);
  }

  isFavorite(carId: string) { return this.favorites.has(carId); }
  goToCar(car: Car) { this.router.navigate(['/cars', car.id]); }

  hasValidImage(car: Car): boolean {
    return !!car.image_url && /\.(jpe?g|png|webp|avif)$/i.test(car.image_url);
  }
}
