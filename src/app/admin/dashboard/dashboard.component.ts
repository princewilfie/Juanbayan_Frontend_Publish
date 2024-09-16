import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  totalDonation: number = 0;
  totalUsers: number = 0;
  totalCampaigns: number = 0;
  donationGoal: number = 10000000; // Assume a donation goal of ₱10,000,000.00
  progress: number = 0; // Progress percentage


  ngOnInit(): void {
    
  }



  // Function to calculate the donation progress percentage
  calculateProgress() {
    this.progress = (this.totalDonation / this.donationGoal) * 100;
  }
}
