import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CampaignRoutingModule } from './campaign-routing.module';
import { CampaignListComponent } from './campaign-list.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [CampaignListComponent],
  imports: [
    CommonModule,
    FormsModule,
    CampaignRoutingModule,
    NgbModalModule
  ]
})
export class CampaignModule { }