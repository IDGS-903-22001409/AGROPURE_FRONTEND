import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { ProductService } from '../../../core/services/product.service';
import { ReviewService } from '../../../core/services/review.service';
import { Product } from '../../../core/models/product.model';
import { Review } from '../../../core/models/review.model';
import { RatingDisplayComponent } from '../../../shared/components/rating-display/rating-display.component';

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
    RatingDisplayComponent
  ],
  template: `
    <div class="product-detail-container" *ngIf="product">
      <div class="breadcrumb">
        <a routerLink="/products">Productos</a>
        <mat-icon>chevron_right</mat-icon>
        <span>{{ product.name }}</span>
      </div>

      <div class="product-header">
        <div class="product-image">
          <mat-icon class="product-icon">water_drop</mat-icon>
        </div>
        
        <div class="product-info">
          <h1>{{ product.name }}</h1>
          <p class="product-description">{{ product.description }}</p>
          
          <div class="price-info">
            <span class="price-label">Precio desde:</span>
            <span class="price">${{ product.basePrice | number:'1.2-2' }}</span>
          </div>

          <div class="product-actions">
            <button mat-raised-button color="primary" [routerLink]="['/quotes']" [queryParams]="{productId: product.id}">
              <mat-icon>request_quote</mat-icon>
              Solicitar Cotización
            </button>
            <button mat-stroked-button routerLink="/products">
              <mat-icon>arrow_back</mat-icon>
              Volver al Catálogo
            </button>
          </div>
        </div>
      </div>

      <mat-divider></mat-divider>

      <div class="product-details">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Componentes Incluidos</mat-card-title>
            <mat-card-subtitle>Materiales y especificaciones técnicas</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="materials-grid" *ngIf="product.materials.length > 0; else noMaterials">
              <div class="material-item" *ngFor="let material of product.materials">
                <div class="material-info">
                  <h3>{{ material.materialName }}</h3>
                  <p>Cantidad: {{ material.quantity }}</p>
                  <p>Costo unitario: ${{ material.unitCost | number:'1.2-2' }}</p>
                </div>
                <div class="material-cost">
                  <span class="total-cost">
                    ${{ (material.quantity * material.unitCost) | number:'1.2-2' }}
                  </span>
                </div>
              </div>
            </div>
            
            <ng-template #noMaterials>
              <p class="no-materials">No hay información de materiales disponible.</p>
            </ng-template>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-card-title>Características del Sistema</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="features-list">
              <div class="feature-item">
                <mat-icon>sensors</mat-icon>
                <div>
                  <h4>Sensores IoT Integrados</h4>
                  <p>Monitoreo continuo de pH, conductividad, turbidez y otros parámetros críticos</p>
                </div>
              </div>
              
              <div class="feature-item">
                <mat-icon>cloud</mat-icon>
                <div>
                  <h4>Conectividad en la Nube</h4>
                  <p>Acceso remoto y almacenamiento de datos históricos para análisis</p>
                </div>
              </div>
              
              <div class="feature-item">
                <mat-icon>auto_fix_high</mat-icon>
                <div>
                  <h4>Automatización Inteligente</h4>
                  <p>Ajuste automático de parámetros basado en condiciones del cultivo</p>
                </div>
              </div>
              
              <div class="feature-item">
                <mat-icon>mobile_friendly</mat-icon>
                <div>
                  <h4>App Móvil</h4>
                  <p>Control y monitoreo desde cualquier lugar con notificaciones en tiempo real</p>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card *ngIf="reviews.length > 0">
          <mat-card-header>
            <mat-card-title>Reseñas de Clientes</mat-card-title>
            <mat-card-subtitle>{{ reviews.length }} reseña(s)</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="reviews-list">
              <div class="review-item" *ngFor="let review of reviews">
                <div class="review-header">
                  <strong>{{ review.userName }}</strong>
                  <app-rating-display [rating]="review.rating"></app-rating-display>
                </div>
                <p class="review-comment">{{ review.comment }}</p>
                <small class="review-date">{{ review.createdAt | date:'dd/MM/yyyy' }}</small>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>

    <div class="loading-container" *ngIf="!product">
      <mat-icon>hourglass_empty</mat-icon>
      <p>Cargando información del producto...</p>
    </div>
  `,
  styles: [`
    .product-detail-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 24px;
      color: #666;
    }
    .breadcrumb a {
      color: #4caf50;
      text-decoration: none;
    }
    .breadcrumb mat-icon {
      font-size: 18px;
      height: 18px;
      width: 18px;
    }
    .product-header {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 32px;
      margin-bottom: 32px;
    }
    .product-image {
      height: 300px;
      background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .product-icon {
      font-size: 120px;
      height: 120px;
      width: 120px;
      color: white;
    }
    .product-info h1 {
      color: #2e7d32;
      margin: 0 0 16px 0;
      font-size: 2.5rem;
    }
    .product-description {
      font-size: 1.1rem;
      line-height: 1.6;
      color: #666;
      margin-bottom: 24px;
    }
    .price-info {
      margin-bottom: 32px;
    }
    .price-label {
      color: #666;
      margin-right: 8px;
    }
    .price {
      font-size: 2rem;
      font-weight: bold;
      color: #2e7d32;
    }
    .product-actions {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
    .product-details {
      display: flex;
      flex-direction: column;
      gap: 24px;
      margin-top: 32px;
    }
    .materials-grid {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .material-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: #f9f9f9;
      border-radius: 8px;
      border-left: 4px solid #4caf50;
    }
    .material-info h3 {
      margin: 0 0 8px 0;
      color: #2e7d32;
    }
    .material-info p {
      margin: 4px 0;
      color: #666;
      font-size: 0.9rem;
    }
    .total-cost {
      font-size: 1.2rem;
      font-weight: bold;
      color: #2e7d32;
    }
    .no-materials {
      text-align: center;
      color: #666;
      padding: 32px;
    }
    .features-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .feature-item {
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }
    .feature-item mat-icon {
      color: #4caf50;
      margin-top: 4px;
    }
    .feature-item h4 {
      margin: 0 0 8px 0;
      color: #2e7d32;
    }
    .feature-item p {
      margin: 0;
      color: #666;
      line-height: 1.5;
    }
    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .review-item {
      padding: 16px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
    }
    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .review-comment {
      margin: 8px 0;
      line-height: 1.5;
    }
    .review-date {
      color: #666;
    }
    .loading-container {
      text-align: center;
      padding: 64px 20px;
      color: #666;
    }
    .loading-container mat-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      margin-bottom: 16px;
    }
    @media (max-width: 768px) {
      .product-header {
        grid-template-columns: 1fr;
        gap: 20px;
      }
      .product-image {
        height: 200px;
      }
      .product-icon {
        font-size: 80px;
        height: 80px;
        width: 80px;
      }
      .product-info h1 {
        font-size: 2rem;
      }
      .product-actions {
        flex-direction: column;
      }
    }
  `]
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
      }
    });
  }

  private loadReviews(productId: number): void {
    this.reviewService.getProductReviews(productId).subscribe({
      next: (reviews) => {
        this.reviews = reviews.filter(r => r.isApproved);
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
      }
    });
  }
}
