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
  templateUrl: './material-form.html',
  styleUrls: ['./material-form.scss'],
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
