import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PurchaseService, Inventory } from '../../../core/services/purchase';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './inventory.html',
  styleUrls: ['./inventory.scss'],
})
export class InventoryComponent implements OnInit {
  inventory: Inventory[] = [];
  displayedColumns: string[] = [
    'materialName',
    'totalQuantity',
    'averageCost',
    'totalValue',
    'lastPurchaseDate',
    'status',
  ];

  constructor(private purchaseService: PurchaseService) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  private loadInventory(): void {
    this.purchaseService.getInventory().subscribe({
      next: (inventory) => {
        this.inventory = inventory;
      },
      error: (error) => {
        console.error('Error loading inventory:', error);
      },
    });
  }

  getTotalInventoryValue(): number {
    return this.inventory.reduce((total, item) => total + item.totalValue, 0);
  }

  getStockStatus(quantity: number): string {
    if (quantity < 10) return 'stock-low';
    if (quantity < 50) return 'stock-medium';
    return 'stock-good';
  }

  getStockStatusText(quantity: number): string {
    if (quantity < 10) return 'Stock Bajo';
    if (quantity < 50) return 'Stock Medio';
    return 'Stock Bueno';
  }
}
