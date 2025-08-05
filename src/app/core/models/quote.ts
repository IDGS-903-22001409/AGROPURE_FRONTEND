import { QuoteStatus } from './enums';

export interface Quote {
  id: number;
  customerName: string;
  customerEmail: string;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalCost: number;
  discount: number;
  status: QuoteStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateQuoteRequest {
  productId: number;
  quantity: number;
  customerNotes?: string;
}
