import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PurchaseService, Inventory } from '../../../core/services/purchase';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="inventory-container">
      <div class="inventory-header">
        <h1>Inventario de Materiales</h1>
        <p>Estado actual del inventario basado en compras</p>
      </div>

      <mat-card *ngIf="inventory.length > 0; else noInventory">
        <mat-card-content>
          <table mat-table [dataSource]="inventory" class="inventory-table">
            <ng-container matColumnDef="materialName">
              <th mat-header-cell *matHeaderCellDef>Material</th>
              <td mat-cell *matCellDef="let item">{{ item.materialName }}</td>
            </ng-container>

            <ng-container matColumnDef="totalQuantity">
              <th mat-header-cell *matHeaderCellDef>Cantidad Total</th>
              <td mat-cell *matCellDef="let item">
                {{ item.totalQuantity | number : "1.2-2" }} {{ item.unit }}
              </td>
            </ng-container>

            <ng-container matColumnDef="averageCost">
              <th mat-header-cell *matHeaderCellDef>Costo Promedio</th>
              <td mat-cell *matCellDef="let item">
                ${{ item.averageCost | number : "1.2-2" }} / {{ item.unit }}
              </td>
            </ng-container>

            <ng-container matColumnDef="totalValue">
              <th mat-header-cell *matHeaderCellDef>Valor Total</th>
              <td mat-cell *matCellDef="let item">
                <strong>${{ item.totalValue | number : "1.2-2" }}</strong>
              </td>
            </ng-container>

            <ng-container matColumnDef="lastPurchaseDate">
              <th mat-header-cell *matHeaderCellDef>Última Compra</th>
              <td mat-cell *matCellDef="let item">
                {{ item.lastPurchaseDate | date : "dd/MM/yyyy" }}
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let item">
                <span [class]="getStockStatus(item.totalQuantity)">
                  {{ getStockStatusText(item.totalQuantity) }}
                </span>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>

          <div class="inventory-summary">
            <div class="summary-card">
              <h3>Valor Total del Inventario</h3>
              <p class="total-value">${{ getTotalInventoryValue() | number : "1.2-2" }}</p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <ng-template #noInventory>
        <mat-card>
          <mat-card-content>
            <div class="no-inventory">
              <mat-icon>inventory_2</mat-icon>
              <h2>No hay materiales en inventario</h2>
              <p>Registra compras para ver el inventario de materiales.</p>
            </div>
          </mat-card-content>
        </mat-card>
      </ng-template>
    </div>
  `,
  styles: [`
    .inventory-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    .inventory-header {
      margin-bottom: 32px;
    }
    .inventory-header h1 {
      color: #2e7d32;
      margin-bottom: 8px;
    }
    .inventory-table {
      width: 100%;
    }
    .inventory-summary {
      margin-top: 24px;
      display: flex;
      justify-content: center;
    }
    .summary-card {
      background: #e8f5e8;
      padding: 24px;
      border-radius: 8px;
      text-align: center;
    }
    .summary-card h3 {
      margin: 0 0 12px 0;
      color: #2e7d32;
    }
    .total-value {
      font-size: 2rem;
      font-weight: bold;
      color: #2e7d32;
      margin: 0;
    }
    .stock-low {
      color: #f44336;
      font-weight: 500;
    }
    .stock-medium {
      color: #ff9800;
      font-weight: 500;
    }
    .stock-good {
      color: #4caf50;
      font-weight: 500;
    }
    .no-inventory {
      text-align: center;
      padding: 64px 32px;
    }
    .no-inventory mat-icon {
      font-size: 64px;
      height: 64px;
      width: 64px;
      color: #ccc;
      margin-bottom: 24px;
    }
  `]
})
export class InventoryComponent implements OnInit {
  inventory: Inventory[] = [];
  displayedColumns: string[] = [
    'materialName',
    'totalQuantity',
    'averageCost',
    'totalValue',
    'lastPurchaseDate',
    'status'
  ];

  constructor(private purchaseService: PurchaseService) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  private loadInventory(): void {
    this.purchaseService.getInventory().subscribe({
      next: (inventory) => {
        this.inventory = inventory;
      },
      error: (error) => {
        console.error('Error loading inventory:', error);
      }
    });
  }

  getTotalInventoryValue(): number {
    return this.inventory.reduce((total, item) => total + item.totalValue, 0);
  }

  getStockStatus(quantity: number): string {
    if (quantity < 10) return 'stock-low';
    if (quantity < 50) return 'stock-medium';
    return 'stock-good';
  }

  getStockStatusText(quantity: number): string {
    if (quantity < 10) return 'Stock Bajo';
    if (quantity < 50) return 'Stock Medio';
    return 'Stock Bueno';
  }
}
