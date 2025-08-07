import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { QuoteService } from '../../../core/services/quote';
import { AuthService } from '../../../core/services/auth';
import { NotificationService } from '../../../core/services/notification';
import { Quote } from '../../../core/models/quote';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-quotes',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './my-quotes.html',
  styleUrls: ['./my-quotes.scss'],
})
export class MyQuotesComponent implements OnInit, OnDestroy {
  quotes: Quote[] = [];
  isLoading = true;
  hasError = false;
  errorMessage = '';
  currentUserId: number | null = null;

  private subscriptions: Subscription[] = [];

  displayedColumns: string[] = [
    'id',
    'product',
    'quantity',
    'unitPrice',
    'discount',
    'total',
    'status',
    'date',
  ];

  constructor(
    private quoteService: QuoteService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    console.log('MyQuotesComponent: Inicializando...');
    this.loadUserQuotes();
  }

  ngOnDestroy(): void {
    // Limpiar suscripciones para evitar memory leaks
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private loadUserQuotes(): void {
    try {
      this.isLoading = true;
      this.hasError = false;

      const currentUser = this.authService.getCurrentUser();
      console.log('MyQuotesComponent: Usuario actual:', currentUser);

      if (!currentUser) {
        console.error('MyQuotesComponent: No hay usuario logueado');
        this.hasError = true;
        this.errorMessage = 'No hay usuario logueado';
        this.isLoading = false;
        return;
      }

      this.currentUserId = currentUser.id;
      console.log(
        'MyQuotesComponent: Cargando cotizaciones para usuario ID:',
        this.currentUserId
      );

      const subscription = this.quoteService
        .getUserQuotes(currentUser.id)
        .subscribe({
          next: (quotes) => {
            console.log('MyQuotesComponent: Cotizaciones recibidas:', quotes);
            this.quotes = quotes || [];
            this.isLoading = false;
            this.hasError = false;

            if (this.quotes.length === 0) {
              console.log('MyQuotesComponent: No se encontraron cotizaciones');
            } else {
              console.log(
                `MyQuotesComponent: Se cargaron ${this.quotes.length} cotizaciones`
              );
            }
          },
          error: (error) => {
            console.error(
              'MyQuotesComponent: Error cargando cotizaciones:',
              error
            );
            this.hasError = true;
            this.errorMessage =
              error.message || 'Error cargando las cotizaciones';
            this.isLoading = false;

            // Mostrar notificación de error
            this.notificationService.error('Error cargando tus cotizaciones');
          },
        });

      this.subscriptions.push(subscription);
    } catch (error) {
      console.error('MyQuotesComponent: Error inesperado:', error);
      this.hasError = true;
      this.errorMessage = 'Error inesperado al cargar cotizaciones';
      this.isLoading = false;
    }
  }

  // Método para recargar manualmente
  reloadQuotes(): void {
    console.log('MyQuotesComponent: Recargando cotizaciones manualmente...');
    this.loadUserQuotes();
  }

  getStatusColor(status: string): 'primary' | 'accent' | 'warn' {
    switch (status) {
      case 'Approved':
      case 'Completed':
        return 'primary';
      case 'Pending':
        return 'accent';
      case 'Rejected':
        return 'warn';
      default:
        return 'accent';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'Pending':
        return 'Pendiente';
      case 'Approved':
        return 'Aprobada';
      case 'Rejected':
        return 'Rechazada';
      case 'Completed':
        return 'Completada';
      default:
        return status;
    }
  }

  getPendingCount(): number {
    return this.quotes.filter((q) => q.status === 'Pending').length;
  }

  getApprovedCount(): number {
    return this.quotes.filter(
      (q) => q.status === 'Approved' || q.status === 'Completed'
    ).length;
  }

  getTotalValue(): number {
    return this.quotes
      .filter((q) => q.status === 'Approved' || q.status === 'Completed')
      .reduce((sum, q) => sum + q.totalCost, 0);
  }

  // Calcular descuento para mostrar
  getDiscount(quote: Quote): number {
    const baseTotal = quote.unitPrice * quote.quantity;
    return baseTotal - quote.totalCost;
  }
}
