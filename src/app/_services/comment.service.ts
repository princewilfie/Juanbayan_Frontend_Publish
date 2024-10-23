import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../_models/comment';
import { environment } from '../../environments/environment'; // Import environment for API baseUrl


@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private baseUrl = `${environment.apiUrl}/comment`;

  constructor(private http: HttpClient) {}

  // Create a new comment
  create(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(`${this.baseUrl}`, comment);
  }

  // Get comments by Campaign ID
  getByCampaignId(campaignId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}/campaign/${campaignId}`);
  }

  // Delete a comment by ID
  delete(commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${commentId}`);
  }

  // Update a comment by ID
  update(commentId: number, comment: Comment): Observable<Comment> {
    return this.http.put<Comment>(`${this.baseUrl}/${commentId}`, comment);
  }
}
