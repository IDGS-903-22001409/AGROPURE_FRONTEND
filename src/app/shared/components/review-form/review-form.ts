// src/app/shared/components/review-form/review-form.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ReviewService } from '../../../core/services/review';
import { AuthService } from '../../../core/services/auth';
import { NotificationService } from '../../../core/services/notification';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
  ],
  template: `
    <mat-card class="review-form-card" *ngIf="showForm">
      <mat-card-header>
        <mat-card-title>
          <mat-icon>rate_review</mat-icon>
          Escribir Reseña
        </mat-card-title>
        <mat-card-subtitle>
          Comparte tu experiencia con este producto
        </mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <form [formGroup]="reviewForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Calificación</mat-label>
            <mat-select formControlName="rating" required>
              <mat-option [value]="5">
                <div class="rating-option">
                  <span class="stars">⭐⭐⭐⭐⭐</span>
                  <span>Excelente (5 estrellas)</span>
                </div>
              </mat-option>
              <mat-option [value]="4">
                <div class="rating-option">
                  <span class="stars">⭐⭐⭐⭐</span>
                  <span>Muy bueno (4 estrellas)</span>
                </div>
              </mat-option>
              <mat-option [value]="3">
                <div class="rating-option">
                  <span class="stars">⭐⭐⭐</span>
                  <span>Bueno (3 estrellas)</span>
                </div>
              </mat-option>
              <mat-option [value]="2">
                <div class="rating-option">
                  <span class="stars">⭐⭐</span>
                  <span>Regular (2 estrellas)</span>
                </div>
              </mat-option>
              <mat-option [value]="1">
                <div class="rating-option">
                  <span class="stars">⭐</span>
                  <span>Malo (1 estrella)</span>
                </div>
              </mat-option>
            </mat-select>
            <mat-error *ngIf="reviewForm.get('rating')?.hasError('required')">
              Selecciona una calificación
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Tu reseña</mat-label>
            <textarea
              matInput
              formControlName="comment"
              rows="4"
              placeholder="Describe tu experiencia con este producto..."
              maxlength="1000"
            ></textarea>
            <mat-hint align="end">
              {{ reviewForm.get('comment')?.value?.length || 0 }}/1000
            </mat-hint>
            <mat-error *ngIf="reviewForm.get('comment')?.hasError('required')">
              Escribe tu comentario
            </mat-error>
            <mat-error *ngIf="reviewForm.get('comment')?.hasError('minlength')">
              Mínimo 10 caracteres
            </mat-error>
          </mat-form-field>

          <div class="form-actions">
            <button mat-button type="button" (click)="cancelReview()">
              Cancelar
            </button>
            <button
              mat-raised-button
              color="primary"
              type="submit"
              [disabled]="reviewForm.invalid || isSubmitting"
            >
              <mat-icon>send</mat-icon>
              {{ isSubmitting ? 'Enviando...' : 'Enviar Reseña' }}
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .review-form-card {
        margin: 24px 0;
        border-left: 4px solid #4caf50;
      }

      mat-card-title {
        display: flex;
        align-items: center;
        gap: 12px;
        color: #2e7d32;
      }

      .full-width {
        width: 100%;
        margin-bottom: 16px;
      }

      .rating-option {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .stars {
        font-size: 16px;
      }

      .form-actions {
        display: flex;
        gap: 16px;
        justify-content: flex-end;
        margin-top: 16px;

        @media (max-width: 600px) {
          flex-direction: column-reverse;
        }
      }
    `,
  ],
})
export class ReviewFormComponent implements OnInit {
  @Input() productId!: number;
  @Input() showForm: boolean = false;
  @Output() reviewSubmitted = new EventEmitter<void>();
  @Output() formCancelled = new EventEmitter<void>();

  reviewForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.reviewForm = this.fb.group({
      rating: ['', Validators.required],
      comment: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {
    // Verificar si el usuario está autenticado
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.showForm = false;
    }
  }

  onSubmit(): void {
    if (this.reviewForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const reviewData = {
        productId: this.productId,
        rating: this.reviewForm.get('rating')?.value,
        comment: this.reviewForm.get('comment')?.value.trim(),
      };

      this.reviewService.createReview(reviewData).subscribe({
        next: (review) => {
          this.notificationService.success(
            'Reseña enviada exitosamente. Será visible después de la moderación.'
          );
          this.reviewForm.reset();
          this.reviewSubmitted.emit();
          this.isSubmitting = false;
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error submitting review:', error);
        },
      });
    }
  }

  cancelReview(): void {
    this.reviewForm.reset();
    this.formCancelled.emit();
  }
}
