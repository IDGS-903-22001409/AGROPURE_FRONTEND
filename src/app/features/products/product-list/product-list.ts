import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatGridListModule],
  template: `
    <div class="products-container">
      <div class="products-header">
        <h1>Catálogo de Productos AGROPURE</h1>
        <p>Sistemas inteligentes de monitoreo y tratamiento de agua para riego</p>
      </div>

      <div class="products-grid" *ngIf="products.length > 0; else noProducts">
        <mat-card class="product-card" *ngFor="let product of products">
          <div class="product-image">
            <mat-icon class="product-icon">water_drop</mat-icon>
          </div>
          
          <mat-card-header>
            <mat-card-title>{{ product.name }}</mat-card-title>
            <mat-card-subtitle>Desde ${{ product.basePrice | number:'1.2-2' }}</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <p class="product-description">{{ product.description }}</p>
            
            <div class="materials-info" *ngIf="product.materials.length > 0">
              <h4>Componentes incluidos:</h4>
              <ul class="materials-list">
                <li *ngFor="let material of product.materials.slice(0, 3)">
                  {{ material.materialName }} ({{ material.quantity }})
                </li>
                <li *ngIf="product.materials.length > 3">
                  +{{ product.materials.length - 3 }} componentes más
                </li>
              </ul>
            </div>
          </mat-card-content>
          
          <mat-card-actions>
            <button mat-button [routerLink]="['/products', product.id]">
              <mat-icon>visibility</mat-icon>
              Ver Detalles
            </button>
            <button mat-raised-button color="primary" [routerLink]="['/quotes']" [queryParams]="{productId: product.id}">
              <mat-icon>request_quote</mat-icon>
              Cotizar
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <ng-template #noProducts>
        <div class="no-products">
          <mat-icon>inventory_2</mat-icon>
          <h2>No hay productos disponibles</h2>
          <p>Estamos trabajando en nuevos productos. Vuelve pronto.</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .products-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    .products-header {
      text-align: center;
      margin-bottom: 48px;
    }
    .products-header h1 {
      color: #2e7d32;
      margin-bottom: 16px;
    }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
    }
    .product-card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .product-image {
      height: 120px;
      background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .product-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      color: white;
    }
    .product-description {
      margin-bottom: 16px;
      color: #666;
      line-height: 1.5;
    }
    .materials-info h4 {
      margin: 16px 0 8px 0;
      color: #2e7d32;
      font-size: 14px;
    }
    .materials-list {
      margin: 0;
      padding-left: 16px;
      font-size: 13px;
      color: #666;
    }
    .materials-list li {
      margin-bottom: 4px;
    }
    mat-card-content {
      flex: 1;
    }
    mat-card-actions {
      padding: 16px;
      display: flex;
      gap: 8px;
    }
    .no-products {
      text-align: center;
      padding: 64px 20px;
    }
    .no-products mat-icon {
      font-size: 64px;
      height: 64px;
      width: 64px;
      color: #ccc;
      margin-bottom: 16px;
    }
    .no-products h2 {
      color: #666;
      margin-bottom: 8px;
    }
    @media (max-width: 768px) {
      .products-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }
}
