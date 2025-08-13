import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
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
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ProductService } from '../../../core/services/product';
import { MaterialService } from '../../../core/services/material';
import { NotificationService } from '../../../core/services/notification';
import { Product } from '../../../core/models/product';
import { Material } from '../../../core/models/material';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.css'],
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  availableMaterials: Material[] = [];
  isLoading = false;

  // Cálculos de costos
  materialsCost = 0;
  laborCost = 0;
  overheadCost = 0;
  profitMargin = 0;
  calculatedCost = 0;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private materialService: MaterialService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<ProductFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product | null
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      detailedDescription: [''],
      category: [''],
      imageUrl: [''],
      technicalSpecs: [''],
      materials: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.loadMaterials();
    this.addMaterial(); // Agregar primera fila de material

    if (this.data) {
      this.loadProductData();
    }
  }

  get materialsArray(): FormArray {
    return this.productForm.get('materials') as FormArray;
  }

  private loadMaterials(): void {
    this.materialService.getMaterials().subscribe({
      next: (materials) => {
        this.availableMaterials = materials;
      },
      error: (error) => {
        console.error('Error loading materials:', error);
      },
    });
  }

  private loadProductData(): void {
    if (this.data) {
      this.productForm.patchValue({
        name: this.data.name,
        description: this.data.description,
        detailedDescription: this.data.detailedDescription,
        category: this.data.category,
        imageUrl: this.data.imageUrl,
        technicalSpecs: this.data.technicalSpecs,
      });

      // Limpiar array de materiales y cargar los del producto
      this.materialsArray.clear();
      this.data.materials.forEach((material) => {
        this.materialsArray.push(
          this.fb.group({
            materialId: [material.materialId, Validators.required],
            quantity: [
              material.quantity,
              [Validators.required, Validators.min(0.01)],
            ],
          })
        );
      });

      this.calculateTotal();
    }
  }

  addMaterial(): void {
    const materialGroup = this.fb.group({
      materialId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(0.01)]],
    });
    this.materialsArray.push(materialGroup);
  }

  removeMaterial(index: number): void {
    this.materialsArray.removeAt(index);
    this.calculateTotal();
  }

  onMaterialChange(index: number): void {
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.materialsCost = 0;

    // Calcular costo de materiales
    this.materialsArray.controls.forEach((control) => {
      const materialId = control.get('materialId')?.value;
      const quantity = control.get('quantity')?.value || 0;

      if (materialId && quantity > 0) {
        const material = this.availableMaterials.find(
          (m) => m.id === materialId
        );
        if (material) {
          this.materialsCost += material.unitCost * quantity;
        }
      }
    });

    // Calcular costos adicionales
    this.laborCost = this.materialsCost * 0.3; // 30% mano de obra
    this.overheadCost = (this.materialsCost + this.laborCost) * 0.2; // 20% gastos generales
    const totalProductionCost =
      this.materialsCost + this.laborCost + this.overheadCost;
    this.profitMargin = totalProductionCost * 0.25; // 25% ganancia
    this.calculatedCost = totalProductionCost + this.profitMargin;
  }

  onSubmit(): void {
    if (this.productForm.valid && this.materialsArray.length > 0) {
      this.isLoading = true;

      const formData = {
        ...this.productForm.value,
        basePrice: this.calculatedCost, // Usar el precio calculado
      };

      const operation = this.data
        ? this.productService.updateProduct(this.data.id, formData)
        : this.productService.createProduct(formData);

      operation.subscribe({
        next: (product) => {
          this.notificationService.success(
            `Producto ${this.data ? 'actualizado' : 'creado'} exitosamente`
          );
          this.dialogRef.close(product);
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
