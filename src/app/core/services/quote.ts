import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api';
import {
  Quote,
  CreateQuoteRequest,
  CreatePublicQuoteRequest,
} from '../models/quote';
import { QuoteStatus } from '../models/enums';

@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  constructor(private apiService: ApiService) {}

  createQuote(quoteData: CreateQuoteRequest): Observable<Quote> {
    return this.apiService.post<Quote>('quotes', quoteData);
  }

  createPublicQuote(quoteData: CreatePublicQuoteRequest): Observable<Quote> {
    return this.apiService.post<Quote>('quotes/public', quoteData);
  }

  getQuotes(): Observable<Quote[]> {
    return this.apiService.get<Quote[]>('quotes');
  }

  getUserQuotes(userId: number): Observable<Quote[]> {
    return this.apiService.get<Quote[]>(`quotes/user/${userId}`);
  }

  getQuote(id: number): Observable<Quote> {
    return this.apiService.get<Quote>(`quotes/${id}`);
  }

  updateQuoteStatus(
    id: number,
    status: QuoteStatus,
    adminNotes?: string
  ): Observable<Quote> {
    return this.apiService.put<Quote>(`quotes/${id}/status`, {
      status,
      adminNotes,
    });
  }

  approveAndCreateUser(id: number): Observable<void> {
    return this.apiService.post<void>(
      `quotes/${id}/approve-and-create-user`,
      {}
    );
  }

  deleteQuote(id: number): Observable<void> {
    return this.apiService.delete<void>(`quotes/${id}`);
  }
}
