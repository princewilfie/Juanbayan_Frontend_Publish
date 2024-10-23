// like.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Like } from '../_models'; 
import { environment } from '../../environments/environment'; // Import environment for API baseUrl


@Injectable({
  providedIn: 'root'
})
export class LikeService {
  
    private baseUrl = `${environment.apiUrl}/like`;

  constructor(private http: HttpClient) {}

  // Create a like
  createLike(like: Like): Observable<Like> {
    return this.http.post<Like>(`${this.baseUrl}`, like);
  }

  // Get likes by campaign ID
  getLikesByCampaignId(campaignId: number): Observable<Like[]> {
    return this.http.get<Like[]>(`${this.baseUrl}/campaign/${campaignId}`);
  }

  // Delete a like (unlike)
  deleteLike(likeId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${likeId}`);
  }
}
