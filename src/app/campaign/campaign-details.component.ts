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

// Generate dynamic campaign URL
getCampaignUrl(): string {
  return `http://juanbayan.com.ph/campaign/${this.campaign?.Campaign_ID}`;  // Replace with your actual base URL
}

shareToFacebook(url: string): void {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  window.open(facebookUrl, '_blank');
}

shareToTwitter(url: string): void {
  const twitterUrl = `https://twitter.com/share?url=${encodeURIComponent(url)}&text=Check+out+this+campaign!`;
  window.open(twitterUrl, '_blank');
}

shareToInstagram(url: string): void {
  alert('Instagram doesn\'t allow direct sharing from the web. Link copied to clipboard.');
  this.copyToClipboard(url);
}

copyToClipboard(text: string): void {
  const tempInput = document.createElement('input');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
}
  getImagePath(image: string): string {
    return image ? `http://localhost:4000/${image}` : 'assets/'; 
  }

  goBack() {
    this.router.navigate(['/campaign']); // Update the route as needed
  }
  
}