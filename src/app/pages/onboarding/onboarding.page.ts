import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { flash } from 'ionicons/icons';

interface OnboardingSlide {
  title: string;
  subtitle: string;
  image: string;
}

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, CommonModule],
})
export class OnboardingPage {
  currentSlide = 0;

  // Fixed, original illustrations bundled with the app (no copyright risk,
  // no dependency on what happens to be in the live fleet at the moment).
  slides: OnboardingSlide[] = [
    { title: 'Discover Your Dream Car', subtitle: 'Hundreds of luxury and economy cars at your fingertips', image: 'assets/images/hero-car.svg' },
    { title: 'Book with Ease', subtitle: 'Book in minutes with multiple payment options', image: 'assets/images/hero-car.svg' },
    { title: 'Track and Manage', subtitle: 'Track your bookings and contracts in one place', image: 'assets/images/hero-car.svg' },
  ];

  constructor(private router: Router) {
    addIcons({ flash });
  }

  next() {
    if (this.currentSlide < this.slides.length - 1) {
      this.currentSlide++;
    } else {
      this.skip();
    }
  }

  skip() {
    localStorage.setItem('onboarding_done', 'true');
    this.router.navigate(['/auth/login']);
  }
}
