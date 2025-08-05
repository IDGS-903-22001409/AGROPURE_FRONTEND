import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api';
import { DashboardStats } from '../models/dashboard';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private apiService: ApiService) {}

  getStats(): Observable<DashboardStats> {
    return this.apiService.get<DashboardStats>('dashboard/stats');
  }
}
