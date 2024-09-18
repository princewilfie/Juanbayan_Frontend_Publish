import { Component, OnInit } from '@angular/core';
import { AccountService } from '@app/_services';
import { CampaignService } from '@app/_services/campaign.service'; // Assume you have a service to get campaigns
import { Account } from '@app/_models/account';
import { Campaign } from '@app/_models/campaign';

@Component({
  selector: 'app-details',
  templateUrl: './profile.details.component.html'
})
export class DetailsComponent implements OnInit {
  account: Account;
  campaigns: Campaign[];
  currentSection: string = 'activities'; // Default section

  constructor(
    private accountService: AccountService,
    private campaignService: CampaignService // Assume a service to fetch campaigns
  ) {}

  ngOnInit(): void {
    // Fetch account data
    this.account = this.accountService.accountValue;

    // Fetch campaigns data, assuming this is an async call to a backend or service
    this.campaignService.getCampaignsByAccountId(this.account.id).subscribe((campaigns) => {
      this.campaigns = campaigns;
    });
  }

  showSection(section: string): void {
    this.currentSection = section; // Set the current section based on the button clicked
  }

  openProfileModal() {
    // Logic to open profile modal, if necessary
  }
}
