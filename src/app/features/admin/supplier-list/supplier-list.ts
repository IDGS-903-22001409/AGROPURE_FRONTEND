// src/app/features/admin/supplier-list/supplier-list.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { SupplierService } from '../../../core/services/supplier';
import { NotificationService } from '../../../core/services/notification';
import { Supplier } from '../../../core/models/supplier';
import { SupplierFormComponent } from '../supplier-form/supplier-form';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './supplier-list.html',
  styleUrls: ['./supplier-list.scss'],
})
export class SupplierListComponent implements OnInit {
  suppliers: Supplier[] = [];
  displayedColumns: string[] = [
    'id',
    'name',
    'contact',
    'address',
    'status',
    'actions',
  ];

  constructor(
    private supplierService: SupplierService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  private loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe({
      next: (suppliers) => {
        this.suppliers = suppliers;
      },
      error: (error) => {
        console.error('Error loading suppliers:', error);
      },
    });
  }

  openSupplierForm(supplier?: Supplier): void {
    const dialogRef = this.dialog.open(SupplierFormComponent, {
      width: '600px',
      data: supplier || null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadSuppliers();
      }
    });
  }

  editSupplier(supplier: Supplier): void {
    this.openSupplierForm(supplier);
  }

  deleteSupplier(supplier: Supplier): void {
    if (confirm(`¿Eliminar proveedor ${supplier.name}?`)) {
      this.supplierService.deleteSupplier(supplier.id).subscribe({
        next: () => {
          this.suppliers = this.suppliers.filter((s) => s.id !== supplier.id);
          this.notificationService.success('Proveedor eliminado exitosamente');
        },
      });
    }
  }
}
