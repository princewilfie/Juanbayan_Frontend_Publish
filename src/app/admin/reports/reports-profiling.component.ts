import { Component, OnInit } from '@angular/core';
import { Account, Donation, Campaign } from '../../_models';
import { CampaignService, DonationService, AccountService } from '../../_services';

@Component({
  selector: 'app-reports-profiling',
  templateUrl: './reports-profiling.component.html',
  styleUrls: ['./reports-profiling.component.css']
})
export class ReportsProfilingComponent implements OnInit {
  accounts: Account[] = []; // Complete list of accounts (both donors and beneficiaries)
  donations: Donation[] = []; // Donations data
  campaigns: Campaign[] = []; // Campaign data

  donorSearchTerm: string = '';
  beneficiarySearchTerm: string = '';
  filteredDonors: Account[] = [];
  filteredBeneficiaries: Account[] = [];
  totalDonationsAmount: number = 0;
  totalHelpReceivedAmount: number = 0;

  constructor(
    private donationService: DonationService,
    private campaignService: CampaignService,
    private accountService: AccountService // Assuming you have this service for accounts
  ) {}

  ngOnInit(): void {
    // Fetch or initialize your data here (for example, accounts, donations, and campaigns)
    this.fetchData();
  }

  fetchData() {
    console.log('Fetching data...');

    // Fetch donations
    this.donationService.getAllDonations().subscribe(donations => {
      console.log('Donations fetched:', donations);
      this.donations = donations;
      this.filterDonors(); // Reapply filters after fetching data
      this.filterBeneficiaries(); // Reapply filters after fetching data
    }, error => {
      console.error('Error fetching donations:', error);
    });

    // Fetch campaigns
    this.campaignService.getAllCampaigns().subscribe(campaigns => {
      console.log('Campaigns fetched:', campaigns);
      this.campaigns = campaigns;
      this.filterDonors(); // Reapply filters after fetching data
      this.filterBeneficiaries(); // Reapply filters after fetching data
    }, error => {
      console.error('Error fetching campaigns:', error);
    });

    // Fetch accounts
    this.accountService.getAll().subscribe(accounts => {
      console.log('Accounts fetched:', accounts);
      this.accounts = accounts;
      this.filterDonors(); // Reapply filters after fetching data
      this.filterBeneficiaries(); // Reapply filters after fetching data
    }, error => {
      console.error('Error fetching accounts:', error);
    });
  }

  filterDonors() {
    console.log('Filtering donors with search term:', this.donorSearchTerm);
    this.filteredDonors = this.accounts.filter(account => {
      // Ensure comparison types are consistent (convert account.id to a number if needed)
      const matchesName = (account.acc_firstname + ' ' + account.acc_lastname).toLowerCase().includes(this.donorSearchTerm.toLowerCase());
      const matchesCampaign = this.campaigns.some(campaign => 
        campaign.Campaign_Name.toLowerCase().includes(this.donorSearchTerm.toLowerCase()) && +campaign.Acc_ID === +account.id // Convert both to number
      );
      return matchesName || matchesCampaign;
    });
    console.log('Filtered donors:', this.filteredDonors);

    // Update total donations
    this.totalDonationsAmount = this.filteredDonors.reduce((sum, donor) => {
      return sum + (this.donations.filter(donation => Number(donation.acc_id) === Number(donor.id)).reduce((sum, donation) => sum + donation.donation_amount, 0));
    }, 0);
    console.log('Total donations amount:', this.totalDonationsAmount);
  }

  filterBeneficiaries() {
    console.log('Filtering beneficiaries with search term:', this.beneficiarySearchTerm);
    this.filteredBeneficiaries = this.accounts.filter(account => {
      // Ensure comparison types are consistent (convert account.id to a number if needed)
      const matchesName = (account.acc_firstname + ' ' + account.acc_lastname).toLowerCase().includes(this.beneficiarySearchTerm.toLowerCase());
      const matchesCampaign = this.campaigns.some(campaign => 
        campaign.Campaign_Name.toLowerCase().includes(this.beneficiarySearchTerm.toLowerCase()) && +campaign.Acc_ID === +account.id // Convert both to number
      );
      return matchesName || matchesCampaign;
    });
    console.log('Filtered beneficiaries:', this.filteredBeneficiaries);

    // Update total help received
    this.totalHelpReceivedAmount = this.filteredBeneficiaries.reduce((sum, beneficiary) => {
      return sum + (this.donations.filter(donation => Number(donation.acc_id) === Number(beneficiary.id)).reduce((sum, donation) => sum + donation.donation_amount, 0));
    }, 0);
    console.log('Total help received amount:', this.totalHelpReceivedAmount);
  }
}
