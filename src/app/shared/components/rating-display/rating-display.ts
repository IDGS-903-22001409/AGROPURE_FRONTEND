import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-rating-display',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="rating-display">
      <mat-icon
        *ngFor="let star of stars"
        [class]="star.filled ? 'star-filled' : 'star-empty'"
      >
        {{ star.filled ? 'star' : 'star_border' }}
      </mat-icon>
      <span class="rating-value" *ngIf="showValue">({{ rating }}/5)</span>
    </div>
  `,
  styles: [
    `
      .rating-display {
        display: flex;
        align-items: center;
        gap: 2px;
      }
      .star-filled {
        color: #ffc107;
      }
      .star-empty {
        color: #e0e0e0;
      }
      .rating-value {
        margin-left: 8px;
        font-size: 0.9rem;
        color: #666;
      }
      mat-icon {
        font-size: 16px;
        height: 16px;
        width: 16px;
      }
    `,
  ],
})
export class RatingDisplayComponent {
  @Input() rating: number = 0;
  @Input() showValue: boolean = false;

  get stars() {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push({ filled: i <= this.rating });
    }
    return stars;
  }
}
