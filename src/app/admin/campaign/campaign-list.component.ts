import { Component, OnInit } from '@angular/core';
import { CampaignService } from '@app/_services';
import { Campaign } from '@app/_models';

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html'
})
export class CampaignListComponent implements OnInit {
  campaigns: Campaign[] = [];

  constructor(private campaignService: CampaignService) {}

  ngOnInit(): void {
    this.loadCampaigns(); // Initial load
  }

  // Method to load all campaigns from the backend
  loadCampaigns(): void {
    this.campaignService.getAll().subscribe(
      (data: Campaign[]) => {
        this.campaigns = data;
      },
      error => {
        console.error('Error fetching campaigns:', error);
      }
    );
  }

  // Approve a campaign and reload the list after
  approveCampaign(id: number): void {
    this.campaignService.approve(id).subscribe(
      (response: Campaign) => {
        console.log('Campaign approved:', response);  // Log the approved campaign
        this.loadCampaigns();  // Reload the campaign list after approval
      },
      error => {
        console.error('Error approving campaign:', error);
      }
    );
  }
  

  // Reject a campaign and reload the list after
  rejectCampaign(id: number): void {
    this.campaignService.reject(id).subscribe(
      (response: Campaign) => {
        this.loadCampaigns(); // Reload campaign list after rejection
      },
      error => {
        console.error('Error rejecting campaign:', error);
      }
    );
  }

  // Optionally add this method if you need better campaign status handling
  getCampaignStatus(status: number): string {
    return status === 1 ? 'Active' : 'Inactive';
  }
}