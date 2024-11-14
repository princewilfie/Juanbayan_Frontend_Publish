import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Revenue } from '../_models/revenue';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RevenueService {
  private baseUrl = `${environment.apiUrl}/Revenue`;

  constructor(private http: HttpClient) {}

  // Get all revenues
  getAllRevenues(): Observable<Revenue[]> {
    return this.http.get<Revenue[]>(`${this.baseUrl}`);
  }

  // Get revenue by ID
  getRevenueById(id: number): Observable<Revenue> {
    return this.http.get<Revenue>(`${this.baseUrl}/${id}`);
  }

  // Get revenues by Campaign ID
  getRevenueByCampaignId(campaignId: number): Observable<Revenue[]> {
    return this.http.get<Revenue[]>(`${this.baseUrl}/campaign/${campaignId}`);
  }

  // Create a new revenue record
  createRevenue(donationId: number, campaignId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, { donationId, campaignId });
  }

  // Update an existing revenue record
  updateRevenue(id: number, revenueData: Revenue): Observable<Revenue> {
    return this.http.put<Revenue>(`${this.baseUrl}/${id}`, revenueData);
  }

  // Delete a revenue record by ID
  deleteRevenue(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
