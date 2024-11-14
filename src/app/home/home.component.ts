import { Component, OnInit, Renderer2 } from '@angular/core';
import { AccountService, CampaignService } from '@app/_services'; // Make sure the path is correct
import { Router } from '@angular/router';
import { Campaign } from '@app/_models';
import * as $ from 'jquery';  // Import jQuery
import { EventService } from '../_services';

@Component({
  templateUrl: 'home.component.html'
})
export class HomeComponent implements OnInit {
  account: any;
  campaigns: Campaign[] = [];
  totalGoal: number = 0;
  totalCollection: number = 0;
  progressPercentage: number = 0;
  activeApprovedEvents: any;

  constructor(
    private renderer: Renderer2,
    private accountService: AccountService, // Inject the account service to check user status
    private router: Router,
    private campaignService: CampaignService,
    private eventService: EventService
  ) { }

  ngOnInit() {
    this.updateProgressBar();
    this.account = this.accountService.accountValue;
    this.loadActiveApprovedEvents();
    this.loadApprovedCampaigns(); // Only check the login status, no redirection
  }

  
  ngAfterViewInit(): void {
    //this.applyBackgroundImages();
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
    const account = this.accountService.accountValue;
    
    // Check if the user is logged in
    if (!account) {
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

  viewEventDetails(eventId: string | undefined) {
    if (eventId) {
      this.router.navigate(['/event-details', eventId]);
    } else {
      console.error("Event ID is undefined or missing");
    }
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