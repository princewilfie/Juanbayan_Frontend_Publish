import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RewardListComponent } from './reward-list.component';
import { RewardsAddEditComponent } from './reward-addedit.component';

const routes: Routes = [
  { path: '', component: RewardListComponent },
  { path: 'add', component: RewardsAddEditComponent },
  { path: 'edit/:id', component: RewardsAddEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RewardRoutingModule { }