import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EventService } from '../_services/event.service';

@Component({
  selector: 'app-terms-and-conditions-modal',
  templateUrl: './event-terms-condition.component.html',
  styleUrls: ['./event-terms-condition.component.css']
})
export class TermsAndConditionsModalComponent {
  @Input() accId!: number; // Account ID
  @Input() eventId!: number; // Event ID

  constructor(
    public activeModal: NgbActiveModal,
    private eventService: EventService
  ) {}

  confirmVolunteer() {
    this.eventService.joinEvent(this.accId, this.eventId).subscribe(
      (response) => {
        alert('You have successfully joined as a volunteer!');
        this.activeModal.close(true);
      },
      (error) => {
        alert(error.error.message || 'Error joining event');
        this.activeModal.close(false);
      }
    );
  }

  closeModal() {
    this.activeModal.dismiss();
  }
}