import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { SupplierService } from '../../../core/services/supplier.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Supplier } from '../../../core/models/supplier.model';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
  ],
  template: `
    <div class="supplier-list-container">
      <div class="list-header">
        <h1>Gestión de Proveedores</h1>
        <p>Administra la información de proveedores</p>
        <button mat-raised-button color="primary" (click)="openSupplierForm()">
          <mat-icon>add</mat-icon>
          Nuevo Proveedor
        </button>
      </div>

      <mat-card *ngIf="suppliers.length > 0; else noSuppliers">
        <mat-card-content>
          <table mat-table [dataSource]="suppliers" class="suppliers-table">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let supplier">{{ supplier.id }}</td>
            </ng-container>

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Empresa</th>
              <td mat-cell *matCellDef="let supplier">{{ supplier.name }}</td>
            </ng-container>

            <ng-container matColumnDef="contact">
              <th mat-header-cell *matHeaderCellDef>Contacto</th>
              <td mat-cell *matCellDef="let supplier">
                <div>
                  <strong>{{ supplier.contactPerson }}</strong
                  ><br />
                  <small>{{ supplier.email }}</small
                  ><br />
                  <small>{{ supplier.phone }}</small>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="address">
              <th mat-header-cell *matHeaderCellDef>Dirección</th>
              <td mat-cell *matCellDef="let supplier">
                {{ supplier.address }}
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let supplier">
                <mat-chip
                  [color]="supplier.isActive ? 'primary' : 'warn'"
                  selected
                >
                  {{ supplier.isActive ? 'Activo' : 'Inactivo' }}
                </mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let supplier">
                <button
                  mat-icon-button
                  color="primary"
                  (click)="editSupplier(supplier)"
                >
                  <mat-icon>edit</mat-icon>
                </button>
                <button
                  mat-icon-button
                  color="warn"
                  (click)="deleteSupplier(supplier)"
                >
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>
        </mat-card-content>
      </mat-card>

      <ng-template #noSuppliers>
        <mat-card>
          <mat-card-content>
            <div class="no-suppliers">
              <mat-icon>local_shipping</mat-icon>
              <h2>No hay proveedores registrados</h2>
              <p>
                Agrega proveedores para gestionar el suministro de materiales.
              </p>
              <button
                mat-raised-button
                color="primary"
                (click)="openSupplierForm()"
              >
                <mat-icon>add</mat-icon>
                Agregar Primer Proveedor
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .supplier-list-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }
      .list-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 32px;
        flex-wrap: wrap;
        gap: 16px;
      }
      .list-header h1 {
        color: #2e7d32;
        margin: 0;
      }
      .suppliers-table {
        width: 100%;
      }
      .no-suppliers {
        text-align: center;
        padding: 64px 32px;
      }
      .no-suppliers mat-icon {
        font-size: 64px;
        height: 64px;
        width: 64px;
        color: #ccc;
        margin-bottom: 24px;
      }
      .no-suppliers h2 {
        color: #666;
        margin-bottom: 16px;
      }
    `,
  ],
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
    // Aquí se abriría un diálogo para crear/editar proveedor
    this.notificationService.info('Función de formulario en desarrollo');
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
