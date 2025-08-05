import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api';
import { Quote, CreateQuoteRequest } from '../models/quote';
import { QuoteStatus } from '../models/enums';

@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  constructor(private apiService: ApiService) {}

  createQuote(quoteData: CreateQuoteRequest): Observable<Quote> {
    return this.apiService.post<Quote>('quotes', quoteData);
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

  updateQuoteStatus(id: number, status: QuoteStatus): Observable<Quote> {
    return this.apiService.put<Quote>(`quotes/${id}/status`, { status });
  }

  deleteQuote(id: number): Observable<void> {
    return this.apiService.delete<void>(`quotes/${id}`);
  }
}
