import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonIcon, IonBackButton, IonButtons, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, ToastController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { CarsService } from '../../../services/cars.service';
import { BookingService } from '../../../services/booking.service';
import { AuthService } from '../../../services/auth.service';
import { Car } from '../../../models/car.model';
import { addIcons } from 'ionicons';
import { carSportOutline, calendarOutline, locationOutline, addCircleOutline, cardOutline, shieldCheckmarkOutline, mapOutline, personOutline, phonePortraitOutline, checkmarkCircle, squareOutline, cashOutline, businessOutline } from 'ionicons/icons';

@Component({
  selector: 'app-rental-booking',
  templateUrl: './rental-booking.page.html',
  styleUrls: ['./rental-booking.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonIcon, IonBackButton, IonButtons, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, FormsModule, CommonModule],
})
export class RentalBookingPage implements OnInit {
  car: Car | null = null;
  pickupDate = '';
  returnDate = '';
  pickupLocation = '';
  returnLocation = '';
  paymentMethod: 'cash' | 'card' | 'transfer' = 'cash';
  loading = false;

  extras = [
    { id: '1', name: 'تأمين شامل', price: 50, icon: 'shield-checkmark-outline', selected: false },
    { id: '2', name: 'GPS', price: 20, icon: 'map-outline', selected: false },
    { id: '3', name: 'كرسي أطفال', price: 15, icon: 'person-outline', selected: false },
    { id: '4', name: 'Extra Screen', price: 30, icon: 'phone-portrait-outline', selected: false },
  ];

  constructor(
    private route: ActivatedRoute, private router: Router,
    private carsService: CarsService, private bookingService: BookingService,
    private auth: AuthService, private toast: ToastController
  ) {
    addIcons({ carSportOutline, calendarOutline, locationOutline, addCircleOutline, cardOutline, shieldCheckmarkOutline, mapOutline, personOutline, phonePortraitOutline, checkmarkCircle, squareOutline, cashOutline, businessOutline });
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.car = await this.carsService.getCarById(id);
  }

  hasValidImage(): boolean {
    return !!this.car?.image_url && /\.(jpe?g|png|webp|avif)$/i.test(this.car.image_url);
  }

  get selectedExtras() { return this.extras.filter(e => e.selected); }

  get totalDays(): number {
    if (!this.pickupDate || !this.returnDate) return 0;
    const diff = new Date(this.returnDate).getTime() - new Date(this.pickupDate).getTime();
    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
  }

  get totalPrice(): number {
    if (!this.car || !this.totalDays) return 0;
    const base = this.car.daily_rate! * this.totalDays;
    const extra = this.selectedExtras.reduce((s, e) => s + e.price * this.totalDays, 0);
    return base + extra;
  }

  async confirm() {
    const user = this.auth.currentUser();
    if (!user || !this.car) return;
    this.loading = true;
    try {
      await this.bookingService.createRentalBooking({
        car_id: this.car.id, customer_id: user.id,
        full_name: user.full_name, email: user.email, phone: user.phone,
        start_date: this.pickupDate, end_date: this.returnDate,
        pickup_location: this.pickupLocation, dropoff_location: this.returnLocation,
        total_amount: this.totalPrice, status: 'pending',
      });
      const t = await this.toast.create({ message: '✅ Booking confirmed successfully!', duration: 2000, color: 'success', position: 'top' });
      await t.present();
      this.router.navigate(['/tabs/my-bookings']);
    } catch (err: any) {
      const t = await this.toast.create({ message: err.message, duration: 3000, color: 'danger', position: 'top' });
      await t.present();
    } finally { this.loading = false; }
  }
}
