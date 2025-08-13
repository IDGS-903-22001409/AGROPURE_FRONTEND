import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '../../../core/services/product';
import { NotificationService } from '../../../core/services/notification';
import { Product } from '../../../core/models/product';
import { ProductFormComponent } from '../product-form/product-form';

@Component({
  selector: 'app-admin-product-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
  ],
  template: `
    <div class="product-list-container">
      <div class="list-header">
        <div class="header-text">
          <h1>Gestión de Productos</h1>
          <p>Administra el catálogo de productos</p>
        </div>
        <button mat-raised-button color="primary" (click)="openProductForm()">
          <mat-icon>add</mat-icon>
          Nuevo Producto
        </button>
      </div>

      <mat-card *ngIf="products.length > 0; else noProducts">
        <mat-card-content>
          <table mat-table [dataSource]="products" class="products-table">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let product">{{ product.id }}</td>
            </ng-container>

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Producto</th>
              <td mat-cell *matCellDef="let product">
                <div>
                  <strong>{{ product.name }}</strong
                  ><br />
                  <small>{{ product.description }}</small>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="category">
              <th mat-header-cell *matHeaderCellDef>Categoría</th>
              <td mat-cell *matCellDef="let product">
                {{ product.category || 'Sin categoría' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="materials">
              <th mat-header-cell *matHeaderCellDef>Materiales</th>
              <td mat-cell *matCellDef="let product">
                {{ product.materials.length }} componentes
              </td>
            </ng-container>

            <ng-container matColumnDef="basePrice">
              <th mat-header-cell *matHeaderCellDef>Precio Base</th>
              <td mat-cell *matCellDef="let product">
                <strong>\${{ product.basePrice | number : '1.2-2' }}</strong>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let product">
                <mat-chip
                  [color]="product.isActive ? 'primary' : 'warn'"
                  selected
                >
                  {{ product.isActive ? 'Activo' : 'Inactivo' }}
                </mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let product">
                <button
                  mat-icon-button
                  color="primary"
                  (click)="editProduct(product)"
                >
                  <mat-icon>edit</mat-icon>
                </button>
                <button
                  mat-icon-button
                  color="warn"
                  (click)="deleteProduct(product)"
                >
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>
        </mat-card-content>
      </mat-card>

      <ng-template #noProducts>
        <mat-card>
          <mat-card-content>
            <div class="no-products">
              <mat-icon>inventory</mat-icon>
              <h2>No hay productos registrados</h2>
              <p>Agrega productos al catálogo del sistema.</p>
              <button
                mat-raised-button
                color="primary"
                (click)="openProductForm()"
              >
                <mat-icon>add</mat-icon>
                Agregar Primer Producto
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .product-list-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }

      .list-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 32px;
        flex-wrap: wrap;
        gap: 16px;

        .header-text {
          flex: 1;

          h1 {
            color: #2e7d32;
            margin: 0 0 8px 0;
          }

          p {
            margin: 0;
            color: #666;
          }
        }

        @media (max-width: 768px) {
          flex-direction: column;
          align-items: stretch;
        }
      }

      .products-table {
        width: 100%;
      }

      .no-products {
        text-align: center;
        padding: 64px 32px;

        mat-icon {
          font-size: 64px;
          height: 64px;
          width: 64px;
          color: #ccc;
          margin-bottom: 24px;
        }

        h2 {
          color: #666;
          margin-bottom: 16px;
        }

        p {
          color: #999;
          margin-bottom: 32px;
        }
      }
    `,
  ],
})
export class AdminProductListComponent implements OnInit {
  products: Product[] = [];
  displayedColumns: string[] = [
    'id',
    'name',
    'category',
    'materials',
    'basePrice',
    'status',
    'actions',
  ];

  constructor(
    private productService: ProductService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

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
      },
    });
  }

  openProductForm(product?: Product): void {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '800px',
      data: product || null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  editProduct(product: Product): void {
    this.openProductForm(product);
  }

  deleteProduct(product: Product): void {
    if (confirm(`¿Eliminar producto ${product.name}?`)) {
      this.productService.deleteProduct(product.id).subscribe({
        next: () => {
          this.products = this.products.filter((p) => p.id !== product.id);
          this.notificationService.success('Producto eliminado exitosamente');
        },
      });
    }
  }
}
