import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Material } from '../models/material.model';

@Injectable({
  providedIn: 'root',
})
export class MaterialService {
  constructor(private apiService: ApiService) {}

  getMaterials(): Observable<Material[]> {
    return this.apiService.get<Material[]>('materials');
  }

  getMaterial(id: number): Observable<Material> {
    return this.apiService.get<Material>(`materials/${id}`);
  }

  createMaterial(material: Partial<Material>): Observable<Material> {
    return this.apiService.post<Material>('materials', material);
  }

  updateMaterial(
    id: number,
    material: Partial<Material>
  ): Observable<Material> {
    return this.apiService.put<Material>(`materials/${id}`, material);
  }

  deleteMaterial(id: number): Observable<void> {
    return this.apiService.delete<void>(`materials/${id}`);
  }
}
