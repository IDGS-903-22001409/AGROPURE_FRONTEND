// src/app/features/admin/supplier-form/supplier-form.ts
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
  templateUrl: './supplier-form.html',
  styleUrls: ['./supplier-form.scss'],
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
