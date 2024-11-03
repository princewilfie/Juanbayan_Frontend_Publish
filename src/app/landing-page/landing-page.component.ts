import { Component, OnInit, Renderer2 } from '@angular/core';
import { AccountService, CampaignService } from '@app/_services'; // Make sure the path is correct
import { Router } from '@angular/router';
import { Campaign } from '@app/_models';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html'
})
export class LandingPageComponent implements OnInit {
  
  account: any;
  campaigns: Campaign[] = [];
  totalGoal: number = 0;
  totalCollection: number = 0;
  progressPercentage: number = 0;

  constructor(
    private renderer: Renderer2,
    private accountService: AccountService, // Inject the account service to check user status
    private router: Router,
    private campaignService: CampaignService
  ) {}

  ngOnInit(): void {
    this.updateProgressBar();
    this.account = this.accountService.accountValue;
    this.loadApprovedCampaigns(); // Only check the login status, no redirection
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

  getImagePath(image: string): string {
    return image ? `http://localhost:4000/${image}` : 'assets/'; 
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

  // Logout
  logout() {

    this.accountService.logout(); // Pass the token to the logout method 
    this.router.navigate(['/account/login-register']);
  
  }
}
