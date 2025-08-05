import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-rating-display',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './rating-display.html',
  styleUrls: ['./rating-display.scss'],
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
