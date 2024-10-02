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
    this.campaignService.getAll().subscribe(
      (data: Campaign[]) => {
        this.campaigns = data;
      },
      error => {
        console.error('Error fetching campaigns:', error);
      }
    );
  }

  approveCampaign(id: number): void {
    this.campaignService.approve(id).subscribe(
      (response: Campaign) => {
        this.updateCampaignStatus(id, 'Approved');
      },
      error => {
        console.error('Error approving campaign:', error);
      }
    );
  }

  rejectCampaign(id: number): void {
    this.campaignService.reject(id).subscribe(
      (response: Campaign) => {
        this.updateCampaignStatus(id, 'Rejected');
      },
      error => {
        console.error('Error rejecting campaign:', error);
      }
    );
  }

  private updateCampaignStatus(id: number, approvalStatus: string): void {
    const campaign = this.campaigns.find(c => c.Campaign_ID === id);
    if (campaign) {
      campaign.Campaign_ApprovalStatus = approvalStatus; // For approval status
      if (approvalStatus === 'Approved') {
        campaign.Campaign_Status = 1; // Active if approved
      } else if (approvalStatus === 'Rejected') {
        campaign.Campaign_Status = 0; // Remains inactive if rejected
      }
    }
  }

  // Optionally add this method if you need better campaign status handling
  getCampaignStatus(status: number): string {
    return status === 1 ? 'Active' : 'Inactive';
  }
}