import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Campaign } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private apiUrl = '/api/campaigns';  // Adjust the API URL as needed

  constructor(private http: HttpClient) {}

  getAll(): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(`${this.apiUrl}`);
  }

  getById(id: number): Observable<Campaign> {
    return this.http.get<Campaign>(`${this.apiUrl}/${id}`);
  }

  create(campaign: Campaign, file: File): Observable<Campaign> {
    const formData = new FormData();
    Object.keys(campaign).forEach(key => {
      formData.append(key, (campaign as any)[key]);
    });
    if (file) {
      formData.append('Campaign_Image', file, file.name);
    }
    return this.http.post<Campaign>(`${this.apiUrl}`, formData);
  }

  update(id: number, campaign: Campaign, file?: File): Observable<Campaign> {
    const formData = new FormData();
    Object.keys(campaign).forEach(key => {
      formData.append(key, (campaign as any)[key]);
    });
    if (file) {
      formData.append('Campaign_Image', file, file.name);
    }
    return this.http.put<Campaign>(`${this.apiUrl}/${id}`, formData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  approve(id: number): Observable<Campaign> {
    return this.http.put<Campaign>(`${this.apiUrl}/${id}/approve`, null);
  }

  reject(id: number): Observable<Campaign> {
    return this.http.put<Campaign>(`${this.apiUrl}/${id}/reject`, null);
  }

  getCampaignsByAccountId(accountId: string | number): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(`${this.apiUrl}?Acc_ID=${accountId}`);
  }  
  
}
