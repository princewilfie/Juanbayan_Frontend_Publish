import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventLike } from '../_models/eventLike';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EventLikeService {
  private baseUrl = `${environment.apiUrl}/eventLike`;
  
  constructor(private http: HttpClient) {}

  // Create a new like for an event
  createEventLike(eventLikeData: EventLike): Observable<EventLike> {
    return this.http.post<EventLike>(`${this.baseUrl}`, eventLikeData);
  }

  // Get likes by event ID
  getLikesByEventId(eventId: number): Observable<EventLike[]> {
    return this.http.get<EventLike[]>(`${this.baseUrl}/event/${eventId}`);
  }

  // Delete a like (unlike) by ID
  deleteEventLike(likeId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${likeId}`);
  }
}