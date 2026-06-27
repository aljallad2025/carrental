import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating-stars',
  template: `
<div class="stars">
  <span *ngFor="let s of starsArray; let i = index" class="star" [class.filled]="i < fullStars">★</span>
  <span class="rating-text" *ngIf="showCount">({{ count }})</span>
</div>`,
  styles: [`
.stars { display: inline-flex; align-items: center; gap: 2px; }
.star { font-size: 14px; color: #374151; &.filled { color: #f59e0b; } }
.rating-text { color: #9ca3af; font-size: 12px; margin-right: 4px; }`],
  standalone: true,
  imports: [CommonModule],
})
export class RatingStarsComponent {
  @Input() rating = 0;
  @Input() count = 0;
  @Input() showCount = true;

  get starsArray() { return [1, 2, 3, 4, 5]; }
  get fullStars() { return Math.round(this.rating); }
}
