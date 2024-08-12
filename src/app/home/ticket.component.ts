import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService, AccountService, AlertService, TicketService } from '@app/_services';
import { Account } from '../_models/account';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html'
})
export class TicketComponent implements OnInit {
  event: any = {};
  account: Account = this.accountService.accountValue;
  ticket_number: string;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private accountService: AccountService,
    private alertService: AlertService,
    private ticketService: TicketService,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const eventId = params.get('id');
      if (eventId) {
        this.loadEventDetails(eventId);
      }
    });

    this.ticketService.currentTicketNumber.subscribe(ticket_number => {
      this.ticket_number = ticket_number;
    });
  }

  loadEventDetails(eventId: string) {
    this.eventService.getById(eventId).subscribe(
      data => {
        this.event = data;
      },
      error => {
        this.alertService.error(error);
      }
    );
  }
}
