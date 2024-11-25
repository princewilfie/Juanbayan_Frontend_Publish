import { Component, OnInit } from '@angular/core';
import { AccountService, NotificationService } from '../_services';
@Component({
  selector: 'app-beneficiary-dashboard',
  templateUrl: './beneficiary-dashboard.component.html',
  styleUrls: ['./beneficiary-dashboard.component.css']
})
export class BeneficiaryDashboardComponent implements OnInit {
  account: any; // Define the type based on your account structure

  constructor(private accountService: AccountService, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.account = this.accountService.accountValue;
    this.notificationService.loadNotifications();
  }
}