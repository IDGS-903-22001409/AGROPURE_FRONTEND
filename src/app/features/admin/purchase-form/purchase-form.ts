// src/app/features/admin/purchase-form/purchase-form.ts
import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {
  PurchaseService,
  Purchase,
  CreatePurchase,
} from '../../../core/services/purchase';
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
  templateUrl: './purchase-form.html',
  styleUrls: ['./purchase-form.scss'],
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
      notes: [''],
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
        notes: this.data.notes,
      });
      this.calculateTotal();
    }
  }

  private loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe({
      next: (suppliers) => {
        this.suppliers = suppliers;
      },
    });
  }

  private loadMaterials(): void {
    this.materialService.getMaterials().subscribe({
      next: (materials) => {
        this.materials = materials;
        this.filteredMaterials = materials;
      },
    });
  }

  onSupplierChange(supplierId: number): void {
    this.filteredMaterials = this.materials.filter(
      (m) => m.supplierId === supplierId
    );
    this.purchaseForm.patchValue({ materialId: '' });
  }

  onMaterialChange(materialId: number): void {
    const material = this.materials.find((m) => m.id === materialId);
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
        },
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
