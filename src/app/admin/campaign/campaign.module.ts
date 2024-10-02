import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CampaignRoutingModule } from './campaign-routing.module';
import { CampaignListComponent } from './campaign-list.component';

@NgModule({
  declarations: [CampaignListComponent],
  imports: [
    CommonModule,
    FormsModule,
    CampaignRoutingModule
  ]
})
export class CampaignModule { }