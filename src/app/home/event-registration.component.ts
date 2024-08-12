import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService, EventService, AlertService, RegistrationService, TicketService } from '@app/_services';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-event-registration',
  templateUrl: './event-registration.component.html',
})
export class EventRegistrationComponent implements OnInit {
  event: any = {};
  loading = false;

  formData = {
    password: '',
    terms: false
  };

  account = this.accountService.accountValue;

  constructor(
    private accountService: AccountService,
    private eventService: EventService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private registrationService: RegistrationService,
    private ticketService: TicketService // Inject the TicketService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const eventId = params.get('id');
      if (eventId) {
        this.loadEventDetails(eventId);
      }
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

  generateTicketNumber(): string {
    // Generate a sequential ticket number
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().substr(-2); // Last two digits of the year
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Month in two digits
    const day = currentDate.getDate().toString().padStart(2, '0'); // Day in two digits
    const hour = currentDate.getHours().toString().padStart(2, '0'); // Hour in two digits
    const minute = currentDate.getMinutes().toString().padStart(2, '0'); // Minute in two digits
    const second = currentDate.getSeconds().toString().padStart(2, '0'); // Second in two digits

    // Combine date and time components to form a sequential ticket number
    return `TICKET-${year}${month}${day}${hour}${minute}${second}`;
  }

  submitForm() {
    this.loading = true;
    if (this.formData.terms) {
      const registrationData = {
        event_id: this.event.id,
        acc_id: this.account.id,
        date_registered: new Date(),
        payment_status: 'Pending',
        ticket_number: this.generateTicketNumber()
      };

      this.router.navigate(['/ticket'])
        

      this.registrationService.registerEvent(registrationData)
        .pipe(
          catchError(error => {
            this.alertService.error('An error occurred during registration.');
            return throwError(error);
          })
        )
        .subscribe(() => {
          this.alertService.success('Registration successful.');
          this.loading = false;

          // Set the ticket number in the TicketService
          this.ticketService.setTicketNumber(registrationData.ticket_number);

          this.router.navigate(['/ticket', this.event.id]);


      
        }, () => {
          this.loading = false;
        });
    } else {
      this.alertService.error('You must accept the terms and conditions.');
      this.loading = false;
    }
  }
}