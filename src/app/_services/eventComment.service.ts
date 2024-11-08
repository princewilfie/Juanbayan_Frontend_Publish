// src/app/_services/event-comment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventComment } from '../_models/eventComment';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EventCommentService {
  private baseUrl = `${environment.apiUrl}/eventComment`;

  constructor(private http: HttpClient) {}

  // Create a new comment
  createEventComment(commentData: EventComment): Observable<EventComment> {
    return this.http.post<EventComment>(`${this.baseUrl}`, commentData);
  }

  // Get comments by event ID
  getCommentsByEventId(eventId: number): Observable<EventComment[]> {
    return this.http.get<EventComment[]>(`${this.baseUrl}/event/${eventId}`);
  }

  // Delete a comment by ID
  deleteEventComment(commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${commentId}`);
  }
}
