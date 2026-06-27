import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon, IonButton } from '@ionic/angular/standalone';
import { CommonModule, DecimalPipe } from '@angular/common';
import { CarsService } from '../../../services/cars.service';
import { Car, Review } from '../../../models/car.model';
import { addIcons } from 'ionicons';
import {
  heartOutline, heart, shareOutline, star, starOutline,
  peopleOutline, flashOutline, settingsOutline, locationOutline,
  calendarOutline, checkmarkCircle, personCircleOutline, chevronBackOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.page.html',
  styleUrls: ['./car-detail.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, IonButton, CommonModule, DecimalPipe, FormsModule],
})
export class CarDetailPage implements OnInit {
  car: Car | null = null;
  reviews: Review[] = [];
  loading = true;
  activeSegment = 'details';
  isFavorite = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private carsService: CarsService
  ) {
    addIcons({
      heartOutline, heart, shareOutline, star, starOutline,
      peopleOutline, flashOutline, settingsOutline, locationOutline,
      calendarOutline, checkmarkCircle, personCircleOutline, chevronBackOutline
    });
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    try {
      [this.car, this.reviews] = await Promise.all([
        this.carsService.getCarById(id),
        this.carsService.getCarReviews(id)
      ]);
    } finally {
      this.loading = false;
    }
  }

  fuelLabel(fuel: string): string {
    const map: any = {
      petrol: 'بنزين',
      diesel: 'ديزل',
      electric: 'كهربائي',
      hybrid: 'هجين'
    };
    return map[fuel] || fuel;
  }

  imgError(event: any) {
    event.target.style.display = 'none';
  }

  goBack() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  share() {
    if (navigator.share) {
      navigator.share({ title: this.car?.make + ' ' + this.car?.model, url: window.location.href });
    }
  }

  bookRental() { this.router.navigate(['/booking/rental', this.car!.id]); }
  buyNow() { this.router.navigate(['/booking/purchase', this.car!.id]); }
}
