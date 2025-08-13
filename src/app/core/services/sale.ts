import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api';

export interface Sale {
  id: number;
  userId: number;
  productId: number;
  quoteId?: number;
  orderNumber: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: string;
  notes?: string;
  saleDate: Date;
  deliveryDate?: Date;
  customerName: string;
  productName: string;
}

export interface CreateSaleFromQuoteResponse {
  id: number;
  orderNumber: string;
  totalAmount: number;
  status: string;
  customerName: string;
  productName: string;
}

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  constructor(private apiService: ApiService) {}

  createSaleFromQuote(
    quoteId: number
  ): Observable<CreateSaleFromQuoteResponse> {
    return this.apiService.post<CreateSaleFromQuoteResponse>(
      `sales/from-quote/${quoteId}`,
      {}
    );
  }

  getAllSales(): Observable<Sale[]> {
    return this.apiService.get<Sale[]>('sales');
  }

  getSale(id: number): Observable<Sale> {
    return this.apiService.get<Sale>(`sales/${id}`);
  }

  getUserSales(userId: number): Observable<Sale[]> {
    return this.apiService.get<Sale[]>(`sales/user/${userId}`);
  }
}
