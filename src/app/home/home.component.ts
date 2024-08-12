import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService, EventService, AlertService } from '@app/_services';

@Component({
  templateUrl: 'home.component.html'
})
export class HomeComponent implements OnInit {
  account = this.accountService.accountValue;
  events: any[] = [];
  filteredEvents: any[] = [];
  searchQuery: string = '';
  selectedCategory: string = 'All';
  priceRange: string = 'All';

  constructor(
    private accountService: AccountService, 
    private router: Router, 
    private eventService: EventService, 
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.eventService.getAllEvents().subscribe({
      next: events => {
        this.events = events;
        this.filteredEvents = events; // Initialize filtered events
      },
      error: error => this.alertService.error(error)
    });
  }

  filterEvents() {
    let filteredEvents = this.events;

    // Filter by search query
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filteredEvents = filteredEvents.filter(event =>
        event.name.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (this.selectedCategory !== 'All') {
      filteredEvents = filteredEvents.filter(event => event.category === this.selectedCategory);
    }

    // Filter by price range
    if (this.priceRange === 'Lowest to Highest') {
      filteredEvents = filteredEvents.sort((a, b) => a.price - b.price);
    } else if (this.priceRange === 'Highest to Lowest') {
      filteredEvents = filteredEvents.sort((a, b) => b.price - a.price);
    }

    this.filteredEvents = filteredEvents;
  }
}