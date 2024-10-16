import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CampaignService } from '../_services/campaign.service';
import { Campaign } from '../_models/campaign'; // Adjust based on your actual path
import { Router } from '@angular/router';

@Component({
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
})
export class CampaignDetailsComponent implements OnInit {
  campaign: Campaign | undefined;
  errorMessage: string | null = null;


  constructor(
    private route: ActivatedRoute,
    private campaignService: CampaignService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const campaignId = this.route.snapshot.paramMap.get('id');
    if (campaignId) {
      this.loadCampaignDetails(campaignId);
    }
  }

  loadCampaignDetails(campaignId: string): void {
    this.campaignService.getById(+campaignId).subscribe(
      (data: Campaign) => {
        this.campaign = data;
      },
      (error) => {
        this.errorMessage = 'Error loading campaign details: ' + error.message;
      }
    );
  }

  getImagePath(image: string): string {
    return image ? `http://localhost:4000/${image}` : 'assets/'; 
  }

  goBack() {
    this.router.navigate(['/campaign']); // Update the route as needed
  }
  
}