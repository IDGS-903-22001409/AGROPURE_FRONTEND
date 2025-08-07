import { QuoteStatus } from './enums';

export interface Quote {
  id: number;
  userId?: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string;
  customerCompany?: string;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalCost: number;
  discount: number;
  status: QuoteStatus;
  notes?: string;
  adminNotes?: string;
  isPublicQuote: boolean;
  createdAt: Date;
  updatedAt: Date;
  expiryDate?: Date;
}

export interface CreateQuoteRequest {
  productId: number;
  quantity: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string;
  notes?: string;
}

export interface CreatePublicQuoteRequest {
  productId: number;
  quantity: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string;
  customerCompany?: string;
  notes?: string;
}
