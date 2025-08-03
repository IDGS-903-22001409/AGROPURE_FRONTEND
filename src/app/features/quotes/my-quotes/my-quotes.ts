import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { QuoteService } from '../../../core/services/quote.service';
import { AuthService } from '../../../core/services/auth.service';
import { Quote } from '../../../core/models/quote.model';

@Component({
  selector: 'app-my-quotes',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatChipsModule],
  template: `
    <div class="my-quotes-container">
      <div class="quotes-header">
        <h1>Mis Cotizaciones</h1>
        <p>Historial de todas tus solicitudes de cotización</p>
        <a mat-raised-button color="primary" routerLink="/quotes">
          <mat-icon>add</mat-icon>
          Nueva Cotización
        </a>
      </div>

      <mat-card *ngIf="quotes.length > 0; else noQuotes">
        <mat-card-content>
          <table mat-table [dataSource]="quotes" class="quotes-table">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let quote">#{{ quote.id }}</td>
            </ng-container>

            <ng-container matColumnDef="product">
              <th mat-header-cell *matHeaderCellDef>Producto</th>
              <td mat-cell *matCellDef="let quote">{{ quote.productName }}</td>
            </ng-container>

            <ng-container matColumnDef="quantity">
              <th mat-header-cell *matHeaderCellDef>Cantidad</th>
              <td mat-cell *matCellDef="let quote">{{ quote.quantity }} unidades</td>
            </ng-container>

            <ng-container matColumnDef="unitPrice">
              <th mat-header-cell *matHeaderCellDef>Precio Unitario</th>
              <td mat-cell *matCellDef="let quote">${{ quote.unitPrice | number:'1.2-2' }}</td>
            </ng-container>

            <ng-container matColumnDef="discount">
              <th mat-header-cell *matHeaderCellDef>Descuento</th>
              <td mat-cell *matCellDef="let quote">
                <span *ngIf="quote.discount > 0" class="discount">
                  -${{ quote.discount | number:'1.2-2' }}
                </span>
                <span *ngIf="quote.discount === 0">-</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="total">
              <th mat-header-cell *matHeaderCellDef>Total</th>
              <td mat-cell *matCellDef="let quote">
                <strong>${{ quote.totalCost | number:'1.2-2' }}</strong>
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

            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>Fecha</th>
              <td mat-cell *matCellDef="let quote">{{ quote.createdAt | date:'dd/MM/yyyy' }}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let quote">
                <button mat-icon-button [matMenuTriggerFor]="actionsMenu">
                  <mat-icon>more_vert</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                [class]="'quote-row quote-' + row.status.toLowerCase()"></tr>
          </table>
        </mat-card-content>
      </mat-card>

      <ng-template #noQuotes>
        <mat-card class="no-quotes-card">
          <mat-card-content>
            <div class="no-quotes">
              <mat-icon>assignment</mat-icon>
              <h2>No tienes cotizaciones</h2>
              <p>Solicita tu primera cotización para empezar a usar AGROPURE</p>
              <a mat-raised-button color="primary" routerLink="/quotes">
                <mat-icon>add</mat-icon>
                Solicitar Primera Cotización
              </a>
            </div>
          </mat-card-content>
        </mat-card>
      </ng-template>

      <!-- Summary Cards -->
      <div class="summary-cards" *ngIf="quotes.length > 0">
        <mat-card class="summary-card">
          <mat-card-content>
            <div class="summary-content">
              <mat-icon class="summary-icon pending">pending</mat-icon>
              <div>
                <h3>{{ getPendingCount() }}</h3>
                <p>Pendientes</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="summary-card">
          <mat-card-content>
            <div class="summary-content">
              <mat-icon class="summary-icon approved">check_circle</mat-icon>
              <div>
                <h3>{{ getApprovedCount() }}</h3>
                <p>Aprobadas</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="summary-card">
          <mat-card-content>
            <div class="summary-content">
              <mat-icon class="summary-icon total">attach_money</mat-icon>
              <div>
                <h3>${{ getTotalValue() | number:'1.2-2' }}</h3>
                <p>Valor Total</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .my-quotes-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    .quotes-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
      flex-wrap: wrap;
      gap: 16px;
    }
    .quotes-header h1 {
      color: #2e7d32;
      margin: 0;
    }
    .quotes-header p {
      margin: 4px 0 0 0;
      color: #666;
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
    .quote-pending {
      border-left: 4px solid #ff9800;
    }
    .quote-approved {
      border-left: 4px solid #4caf50;
    }
    .quote-rejected {
      border-left: 4px solid #f44336;
    }
    .quote-completed {
      border-left: 4px solid #2196f3;
    }
    .discount {
      color: #4caf50;
      font-weight: 500;
    }
    .no-quotes-card {
      margin-top: 32px;
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
    .no-quotes h2 {
      color: #666;
      margin-bottom: 16px;
    }
    .no-quotes p {
      color: #999;
      margin-bottom: 32px;
    }
    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
      margin-top: 32px;
    }
    .summary-card {
      height: 100px;
    }
    .summary-content {
      display: flex;
      align-items: center;
      gap: 16px;
      height: 100%;
    }
    .summary-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    .summary-icon.pending { background: #ff9800; }
    .summary-icon.approved { background: #4caf50; }
    .summary-icon.total { background: #2196f3; }
    .summary-content h3 {
      margin: 0;
      font-size: 1.5rem;
      color: #333;
    }
    .summary-content p {
      margin: 4px 0 0 0;
      color: #666;
      font-size: 0.9rem;
    }
    @media (max-width: 768px) {
      .quotes-header {
        flex-direction: column;
        align-items: stretch;
      }
      .quotes-table {
        font-size: 0.8rem;
      }
      .summary-cards {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MyQuotesComponent implements OnInit {
  quotes: Quote[] = [];
  displayedColumns: string[] = ['id', 'product', 'quantity', 'unitPrice', 'discount', 'total', 'status', 'date'];

  constructor(
    private quoteService: QuoteService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserQuotes();
  }

  private loadUserQuotes(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.quoteService.getUserQuotes(currentUser.id).subscribe({
        next: (quotes) => {
          this.quotes = quotes;
        },
        error: (error) => {
          console.error('Error loading user quotes:', error);
        }
      });
    }
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

  getPendingCount(): number {
    return this.quotes.filter(q => q.status === 'Pending').length;
  }

  getApprovedCount(): number {
    return this.quotes.filter(q => q.status === 'Approved' || q.status === 'Completed').length;
  }

  getTotalValue(): number {
    return this.quotes
      .filter(q => q.status === 'Approved' || q.status === 'Completed')
      .reduce((sum, q) => sum + q.totalCost, 0);
  }
}
