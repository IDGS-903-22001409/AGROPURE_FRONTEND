import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private apiService: ApiService) {}

  getProducts(): Observable<Product[]> {
    return this.apiService.get<Product[]>('products');
  }

  getProduct(id: number): Observable<Product> {
    return this.apiService.get<Product>(`products/${id}`);
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.apiService.post<Product>('products', product);
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.apiService.put<Product>(`products/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.apiService.delete<void>(`products/${id}`);
  }

  calculatePrice(
    productId: number,
    quantity: number
  ): Observable<{ unitPrice: number; totalCost: number; discount: number }> {
    return this.apiService.post<{
      unitPrice: number;
      totalCost: number;
      discount: number;
    }>('products/calculate-price', {
      productId,
      quantity,
    });
  }
}
