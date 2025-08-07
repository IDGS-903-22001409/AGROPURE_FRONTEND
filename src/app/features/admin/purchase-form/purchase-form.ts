import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { PurchaseService, Purchase, CreatePurchase } from '../../../core/services/purchase';
import { MaterialService } from '../../../core/services/material';
import { SupplierService } from '../../../core/services/supplier';
import { NotificationService } from '../../../core/services/notification';
import { Material } from '../../../core/models/material';
import { Supplier } from '../../../core/models/supplier';

@Component({
  selector: 'app-purchase-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  template: `
    <div class="purchase-form">
      <h2 mat-dialog-title>{{ data ? 'Editar Compra' : 'Nueva Compra' }}</h2>
      
      <mat-dialog-content>
        <form [formGroup]="purchaseForm">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Proveedor</mat-label>
            <mat-select formControlName="supplierId" required (selectionChange)="onSupplierChange($event.value)">
              <mat-option *ngFor="let supplier of suppliers" [value]="supplier.id">
                {{ supplier.name }}
              </mat-option>
            </mat-select>
            <mat-error *ngIf="purchaseForm.get('supplierId')?.hasError('required')">
              El proveedor es requerido
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Material</mat-label>
            <mat-select formControlName="materialId" required (selectionChange)="onMaterialChange($event.value)">
              <mat-option *ngFor="let material of filteredMaterials" [value]="material.id">
                {{ material.name }} - ${{ material.unitCost | number:'1.2-2' }} / {{ material.unit }}
              </mat-option>
            </mat-select>
            <mat-error *ngIf="purchaseForm.get('materialId')?.hasError('required')">
              El material es requerido
            </mat-error>
          </mat-form-field>

          <div class="form-row">
            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Cantidad</mat-label>
              <input matInput type="number" step="0.01" formControlName="quantity" required (input)="calculateTotal()" />
              <mat-error *ngIf="purchaseForm.get('quantity')?.hasError('required')">
                La cantidad es requerida
              </mat-error>
              <mat-error *ngIf="purchaseForm.get('quantity')?.hasError('min')">
                La cantidad debe ser mayor a 0
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Costo Unitario</mat-label>
              <input matInput type="number" step="0.01" formControlName="unitCost" required (input)="calculateTotal()" />
              <span matPrefix>$</span>
              <mat-error *ngIf="purchaseForm.get('unitCost')?.hasError('required')">
                El costo es requerido
              </mat-error>
              <mat-error *ngIf="purchaseForm.get('unitCost')?.hasError('min')">
                El costo debe ser mayor a 0
              </mat-error>
            </mat-form-field>
          </div>

          <div class="total-display" *ngIf="totalCost > 0">
            <h3>Total: ${{ totalCost | number:'1.2-2' }}</h3>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Fecha de Entrega</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="deliveryDate" />
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Notas</mat-label>
            <textarea matInput formControlName="notes" rows="3"></textarea>
          </mat-form-field>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions>
        <button mat-button (click)="onCancel()">Cancelar</button>
        <button 
          mat-raised-button 
          color="primary" 
          (click)="onSubmit()" 
          [disabled]="purchaseForm.invalid || isLoading">
          {{ isLoading ? 'Guardando...' : (data ? 'Actualizar' : 'Crear') }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .purchase-form {
      min-width: 600px;
    }
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }
    .half-width {
      flex: 1;
    }
    .total-display {
      background: #e8f5e8;
      padding: 16px;
      border-radius: 8px;
      margin: 16px 0;
      text-align: center;
    }
    .total-display h3 {
      margin: 0;
      color: #2e7d32;
    }
    mat-dialog-actions {
      justify-content: flex-end;
      gap: 12px;
    }
  `]
})
export class PurchaseFormComponent implements OnInit {
  purchaseForm: FormGroup;
  suppliers: Supplier[] = [];
  materials: Material[] = [];
  filteredMaterials: Material[] = [];
  totalCost: number = 0;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private purchaseService: PurchaseService,
    private materialService: MaterialService,
    private supplierService: SupplierService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<PurchaseFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Purchase | null
  ) {
    this.purchaseForm = this.fb.group({
      supplierId: ['', Validators.required],
      materialId: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(0.01)]],
      unitCost: [0, [Validators.required, Validators.min(0.01)]],
      deliveryDate: [''],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadSuppliers();
    this.loadMaterials();
    
    if (this.data) {
      this.purchaseForm.patchValue({
        supplierId: this.data.supplierId,
        materialId: this.data.materialId,
        quantity: this.data.quantity,
        unitCost: this.data.unitCost,
        deliveryDate: this.data.deliveryDate,
        notes: this.data.notes
      });
      this.calculateTotal();
    }
  }

  private loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe({
      next: (suppliers) => {
        this.suppliers = suppliers;
      }
    });
  }

  private loadMaterials(): void {
    this.materialService.getMaterials().subscribe({
      next: (materials) => {
        this.materials = materials;
        this.filteredMaterials = materials;
      }
    });
  }

  onSupplierChange(supplierId: number): void {
    this.filteredMaterials = this.materials.filter(m => m.supplierId === supplierId);
    this.purchaseForm.patchValue({ materialId: '' });
  }

  onMaterialChange(materialId: number): void {
    const material = this.materials.find(m => m.id === materialId);
    if (material) {
      this.purchaseForm.patchValue({ unitCost: material.unitCost });
      this.calculateTotal();
    }
  }

  calculateTotal(): void {
    const quantity = this.purchaseForm.get('quantity')?.value || 0;
    const unitCost = this.purchaseForm.get('unitCost')?.value || 0;
    this.totalCost = quantity * unitCost;
  }

  onSubmit(): void {
    if (this.purchaseForm.valid) {
      this.isLoading = true;
      const formData: CreatePurchase = this.purchaseForm.value;

      const operation = this.data
        ? this.purchaseService.updatePurchase(this.data.id, formData)
        : this.purchaseService.createPurchase(formData);

      operation.subscribe({
        next: (purchase) => {
          this.notificationService.success(
            `Compra ${this.data ? 'actualizada' : 'creada'} exitosamente`
          );
          this.dialogRef.close(purchase);
        },
        error: () => {
          this.isLoading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}