import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiService } from './api';
import { Review } from '../models/review';

export interface CreateReviewRequest {
  productId: number;
  rating: number;
  comment: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  constructor(private apiService: ApiService) {}

  getReviews(): Observable<Review[]> {
    return this.apiService.get<Review[]>('reviews').pipe(
      tap((response) =>
        console.log('ReviewService.getReviews response:', response)
      ),
      catchError((error) => {
        console.error('ReviewService.getReviews error:', error);
        return throwError(error);
      })
    );
  }

  getProductReviews(productId: number): Observable<Review[]> {
    return this.apiService.get<Review[]>(`reviews/product/${productId}`).pipe(
      tap((response) =>
        console.log('ReviewService.getProductReviews response:', response)
      ),
      catchError((error) => {
        console.error('ReviewService.getProductReviews error:', error);
        return throwError(error);
      })
    );
  }

  createReview(reviewData: CreateReviewRequest): Observable<Review> {
    console.log('ReviewService.createReview - Enviando datos:', reviewData);

    return this.apiService.post<Review>('reviews', reviewData).pipe(
      tap((response) => {
        console.log('ReviewService.createReview response:', response);
      }),
      catchError((error) => {
        console.error('ReviewService.createReview error:', error);
        return throwError(error);
      })
    );
  }

  approveReview(id: number): Observable<Review> {
    return this.apiService.put<Review>(`reviews/${id}/approve`, {}).pipe(
      tap((response) =>
        console.log('ReviewService.approveReview response:', response)
      ),
      catchError((error) => {
        console.error('ReviewService.approveReview error:', error);
        return throwError(error);
      })
    );
  }

  deleteReview(id: number): Observable<void> {
    return this.apiService.delete<void>(`reviews/${id}`).pipe(
      tap((response) =>
        console.log('ReviewService.deleteReview response:', response)
      ),
      catchError((error) => {
        console.error('ReviewService.deleteReview error:', error);
        return throwError(error);
      })
    );
  }
}
