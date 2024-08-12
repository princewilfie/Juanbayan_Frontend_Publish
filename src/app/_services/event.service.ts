import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Event } from '@app/_models';

const baseUrl = `${environment.apiUrl}/events`;

@Injectable({ providedIn: 'root' })
export class EventService {
    constructor(private http: HttpClient) {}

    getAllEvents(): Observable<Event[]> {
        return this.http.get<Event[]>(baseUrl);
    }

    getById(id: string): Observable<Event> {
        return this.http.get<Event>(`${baseUrl}/${id}`);
    }

    create(eventData: FormData) {
        return this.http.post(`${environment.apiUrl}/events`, eventData);
    }

    update(id: string, eventData: FormData) {
        return this.http.put(`${environment.apiUrl}/events/${id}`, eventData);
    }

    deleteEvent(id: string): Observable<any> {
        return this.http.delete(`${baseUrl}/${id}`);
    }
}