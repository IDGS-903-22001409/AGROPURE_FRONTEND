import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { ProductService } from '../../../core/services/product';
import { ReviewService } from '../../../core/services/review';
import { Product } from '../../../core/models/product';
import { Review } from '../../../core/models/review';
import { RatingDisplayComponent } from '../../../shared/components/rating-display/rating-display';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    RatingDisplayComponent,
  ],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.scss'],
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  reviews: Review[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.params['id']);
    if (productId) {
      this.loadProduct(productId);
      this.loadReviews(productId);
    } else {
      this.router.navigate(['/products']);
    }
  }

  private loadProduct(id: number): void {
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.product = product;
      },
      error: () => {
        this.router.navigate(['/products']);
      },
    });
  }

  private loadReviews(productId: number): void {
    this.reviewService.getProductReviews(productId).subscribe({
      next: (reviews) => {
        this.reviews = reviews.filter((r) => r.isApproved);
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
      },
    });
  }
}
