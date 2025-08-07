import { QuoteStatus } from './enums';

export interface Quote {
  id: number;
  userId?: number | null; // Puede ser null para cotizaciones públicas
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  customerAddress?: string | null;
  customerCompany?: string | null;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalCost: number;
  status: QuoteStatus | string; // Permitir tanto enum como string
  notes?: string | null;
  adminNotes?: string | null;
  isPublicQuote: boolean;
  requestDate: Date | string; // Permitir tanto Date como string del servidor
  responseDate?: Date | string | null;
  expiryDate?: Date | string | null;
  userFullName?: string | null;
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
