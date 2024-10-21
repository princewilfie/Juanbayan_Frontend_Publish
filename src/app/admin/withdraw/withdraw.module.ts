import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WithdrawRoutingModule } from './withdraw-routing.module'; 
import { WithdrawalListComponent } from './withdraw-list.component'; 

@NgModule({
  declarations: [WithdrawalListComponent],
  imports: [
    CommonModule,
    FormsModule,
    WithdrawRoutingModule
  ]
})
export class WithdrawModule { }