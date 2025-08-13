// src/app/features/admin/sales-dashboard/sales-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { QuoteService } from '../../../core/services/quote';
import { SaleService } from '../../../core/services/sale';
import { NotificationService } from '../../../core/services/notification';
import { Quote } from '../../../core/models/quote';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-sales-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
  ],
  template: `
    <div class="sales-dashboard-container">
      <div class="dashboard-header">
        <h1>Dashboard de Ventas</h1>
        <p>Cotizaciones aprobadas listas para conversión a ventas</p>
      </div>

      <!-- Estadísticas -->
      <div class="stats-cards">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon">shopping_cart</mat-icon>
              <div class="stat-info">
                <h3>{{ approvedQuotes.length }}</h3>
                <p>Cotizaciones Aprobadas</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon revenue">attach_money</mat-icon>
              <div class="stat-info">
                <h3>\${{ getTotalPotentialRevenue() | number : '1.2-2' }}</h3>
                <p>Ingresos Potenciales</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon pending">pending</mat-icon>
              <div class="stat-info">
                <h3>{{ getExpiringQuotes() }}</h3>
                <p>Por Expirar (7 días)</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Tabla de cotizaciones aprobadas -->
      <mat-card>
        <mat-card-header>
          <mat-card-title
            >Cotizaciones Aprobadas - Listas para Venta</mat-card-title
          >
          <mat-card-subtitle
            >Convierte cotizaciones aprobadas en ventas con un
            clic</mat-card-subtitle
          >
        </mat-card-header>

        <mat-card-content>
          <div *ngIf="approvedQuotes.length > 0; else noApprovedQuotes">
            <table mat-table [dataSource]="approvedQuotes" class="sales-table">
              <!-- ID Column -->
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let quote">
                  <span class="quote-id">#{{ quote.id }}</span>
                </td>
              </ng-container>

              <!-- Cliente Column -->
              <ng-container matColumnDef="customer">
                <th mat-header-cell *matHeaderCellDef>Cliente</th>
                <td mat-cell *matCellDef="let quote">
                  <div class="customer-info">
                    <strong>{{ quote.customerName }}</strong>
                    <small>{{ quote.customerEmail }}</small>
                    <small *ngIf="quote.customerCompany">{{
                      quote.customerCompany
                    }}</small>
                  </div>
                </td>
              </ng-container>

              <!-- Producto Column -->
              <ng-container matColumnDef="product">
                <th mat-header-cell *matHeaderCellDef>Producto</th>
                <td mat-cell *matCellDef="let quote">
                  <div class="product-info">
                    <strong>{{ quote.productName }}</strong>
                    <small>{{ quote.quantity }} unidades</small>
                  </div>
                </td>
              </ng-container>

              <!-- Valor Column -->
              <ng-container matColumnDef="value">
                <th mat-header-cell *matHeaderCellDef>Valor</th>
                <td mat-cell *matCellDef="let quote">
                  <div class="value-info">
                    <span class="unit-price"
                      >\${{ quote.unitPrice | number : '1.2-2' }} c/u</span
                    >
                    <strong class="total-price"
                      >\${{ quote.totalCost | number : '1.2-2' }}</strong
                    >
                  </div>
                </td>
              </ng-container>

              <!-- Fechas Column -->
              <ng-container matColumnDef="dates">
                <th mat-header-cell *matHeaderCellDef>Fechas</th>
                <td mat-cell *matCellDef="let quote">
                  <div class="dates-info">
                    <small
                      >Aprobada:
                      {{ quote.responseDate | date : 'dd/MM/yyyy' }}</small
                    >
                    <small
                      [class]="
                        isExpiringSoon(quote.expiryDate) ? 'expiry-warning' : ''
                      "
                      *ngIf="quote.expiryDate"
                    >
                      Expira: {{ quote.expiryDate | date : 'dd/MM/yyyy' }}
                    </small>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr
                mat-row
                *matRowDef="let row; columns: displayedColumns"
                [class]="isExpiringSoon(row.expiryDate) ? 'expiring-row' : ''"
                (click)="convertToSale(row)"
                style="cursor: pointer;"
                matTooltip="Click para convertir a venta"
              ></tr>
            </table>
          </div>

          <ng-template #noApprovedQuotes>
            <div class="no-quotes">
              <mat-icon>point_of_sale</mat-icon>
              <h2>No hay cotizaciones aprobadas</h2>
              <p>
                Las cotizaciones aprobadas aparecerán aquí para ser convertidas
                en ventas.
              </p>
              <a mat-raised-button color="primary" routerLink="/admin/quotes">
                <mat-icon>assignment</mat-icon>
                Ir a Cotizaciones
              </a>
            </div>
          </ng-template>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .sales-dashboard-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 20px;
      }

      .dashboard-header {
        margin-bottom: 32px;

        h1 {
          color: #2e7d32;
          margin-bottom: 8px;
        }
      }

      .stats-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-bottom: 32px;
      }

      .stat-card {
        .stat-content {
          display: flex;
          align-items: center;
          gap: 16px;

          .stat-icon {
            font-size: 48px;
            height: 48px;
            width: 48px;
            color: #4caf50;

            &.revenue {
              color: #2196f3;
            }
            &.pending {
              color: #ff9800;
            }
          }

          .stat-info {
            h3 {
              margin: 0;
              font-size: 2rem;
              color: #333;
            }

            p {
              margin: 4px 0 0 0;
              color: #666;
              font-size: 0.9rem;
            }
          }
        }
      }

      .sales-table {
        width: 100%;
      }

      .quote-id {
        font-weight: 600;
        color: #2e7d32;
      }

      .customer-info,
      .product-info {
        display: flex;
        flex-direction: column;
        gap: 4px;

        strong {
          color: #333;
        }

        small {
          color: #666;
          font-size: 0.8rem;
        }
      }

      .value-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
        text-align: right;

        .unit-price {
          color: #666;
          font-size: 0.8rem;
        }

        .total-price {
          color: #2e7d32;
          font-weight: bold;
          font-size: 1.1rem;
        }
      }

      .dates-info {
        display: flex;
        flex-direction: column;
        gap: 4px;

        small {
          color: #666;
          font-size: 0.8rem;

          &.expiry-warning {
            color: #f44336;
            font-weight: 500;
          }
        }
      }

      .actions-container {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .expiring-row {
        background-color: #fff3e0;
        border-left: 4px solid #ff9800;
      }

      .no-quotes {
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
      }

      @media (max-width: 768px) {
        .stats-cards {
          grid-template-columns: 1fr;
        }

        .actions-container {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class SalesDashboardComponent implements OnInit {
  approvedQuotes: any[] = [];
  isConverting = false;

  displayedColumns: string[] = ['id', 'customer', 'product', 'value', 'dates'];

  constructor(
    private quoteService: QuoteService,
    private saleService: SaleService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadApprovedQuotes();
  }

  private loadApprovedQuotes(): void {
    this.quoteService.getQuotes().subscribe({
      next: (quotes) => {
        this.approvedQuotes = quotes.filter(
          (q: any) =>
            (q.status === 1 || q.status === 'Approved') && q.totalCost > 0
        );
      },
      error: (error) => {
        console.error('Error loading approved quotes:', error);
        this.notificationService.error('Error cargando cotizaciones aprobadas');
      },
    });
  }

  convertToSale(quote: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Convertir a Venta',
        message: `¿Crear venta para la cotización #${quote.id} de ${
          quote.customerName
        } por $${quote.totalCost.toFixed(2)}?`,
        confirmText: 'Crear Venta',
        type: 'info',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isConverting = true;

        this.saleService.createSaleFromQuote(quote.id).subscribe({
          next: (sale) => {
            this.notificationService.success(
              `Venta ${sale.orderNumber} creada exitosamente`
            );
            this.loadApprovedQuotes(); // Recargar la lista
            this.isConverting = false;
          },
          error: (error) => {
            console.error('Error creating sale:', error);
            this.notificationService.error('Error creando la venta');
            this.isConverting = false;
          },
        });
      }
    });
  }

  viewQuoteDetails(quote: any): void {
    // Implementar modal de detalles si es necesario
    console.log('View quote details:', quote);
  }

  getTotalPotentialRevenue(): number {
    return this.approvedQuotes.reduce((sum, quote) => sum + quote.totalCost, 0);
  }

  getExpiringQuotes(): number {
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    return this.approvedQuotes.filter((quote) => {
      if (!quote.expiryDate) return false;
      const expiryDate = new Date(quote.expiryDate);
      return expiryDate <= sevenDaysFromNow;
    }).length;
  }

  isExpiringSoon(expiryDate: Date | string | null): boolean {
    if (!expiryDate) return false;

    const expiry = new Date(expiryDate);
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    return expiry <= sevenDaysFromNow;
  }

  getQuoteStatusText(quote: any): string {
    if (this.isExpiringSoon(quote.expiryDate)) {
      return 'Por Expirar';
    }
    return 'Lista para Venta';
  }
}
