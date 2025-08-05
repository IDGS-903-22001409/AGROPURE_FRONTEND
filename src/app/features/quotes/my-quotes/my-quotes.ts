import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { QuoteService } from '../../../core/services/quote';
import { AuthService } from '../../../core/services/auth';
import { Quote } from '../../../core/models/quote';

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
  ],
  templateUrl: './my-quotes.html',
  styleUrls: ['./my-quotes.scss'],
})
export class MyQuotesComponent implements OnInit {
  quotes: Quote[] = [];
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
        },
      });
    }
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
}
