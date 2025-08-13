import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
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
    return this.apiService.post<Quote>('quotes', quoteData).pipe(
      tap((response) =>
        console.log('QuoteService.createQuote response:', response)
      ),
      catchError((error) => {
        console.error('QuoteService.createQuote error:', error);
        return throwError(error);
      })
    );
  }

  createPublicQuote(quoteData: CreatePublicQuoteRequest): Observable<Quote> {
    return this.apiService.post<Quote>('quotes/public', quoteData).pipe(
      tap((response) =>
        console.log('QuoteService.createPublicQuote response:', response)
      ),
      catchError((error) => {
        console.error('QuoteService.createPublicQuote error:', error);
        return throwError(error);
      })
    );
  }

  getQuotes(): Observable<Quote[]> {
    return this.apiService.get<Quote[]>('quotes').pipe(
      tap((response) =>
        console.log('QuoteService.getQuotes response:', response)
      ),
      catchError((error) => {
        console.error('QuoteService.getQuotes error:', error);
        return throwError(error);
      })
    );
  }

  getUserQuotes(userId: number): Observable<Quote[]> {
    console.log(`QuoteService.getUserQuotes: Llamando a quotes/user/${userId}`);

    return this.apiService.get<Quote[]>(`quotes/user/${userId}`).pipe(
      tap((response) => {
        console.log('QuoteService.getUserQuotes response:', response);
        console.log('Response type:', typeof response);
        console.log('Is array:', Array.isArray(response));
        if (Array.isArray(response)) {
          console.log('Array length:', response.length);
          response.forEach((quote, index) => {
            console.log(`Quote ${index}:`, quote);
          });
        }
      }),
      catchError((error) => {
        console.error('QuoteService.getUserQuotes error:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error,
        });
        return throwError(error);
      })
    );
  }

  getQuote(id: number): Observable<Quote> {
    return this.apiService.get<Quote>(`quotes/${id}`).pipe(
      tap((response) =>
        console.log('QuoteService.getQuote response:', response)
      ),
      catchError((error) => {
        console.error('QuoteService.getQuote error:', error);
        return throwError(error);
      })
    );
  }

  updateQuoteStatus(
    id: number,
    status: QuoteStatus,
    adminNotes?: string
  ): Observable<Quote> {
    // Convertir el enum a número como espera el backend
    let statusNumber: number;
    switch (status) {
      case QuoteStatus.Pending:
        statusNumber = 0;
        break;
      case QuoteStatus.Approved:
        statusNumber = 1;
        break;
      case QuoteStatus.Rejected:
        statusNumber = 2;
        break;
      case QuoteStatus.Completed:
        statusNumber = 3;
        break;
      default:
        statusNumber = 0;
    }

    const updateDto = {
      status: statusNumber,
      adminNotes: adminNotes || null,
    };

    console.log('QuoteService.updateQuoteStatus - Enviando:', {
      url: `quotes/${id}/status`,
      payload: updateDto,
    });

    return this.apiService.put<Quote>(`quotes/${id}/status`, updateDto).pipe(
      tap((response) =>
        console.log('QuoteService.updateQuoteStatus response:', response)
      ),
      catchError((error) => {
        console.error('QuoteService.updateQuoteStatus error:', error);
        return throwError(error);
      })
    );
  }

  approveAndCreateUser(id: number): Observable<void> {
    return this.apiService
      .post<void>(`quotes/${id}/approve-and-create-user`, {})
      .pipe(
        tap((response) =>
          console.log('QuoteService.approveAndCreateUser response:', response)
        ),
        catchError((error) => {
          console.error('QuoteService.approveAndCreateUser error:', error);
          return throwError(error);
        })
      );
  }

  deleteQuote(id: number): Observable<void> {
    return this.apiService.delete<void>(`quotes/${id}`).pipe(
      tap((response) =>
        console.log('QuoteService.deleteQuote response:', response)
      ),
      catchError((error) => {
        console.error('QuoteService.deleteQuote error:', error);
        return throwError(error);
      })
    );
  }
}
