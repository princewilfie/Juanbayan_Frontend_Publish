import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WithdrawalListComponent } from './withdraw-list.component'; 

const routes: Routes = [
  { path: '', component: WithdrawalListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WithdrawRoutingModule { }