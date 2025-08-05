import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
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
    MatStepperModule,
  ],
  templateUrl: './quote-form.html',
  styleUrls: ['./quote-form.scss'],
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
      productId: ['', Validators.required],
    });

    this.quantityForm = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1)]],
    });

    this.notesForm = this.fb.group({
      customerNotes: [''],
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
      },
    });
  }

  onProductChange(productId: number): void {
    this.selectedProduct =
      this.products.find((p) => p.id === productId) || null;
    this.calculatePrice();
  }

  calculatePrice(): void {
    if (!this.selectedProduct || !this.quantityForm.get('quantity')?.value) {
      return;
    }

    const quantity = this.quantityForm.get('quantity')?.value;
    this.productService
      .calculatePrice(this.selectedProduct.id, quantity)
      .subscribe({
        next: (calculation) => {
          this.priceCalculation = calculation;
        },
        error: (error) => {
          console.error('Error calculating price:', error);
        },
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
        customerNotes: this.notesForm.get('customerNotes')?.value,
      };

      this.quoteService.createQuote(quoteData).subscribe({
        next: (quote) => {
          this.notificationService.success('Cotización enviada exitosamente');
          this.router.navigate(['/customer/quotes']);
        },
        error: () => {
          this.isSubmitting = false;
        },
      });
    }
  }
}
