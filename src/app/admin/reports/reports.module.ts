import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { ReportsCampaignComponent } from './reports-campaign.component';
import { ReportsEventComponent } from './reports-event.component';
import { ReportsAccountComponent } from './reports-account.component';
import { ReportsParticipantComponent } from './reports-participant.component';
import { ReportsDonationComponent } from './reports-donation.component';
import { ReportsRevenueComponent } from './reports-revenue.component';
import { ReportsProfilingComponent } from './reports-profiling.component';
import { ReportsDonationHistoryComponent } from './reports-dohistory.component';


@NgModule({
  declarations: [
    ReportsComponent,
    ReportsCampaignComponent,
    ReportsEventComponent, 
    ReportsAccountComponent,
    ReportsParticipantComponent,
    ReportsDonationComponent,
    ReportsRevenueComponent,
    ReportsProfilingComponent,
    ReportsDonationHistoryComponent
    

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReportRoutingModule,
    
  ]
})
export class ReportsModule { }