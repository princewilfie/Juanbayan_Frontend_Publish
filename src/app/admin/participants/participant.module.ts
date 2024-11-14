import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParticipantListComponent } from './participant-list.component';
import { ParticipantRoutingModule } from './participant.-routing.module';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [ParticipantListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ParticipantRoutingModule,
    NgbModalModule
  ]
})
export class ParticipantModule { }