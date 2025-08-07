import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api';

export interface SalesReport {
  totalRevenue: number;
  totalSales: number;
  averageOrderValue: number;
  monthlySales: MonthlySales[];
  topProducts: ProductSales[];
  topCustomers: CustomerSales[];
}

export interface MonthlySales {
  month: string;
  year: number;
  revenue: number;
  ordersCount: number;
}

export interface ProductSales {
  productName: string;
  unitsSold: number;
  revenue: number;
}

export interface CustomerSales {
  customerName: string;
  ordersCount: number;
  totalSpent: number;
}

@Injectable({
  providedIn: 'root',
})
export class SalesReportService {
  constructor(private apiService: ApiService) {}

  getSalesReport(startDate?: Date, endDate?: Date): Observable<SalesReport> {
    const params: any = {};
    if (startDate) params.startDate = startDate.toISOString();
    if (endDate) params.endDate = endDate.toISOString();

    return this.apiService.get<SalesReport>('reports/sales', params);
  }

  getMonthlySalesReport(year: number): Observable<MonthlySales[]> {
    return this.apiService.get<MonthlySales[]>(`reports/sales/monthly/${year}`);
  }

  getTopProductsReport(limit: number = 10): Observable<ProductSales[]> {
    return this.apiService.get<ProductSales[]>(`reports/products/top`, {
      limit,
    });
  }

  getTopCustomersReport(limit: number = 10): Observable<CustomerSales[]> {
    return this.apiService.get<CustomerSales[]>(`reports/customers/top`, {
      limit,
    });
  }
}
