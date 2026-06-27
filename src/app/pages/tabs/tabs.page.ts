import { Component } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, carOutline, listOutline, personOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  template: `
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/tabs/home">
          <ion-icon name="home-outline"></ion-icon>
          <ion-label>الرئيسية</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="cars/rental" href="/tabs/cars/rental">
          <ion-icon name="car-outline"></ion-icon>
          <ion-label>إيجار</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="my-bookings" href="/tabs/my-bookings">
          <ion-icon name="list-outline"></ion-icon>
          <ion-label>حجوزاتي</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="profile" href="/tabs/profile">
          <ion-icon name="person-outline"></ion-icon>
          <ion-label>حسابي</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
  styles: [`
    ion-tab-bar {
      --background: #111827;
      --border-color: #1f2937;
      height: 60px;
      padding-bottom: env(safe-area-inset-bottom);
    }
    ion-tab-button {
      --color: #6b7280;
      --color-selected: #0891b2;
    }
    ion-tab-button ion-icon { font-size: 22px; }
    ion-tab-button ion-label { font-size: 11px; font-weight: 600; }
  `],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet],
})
export class TabsPage {
  constructor() {
    addIcons({ homeOutline, carOutline, listOutline, personOutline });
  }
}
