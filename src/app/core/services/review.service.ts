import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  constructor(private apiService: ApiService) {}

  getReviews(): Observable<Review[]> {
    return this.apiService.get<Review[]>('reviews');
  }

  getProductReviews(productId: number): Observable<Review[]> {
    return this.apiService.get<Review[]>(`reviews/product/${productId}`);
  }

  createReview(review: Partial<Review>): Observable<Review> {
    return this.apiService.post<Review>('reviews', review);
  }

  approveReview(id: number): Observable<Review> {
    return this.apiService.put<Review>(`reviews/${id}/approve`, {});
  }

  deleteReview(id: number): Observable<void> {
    return this.apiService.delete<void>(`reviews/${id}`);
  }
}
