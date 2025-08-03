import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardStats } from '../../core/models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatTableModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Dashboard Administrativo</h1>
        <p>Resumen general del sistema AGROPURE</p>
      </div>

      <div class="stats-grid" *ngIf="stats">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon users">
                <mat-icon>people</mat-icon>
              </div>
              <div class="stat-details">
                <h2>{{ stats.totalUsers }}</h2>
                <p>Usuarios Registrados</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon products">
                <mat-icon>inventory</mat-icon>
              </div>
              <div class="stat-details">
                <h2>{{ stats.totalProducts }}</h2>
                <p>Productos Activos</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon quotes">
                <mat-icon>assignment</mat-icon>
              </div>
              <div class="stat-details">
                <h2>{{ stats.totalQuotes }}</h2>
                <p>Cotizaciones Totales</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon pending">
                <mat-icon>pending</mat-icon>
              </div>
              <div class="stat-details">
                <h2>{{ stats.pendingQuotes }}</h2>
                <p>Cotizaciones Pendientes</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="dashboard-content">
        <div class="recent-quotes">
          <mat-card>
            <mat-card-header>
              <mat-card-title>Cotizaciones Recientes</mat-card-title>
              <mat-card-subtitle>Últimas solicitudes de cotización</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <table mat-table [dataSource]="stats?.recentQuotes || []" *ngIf="stats?.recentQuotes?.length; else noQuotes">
                <ng-container matColumnDef="id">
                  <th mat-header-cell *matHeaderCellDef>ID</th>
                  <td mat-cell *matCellDef="let quote">#{{ quote.id }}</td>
                </ng-container>

                <ng-container matColumnDef="customer">
                  <th mat-header-cell *matHeaderCellDef>Cliente</th>
                  <td mat-cell *matCellDef="let quote">{{ quote.customerName }}</td>
                </ng-container>

                <ng-container matColumnDef="product">
                  <th mat-header-cell *matHeaderCellDef>Producto</th>
                  <td mat-cell *matCellDef="let quote">{{ quote.productName }}</td>
                </ng-container>

                <ng-container matColumnDef="quantity">
                  <th mat-header-cell *matHeaderCellDef>Cantidad</th>
                  <td mat-cell *matCellDef="let quote">{{ quote.quantity }}</td>
                </ng-container>

                <ng-container matColumnDef="total">
                  <th mat-header-cell *matHeaderCellDef>Total</th>
                  <td mat-cell *matCellDef="let quote">${{ quote.totalCost | number:'1.2-2' }}</td>
                </ng-container>

                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>Estado</th>
                  <td mat-cell *matCellDef="let quote">
                    <span class="status-badge" [class]="'status-' + quote.status.toLowerCase()">
                      {{ quote.status }}
                    </span>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>

              <ng-template #noQuotes>
                <div class="no-data">
                  <mat-icon>assignment</mat-icon>
                  <p>No hay cotizaciones recientes</p>
                </div>
              </ng-template>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="top-products" *ngIf="stats?.topProducts?.length">
          <mat-card>
            <mat-card-header>
              <mat-card-title>Productos Más Solicitados</mat-card-title>
              <mat-card-subtitle>Ranking por número de cotizaciones</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="product-ranking">
                <div class="product-item" *ngFor="let product of stats.topProducts; let i = index">
                  <div class="rank">{{ i + 1 }}</div>
                  <div class="product-info">
                    <h3>{{ product.productName }}</h3>
                    <p>{{ product.quotesCount }} cotizaciones</p>
                  </div>
                  <div class="revenue">
                    ${{ product.totalRevenue | number:'1.2-2' }}
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .dashboard-header {
      margin-bottom: 32px;
    }
    .dashboard-header h1 {
      color: #2e7d32;
      margin-bottom: 8px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }
    .stat-card {
      height: 120px;
    }
    .stat-content {
      display: flex;
      align-items: center;
      gap: 16px;
      height: 100%;
    }
    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    .stat-icon.users { background: #4caf50; }
    .stat-icon.products { background: #2196f3; }
    .stat-icon.quotes { background: #ff9800; }
    .stat-icon.pending { background: #f44336; }
    .stat-details h2 {
      margin: 0;
      font-size: 2rem;
      color: #333;
    }
    .stat-details p {
      margin: 4px 0 0 0;
      color: #666;
      font-size: 0.9rem;
    }
    .dashboard-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
    }
    .status-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
    }
    .status-pending { background: #fff3e0; color: #f57c00; }
    .status-approved { background: #e8f5e8; color: #2e7d32; }
    .status-rejected { background: #ffebee; color: #c62828; }
    .status-completed { background: #e3f2fd; color: #1976d2; }
    .no-data {
      text-align: center;
      padding: 32px;
      color: #666;
    }
    .no-data mat-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      margin-bottom: 16px;
    }
    .product-ranking {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .product-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px;
      background: #f5f5f5;
      border-radius: 8px;
    }
    .rank {
      width: 32px;
      height: 32px;
      background: #4caf50;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }
    .product-info {
      flex: 1;
    }
    .product-info h3 {
      margin: 0 0 4px 0;
      font-size: 1rem;
    }
    .product-info p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }
    .revenue {
      font-weight: bold;
      color: #2e7d32;
    }
    @media (max-width: 768px) {
      .dashboard-content {
        grid-template-columns: 1fr;
      }
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  displayedColumns: string[] = ['id', 'customer', 'product', 'quantity', 'total', 'status'];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  private loadStats(): void {
    this.dashboardService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
      }
    });
  }
}
