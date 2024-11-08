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

  getAllCampaigns(): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(`${this.baseUrl}`);
  }
  // Create a new campaign with form data (including image)
  create(formData: FormData): Observable<Campaign> {
    return this.http.post<Campaign>(`${this.baseUrl}`, formData);
  }

  updateCampaign(id: string, formData: FormData): Observable<Campaign> {
    return this.http.put<Campaign>(`${this.baseUrl}/${id}`, formData);
  }

  // Add delete campaign method
  deleteCampaign(campaignId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${campaignId}`);
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
  const statusUpdate = { Campaign_Status: 1 };  // Indicating status as Active
  return this.http.put<Campaign>(`${this.baseUrl}/${id}/approve`, statusUpdate);
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

  getCampaignById(id: string): Observable<Campaign> {
    return this.http.get<Campaign>(`${this.baseUrl}/${id}`);
  }

  // Add a method to get approved campaigns
  getApprovedCampaigns(): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(`${this.baseUrl}?status=approved`);
  }

  getProofFilesByCampaignId(campaignId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/${campaignId}/proofs`);
  }


  // Helper to create headers with the token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Ensure the token is stored correctly
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Get notes for a specific campaign
  getCampaignNotes(campaignId: number): Observable<{ noteContent: string }> {
    return this.http.get<{ noteContent: string }>(`${this.baseUrl}/${campaignId}/notes`);
  }
}