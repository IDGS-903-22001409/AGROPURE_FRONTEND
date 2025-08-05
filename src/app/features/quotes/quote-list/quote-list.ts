import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
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
  ],
  templateUrl: './quote-list.html',
  styleUrls: ['./quote-list.scss'],
})
export class QuoteListComponent implements OnInit {
  quotes: Quote[] = [];
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
      },
    });
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

  updateQuoteStatus(quote: Quote, newStatus: string): void {
    this.quoteService
      .updateQuoteStatus(quote.id, newStatus as QuoteStatus)
      .subscribe({
        next: (updatedQuote) => {
          const index = this.quotes.findIndex((q) => q.id === quote.id);
          if (index !== -1) {
            this.quotes[index] = updatedQuote;
          }
          this.notificationService.success(`Estado actualizado`);
        },
      });
  }

  deleteQuote(quote: Quote): void {
    if (confirm('¿Eliminar cotización?')) {
      this.quoteService.deleteQuote(quote.id).subscribe({
        next: () => {
          this.quotes = this.quotes.filter((q) => q.id !== quote.id);
          this.notificationService.success('Cotización eliminada');
        },
      });
    }
  }

  getPendingCount(): number {
    return this.quotes.filter((q) => q.status === 'Pending').length;
  }

  getApprovedCount(): number {
    return this.quotes.filter((q) => q.status === 'Approved').length;
  }

  getCompletedCount(): number {
    return this.quotes.filter((q) => q.status === 'Completed').length;
  }

  getTotalRevenue(): number {
    return this.quotes
      .filter((q) => q.status === 'Approved' || q.status === 'Completed')
      .reduce((sum, q) => sum + q.totalCost, 0);
  }
}
