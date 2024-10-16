import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TermsAndConditionsModalComponent } from './event-terms-condition.component';
import { EventService } from '../_services/event.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  event: any;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.eventService.getById(+eventId).subscribe(
        (data) => {
          this.event = data;
        },
        (error) => {
          console.error('Error fetching event details:', error);
        }
      );
    }
  }

  // Define getImagePath method here
  getImagePath(imageName: string): string {
    return imageName ? `http://localhost:4000/assets/${imageName}` : 'assets/';
  }

  openTermsAndConditionsModal() {
    const modalRef = this.modalService.open(TermsAndConditionsModalComponent, {
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.accId = 1; // Set account ID here (replace 1 with actual ID)
    modalRef.componentInstance.eventId = this.event.Event_ID;

    modalRef.result.then(
      (result) => {
        if (result) {
          console.log('User confirmed to join as a volunteer');
        }
      },
      (reason) => {
        console.log('User dismissed the modal');
      }
    );
  }
}