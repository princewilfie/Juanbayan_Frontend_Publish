import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../_services';
import { Account } from '../../_models';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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

  downloadDonorPDF(): void {
    const doc = new jsPDF();
    let finalY = 20; // Initial Y position for the content
  
    // Table generation
    (doc as any).autoTable({
      head: [['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Campaign', 'Donation Amount']],
      body: this.flattenedDonors.map(donor => [
        donor.id,
        donor.acc_firstname,
        donor.acc_lastname,
        donor.acc_email,
        donor.acc_pnumber,
        donor.campaign_name,
        `P${donor.donation_amount.toFixed(2)}`,
      ]),
      startY: finalY,
      didDrawCell: (data: any) => {
        finalY = data.cursor.y; // Capture the current Y position
      },
    });
  
    // Add text after the table
    doc.text(`Total Donors: ${this.flattenedDonors.length}`, 14, finalY + 10);
    doc.text(`Total Donations: P${this.totalDonations.toFixed(2)}`, 14, finalY + 20);
  
    // Save the PDF
    doc.save('JuanBayan-Donors.pdf');
  }
  
  downloadBeneficiaryPDF(): void {
    const doc = new jsPDF();
    let finalY = 20; // Initial Y position for the content
  
    // Table generation
    (doc as any).autoTable({
      head: [['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Campaign', 'Amount Raised']],
      body: this.flattenedBeneficiaries.map(beneficiary => [
        beneficiary.id,
        beneficiary.acc_firstname,
        beneficiary.acc_lastname,
        beneficiary.acc_email,
        beneficiary.acc_pnumber,
        beneficiary.campaign_name,
        `P${beneficiary.campaign_currentraised.toFixed(2)}`,
      ]),
      startY: finalY,
      didDrawCell: (data: any) => {
        finalY = data.cursor.y; // Capture the current Y position
      },
    });
  
    // Add text after the table
    doc.text(`Total Beneficiaries: ${this.flattenedBeneficiaries.length}`, 14, finalY + 10);
    doc.text(`Total Help Received: P${this.totalHelpReceived.toFixed(2)}`, 14, finalY + 20);
  
    // Save the PDF
    doc.save('JuanBayan-Beneficiaries.pdf');
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
    this.flattenedDonors = this.donors.filter((donor) =>
      `${donor.acc_firstname} ${donor.acc_lastname}`
        .toLowerCase()
        .includes(this.donorSearchTerm.toLowerCase())
    );
    this.calculateTotalDonations();
  }

  filterBeneficiaries(): void {
    this.flattenedBeneficiaries = this.beneficiaries.filter((beneficiary) =>
      `${beneficiary.acc_firstname} ${beneficiary.acc_lastname}`
        .toLowerCase()
        .includes(this.beneficiarySearchTerm.toLowerCase())
    );
    this.calculateTotalHelpReceived();
  }

  calculateTotalDonations(): void {
    this.totalDonations = this.flattenedDonors.reduce((sum, donor) => {
      return sum + (donor.donation_amount || 0); // Use the flattenedDonors donation_amount directly
    }, 0);
  }
  
  calculateTotalHelpReceived(): void {
    this.totalHelpReceived = this.flattenedBeneficiaries.reduce((sum, beneficiary) => {
      return sum + (beneficiary.campaign_currentraised || 0); // Use the flattenedBeneficiaries campaign_currentraised directly
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