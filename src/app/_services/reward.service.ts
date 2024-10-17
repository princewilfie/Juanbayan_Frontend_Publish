import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Reward } from '@app/_models';
import { environment } from '@environments/environment';

const baseUrl = `${environment.apiUrl}/rewards`;

@Injectable({
  providedIn: 'root',
})
export class RewardService {

  constructor(private http: HttpClient) {}

  createReward(formData: FormData): Observable<Reward> {
    return this.http.post<Reward>(`${baseUrl}`, formData);
  }
  // Get all rewards (GET)
  getAllRewards(): Observable<Reward[]> {
    return this.http.get<Reward[]>(baseUrl); // Change this line
  }

  // Get a reward by ID (GET)
  getRewardById(id: number): Observable<Reward> {
    return this.http.get<Reward>(`${baseUrl}/${id}`);
  }

  updateReward(id: number, formData: FormData): Observable<Reward> {
    return this.http.put<Reward>(`${baseUrl}/${id}`, formData);
}
  // Delete a reward by ID (DELETE)
  deleteReward(id: number): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  // Consume a reward by ID (POST)
  consumeReward(id: number): Observable<any> {
    return this.http.post(`${baseUrl}/${id}/consume`, null);
  }

  redeemReward(reward_id: number, address: string, acc_id: number): Observable<any> {
    const url = `${baseUrl}/redeem`;
    return this.http.post(url, { reward_id, address, acc_id });
  }

  getAllAdmin(): Observable<Reward[]> {
    const adminUrl = `${baseUrl}/admin`; // Append '/admin' to the base URL
    return this.http.get<Reward[]>(adminUrl); // Make the GET request to '/admin'
}
}
