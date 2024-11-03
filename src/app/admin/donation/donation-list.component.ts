import { Component, OnInit } from '@angular/core';
import { DonationService } from '../../_services/donation.service';
import { Donation } from '../../_models';

@Component({
  selector: 'app-donation-list',
  templateUrl: './donation-list.component.html'
})
export class DonationListComponent implements OnInit {
  donations: Donation[] = [];

  constructor(private donationService: DonationService) {}

  ngOnInit(): void {
    this.loadDonations(); // Initial load
  }

  // Method to load all donations from the backend
  loadDonations(): void {
    this.donationService.getAllDonations().subscribe(
      (data: Donation[]) => {
        this.donations = data;
      },
      error => {
        console.error('Error fetching donations:', error);
      }
    );
  }

  // View a donation (example method; you may add additional functionality)
  viewDonation(id: number): void {
    this.donationService.getDonationById(id).subscribe(
      (donation: Donation) => {
        console.log('Viewing donation:', donation);
        // You can open a modal or navigate to a detailed view here
      },
      error => {
        console.error('Error fetching donation:', error);
      }
    );
  }

}
