import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Donation } from '../_models/donation';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  private baseUrl = `${environment.apiUrl}/donations`; // Base URL for donation API

  constructor(private http: HttpClient) {}

  // Get all donations
  getAllDonations(): Observable<Donation[]> {
    return this.http.get<Donation[]>(`${this.baseUrl}`);
  }

  // Get donation by ID
  getDonationById(id: number): Observable<Donation> {
    return this.http.get<Donation>(`${this.baseUrl}/${id}`);
  }

  // Create a new donation
  createDonation(donationData: Donation): Observable<Donation> {
    return this.http.post<Donation>(`${this.baseUrl}/create`, donationData);
  }
}