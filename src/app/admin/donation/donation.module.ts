import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DonationRoutingModule } from './donation-routing.module';
import { DonationListComponent } from './donation-list.component';

@NgModule({
  declarations: [DonationListComponent],
  imports: [
    CommonModule,
    FormsModule,
    DonationRoutingModule
  ]
})
export class DonationModule { }