import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services';
@Component({
  selector: 'app-beneficiary-dashboard',
  templateUrl: './beneficiary-dashboard.component.html',
  styleUrls: ['./beneficiary-dashboard.component.css']
})
export class BeneficiaryDashboardComponent implements OnInit {
  account: any; // Define the type based on your account structure

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.account = this.accountService.accountValue;
  }
}