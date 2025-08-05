import { Quote } from './quote';

export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalQuotes: number;
  pendingQuotes: number;
  recentQuotes: Quote[];
  monthlyRevenue: number;
  topProducts: ProductStat[];
}

export interface ProductStat {
  productName: string;
  quotesCount: number;
  totalRevenue: number;
}
