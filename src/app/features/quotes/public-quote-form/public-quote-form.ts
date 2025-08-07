// src/app/features/quotes/public-quote-form/public-quote-form.ts
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
  templateUrl: './public-quote-form.html',
  styleUrls: ['./public-quote-form.scss'],
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
      customerAddress: [''],
    });

    this.productForm = this.fb.group({
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      notes: [''],
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
    if (!this.selectedProduct || !this.productForm.get('quantity')?.value) {
      return;
    }

    const quantity = this.productForm.get('quantity')?.value;
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

  submitQuote(): void {
    if (this.personalForm.valid && this.productForm.valid) {
      this.isSubmitting = true;

      const quoteData = {
        ...this.personalForm.value,
        ...this.productForm.value,
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
        },
      });
    }
  }
}
