import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { QuoteService } from '../../../core/services/quote.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Quote, QuoteStatus } from '../../../core/models/quote.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-quote-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatChipsModule, MatMenuModule],
  template: `
    <div class="quote-list-container">
      <div class="list-header">
        <h1>Gestión de Cotizaciones</h1>
        <p>Administra todas las cotizaciones del sistema</p>
      </div>

      <mat-card *ngIf="quotes.length > 0; else noQuotes">
        <mat-card-content>
          <table mat-table [dataSource]="quotes" class="quotes-table">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let quote">#{{ quote.id }}</td>
            </ng-container>

            <ng-container matColumnDef="customer">
              <th mat-header-cell *matHeaderCellDef>Cliente</th>
              <td mat-cell *matCellDef="let quote">
                <div>
                  <strong>{{ quote.customerName }}</strong><br>
                  <small>{{ quote.customerEmail }}</small>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="product">
              <th mat-header-cell *matHeaderCellDef>Producto</th>
              <td mat-cell *matCellDef="let quote">{{ quote.productName }}</td>
            </ng-container>

            <ng-container matColumnDef="quantity">
              <th mat-header-cell *matHeaderCellDef>Cantidad</th>
              <td mat-cell *matCellDef="let quote">{{ quote.quantity }}</td>
            </ng-container>

            <ng-container matColumnDef="pricing">
              <th mat-header-cell *matHeaderCellDef>Precios</th>
              <td mat-cell *matCellDef="let quote">
                <div class="pricing-info">
                  <div>Unitario: ${{ quote.unitPrice | number:'1.2-2' }}</div>
                  <div *ngIf="quote.discount > 0" class="discount">
                    Descuento: -${{ quote.discount | number:'1.2-2' }}
                  </div>
                  <div class="total">Total: ${{ quote.totalCost | number:'1.2-2' }}</div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let quote">
                <mat-chip [color]="getStatusColor(quote.status)" selected>
                  {{ getStatusText(quote.status) }}
                </mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="dates">
              <th mat-header-cell *matHeaderCellDef>Fechas</th>
              <td mat-cell *matCellDef="let quote">
                <div class="dates-info">
                  <div>Creada: {{ quote.createdAt | date:'dd/MM/yyyy' }}</div>
                  <div *ngIf="quote.updatedAt !== quote.createdAt">
                    Actualizada: {{ quote.updatedAt | date:'dd/MM/yyyy' }}
                  </div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let quote">
                <button mat-icon-button [matMenuTriggerFor]="actionsMenu">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #actionsMenu="matMenu">
                  <button mat-menu-item 
                          (click)="updateQuoteStatus(quote, 'Approved')"
                          *ngIf="quote.status === 'Pending'">
                    <mat-icon color="primary">check</mat-icon>
                    <span>Aprobar</span>
                  </button>
                  <button mat-menu-item 
                          (click)="updateQuoteStatus(quote, 'Rejected')"
                          *ngIf="quote.status === 'Pending'">
                    <mat-icon color="warn">close</mat-icon>
                    <span>Rechazar</span>
                  </button>
                  <button mat-menu-item 
                          (click)="updateQuoteStatus(quote, 'Completed')"
                          *ngIf="quote.status === 'Approved'">
                    <mat-icon color="accent">done_all</mat-icon>
                    <span>Marcar Completada</span>
                  </button>
                  <mat-divider></mat-divider>
                  <button mat-menu-item (click)="deleteQuote(quote)">
                    <mat-icon color="warn">delete</mat-icon>
                    <span>Eliminar</span>
                  </button>
                </mat-menu>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                [class]="'quote-row quote-' + row.status.toLowerCase()"></tr>
          </table>
        </mat-card-content>
      </mat-card>

      <ng-template #noQuotes>
        <mat-card>
          <mat-card-content>
            <div class="no-quotes">
              <mat-icon>assignment</mat-icon>
              <h2>No hay cotizaciones</h2>
              <p>Las cotizaciones aparecerán aquí cuando los clientes las soliciten.</p>
            </div>
          </mat-card-content>
        </mat-card>
      </ng-template>

      <!-- Statistics Cards -->
      <div class="stats-grid" *ngIf="quotes.length > 0">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon pending">pending</mat-icon>
              <div>
                <h3>{{ getPendingCount() }}</h3>
                <p>Pendientes</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon approved">check_circle</mat-icon>
              <div>
                <h3>{{ getApprovedCount() }}</h3>
                <p>Aprobadas</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon revenue">attach_money</mat-icon>
              <div>
                <h3>${{ getTotalRevenue() | number:'1.2-2' }}</h3>
                <p>Ingresos Potenciales</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon completed">done_all</mat-icon>
              <div>
                <h3>{{ getCompletedCount() }}</h3>
                <p>Completadas</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .quote-list-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
    }
    .list-header {
      margin-bottom: 32px;
    }
    .list-header h1 {
      color: #2e7d32;
      margin-bottom: 8px;
    }
    .quotes-table {
      width: 100%;
    }
    .quote-row {
      transition: background-color 0.2s;
    }
    .quote-row:hover {
      background-color: #f5f5f5;
    }
    .quote-pending { border-left: 4px solid #ff9800; }
    .quote-approved { border-left: 4px solid #4caf50; }
    .quote-rejected { border-left: 4px solid #f44336; }
    .quote-completed { border-left: 4px solid #2196f3; }
    .pricing-info, .dates-info {
      font-size: 0.9rem;
      line-height: 1.4;
    }
    .pricing-info .discount {
      color: #4caf50;
      font-weight: 500;
    }
    .pricing-info .total {
      font-weight: bold;
      color: #2e7d32;
    }
    .dates-info div {
      margin-bottom: 2px;
    }
    .no-quotes {
      text-align: center;
      padding: 64px 32px;
    }
    .no-quotes mat-icon {
      font-size: 64px;
      height: 64px;
      width: 64px;
      color: #ccc;
      margin-bottom: 24px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
      margin-top: 32px;
    }
    .stat-card {
      height: 100px;
    }
    .stat-content {
      display: flex;
      align-items: center;
      gap: 16px;
      height: 100%;
    }
    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    .stat-icon.pending { background: #ff9800; }
    .stat-icon.approved { background: #4caf50; }
    .stat-icon.revenue { background: #2196f3; }
    .stat-icon.completed { background: #9c27b0; }
    .stat-content h3 {
      margin: 0;
      font-size: 1.5rem;
      color: #333;
    }
    .stat-content p {
      margin: 4px 0 0 0;
      color: #666;
      font-size: 0.9rem;
    }
    @media (max-width: 768px) {
      .quotes-table {
        font-size: 0.8rem;
      }
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class QuoteListComponent implements OnInit {
  quotes: Quote[] = [];
  displayedColumns: string[] = ['id', 'customer', 'product', 'quantity', 'pricing', 'status', 'dates', 'actions'];

  constructor(
    private quoteService: QuoteService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadQuotes();
  }

  private loadQuotes(): void {
    this.quoteService.getQuotes().subscribe({
      next: (quotes) => {
        this.quotes = quotes;
      },
      error: (error) => {
        console.error('Error loading quotes:', error);
      }
    });
  }

  getStatusColor(status: string): 'primary' | 'accent' | 'warn' {
    switch (status) {
      case 'Approved': case 'Completed': return 'primary';
      case 'Pending': return 'accent';
      case 'Rejected': return 'warn';
      default: return 'accent';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'Pending': return 'Pendiente';
      case 'Approved': return 'Aprobada';
      case 'Rejected': return 'Rechazada';
      case 'Completed': return 'Completada';
      default: return status;
    }
  }

  updateQuoteStatus(quote: Quote, newStatus: QuoteStatus): void {
    const statusText = this.getStatusText(newStatus);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: `Cambiar Estado de Cotización`,
        message: `¿Cambiar el estado de la cotización #${quote.id} a "${statusText}"?`,
        confirmText: 'Cambiar Estado',
        type: 'info'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.quoteService.updateQuoteStatus(quote.id, newStatus).subscribe({
          next: (updatedQuote) => {
            const index = this.quotes.findIndex(q => q.id === quote.id);
            if (index !== -1) {
              this.quotes[index] = updatedQuote;
            }
            this.notificationService.success(`Estado actualizado a ${statusText}`);
          }
        });
      }
    });
  }

  deleteQuote(quote: Quote): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar Cotización',
        message: `¿Estás seguro de que deseas eliminar la cotización #${quote.id}? Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar',
        type: 'danger'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.quoteService.deleteQuote(quote.id).subscribe({
          next: () => {
            this.quotes = this.quotes.filter(q => q.id !== quote.id);
            this.notificationService.success('Cotización eliminada exitosamente');
          }
        });
      }
    });
  }

  getPendingCount(): number {
    return this.quotes.filter(q => q.status === 'Pending').length;
  }

  getApprovedCount(): number {
    return this.quotes.filter(q => q.status === 'Approved').length;
  }

  getCompletedCount(): number {
    return this.quotes.filter(q => q.status === 'Completed').length;
  }

  getTotalRevenue(): number {
    return this.quotes
      .filter(q => q.status === 'Approved' || q.status === 'Completed')
      .reduce((sum, q) => sum + q.totalCost, 0);
  }
}
