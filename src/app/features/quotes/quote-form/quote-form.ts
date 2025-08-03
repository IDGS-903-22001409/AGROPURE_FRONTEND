import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { QuoteService } from '../../../core/services/quote.service';
import { ProductService } from '../../../core/services/product.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-quote-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule
  ],
  template: `
    <div class="quote-container">
      <mat-card class="quote-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>request_quote</mat-icon>
            Solicitar Cotización
          </mat-card-title>
          <mat-card-subtitle>
            Obtén una cotización personalizada para tu sistema AGROPURE
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <mat-stepper #stepper orientation="vertical" [linear]="true">
            <!-- Paso 1: Selección de Producto -->
            <mat-step [stepControl]="productForm" label="Seleccionar Producto">
              <form [formGroup]="productForm">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Producto</mat-label>
                  <mat-select formControlName="productId" (selectionChange)="onProductChange($event.value)">
                    <mat-option *ngFor="let product of products" [value]="product.id">
                      {{ product.name }} - ${{ product.basePrice | number:'1.2-2' }}
                    </mat-option>
                  </mat-select>
                  <mat-error *ngIf="productForm.get('productId')?.hasError('required')">
                    Selecciona un producto
                  </mat-error>
                </mat-form-field>

                <div class="product-details" *ngIf="selectedProduct">
                  <h3>{{ selectedProduct.name }}</h3>
                  <p>{{ selectedProduct.description }}</p>
                  <p><strong>Precio base:</strong> ${{ selectedProduct.basePrice | number:'1.2-2' }}</p>
                </div>

                <div class="step-actions">
                  <button mat-raised-button color="primary" matStepperNext [disabled]="productForm.invalid">
                    Continuar
                  </button>
                </div>
              </form>
            </mat-step>

            <!-- Paso 2: Cantidad y Cálculos -->
            <mat-step [stepControl]="quantityForm" label="Cantidad y Presupuesto">
              <form [formGroup]="quantityForm">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Cantidad</mat-label>
                  <input matInput type="number" formControlName="quantity" min="1" (input)="calculatePrice()">
                  <mat-error *ngIf="quantityForm.get('quantity')?.hasError('required')">
                    La cantidad es requerida
                  </mat-error>
                  <mat-error *ngIf="quantityForm.get('quantity')?.hasError('min')">
                    La cantidad mínima es 1
                  </mat-error>
                </mat-form-field>

                <div class="price-calculation" *ngIf="priceCalculation">
                  <div class="price-row">
                    <span>Precio unitario:</span>
                    <span>${{ priceCalculation.unitPrice | number:'1.2-2' }}</span>
                  </div>
                  <div class="price-row" *ngIf="priceCalculation.discount > 0">
                    <span>Descuento ({{ getDiscountPercentage() }}%):</span>
                    <span class="discount">-${{ priceCalculation.discount | number:'1.2-2' }}</span>
                  </div>
                  <div class="price-row total">
                    <span><strong>Total:</strong></span>
                    <span><strong>${{ priceCalculation.totalCost | number:'1.2-2' }}</strong></span>
                  </div>
                </div>

                <div class="discount-info">
                  <h4>Descuentos por Volumen:</h4>
                  <ul>
                    <li>3+ unidades: 5% de descuento</li>
                    <li>5+ unidades: 10% de descuento</li>
                    <li>10+ unidades: 15% de descuento</li>
                  </ul>
                </div>

                <div class="step-actions">
                  <button mat-button matStepperPrevious>Atrás</button>
                  <button mat-raised-button color="primary" matStepperNext [disabled]="quantityForm.invalid">
                    Continuar
                  </button>
                </div>
              </form>
            </mat-step>

            <!-- Paso 3: Notas Adicionales -->
            <mat-step [stepControl]="notesForm" label="Información Adicional">
              <form [formGroup]="notesForm">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Notas o Requerimientos Especiales (Opcional)</mat-label>
                  <textarea matInput formControlName="customerNotes" rows="4" 
                           placeholder="Describe cualquier requerimiento especial o pregunta sobre el producto..."></textarea>
                </mat-form-field>

                <div class="step-actions">
                  <button mat-button matStepperPrevious>Atrás</button>
                  <button mat-raised-button color="primary" (click)="submitQuote()" [disabled]="isSubmitting">
                    <mat-icon>send</mat-icon>
                    {{ isSubmitting ? 'Enviando...' : 'Enviar Cotización' }}
                  </button>
                </div>
              </form>
            </mat-step>
          </mat-stepper>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .quote-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .quote-card {
      padding: 20px;
    }
    mat-card-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    .product-details {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      margin: 16px 0;
    }
    .product-details h3 {
      margin: 0 0 8px 0;
      color: #2e7d32;
    }
    .price-calculation {
      background: #e8f5e8;
      padding: 16px;
      border-radius: 8px;
      margin: 16px 0;
    }
    .price-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .price-row.total {
      border-top: 1px solid #ccc;
      padding-top: 8px;
      margin-top: 8px;
    }
    .discount {
      color: #4caf50;
    }
    .discount-info {
      background: #fff3e0;
      padding: 16px;
      border-radius: 8px;
      margin: 16px 0;
    }
    .discount-info h4 {
      margin: 0 0 8px 0;
      color: #f57c00;
    }
    .discount-info ul {
      margin: 0;
      padding-left: 20px;
    }
    .step-actions {
      display: flex;
      gap: 12px;
      margin-top: 24px;
    }
    .mat-mdc-form-field {
      margin-bottom: 16px;
    }
  `]
})
export class QuoteFormComponent implements OnInit {
  productForm: FormGroup;
  quantityForm: FormGroup;
  notesForm: FormGroup;
  
  products: Product[] = [];
  selectedProduct: Product | null = null;
  priceCalculation: any = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private quoteService: QuoteService,
    private productService: ProductService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      productId: ['', Validators.required]
    });
    
    this.quantityForm = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
    
    this.notesForm = this.fb.group({
      customerNotes: ['']
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    
    // Check if productId is provided in query params
    this.route.queryParams.subscribe(params => {
      if (params['productId']) {
        this.productForm.patchValue({ productId: +params['productId'] });
        this.onProductChange(+params['productId']);
      }
    });
  }

  private loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  onProductChange(productId: number): void {
    this.selectedProduct = this.products.find(p => p.id === productId) || null;
    this.calculatePrice();
  }

  calculatePrice(): void {
    if (!this.selectedProduct || !this.quantityForm.get('quantity')?.value) {
      return;
    }

    const quantity = this.quantityForm.get('quantity')?.value;
    this.productService.calculatePrice(this.selectedProduct.id, quantity).subscribe({
      next: (calculation) => {
        this.priceCalculation = calculation;
      },
      error: (error) => {
        console.error('Error calculating price:', error);
      }
    });
  }

  getDiscountPercentage(): number {
    const quantity = this.quantityForm.get('quantity')?.value || 0;
    if (quantity >= 10) return 15;
    if (quantity >= 5) return 10;
    if (quantity >= 3) return 5;
    return 0;
  }

  submitQuote(): void {
    if (this.productForm.valid && this.quantityForm.valid) {
      this.isSubmitting = true;
      
      const quoteData = {
        productId: this.productForm.get('productId')?.value,
        quantity: this.quantityForm.get('quantity')?.value,
        customerNotes: this.notesForm.get('customerNotes')?.value
      };

      this.quoteService.createQuote(quoteData).subscribe({
        next: (quote) => {
          this.notificationService.success('Cotización enviada exitosamente');
          this.router.navigate(['/customer/quotes']);
        },
        error: () => {
          this.isSubmitting = false;
        }
      });
    }
  }
}
