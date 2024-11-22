import { Component, OnInit } from '@angular/core';
import { EventService } from '../../_services';
import { CommunityEvent } from '../../_models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html'
})
export class EventListComponent implements OnInit {

  rejectionNote: string = '';
  selectedEventId: number | null = null;
  events: CommunityEvent[] = [];
  showRejectionModal: boolean = false; // Flag to control modal visibility
  loading = false;
  searchQuery: string = '';

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.eventService.getAll().subscribe(
      (data: CommunityEvent[]) => {
        console.log('Loaded events:', data); // Debugging
        this.events = data;
      },
      error => {
        console.error('Error fetching events:', error);
      }
    );
  }
  

  approveEvent(id: number): void {
    this.loading = true;
    this.eventService.approve(id).subscribe(
      (response: CommunityEvent) => {
        this.updateEventStatus(id, 'Approved');
        Swal.fire({
          icon: 'success',
          title: 'Event Approved!',
          text: 'The event has been approved successfully.',
          showConfirmButton: false,
          timer: 1500
        });
        this.loading = false;
      },
      error => {
        console.error('Error approving campaign:', error);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Something went wrong while approving the event. Please try again.',
        });
      }
    );
  }

  get filteredEvents(): CommunityEvent[] {
    if (!this.searchQuery.trim()) {
      return this.events;
    }
    
    const lowerQuery = this.searchQuery.toLowerCase();
    const filtered = this.events.filter(event =>
      (event.Event_Name?.toLowerCase() || '').includes(lowerQuery) ||
      (event.Event_Description?.toLowerCase() || '').includes(lowerQuery) ||
      (event.Event_Location?.toLowerCase() || '').includes(lowerQuery) ||
      (this.getEventStatus(event.Event_Status)?.toLowerCase() || '').includes(lowerQuery) ||
      (event.Event_ApprovalStatus?.toLowerCase() || '').includes(lowerQuery)
    );
    
    console.log('Filtered events:', filtered); // Debugging
    return filtered;
  }
  

  rejectEventWithNote(eventId: number): void {
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
    
    this.loading = true;  // Set loading to true when the rejection starts
    
    this.eventService.reject(eventId, this.rejectionNote).subscribe(
      (response: CommunityEvent) => {
        this.rejectionNote = ''; // Clear the note after submission
        this.loadEvents(); // Reload event list after rejection
        this.closeRejectionModal(); // Close the modal
  
        Swal.fire({
          icon: 'success',
          title: 'Event Rejected!',
          text: 'The event has been rejected successfully.',
          showConfirmButton: false,
          timer: 1500
        });
  
        this.loading = false;  // Reset loading after the request completes
      },
      error => {
        console.error('Error rejecting event:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Something went wrong while rejecting the event. Please try again.',
        });
        
        this.loading = false;  // Reset loading after an error occurs
      }
    );
  }

  openRejectionModal(eventId: number): void {
    this.selectedEventId = eventId;
    this.showRejectionModal = true; // Show the modal
  }

  closeRejectionModal(): void {
    this.showRejectionModal = false; // Hide the modal
  }

  private updateEventStatus(id: number, approvalStatus: string): void {
    const event = this.events.find(e => e.Event_ID === id);
    if (event) {
      event.Event_ApprovalStatus = approvalStatus;
      event.Event_Status = approvalStatus === 'Approved' ? 1 : 0;
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
