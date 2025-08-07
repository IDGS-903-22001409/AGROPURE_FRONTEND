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
  status: QuoteStatus | string; // Permitir tanto enum como string
  notes?: string;
  adminNotes?: string;
  isPublicQuote: boolean;
  requestDate: Date | string; // Permitir tanto Date como string
  responseDate?: Date | string;
  expiryDate?: Date | string;
  userFullName?: string;
}

export interface CreateQuoteRequest {
  productId: number;
  quantity: number;
  notes?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
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
