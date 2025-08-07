import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api';

export interface Purchase {
  id: number;
  supplierId: number;
  supplierName: string;
  materialId: number;
  materialName: string;
  purchaseNumber: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  purchaseDate: Date;
  deliveryDate?: Date;
  notes?: string;
  status: string;
}

export interface CreatePurchase {
  supplierId: number;
  materialId: number;
  quantity: number;
  unitCost: number;
  deliveryDate?: Date;
  notes?: string;
}

export interface Inventory {
  materialId: number;
  materialName: string;
  unit: string;
  totalQuantity: number;
  averageCost: number;
  totalValue: number;
  lastPurchaseDate: Date;
}

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  constructor(private apiService: ApiService) {}

  getPurchases(): Observable<Purchase[]> {
    return this.apiService.get<Purchase[]>('purchases');
  }

  getPurchase(id: number): Observable<Purchase> {
    return this.apiService.get<Purchase>(`purchases/${id}`);
  }

  createPurchase(purchase: CreatePurchase): Observable<Purchase> {
    return this.apiService.post<Purchase>('purchases', purchase);
  }

  updatePurchase(
    id: number,
    purchase: Partial<CreatePurchase>
  ): Observable<Purchase> {
    return this.apiService.put<Purchase>(`purchases/${id}`, purchase);
  }

  deletePurchase(id: number): Observable<void> {
    return this.apiService.delete<void>(`purchases/${id}`);
  }

  getInventory(): Observable<Inventory[]> {
    return this.apiService.get<Inventory[]>('purchases/inventory');
  }
}
