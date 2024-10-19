import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RewardListComponent } from './reward-list.component';

const routes: Routes = [
  { path: '', component: RewardListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RewardRoutingModule { }