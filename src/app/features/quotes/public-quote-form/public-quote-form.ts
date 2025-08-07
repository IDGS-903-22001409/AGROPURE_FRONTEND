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
import { QuoteService } from '../../../core/services/quote';
import { ProductService } from '../../../core/services/product';
import { NotificationService } from '../../../core/services/notification';
import { Product } from '../../../core/models/product';

@Component({
  selector: 'app-public-quote-form',
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
    MatStepperModule,
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
            Completa tus datos para recibir una cotización personalizada
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <mat-stepper #stepper orientation="vertical" [linear]="true">
            <!-- Paso 1: Información Personal -->
            <mat-step [stepControl]="personalForm" label="Información Personal">
              <form [formGroup]="personalForm">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Nombre Completo</mat-label>
                  <input matInput formControlName="customerName" required />
                  <mat-icon matSuffix>person</mat-icon>
                  <mat-error *ngIf="personalForm.get('customerName')?.hasError('required')">
                    El nombre es requerido
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Email</mat-label>
                  <input matInput type="email" formControlName="customerEmail" required />
                  <mat-icon matSuffix>email</mat-icon>
                  <mat-error *ngIf="personalForm.get('customerEmail')?.hasError('required')">
                    El email es requerido
                  </mat-error>
                  <mat-error *ngIf="personalForm.get('customerEmail')?.hasError('email')">
                    Ingresa un email válido
                  </mat-error>
                </mat-form-field>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Teléfono</mat-label>
                    <input matInput formControlName="customerPhone" />
                    <mat-icon matSuffix>phone</mat-icon>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Empresa (Opcional)</mat-label>
                    <input matInput formControlName="customerCompany" />
                    <mat-icon matSuffix>business</mat-icon>
                  </mat-form-field>
                </div>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Dirección</mat-label>
                  <textarea matInput formControlName="customerAddress" rows="2"></textarea>
                  <mat-icon matSuffix>location_on</mat-icon>
                </mat-form-field>

                <div class="step-actions">
                  <button
                    mat-raised-button
                    color="primary"
                    matStepperNext
                    [disabled]="personalForm.invalid"
                  >
                    Continuar
                  </button>
                </div>
              </form>
            </mat-step>

            <!-- Paso 2: Selección de Producto -->
            <mat-step [stepControl]="productForm" label="Seleccionar Producto">
              <form [formGroup]="productForm">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Producto</mat-label>
                  <mat-select
                    formControlName="productId"
                    (selectionChange)="onProductChange($event.value)"
                  >
                    <mat-option
                      *ngFor="let product of products"
                      [value]="product.id"
                    >
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

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Cantidad</mat-label>
                  <input
                    matInput
                    type="number"
                    formControlName="quantity"
                    min="1"
                    (input)="calculatePrice()"
                  />
                  <mat-error *ngIf="productForm.get('quantity')?.hasError('required')">
                    La cantidad es requerida
                  </mat-error>
                  <mat-error *ngIf="productForm.get('quantity')?.hasError('min')">
                    La cantidad mínima es 1
                  </mat-error>
                </mat-form-field>

                <div class="price-calculation" *ngIf="priceCalculation">
                  <div class="price-row">
                    <span>Precio unitario:</span>
                    <span>${{ priceCalculation.unitPrice | number:'1.2-2' }}</span>
                  </div>
                  <div class="price-row" *ngIf="priceCalculation.discount > 0">
                    <span>Descuento:</span>
                    <span class="discount">-${{ priceCalculation.discount | number:'1.2-2' }}</span>
                  </div>
                  <div class="price-row total">
                    <span><strong>Total estimado:</strong></span>
                    <span><strong>${{ priceCalculation.totalCost | number:'1.2-2' }}</strong></span>
                  </div>
                </div>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Notas o Requerimientos Especiales (Opcional)</mat-label>
                  <textarea
                    matInput
                    formControlName="notes"
                    rows="3"
                    placeholder="Describe cualquier requerimiento especial..."
                  ></textarea>
                </mat-form-field>

                <div class="step-actions">
                  <button mat-button matStepperPrevious>Atrás</button>
                  <button
                    mat-raised-button
                    color="primary"
                    (click)="submitQuote()"
                    [disabled]="productForm.invalid || isSubmitting"
                  >
                    <mat-icon>send</mat-icon>
                    {{ isSubmitting ? "Enviando..." : "Enviar Cotización" }}
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
    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }
    .half-width {
      flex: 1;
    }
    .product-details {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      margin: 16px 0;
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
    .step-actions {
      display: flex;
      gap: 12px;
      margin-top: 24px;
    }
  `]
})
export class PublicQuoteFormComponent implements OnInit {
  personalForm: FormGroup;
  productForm: FormGroup;
  
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
    this.personalForm = this.fb.group({
      customerName: ['', Validators.required],
      customerEmail: ['', [Validators.required, Validators.email]],
      customerPhone: [''],
      customerCompany: [''],
      customerAddress: ['']
    });

    this.productForm = this.fb.group({
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    
    // Check if productId is provided in query params
    this.route.queryParams.subscribe((params) => {
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
    this.selectedProduct = this.products.find((p) => p.id === productId) || null;
    this.calculatePrice();
  }

  calculatePrice(): void {
    if (!this.selectedProduct || !this.productForm.get('quantity')?.value) {
      return;
    }

    const quantity = this.productForm.get('quantity')?.value;
    this.productService.calculatePrice(this.selectedProduct.id, quantity).subscribe({
      next: (calculation) => {
        this.priceCalculation = calculation;
      },
      error: (error) => {
        console.error('Error calculating price:', error);
      }
    });
  }

  submitQuote(): void {
    if (this.personalForm.valid && this.productForm.valid) {
      this.isSubmitting = true;

      const quoteData = {
        ...this.personalForm.value,
        ...this.productForm.value
      };

      this.quoteService.createPublicQuote(quoteData).subscribe({
        next: () => {
          this.notificationService.success(
            'Cotización enviada exitosamente. Te contactaremos pronto.'
          );
          this.router.navigate(['/']);
        },
        error: () => {
          this.isSubmitting = false;
        }
      });
    }
  }
}