import { Component, OnInit, Renderer2 } from '@angular/core';
import { AccountService } from '@app/_services'; // Make sure the path is correct
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html'
})
export class LandingPageComponent implements OnInit {
  
  donationGoal: number = 10; // Goal in millions
  currentDonation: number = 5; // Collected in millions
  progressPercentage: string = '0%';
  account: any;

  constructor(
    private renderer: Renderer2,
    private accountService: AccountService, // Inject the account service to check user status
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateProgressBar();
    this.account = this.accountService.accountValue; // Only check the login status, no redirection
  }
  

  // Method to update the progress bar based on donations
  updateProgressBar() {
    const progress = (this.currentDonation / this.donationGoal) * 100;
    this.progressPercentage = `${progress}%`;
    const progressBarElement = document.getElementById('progress') as HTMLElement;
    if (progressBarElement) {
      this.renderer.setStyle(progressBarElement, 'width', this.progressPercentage);
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


  onNavigate(url: string) {
    if (!this.account) {
      this.router.navigate(['/account/login-register'], { queryParams: { returnUrl: url } });
    } else {
      this.router.navigate([url]);
    }
  }

  // Logout
  logout() {
    this.accountService.logout();
    this.router.navigate(['/account/login-register']);
  }
  
  
  
}
