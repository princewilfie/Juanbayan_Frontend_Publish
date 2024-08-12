import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private ticketNumberSource = new BehaviorSubject<string>(null);
  currentTicketNumber = this.ticketNumberSource.asObservable();

  setTicketNumber(ticketNumber: string) {
    this.ticketNumberSource.next(ticketNumber);
  }
}