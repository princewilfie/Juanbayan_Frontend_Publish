import { Component, OnInit, Renderer2 } from '@angular/core';
import { AccountService, CampaignService, EventService } from '../_services';
import { Campaign } from '../_models';

@Component({
  selector: 'app-donor-dashboard',
  templateUrl: './donor-dashboard.component.html',
  styleUrls: ['./donor-dashboard.component.css']
})
export class DonorDashboardComponent implements OnInit {
  user = 'User';
  campaigns: Campaign[] = [];
  totalGoal: number = 0;
  totalCollection: number = 0;
  progressPercentage: number = 0;
  activeApprovedEvents: any;
  account: any;

  constructor(
    private renderer: Renderer2,
    private eventService: EventService,
    private accountService: AccountService,
    private campaignService: CampaignService
  ) {}

  ngOnInit() {
    this.updateProgressBar();
    this.account = this.accountService.accountValue;
    this.loadActiveApprovedEvents();
    this.loadApprovedCampaigns(); // Only check the login status, no redirection
  }

  updateProgressBar(): void {
    const progress = this.totalGoal ? (this.totalCollection / this.totalGoal) * 100 : 0;
    this.progressPercentage = progress;
    const progressBarElement = document.getElementById('progress') as HTMLElement;
    if (progressBarElement) {
      this.renderer.setStyle(progressBarElement, 'width', `${this.progressPercentage}%`);
    }
  }

  getImagePath(image: string): string {
    return image ? `http://localhost:4000/${image}` : 'assets/'; 
  }

  loadActiveApprovedEvents() {
    this.eventService.getApprovedActiveEvents().subscribe(
      (data: any[]) => {
        this.activeApprovedEvents = data;
        console.log("Fetched events:", this.activeApprovedEvents);
      },
      (error) => {
        console.error('Error fetching events:', error);
      }
    );
  }

  loadApprovedCampaigns(): void {
    this.campaignService.getApprovedCampaigns().subscribe({
      next: (data) => {
        this.campaigns = data;
        this.calculateTotals();
      },
      error: (err) => {
        console.error('Error loading campaigns:', err);
      }
    });
  }

  calculateTotals(): void {
    this.totalGoal = this.campaigns.reduce((sum, campaign) => sum + campaign.Campaign_TargetFund, 0);
    this.totalCollection = this.campaigns.reduce((sum, campaign) => sum + (campaign.Campaign_CurrentRaised || 0), 0);
    
    // Calculate progress percentage, making sure to avoid division by zero
    this.progressPercentage = this.totalGoal ? (this.totalCollection / this.totalGoal) * 100 : 0;
    this.updateProgressBar();
  }
  
}