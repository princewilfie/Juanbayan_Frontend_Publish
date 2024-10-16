import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventRoutingModule } from './event-routing.module';
import { EventListComponent } from './event-list.component';

@NgModule({
  declarations: [EventListComponent],
  imports: [
    CommonModule,
    FormsModule,
    EventRoutingModule
  ]
})
export class EventModule { }