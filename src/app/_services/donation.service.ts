import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Donation } from '../_models/donation';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  private baseUrl = `${environment.apiUrl}/donation`; // Base URL for donation API

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


  createGcashPayment(paymentData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create-gcash-payment`, paymentData);
  }

  saveDonation(donation: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, donation);
  }
 

  // Get campaign details by ID
  getCampaignById(campaignId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/campaign/${campaignId}`);
  }

  getDonationsByCampaignId(campaignId: number): Observable<Donation[]> {
    return this.http.get<Donation[]>(`${this.baseUrl}/campaign/${campaignId}`);
  }

  getFeeAmounts(): Observable<{ totalFeeAmount: number, feeAmounts: { donation_id: number, fee_amount: number }[] }> {
    return this.http.get<{ totalFeeAmount: number, feeAmounts: { donation_id: number, fee_amount: number }[] }>(`${this.baseUrl}/fees`);
  }

}