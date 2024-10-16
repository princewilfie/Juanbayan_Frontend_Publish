import { Component, OnInit } from '@angular/core';
import { EventService } from '../_services/event.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  activeApprovedEvents: any[] = []; // Only active, approved events
  errorMessage: string | null = null;

  constructor(
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadActiveApprovedEvents();
  }

  loadActiveApprovedEvents() {
    this.eventService.getApprovedActiveEvents().subscribe(
      (data: any[]) => {
        this.activeApprovedEvents = data;
        console.log("Fetched events:", this.activeApprovedEvents);
      },
      (error) => {
        console.error('Error fetching events:', error);
      }
    );
  }
  

  viewEventDetails(eventId: string | undefined) {
    if (eventId) {
      this.router.navigate(['/event-details', eventId]);
    } else {
      console.error("Event ID is undefined or missing");
    }
  }
  

  getImagePath(imageName: string): string {
    return imageName ? `http://localhost:4000/assets/${imageName}` : 'assets/jb-symbol-logo.png';
  }  

}