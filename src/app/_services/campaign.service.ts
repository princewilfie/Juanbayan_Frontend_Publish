import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Campaign } from '../_models/campaign'; // Replace with your actual model path
import { environment } from '../../environments/environment'; // Import environment for API baseUrl

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private baseUrl = `${environment.apiUrl}/campaigns`; // Use the environment variable for the base API URL

  constructor(private http: HttpClient) { }

  // Create a new campaign with form data (including image)
  create(formData: FormData): Observable<Campaign> {
    return this.http.post<Campaign>(`${this.baseUrl}`, formData);
  }

  updateCampaign(id: string, formData: FormData): Observable<Campaign> {
    return this.http.put<Campaign>(`${this.baseUrl}/${id}`, formData);
  }

  // Get all campaigns
  getAll(): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(`${this.baseUrl}`);
  }

  // Get a campaign by ID
  getById(id: number): Observable<Campaign> {
    return this.http.get<Campaign>(`${this.baseUrl}/${id}`);
  }

  // Delete a campaign
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Approve a campaign (Admin only)
  approve(id: number): Observable<Campaign> {
    return this.http.put<Campaign>(`${this.baseUrl}/${id}/approve`, {});
  }

  // Reject a campaign (Admin only)
  reject(id: number): Observable<Campaign> {
    return this.http.put<Campaign>(`${this.baseUrl}/${id}/reject`, {});
  }

  // Update Campaign Status (Generic function for both approval and rejection)
  updateCampaignStatus(campaignId: number, status: number): Observable<Campaign> {
    return this.http.put<Campaign>(`${this.baseUrl}/${campaignId}/status`, { Campaign_Status: status });
  }

  // Get campaigns by account ID
  getCampaignsByAccountId(accountId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/account/${accountId}`);
  }
}