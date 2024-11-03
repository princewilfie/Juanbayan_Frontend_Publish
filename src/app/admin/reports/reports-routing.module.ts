import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { ReportsCampaignComponent } from './reports-campaign.component';

const routes: Routes = [
  { path: '', component: ReportsComponent },
  { path: 'reports-campaign', component: ReportsCampaignComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }