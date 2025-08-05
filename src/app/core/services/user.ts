import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private apiService: ApiService) {}

  getUsers(): Observable<User[]> {
    return this.apiService.get<User[]>('users');
  }

  getUser(id: number): Observable<User> {
    return this.apiService.get<User>(`users/${id}`);
  }

  getUserProfile(): Observable<User> {
    return this.apiService.get<User>('users/profile');
  }

  updateUser(id: number, userData: Partial<User>): Observable<User> {
    return this.apiService.put<User>(`users/${id}`, userData);
  }

  updateProfile(userData: Partial<User>): Observable<User> {
    return this.apiService.put<User>('users/profile', userData);
  }

  deleteUser(id: number): Observable<void> {
    return this.apiService.delete<void>(`users/${id}`);
  }

  toggleUserStatus(id: number): Observable<User> {
    return this.apiService.put<User>(`users/${id}/toggle-status`, {});
  }
}
