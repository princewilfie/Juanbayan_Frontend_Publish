import { Component, OnInit } from '@angular/core';
import { EventService } from '@app/_services';
import { CommunityEvent } from '@app/_models';

@Component({
  selector: 'app-campaign-list',
  templateUrl: './event-list.component.html'
})
export class EventListComponent implements OnInit {
  events: CommunityEvent[] = [];

  constructor(private eventService: EventService) {}

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
      },
      error => {
        console.error('Error approving event:', error);
      }
    );
  }

  rejectEvent(id: number): void {
    this.eventService.reject(id).subscribe(
      (response: CommunityEvent) => {
        this.updateEventStatus(id, 'Rejected');
      },
      error => {
        console.error('Error rejecting event:', error);
      }
    );
  }

  private updateEventStatus(id: number, approvalStatus: string): void {
    const event = this.events.find(c => c.Event_ID === id);
    if (event) {
      event.Event_ApprovalStatus = approvalStatus; // For approval status
      if (approvalStatus === 'Approved') {
        event.Event_Status = 1; // Active if approved
      } else if (approvalStatus === 'Rejected') {
        event.Event_Status = 0; // Remains inactive if rejected
      }
    }
  }

  // Optionally add this method if you need better campaign status handling
  getEventStatus(status: number): string {
    return status === 1 ? 'Active' : 'Inactive';
  }
}