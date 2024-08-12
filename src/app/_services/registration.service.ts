import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Event } from '@app/_models';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private http: HttpClient) { }

  registerEvent(registrationData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/registrations/registerEvent`, registrationData);
  }
}