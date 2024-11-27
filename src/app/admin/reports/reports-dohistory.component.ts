import { Component } from '@angular/core';
import { AccountService } from '../../_services';

@Component({
  selector: 'app-donation-history',
  templateUrl: './reports-dohistory.component.html',
  styleUrls: ['./reports-dohistory.component.css'],
})
export class ReportsDonationHistoryComponent {
  firstName: string = '';
  lastName: string = '';
  donationData: any = null;
  errorMessage: string = '';

  constructor(private accountService: AccountService) {}

  fetchDonations(): void {
    if (!this.firstName.trim() || !this.lastName.trim()) {
      this.errorMessage = 'First Name and Last Name are required';
      return;
    }

    this.accountService
      .getBeneficiaryDonations(this.firstName, this.lastName)
      .subscribe(
        (response) => {
          if (response.success) {
            this.donationData = response.data;
            this.errorMessage = '';
          } else {
            this.errorMessage = response.message || 'Failed to fetch data';
          }
        },
        (error) => {
          console.error('Error fetching donation data:', error);
          this.errorMessage = 'An error occurred. Please try again.';
        }
      );
  }
}
