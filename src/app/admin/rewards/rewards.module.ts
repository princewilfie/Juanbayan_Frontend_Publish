import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RewardRoutingModule } from './rewards-routing.module';
import { RewardListComponent } from './reward-list.component';
import { RewardsAddEditComponent } from './reward-addedit.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    RewardListComponent,
    RewardsAddEditComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RewardRoutingModule
  ]
})
export class RewardModule { }
