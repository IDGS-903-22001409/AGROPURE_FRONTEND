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
  isLoading = false; // CAMBIO: Empezar en false para evitar loading infinito
  hasError = false;
  errorMessage = '';
  currentUserId: number | null = null;

  private subscriptions: Subscription[] = [];

  displayedColumns: string[] = [
    'id',
    'product',
    'quantity',
    'unitPrice',
    'total', // CAMBIO: Quitar 'discount' porque no existe en el modelo
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
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private loadUserQuotes(): void {
    try {
      // CAMBIO: Inicializar estado correctamente
      this.isLoading = true;
      this.hasError = false;
      this.errorMessage = '';

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
            console.log('MyQuotesComponent: Respuesta cruda:', quotes);

            // CAMBIO: Validar que quotes sea un array
            if (Array.isArray(quotes)) {
              this.quotes = quotes;
              console.log(
                `MyQuotesComponent: Se cargaron ${this.quotes.length} cotizaciones`
              );
            } else {
              console.error(
                'MyQuotesComponent: La respuesta no es un array:',
                quotes
              );
              this.quotes = [];
              this.hasError = true;
              this.errorMessage = 'Error en formato de datos recibidos';
            }

            this.isLoading = false;
            this.hasError = false;
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
            this.quotes = []; // CAMBIO: Limpiar quotes en caso de error

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
      this.quotes = [];
    }
  }

  reloadQuotes(): void {
    console.log('MyQuotesComponent: Recargando cotizaciones manualmente...');
    this.loadUserQuotes();
  }

  getStatusColor(status: string): 'primary' | 'accent' | 'warn' {
    // CAMBIO: Manejar diferentes formatos de status
    const statusStr = typeof status === 'string' ? status : String(status);
    switch (statusStr.toLowerCase()) {
      case 'approved':
      case 'completed':
        return 'primary';
      case 'pending':
        return 'accent';
      case 'rejected':
        return 'warn';
      default:
        return 'accent';
    }
  }

  getStatusText(status: string): string {
    // CAMBIO: Manejar diferentes formatos de status
    const statusStr = typeof status === 'string' ? status : String(status);
    switch (statusStr.toLowerCase()) {
      case 'pending':
        return 'Pendiente';
      case 'approved':
        return 'Aprobada';
      case 'rejected':
        return 'Rechazada';
      case 'completed':
        return 'Completada';
      default:
        return statusStr;
    }
  }

  getPendingCount(): number {
    return this.quotes.filter((q) => {
      const status = typeof q.status === 'string' ? q.status : String(q.status);
      return status.toLowerCase() === 'pending';
    }).length;
  }

  getApprovedCount(): number {
    return this.quotes.filter((q) => {
      const status = typeof q.status === 'string' ? q.status : String(q.status);
      return ['approved', 'completed'].includes(status.toLowerCase());
    }).length;
  }

  getTotalValue(): number {
    return this.quotes
      .filter((q) => {
        const status =
          typeof q.status === 'string' ? q.status : String(q.status);
        return ['approved', 'completed'].includes(status.toLowerCase());
      })
      .reduce((sum, q) => sum + (q.totalCost || 0), 0);
  }

  // CAMBIO: Simplificar cálculo de descuento
  getDiscount(quote: Quote): number {
    if (!quote.unitPrice || !quote.quantity || !quote.totalCost) {
      return 0;
    }
    const baseTotal = quote.unitPrice * quote.quantity;
    return Math.max(0, baseTotal - quote.totalCost);
  }

  // CAMBIO: Método para debug - eliminar en producción
  debugInfo(): void {
    console.log('=== DEBUG INFO ===');
    console.log('isLoading:', this.isLoading);
    console.log('hasError:', this.hasError);
    console.log('quotes:', this.quotes);
    console.log('quotes length:', this.quotes.length);
    console.log('currentUserId:', this.currentUserId);
  }
}
