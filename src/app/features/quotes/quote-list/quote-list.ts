// src/app/features/quotes/quote-list/quote-list.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { QuoteService } from '../../../core/services/quote';
import { NotificationService } from '../../../core/services/notification';
import { Quote } from '../../../core/models/quote';
import { QuoteStatus } from '../../../core/models/enums';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-quote-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatMenuModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './quote-list.html',
  styleUrls: ['./quote-list.scss'],
})
export class QuoteListComponent implements OnInit {
  quotes: Quote[] = [];
  filteredQuotes: Quote[] = [];
  isLoading = false;

  displayedColumns: string[] = [
    'id',
    'customer',
    'product',
    'quantity',
    'pricing',
    'status',
    'dates',
    'actions',
  ];

  // Filtros
  statusFilter: string = 'all';
  searchTerm: string = '';

  constructor(
    private quoteService: QuoteService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadQuotes();
  }

  private loadQuotes(): void {
    this.isLoading = true;
    this.quoteService.getQuotes().subscribe({
      next: (quotes) => {
        console.log('Cotizaciones cargadas:', quotes);
        this.quotes = quotes;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading quotes:', error);
        this.notificationService.error('Error cargando las cotizaciones');
        this.isLoading = false;
      },
    });
  }

  applyFilters(): void {
    let filtered = [...this.quotes];

    // Filtrar por estado
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(
        (quote) => this.getStatusKey(quote.status) === this.statusFilter
      );
    }

    // Filtrar por término de búsqueda
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (quote) =>
          quote.customerName.toLowerCase().includes(term) ||
          quote.customerEmail.toLowerCase().includes(term) ||
          quote.productName.toLowerCase().includes(term) ||
          quote.id.toString().includes(term)
      );
    }

    this.filteredQuotes = filtered;
  }

  onStatusFilterChange(status: string): void {
    this.statusFilter = status;
    this.applyFilters();
  }

  onSearchChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.applyFilters();
  }

  getStatusColor(status: string | QuoteStatus): 'primary' | 'accent' | 'warn' {
    const statusKey = this.getStatusKey(status);
    switch (statusKey) {
      case 'approved':
      case 'completed':
        return 'primary';
      case 'pending':
        return 'accent';
      case 'rejected':
        return 'warn';
      default:
        console.warn('Estado desconocido:', status);
        return 'accent';
    }
  }

  getStatusText(status: string | QuoteStatus): string {
    const statusKey = this.getStatusKey(status);
    switch (statusKey) {
      case 'pending':
        return 'Pendiente';
      case 'approved':
        return 'Aprobada';
      case 'rejected':
        return 'Rechazada';
      case 'completed':
        return 'Completada';
      default:
        console.warn('Estado de texto desconocido:', status);
        return String(status) || 'Sin Estado';
    }
  }

  private getStatusKey(status: string | QuoteStatus): string {
    if (!status) {
      console.warn('Estado es null o undefined');
      return 'pending'; // Estado por defecto
    }
    return String(status).toLowerCase();
  }

  // Hacer público el método getStatusKey para usarlo en el template
  public getStatusKeyPublic(status: string | QuoteStatus): string {
    return this.getStatusKey(status);
  }

  // REMOVIDO: viewQuoteDetails() - No queremos mostrar detalles
  // REMOVIDO: deleteQuote() - No queremos permitir eliminar

  approveQuote(quote: Quote): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Aprobar Cotización',
        message: `¿Estás seguro de que deseas aprobar la cotización #${quote.id} de ${quote.customerName}?`,
        confirmText: 'Aprobar',
        type: 'info',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateQuoteStatus(
          quote,
          QuoteStatus.Approved,
          'Cotización aprobada por el administrador'
        );
      }
    });
  }

  rejectQuote(quote: Quote): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Rechazar Cotización',
        message: `¿Estás seguro de que deseas rechazar la cotización #${quote.id} de ${quote.customerName}?`,
        confirmText: 'Rechazar',
        type: 'warning',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateQuoteStatus(
          quote,
          QuoteStatus.Rejected,
          'Cotización rechazada por el administrador'
        );
      }
    });
  }

  approveAndCreateUser(quote: Quote): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Aprobar y Crear Usuario',
        message: `¿Aprobar la cotización #${quote.id} y crear cuenta para ${quote.customerName}? Se enviará un email con credenciales de acceso.`,
        confirmText: 'Aprobar y Crear',
        type: 'info',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.quoteService.approveAndCreateUser(quote.id).subscribe({
          next: () => {
            this.notificationService.success(
              'Cotización aprobada y usuario creado exitosamente'
            );
            this.loadQuotes();
          },
          error: (error) => {
            console.error('Error:', error);
            this.notificationService.error(
              'Error al aprobar cotización y crear usuario'
            );
          },
        });
      }
    });
  }

  updateQuoteStatus(
    quote: Quote,
    newStatus: QuoteStatus,
    adminNotes?: string
  ): void {
    this.quoteService
      .updateQuoteStatus(quote.id, newStatus, adminNotes)
      .subscribe({
        next: (updatedQuote) => {
          // Actualizar la cotización en la lista
          const index = this.quotes.findIndex((q) => q.id === quote.id);
          if (index !== -1) {
            this.quotes[index] = updatedQuote;
            this.applyFilters();
          }

          const statusText = this.getStatusText(newStatus);
          this.notificationService.success(
            `Cotización ${statusText.toLowerCase()} exitosamente`
          );
        },
        error: (error) => {
          console.error('Error updating quote status:', error);
          this.notificationService.error(
            'Error actualizando el estado de la cotización'
          );
        },
      });
  }

  // Métodos para estadísticas
  getPendingCount(): number {
    return this.quotes.filter((q) => this.getStatusKey(q.status) === 'pending')
      .length;
  }

  getApprovedCount(): number {
    return this.quotes.filter((q) =>
      ['approved', 'completed'].includes(this.getStatusKey(q.status))
    ).length;
  }

  getRejectedCount(): number {
    return this.quotes.filter((q) => this.getStatusKey(q.status) === 'rejected')
      .length;
  }

  getCompletedCount(): number {
    return this.quotes.filter(
      (q) => this.getStatusKey(q.status) === 'completed'
    ).length;
  }

  getTotalRevenue(): number {
    return this.quotes
      .filter((q) =>
        ['approved', 'completed'].includes(this.getStatusKey(q.status))
      )
      .reduce((sum, q) => sum + (q.totalCost || 0), 0);
  }

  // Métodos para exportar datos
  exportToCSV(): void {
    const csvData = this.quotes.map((quote) => ({
      ID: quote.id,
      Cliente: quote.customerName,
      Email: quote.customerEmail,
      Producto: quote.productName,
      Cantidad: quote.quantity,
      'Precio Unitario': quote.unitPrice,
      Total: quote.totalCost,
      Estado: this.getStatusText(quote.status),
      'Fecha Solicitud': new Date(quote.requestDate).toLocaleDateString(
        'es-MX'
      ),
      'Fecha Respuesta': quote.responseDate
        ? new Date(quote.responseDate).toLocaleDateString('es-MX')
        : '',
      Notas: quote.notes || '',
      'Notas Admin': quote.adminNotes || '',
    }));

    // Convertir a CSV y descargar
    const csvContent = this.convertToCSV(csvData);
    this.downloadCSV(csvContent, 'cotizaciones.csv');
  }

  private convertToCSV(data: any[]): string {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map((row) =>
        headers.map((header) => `"${row[header] || ''}"`).join(',')
      ),
    ].join('\n');

    return csvContent;
  }

  private downloadCSV(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  // Helper para verificar si una cotización puede ser procesada
  canApprove(quote: Quote): boolean {
    return this.getStatusKey(quote.status) === 'pending';
  }

  canReject(quote: Quote): boolean {
    return this.getStatusKey(quote.status) === 'pending';
  }

  canCreateUser(quote: Quote): boolean {
    return this.getStatusKey(quote.status) === 'pending' && quote.isPublicQuote;
  }

  // Método de debug para verificar estados
  debugQuoteStates(): void {
    console.log('=== DEBUG: Estados de Cotizaciones ===');
    this.quotes.forEach((quote, index) => {
      console.log(`Cotización ${index + 1}:`, {
        id: quote.id,
        status: quote.status,
        statusType: typeof quote.status,
        statusKey: this.getStatusKey(quote.status),
        statusText: this.getStatusText(quote.status),
        canApprove: this.canApprove(quote),
        canReject: this.canReject(quote),
        canCreateUser: this.canCreateUser(quote),
      });
    });
  }
}
