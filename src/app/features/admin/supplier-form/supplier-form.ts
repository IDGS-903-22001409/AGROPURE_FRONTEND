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
import { MatButtonModule } from '@angular/material/button';
import { SupplierService } from '../../../core/services/supplier';
import { NotificationService } from '../../../core/services/notification';
import { Supplier } from '../../../core/models/supplier';

@Component({
  selector: 'app-supplier-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <div class="supplier-form">
      <h2 mat-dialog-title>
        {{ data ? 'Editar Proveedor' : 'Nuevo Proveedor' }}
      </h2>

      <mat-dialog-content>
        <form [formGroup]="supplierForm">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nombre de la Empresa</mat-label>
            <input matInput formControlName="name" required />
            <mat-error *ngIf="supplierForm.get('name')?.hasError('required')">
              El nombre es requerido
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Persona de Contacto</mat-label>
            <input matInput formControlName="contactPerson" />
          </mat-form-field>

          <div class="form-row">
            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" />
              <mat-error *ngIf="supplierForm.get('email')?.hasError('email')">
                Ingresa un email válido
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Teléfono</mat-label>
              <input matInput formControlName="phone" />
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Dirección</mat-label>
            <textarea matInput formControlName="address" rows="3"></textarea>
          </mat-form-field>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions>
        <button mat-button (click)="onCancel()">Cancelar</button>
        <button
          mat-raised-button
          color="primary"
          (click)="onSubmit()"
          [disabled]="supplierForm.invalid || isLoading"
        >
          {{ isLoading ? 'Guardando...' : data ? 'Actualizar' : 'Crear' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [
    `
      .supplier-form {
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
export class SupplierFormComponent implements OnInit {
  supplierForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<SupplierFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Supplier | null
  ) {
    this.supplierForm = this.fb.group({
      name: ['', Validators.required],
      contactPerson: [''],
      email: ['', Validators.email],
      phone: [''],
      address: [''],
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.supplierForm.patchValue({
        name: this.data.name,
        contactPerson: this.data.contactPerson,
        email: this.data.email,
        phone: this.data.phone,
        address: this.data.address,
      });
    }
  }

  onSubmit(): void {
    if (this.supplierForm.valid) {
      this.isLoading = true;
      const formData = this.supplierForm.value;

      const operation = this.data
        ? this.supplierService.updateSupplier(this.data.id, formData)
        : this.supplierService.createSupplier(formData);

      operation.subscribe({
        next: (supplier) => {
          this.notificationService.success(
            `Proveedor ${this.data ? 'actualizado' : 'creado'} exitosamente`
          );
          this.dialogRef.close(supplier);
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
