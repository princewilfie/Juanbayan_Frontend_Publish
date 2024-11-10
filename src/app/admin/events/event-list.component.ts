import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { EventService } from '../../_services';
import { CommunityEvent } from '../../_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html'
})
export class EventListComponent implements OnInit {

  @ViewChild('rejectionModal') rejectionModal: TemplateRef<any> | undefined;
  
  rejectionNote: string = '';
  selectedEventId: number | null = null;

  events: CommunityEvent[] = [];

  constructor(
    private eventService: EventService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.eventService.getAll().subscribe(
      (data: CommunityEvent[]) => {
        this.events = data;
      },
      error => {
        console.error('Error fetching events:', error);
      }
    );
  }

  approveEvent(id: number): void {
    this.eventService.approve(id).subscribe(
      (response: CommunityEvent) => {
        this.updateEventStatus(id, 'Approved');
      // Show SweetAlert success message for approval
      Swal.fire({
        icon: 'success',
        title: 'Event Approved!',
        text: 'The event has been approved successfully.',
        showConfirmButton: false,
        timer: 1500
      });
    },
    error => {
      console.error('Error approving campaign:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Something went wrong while approving the event. Please try again.',
      });
    }
    );
  }

  rejectEventWithNote(eventId: number, modal: any): void {
    if (!this.rejectionNote.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Empty Field!',
        text: 'Please add a reason for rejection.',
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    this.eventService.reject(eventId, this.rejectionNote).subscribe(
      (response: CommunityEvent) => {
        this.rejectionNote = ''; // Clear the note after submission
        this.loadEvents(); // Reload event list after rejection
        modal.close(); // Close the modal
        Swal.fire({
          icon: 'success',
          title: 'Event Rejected!',
          text: 'The event has been rejected successfully.',
          showConfirmButton: false,
          timer: 1500
        });
      },
      error => {
        console.error('Error rejecting event:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Something went wrong while rejecting the event. Please try again.',
        });
      }
    );
  }

  openRejectionModal(eventId: number): void {
    this.selectedEventId = eventId;
    if (this.rejectionModal) {
      this.modalService.open(this.rejectionModal, { centered: true });
    } else {
      console.error('Rejection modal is undefined.');
    }
  }

  private updateEventStatus(id: number, approvalStatus: string): void {
    const event = this.events.find(e => e.Event_ID === id);
    if (event) {
      event.Event_ApprovalStatus = approvalStatus;
      if (approvalStatus === 'Approved') {
        event.Event_Status = 1; // Active if approved
      } else if (approvalStatus === 'Rejected') {
        event.Event_Status = 0; // Remains inactive if rejected
      }
    }
  }

  private loadEvents(): void {
    this.eventService.getAll().subscribe(
      (data: CommunityEvent[]) => {
        this.events = data;
      },
      error => {
        console.error('Error loading events:', error);
      }
    );
  }

  getEventStatus(status: number): string {
    return status === 1 ? 'Active' : 'Inactive';
  }
}
