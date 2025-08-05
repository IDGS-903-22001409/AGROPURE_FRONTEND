import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ReviewService } from '../../../core/services/review';
import { NotificationService } from '../../../core/services/notification';
import { Review } from '../../../core/models/review';
import { RatingDisplayComponent } from '../../../shared/components/rating-display/rating-display';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    RatingDisplayComponent,
  ],
  templateUrl: './review-list.html',
  styleUrls: ['./review-list.scss'],
})
export class ReviewListComponent implements OnInit {
  reviews: Review[] = [];
  displayedColumns: string[] = [
    'id',
    'user',
    'rating',
    'comment',
    'status',
    'date',
    'actions',
  ];

  constructor(
    private reviewService: ReviewService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  private loadReviews(): void {
    this.reviewService.getReviews().subscribe({
      next: (reviews) => {
        this.reviews = reviews;
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
      },
    });
  }

  approveReview(review: Review): void {
    this.reviewService.approveReview(review.id).subscribe({
      next: (updatedReview) => {
        const index = this.reviews.findIndex((r) => r.id === review.id);
        if (index !== -1) {
          this.reviews[index] = updatedReview;
        }
        this.notificationService.success('Reseña aprobada exitosamente');
      },
    });
  }

  deleteReview(review: Review): void {
    if (confirm('¿Eliminar esta reseña?')) {
      this.reviewService.deleteReview(review.id).subscribe({
        next: () => {
          this.reviews = this.reviews.filter((r) => r.id !== review.id);
          this.notificationService.success('Reseña eliminada exitosamente');
        },
      });
    }
  }
}
