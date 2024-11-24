import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../_services';
import { Account } from '../../_models';

@Component({
  selector: 'app-reports-profiling',
  templateUrl: './reports-profiling.component.html',
  styleUrls: ['./reports-profiling.component.css']
})
export class ReportsProfilingComponent implements OnInit {
  donors: any[] = [];
  beneficiaries: any[] = [];
  filteredDonors: any[] = [];
  filteredBeneficiaries: any[] = [];
  donorSearchTerm: string = '';
  beneficiarySearchTerm: string = '';
  totalDonations: number = 0;
  totalHelpReceived: number = 0;
  flattenedDonors: any[] = [];
  flattenedBeneficiaries: any[] = [];

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.loadDonors();
    this.loadBeneficiaries();
  }
  loadDonors(): void {
    this.accountService.getAllDonors().subscribe((response: any) => {
      this.donors = response?.data || [];
      this.flattenedDonors = this.flattenDonations(this.donors);
      console.log('Donors:', this.donors); // Debugging
      this.calculateTotalDonations();
    });
  }

  loadBeneficiaries(): void {
    this.accountService.getAllBeneficiaries().subscribe((response: any) => {
      this.beneficiaries = response?.data || [];
      this.flattenedBeneficiaries = this.flattenCampaigns(this.beneficiaries);
      console.log('Beneficiaries:', this.beneficiaries); // Debugging
      this.calculateTotalHelpReceived();
    });
  }

  flattenDonations(donors: any[]): any[] {
    return donors
      .map((donor) =>
        donor.Donations.map((donation: any) => ({
          id: donor.id,
          acc_firstname: donor.acc_firstname,
          acc_lastname: donor.acc_lastname,
          acc_email: donor.acc_email,
          acc_pnumber: donor.acc_pnumber,
          campaign_name: donation.campaign.Campaign_Name,
          donation_amount: donation.donation_amount,
        }))
      )
      .reduce((acc, val) => acc.concat(val), []);
  }
  
  flattenCampaigns(beneficiaries: any[]): any[] {
    return beneficiaries
      .map((beneficiary) =>
        beneficiary.Campaigns.map((campaign: any) => ({
          id: beneficiary.id,
          acc_firstname: beneficiary.acc_firstname,
          acc_lastname: beneficiary.acc_lastname,
          acc_email: beneficiary.acc_email,
          acc_pnumber: beneficiary.acc_pnumber,
          campaign_name: campaign.Campaign_Name,
          campaign_currentraised: campaign.Campaign_CurrentRaised,
        }))
      )
      .reduce((acc, val) => acc.concat(val), []);
  }
  
  filterDonors(): void {
    this.filteredDonors = this.donors.filter((donor) =>
      `${donor.acc_firstname} ${donor.acc_lastname}`
        .toLowerCase()
        .includes(this.donorSearchTerm.toLowerCase())
    );
    this.calculateTotalDonations();
  }

  filterBeneficiaries(): void {
    this.filteredBeneficiaries = this.beneficiaries.filter((beneficiary) =>
      `${beneficiary.acc_firstname} ${beneficiary.acc_lastname}`
        .toLowerCase()
        .includes(this.beneficiarySearchTerm.toLowerCase())
    );
    this.calculateTotalHelpReceived();
  }

  calculateTotalDonations(): void {
    this.totalDonations = this.donors.reduce((sum, donor) => {
      return sum + (donor.Donations?.reduce((donationSum, donation) => donationSum + donation.donation_amount, 0) || 0);
    }, 0);
  }
  
  calculateTotalHelpReceived(): void {
    this.totalHelpReceived = this.beneficiaries.reduce((sum, beneficiary) => {
      return sum + (beneficiary.Campaigns?.reduce((campaignSum, campaign) => campaignSum + campaign.Campaign_CurrentRaised, 0) || 0);
    }, 0);
  }
  

  downloadCSV(data: any[], filename: string): void {
    const csvData = this.convertToCSV(data);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `${filename}.csv`);
    a.click();
  }

  private convertToCSV(data: any[]): string {
    const headers = Object.keys(data[0]);
    const rows = data.map((row) =>
      headers.map((header) => `"${row[header] || ''}"`).join(',')
    );
    return [headers.join(','), ...rows].join('\n');
  }
}