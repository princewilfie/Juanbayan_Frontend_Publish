import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Withdraw } from '../_models/withdraw';

@Injectable({
  providedIn: 'root',
})
export class WithdrawService {
  private baseUrl = `${environment.apiUrl}/withdraw`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Withdraw[]> {
    return this.http.get<Withdraw[]>(`${this.baseUrl}/all`); // Change this line
  }

  // Request a withdrawal
  requestWithdrawal(data: Omit<Withdraw, 'Withdraw_ID' | 'Request_Date' | 'Status'>): Observable<Withdraw> {
    return this.http.post<Withdraw>(`${this.baseUrl}/request`, data);
  }

  // Approve a withdrawal (Admin only)
  approveWithdrawal(withdrawId: number): Observable<Withdraw> {
    return this.http.put<Withdraw>(`${this.baseUrl}/approve`, { Withdraw_ID: withdrawId });
  }

  // Reject a withdrawal (Admin only)
  rejectWithdrawal(withdrawId: number): Observable<Withdraw> {
    return this.http.put<Withdraw>(`${this.baseUrl}/reject`, { Withdraw_ID: withdrawId });
  }
}
