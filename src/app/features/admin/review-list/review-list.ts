import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ReviewService } from '../../../core/services/review.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Review } from '../../../core/models/review.model';
import { RatingDisplayComponent } from '../../../shared/components/rating-display/rating-display.component';

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
  template: `
    <div class="review-list-container">
      <div class="list-header">
        <h1>Gestión de Reseñas</h1>
        <p>Modera las reseñas de productos</p>
      </div>

      <mat-card *ngIf="reviews.length > 0; else noReviews">
        <mat-card-content>
          <table mat-table [dataSource]="reviews" class="reviews-table">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let review">{{ review.id }}</td>
            </ng-container>

            <ng-container matColumnDef="user">
              <th mat-header-cell *matHeaderCellDef>Usuario</th>
              <td mat-cell *matCellDef="let review">{{ review.userName }}</td>
            </ng-container>

            <ng-container matColumnDef="rating">
              <th mat-header-cell *matHeaderCellDef>Calificación</th>
              <td mat-cell *matCellDef="let review">
                <app-rating-display
                  [rating]="review.rating"
                  [showValue]="true"
                ></app-rating-display>
              </td>
            </ng-container>

            <ng-container matColumnDef="comment">
              <th mat-header-cell *matHeaderCellDef>Comentario</th>
              <td mat-cell *matCellDef="let review">
                <div class="comment-cell">{{ review.comment }}</div>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let review">
                <mat-chip
                  [color]="review.isApproved ? 'primary' : 'warn'"
                  selected
                >
                  {{ review.isApproved ? 'Aprobada' : 'Pendiente' }}
                </mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>Fecha</th>
              <td mat-cell *matCellDef="let review">
                {{ review.createdAt | date : 'dd/MM/yyyy' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let review">
                <button
                  mat-icon-button
                  color="primary"
                  (click)="approveReview(review)"
                  *ngIf="!review.isApproved"
                  title="Aprobar reseña"
                >
                  <mat-icon>check</mat-icon>
                </button>
                <button
                  mat-icon-button
                  color="warn"
                  (click)="deleteReview(review)"
                  title="Eliminar reseña"
                >
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr
              mat-row
              *matRowDef="let row; columns: displayedColumns"
              [class]="!row.isApproved ? 'pending-row' : ''"
            ></tr>
          </table>
        </mat-card-content>
      </mat-card>

      <ng-template #noReviews>
        <mat-card>
          <mat-card-content>
            <div class="no-reviews">
              <mat-icon>reviews</mat-icon>
              <h2>No hay reseñas</h2>
              <p>
                Las reseñas de productos aparecerán aquí para su moderación.
              </p>
            </div>
          </mat-card-content>
        </mat-card>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .review-list-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }
      .list-header {
        margin-bottom: 32px;
      }
      .list-header h1 {
        color: #2e7d32;
        margin-bottom: 8px;
      }
      .reviews-table {
        width: 100%;
      }
      .comment-cell {
        max-width: 300px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .pending-row {
        background-color: #fff3e0;
      }
      .no-reviews {
        text-align: center;
        padding: 64px 32px;
      }
      .no-reviews mat-icon {
        font-size: 64px;
        height: 64px;
        width: 64px;
        color: #ccc;
        margin-bottom: 24px;
      }
      .no-reviews h2 {
        color: #666;
        margin-bottom: 16px;
      }
    `,
  ],
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
