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

  // Create a new reward (POST)
  createReward(reward: Reward): Observable<Reward> {
    return this.http.post<Reward>(`${baseUrl}`, reward);
  }

  // Get all rewards (GET)
  getAllRewards(): Observable<Reward[]> {
    return this.http.get<Reward[]>(baseUrl); // Change this line
  }

  // Get a reward by ID (GET)
  getRewardById(id: number): Observable<Reward> {
    return this.http.get<Reward>(`${baseUrl}/${id}`);
  }

  // Update a reward by ID (PUT)
  updateReward(id: number, reward: Partial<Reward>): Observable<Reward> {
    return this.http.put<Reward>(`${baseUrl}/${id}`, reward);
  }

  // Delete a reward by ID (DELETE)
  deleteReward(id: number): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  // Consume a reward by ID (POST)
  consumeReward(id: number): Observable<any> {
    return this.http.post(`${baseUrl}/${id}/consume`, null);
  }
}
