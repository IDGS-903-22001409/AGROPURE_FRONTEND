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
import { MaterialService } from '../../../core/services/material';
import { SupplierService } from '../../../core/services/supplier';
import { NotificationService } from '../../../core/services/notification';
import { Material } from '../../../core/models/material';
import { Supplier } from '../../../core/models/supplier';

@Component({
  selector: 'app-material-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  template: `
    <div class="material-form">
      <h2 mat-dialog-title>
        {{ data ? 'Editar Material' : 'Nuevo Material' }}
      </h2>

      <mat-dialog-content>
        <form [formGroup]="materialForm">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nombre del Material</mat-label>
            <input matInput formControlName="name" required />
            <mat-error *ngIf="materialForm.get('name')?.hasError('required')">
              El nombre es requerido
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Descripción</mat-label>
            <textarea
              matInput
              formControlName="description"
              rows="3"
            ></textarea>
          </mat-form-field>

          <div class="form-row">
            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Costo Unitario</mat-label>
              <input
                matInput
                type="number"
                step="0.01"
                formControlName="unitCost"
                required
              />
              <span matPrefix>$</span>
              <mat-error
                *ngIf="materialForm.get('unitCost')?.hasError('required')"
              >
                El costo es requerido
              </mat-error>
              <mat-error *ngIf="materialForm.get('unitCost')?.hasError('min')">
                El costo debe ser mayor a 0
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Unidad de Medida</mat-label>
              <input
                matInput
                formControlName="unit"
                required
                placeholder="kg, m, pcs, etc."
              />
              <mat-error *ngIf="materialForm.get('unit')?.hasError('required')">
                La unidad es requerida
              </mat-error>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Proveedor</mat-label>
            <mat-select formControlName="supplierId" required>
              <mat-option
                *ngFor="let supplier of suppliers"
                [value]="supplier.id"
              >
                {{ supplier.name }}
              </mat-option>
            </mat-select>
            <mat-error
              *ngIf="materialForm.get('supplierId')?.hasError('required')"
            >
              El proveedor es requerido
            </mat-error>
          </mat-form-field>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions>
        <button mat-button (click)="onCancel()">Cancelar</button>
        <button
          mat-raised-button
          color="primary"
          (click)="onSubmit()"
          [disabled]="materialForm.invalid || isLoading"
        >
          {{ isLoading ? 'Guardando...' : data ? 'Actualizar' : 'Crear' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [
    `
      .material-form {
        min-width: 500px;
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
      mat-dialog-actions {
        justify-content: flex-end;
        gap: 12px;
      }
    `,
  ],
})
export class MaterialFormComponent implements OnInit {
  materialForm: FormGroup;
  suppliers: Supplier[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private materialService: MaterialService,
    private supplierService: SupplierService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<MaterialFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Material | null
  ) {
    this.materialForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      unitCost: [0, [Validators.required, Validators.min(0.01)]],
      unit: ['', Validators.required],
      supplierId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadSuppliers();

    if (this.data) {
      this.materialForm.patchValue({
        name: this.data.name,
        description: this.data.description,
        unitCost: this.data.unitCost,
        unit: this.data.unit,
        supplierId: this.data.supplierId,
      });
    }
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

  onSubmit(): void {
    if (this.materialForm.valid) {
      this.isLoading = true;
      const formData = this.materialForm.value;

      const operation = this.data
        ? this.materialService.updateMaterial(this.data.id, formData)
        : this.materialService.createMaterial(formData);

      operation.subscribe({
        next: (material) => {
          this.notificationService.success(
            `Material ${this.data ? 'actualizado' : 'creado'} exitosamente`
          );
          this.dialogRef.close(material);
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
