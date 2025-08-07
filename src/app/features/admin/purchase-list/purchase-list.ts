// src/app/features/admin/purchase-list/purchase-list.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { PurchaseService, Purchase } from '../../../core/services/purchase';
import { NotificationService } from '../../../core/services/notification';
import { PurchaseFormComponent } from '../purchase-form/purchase-form';

@Component({
  selector: 'app-purchase-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './purchase-list.html',
  styleUrls: ['./purchase-list.scss'],
})
export class PurchaseListComponent implements OnInit {
  purchases: Purchase[] = [];
  displayedColumns: string[] = [
    'purchaseNumber',
    'supplier',
    'material',
    'quantity',
    'unitCost',
    'totalCost',
    'status',
    'date',
    'actions',
  ];

  constructor(
    private purchaseService: PurchaseService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadPurchases();
  }

  private loadPurchases(): void {
    this.purchaseService.getPurchases().subscribe({
      next: (purchases) => {
        this.purchases = purchases;
      },
      error: (error) => {
        console.error('Error loading purchases:', error);
      },
    });
  }

  getStatusColor(status: string): 'primary' | 'accent' | 'warn' {
    switch (status) {
      case 'Entregado':
        return 'primary';
      case 'En Tránsito':
        return 'accent';
      case 'Pendiente':
        return 'warn';
      default:
        return 'accent';
    }
  }

  openPurchaseForm(purchase?: Purchase): void {
    const dialogRef = this.dialog.open(PurchaseFormComponent, {
      width: '600px',
      data: purchase || null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadPurchases();
      }
    });
  }

  editPurchase(purchase: Purchase): void {
    this.openPurchaseForm(purchase);
  }

  deletePurchase(purchase: Purchase): void {
    if (confirm(`¿Eliminar compra ${purchase.purchaseNumber}?`)) {
      this.purchaseService.deletePurchase(purchase.id).subscribe({
        next: () => {
          this.purchases = this.purchases.filter((p) => p.id !== purchase.id);
          this.notificationService.success('Compra eliminada exitosamente');
        },
      });
    }
  }
}
