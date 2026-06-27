import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-empty-state',
  template: `
<div class="empty-state">
  <div class="empty-icon">{{ icon }}</div>
  <h3>{{ title }}</h3>
  <p *ngIf="subtitle">{{ subtitle }}</p>
  <ion-button *ngIf="actionLabel" fill="outline" (click)="action()">{{ actionLabel }}</ion-button>
</div>`,
  styles: [`
.empty-state { text-align: center; padding: 80px 24px; .empty-icon { font-size: 72px; margin-bottom: 20px; } h3 { color: #fff; font-size: 20px; font-weight: 800; margin-bottom: 8px; } p { color: #9ca3af; font-size: 15px; margin-bottom: 24px; } }`],
  standalone: true,
  imports: [CommonModule, IonButton],
})
export class EmptyStateComponent {
  @Input() icon = '🔍';
  @Input() title = 'لا توجد نتائج';
  @Input() subtitle = '';
  @Input() actionLabel = '';
  @Input() actionFn: (() => void) | null = null;

  action() { if (this.actionFn) this.actionFn(); }
}
