import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { CommunityEvent } from '../_models/communityevent';
import { environment } from '../../environments/environment'; // Import environment for API baseUrl
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private baseUrl = `${environment.apiUrl}/events`; // Use the environment variable for the base API URL

  constructor(private http: HttpClient) {}


  reject(id: number, adminNotes: string): Observable<CommunityEvent> {
    return this.http.put<CommunityEvent>(`${this.baseUrl}/${id}/reject`, { adminNotes });
}

  // Create a new event with form data (including image)
  create(formData: FormData): Observable<CommunityEvent> {
    // Optional: Add Authorization token or other headers if required
    const headers = new HttpHeaders(); // You can set a token: .set('Authorization', `Bearer ${yourToken}`)
    
    return this.http.post<CommunityEvent>(`${this.baseUrl}`, formData, { headers })
      .pipe(
        catchError(error => {
          console.error('Error creating event:', error); // Log the error for debugging
          return throwError(error); // Throw the error for further handling in the component
        })
      );
  }

  // Update event
  update(id: number, formData: FormData): Observable<CommunityEvent> {
    return this.http.put<CommunityEvent>(`${this.baseUrl}/${id}`, formData)
      .pipe(
        catchError(error => {
          console.error('Error updating event:', error);
          return throwError(error);
        })
      );
  }

  // Get all events
  getAll(): Observable<CommunityEvent[]> {
    return this.http.get<CommunityEvent[]>(`${this.baseUrl}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching all events:', error);
          return throwError(error);
        })
      );
  }

  // Get an event by ID
  getById(id: number): Observable<CommunityEvent> {
    return this.http.get<CommunityEvent>(`${this.baseUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching event by ID:', error);
          return throwError(error);
        })
      );
  }

  // Delete an event
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error deleting event:', error);
          return throwError(error);
        })
      );
  }

  // Get events by account ID
  getEventsByAccountId(accountId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/account/${accountId}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching events by account ID:', error);
          return throwError(error);
        })
      );
  }

  updateEvent(id: string, formData: FormData): Observable<Event> {
    return this.http.put<Event>(`${this.baseUrl}/${id}`, formData); // Use Event_ID instead of id
  }


  approve(id: number): Observable<CommunityEvent> {
    return this.http.put<CommunityEvent>(`${this.baseUrl}/${id}/approve`, {});
  }


  // Method to fetch all events
  getAllEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`);
  }

  // Fetch approved and active events from the backend
  getApprovedActiveEvents(): Observable<CommunityEvent[]> {
    return this.http.get<CommunityEvent[]>(`${this.baseUrl}/approved`)
      .pipe(
        catchError(error => {
          console.error('Error fetching approved and active events:', error);
          return throwError(error);
        })
      );
  }


  joinEvent(Acc_ID: number, Event_ID: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/join`, { Acc_ID, Event_ID });
  }

  getEventParticipants(Event_ID: number): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/participants`, { Event_ID })
      .pipe(
        catchError(error => {
          console.error('Error fetching participants:', error); // Log error for debugging
          return throwError(error); // Throw error for further handling
        })
      );
  }

}