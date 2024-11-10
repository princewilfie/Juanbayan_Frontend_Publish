import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventRoutingModule } from './event-routing.module';
import { EventListComponent } from './event-list.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [EventListComponent],
  imports: [
    CommonModule,
    FormsModule,
    EventRoutingModule,
    NgbModalModule
  ]
})
export class EventModule { }