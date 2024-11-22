import { Component, OnInit } from '@angular/core';
import { EventService, CampaignService } from '../_services';
import { Router } from '@angular/router';
import { CommunityEvent } from '../_models';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  //styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  
  activeApprovedEvents: any[] = []; // Only active, approved events
  errorMessage: string | null = null;
  searchQuery: string = '';
  activeApprovedCampaigns: any[] = [];
  filteredEvents: CommunityEvent[] = [];
  events: CommunityEvent[] = [];

  constructor(
    private eventService: EventService,
    private router: Router,
    private campaignService: CampaignService
  ) {}

  ngOnInit() {
    this.loadActiveApprovedEvents();
    this.loadActiveApprovedCampaigns();
  }

  loadActiveApprovedEvents() {
    this.eventService.getApprovedActiveEvents().subscribe(
      (data: any[]) => {
        this.activeApprovedEvents = data;
        this.filteredEvents = [...data]; // Initialize filteredEvents
        console.log("Fetched events:", this.activeApprovedEvents);
      },
      (error) => {
        console.error('Error fetching events:', error);
      }
    );
  }

  loadActiveApprovedCampaigns() {
    this.campaignService.getApprovedCampaigns().subscribe(
      (data: any[]) => {
        this.activeApprovedCampaigns = data;
        console.log("Fetched campaigns:", this.activeApprovedCampaigns);
      },
      (error) => {
        console.error('Error fetching campaigns:', error);
      }
    );
  }

  searchEvents(): void {
    if (!this.searchQuery.trim()) {
      // Reset to all events if search is empty
      this.filteredEvents = [...this.activeApprovedEvents];
      return;
    }
  
    const lowerQuery = this.searchQuery.toLowerCase();
    this.filteredEvents = this.activeApprovedEvents.filter(event =>
      (event.Event_Name?.toLowerCase() || '').includes(lowerQuery) ||
      (event.Event_Description?.toLowerCase() || '').includes(lowerQuery)
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