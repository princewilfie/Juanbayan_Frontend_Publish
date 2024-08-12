import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module';
import { EventListComponent } from './event-list.component';
import { AddEventComponent } from './add-event.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        EventsRoutingModule
    ],
    declarations: [
        EventListComponent,
        AddEventComponent
    ]
})
export class EventsModule { }