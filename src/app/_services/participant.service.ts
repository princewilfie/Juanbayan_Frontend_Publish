import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Participant } from '../_models/participant';
import { environment } from '../../environments/environment';

const baseUrl = `${environment.apiUrl}/eventParticipant`;

@Injectable({
  providedIn: 'root',
})
export class ParticipantService {

  constructor(private http: HttpClient) {}

  // Join an event (POST)
  joinEvent(Acc_ID: number, Event_ID: number): Observable<any> {
    return this.http.post(`${baseUrl}/join`, { Acc_ID, Event_ID });
  }

  // Get all events joined by an account (GET)
  getJoinedEvents(accId: number): Observable<Participant[]> {
    return this.http.get<Participant[]>(`${baseUrl}/account/${accId}/joined`);
  }

  // Get participants of an event (GET)
  getEventParticipants(eventId: number): Observable<Participant[]> {
    return this.http.get<Participant[]>(`${baseUrl}/event/${eventId}/participants`);
  }

  // Delete a participant (DELETE)
  deleteParticipant(participantId: number): Observable<any> {
    return this.http.delete(`${baseUrl}/${participantId}`);
  }

  // Update participant details (PUT)
  updateParticipant(participantId: number, participantData: Participant): Observable<Participant> {
    return this.http.put<Participant>(`${baseUrl}/${participantId}`, participantData);
  }
}
