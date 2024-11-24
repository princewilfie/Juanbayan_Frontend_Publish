import { Component, OnInit, Renderer2 } from '@angular/core';
import { AccountService, CampaignService } from '@app/_services'; // Make sure the path is correct
import { Router } from '@angular/router';
import { Campaign } from '@app/_models';
import { EventService, WithdrawService } from '../_services';
import { Withdraw } from '../_models';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html'
})
export class LandingPageComponent implements OnInit {
  
  account: any;
  campaigns: Campaign[] = [];
  activeApprovedEvents: any[] = [];
  totalGoal: number;
  totalCollection: number;
  progressPercentage: number = 0;
  testimonies: Withdraw[] = [];
  filteredCampaigns: Campaign[] = [];

  constructor(
    private renderer: Renderer2,
    private accountService: AccountService, // Inject the account service to check user status
    private router: Router,
    private campaignService: CampaignService,
    private eventService: EventService,
    private withdrawService: WithdrawService
  ) {}

  ngOnInit(): void {
    this.account = this.accountService.accountValue;
    this.loadApprovedCampaigns(); // Fetch campaigns and load data
    this.loadActiveApprovedEvents();

    this.withdrawService.getAll().subscribe((data: Withdraw[]) => {
      this.testimonies = data.filter(withdraw => withdraw.Testimony); // Only include entries with testimony
    });
  }
  
  loadApprovedCampaigns(): void {
    this.campaignService.getAllCampaigns().subscribe((campaigns: Campaign[]) => {
      this.campaigns = campaigns.filter(campaign => campaign.Campaign_Status === 1);
      
      // Calculate Progress_Percentage for each campaign
      this.campaigns = this.campaigns.map(campaign => {
        const progress = campaign.Campaign_TargetFund
          ? (campaign.Campaign_CurrentRaised || 0) / campaign.Campaign_TargetFund * 100
          : 0;

        // Log the individual progress for each campaign
        console.log(`Campaign: ${campaign.Campaign_Name}, Progress: ${progress}%`);
        // Add the calculated progress to each campaign
        return { ...campaign, progress }; // Add progress to each campaign
      });
      this.calculateTotals();
      this.filteredCampaigns = [...this.campaigns]; // Initialize filteredCampaigns with all approved campaigns
    });
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

  // Check if the user is logged in
  checkLoginStatus() {
    this.account = this.accountService.accountValue;

    if (!this.account) {
      // Redirect to login-register page if not logged in
      this.router.navigate(['/account/login-register']);
    }
  }

  onDonate() {
    if (!this.account) {
      this.router.navigate(['/account/login-register'], { queryParams: { returnUrl: '/donate' } });
    } else {
      // Navigate to the donate page or show donate modal
      this.router.navigate(['/donate']);
    }
  }

  getStarted() {
      this.router.navigate(['/account/login-register']);
  }

  getImagePath(image: string): string {
    return image ? `http://localhost:4000/${image}` : 'assets/'; 
  }


  about() {
      this.router.navigate(['/team-member']);

  }

  onNavigate(url: string) {
    if (!this.account) {
      this.router.navigate(['/account/login-register'], { queryParams: { returnUrl: url } });
    } else {
      this.router.navigate([url]);
    }
  }

  // Method to update the progress bar based on donations
  updateProgressBar(): void {
    const progress = this.totalGoal ? (this.totalCollection / this.totalGoal) * 100 : 0;
    this.progressPercentage = progress;
    const progressBarElement = document.getElementById('progress') as HTMLElement;
    if (progressBarElement) {
      this.renderer.setStyle(progressBarElement, 'width', `${this.progressPercentage}%`);
    }
  }
  
  calculateTotals(): void {
    this.totalGoal = this.campaigns.reduce((sum, campaign) => sum + campaign.Campaign_TargetFund, 0);
    this.totalCollection = this.campaigns.reduce((sum, campaign) => sum + (campaign.Campaign_CurrentRaised || 0), 0);
    
    // Calculate progress percentage, making sure to avoid division by zero
    this.progressPercentage = this.totalGoal ? (this.totalCollection / this.totalGoal) * 100 : 0;
    this.updateProgressBar();
  }
  // Logout
  logout() {

    this.accountService.logout(); // Pass the token to the logout method 
    this.router.navigate(['/account/login-register']);
  
  }


}
