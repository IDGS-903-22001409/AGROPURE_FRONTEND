import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api';
import { Supplier } from '../models/supplier';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  constructor(private apiService: ApiService) {}

  getSuppliers(): Observable<Supplier[]> {
    return this.apiService.get<Supplier[]>('suppliers');
  }

  getSupplier(id: number): Observable<Supplier> {
    return this.apiService.get<Supplier>(`suppliers/${id}`);
  }

  createSupplier(supplier: Partial<Supplier>): Observable<Supplier> {
    return this.apiService.post<Supplier>('suppliers', supplier);
  }

  updateSupplier(
    id: number,
    supplier: Partial<Supplier>
  ): Observable<Supplier> {
    return this.apiService.put<Supplier>(`suppliers/${id}`, supplier);
  }

  deleteSupplier(id: number): Observable<void> {
    return this.apiService.delete<void>(`suppliers/${id}`);
  }
}
