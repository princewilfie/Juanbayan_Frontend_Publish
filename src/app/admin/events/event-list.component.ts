import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { EventService } from '@app/_services';
import { Event } from '@app/_models';

@Component({ templateUrl: 'event-list.component.html' })
export class EventListComponent implements OnInit {
    events: any[];

    constructor(private eventService: EventService) {}

    ngOnInit() {
        this.loadEvents();
    }

    loadEvents() {
        this.eventService.getAllEvents().pipe(first()).subscribe(events => {
            this.events = events;
        });
    }

    deleteEvent(id: string) {
        const event = this.events.find(x => x.id === id);
        event.isDeleting = true;
        this.eventService.deleteEvent(id).pipe(first()).subscribe(() => {
            this.events = this.events.filter(x => x.id !== id);
        });
    }
}