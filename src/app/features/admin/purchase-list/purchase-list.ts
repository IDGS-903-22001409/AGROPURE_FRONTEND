import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { PurchaseService, Purchase } from '../../../core/services/purchase';
import { NotificationService } from '../../../core/services/notification';
import { PurchaseFormComponent } from '../purchase-form/purchase-form';

@Component({
  selector: 'app-purchase-list',
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
    <div class="purchase-list-container">
      <div class="list-header">
        <h1>Gestión de Compras</h1>
        <p>Administra las compras a proveedores</p>
        <button mat-raised-button color="primary" (click)="openPurchaseForm()">
          <mat-icon>add</mat-icon>
          Nueva Compra
        </button>
      </div>

      <mat-card *ngIf="purchases.length > 0; else noPurchases">
        <mat-card-content>
          <table mat-table [dataSource]="purchases" class="purchases-table">
            <ng-container matColumnDef="purchaseNumber">
              <th mat-header-cell *matHeaderCellDef>Número</th>
              <td mat-cell *matCellDef="let purchase">{{ purchase.purchaseNumber }}</td>
            </ng-container>

            <ng-container matColumnDef="supplier">
              <th mat-header-cell *matHeaderCellDef>Proveedor</th>
              <td mat-cell *matCellDef="let purchase">{{ purchase.supplierName }}</td>
            </ng-container>

            <ng-container matColumnDef="material">
              <th mat-header-cell *matHeaderCellDef>Material</th>
              <td mat-cell *matCellDef="let purchase">{{ purchase.materialName }}</td>
            </ng-container>

            <ng-container matColumnDef="quantity">
              <th mat-header-cell *matHeaderCellDef>Cantidad</th>
              <td mat-cell *matCellDef="let purchase">{{ purchase.quantity }}</td>
            </ng-container>

            <ng-container matColumnDef="unitCost">
              <th mat-header-cell *matHeaderCellDef>Costo Unitario</th>
              <td mat-cell *matCellDef="let purchase">
                ${{ purchase.unitCost | number : "1.2-2" }}
              </td>
            </ng-container>

            <ng-container matColumnDef="totalCost">
              <th mat-header-cell *matHeaderCellDef>Total</th>
              <td mat-cell *matCellDef="let purchase">
                <strong>${{ purchase.totalCost | number : "1.2-2" }}</strong>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let purchase">
                <mat-chip [color]="getStatusColor(purchase.status)" selected>
                  {{ purchase.status }}
                </mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>Fecha</th>
              <td mat-cell *matCellDef="let purchase">
                {{ purchase.purchaseDate | date : "dd/MM/yyyy" }}
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let purchase">
                <button mat-icon-button color="primary" (click)="editPurchase(purchase)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deletePurchase(purchase)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>
        </mat-card-content>
      </mat-card>

      <ng-template #noPurchases>
        <mat-card>
          <mat-card-content>
            <div class="no-purchases">
              <mat-icon>shopping_cart</mat-icon>
              <h2>No hay compras registradas</h2>
              <p>Comienza registrando tu primera compra a proveedores.</p>
            </div>
          </mat-card-content>
        </mat-card>
      </ng-template>
    </div>
  `,
  styles: [`
    .purchase-list-container {
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
    }
    .list-header h1 {
      color: #2e7d32;
      margin: 0;
    }
    .purchases-table {
      width: 100%;
    }
    .no-purchases {
      text-align: center;
      padding: 64px 32px;
    }
    .no-purchases mat-icon {
      font-size: 64px;
      height: 64px;
      width: 64px;
      color: #ccc;
      margin-bottom: 24px;
    }
  `]
})
export class PurchaseListComponent implements OnInit {
  purchases: Purchase[] = [];
  displayedColumns: string[] = [
    'purchaseNumber',
    'supplier',
    'material',
    'quantity',
    'unitCost',
    'totalCost',
    'status',
    'date',
    'actions'
  ];

  constructor(
    private purchaseService: PurchaseService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadPurchases();
  }

  private loadPurchases(): void {
    this.purchaseService.getPurchases().subscribe({
      next: (purchases) => {
        this.purchases = purchases;
      },
      error: (error) => {
        console.error('Error loading purchases:', error);
      }
    });
  }

  getStatusColor(status: string): 'primary' | 'accent' | 'warn' {
    switch (status) {
      case 'Entregado':
        return 'primary';
      case 'En Tránsito':
        return 'accent';
      case 'Pendiente':
        return 'warn';
      default:
        return 'accent';
    }
  }

  openPurchaseForm(purchase?: Purchase): void {
    const dialogRef = this.dialog.open(PurchaseFormComponent, {
      width: '600px',
      data: purchase || null
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadPurchases();
      }
    });
  }

  editPurchase(purchase: Purchase): void {
    this.openPurchaseForm(purchase);
  }

  deletePurchase(purchase: Purchase): void {
    if (confirm(`¿Eliminar compra ${purchase.purchaseNumber}?`)) {
      this.purchaseService.deletePurchase(purchase.id).subscribe({
        next: () => {
          this.purchases = this.purchases.filter(p => p.id !== purchase.id);
          this.notificationService.success('Compra eliminada exitosamente');
        }
      });
    }
  }
}
