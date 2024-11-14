import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EventService } from '../_services/event.service';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-terms-and-conditions-modal',
  templateUrl: './event-terms-condition.component.html',
  styleUrls: ['./event-terms-condition.component.css']
})
export class TermsAndConditionsModalComponent implements OnInit {
  @Input() eventId!: number; // Event ID
  termsModalOpen: boolean = false;

  accountId: number; // The correct Account ID will be stored here

  constructor(
    public activeModal: NgbActiveModal,
    private eventService: EventService,
    private accountService: AccountService // Inject AccountService
  ) {}

  ngOnInit(): void {
    // Get the account ID of the currently logged-in user
    const account = this.accountService.accountValue;
    if (account && account.id) {
      this.accountId = Number(account.id); // Assign the correct account ID
    } else {
      console.error('No account is logged in.');
      // You can handle this by showing an error or redirecting the user
    }
  }

  confirmVolunteer() {
    if (this.accountId && this.eventId) {
      this.eventService.joinEvent(this.accountId, this.eventId).subscribe(
        (response) => {
          alert('You have successfully joined as a volunteer!');
          this.activeModal.close(true);
        },
        (error) => {
          alert(error.error.message || 'Error joining event');
          this.activeModal.close(false);
        }
      );
    } else {
      alert('Unable to join the event. Account or Event ID is missing.');
    }
  }

  closeModal() {
    this.termsModalOpen = false;
  }
}
