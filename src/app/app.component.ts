import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AccountService } from './_services';
import { Account, Role } from './_models';

@Component({
  selector: 'app',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  Role = Role;
  account: Account | null = null; // Default to null for logged out state
  showNavbar: boolean = true; // Controls navbar visibility
  dropdownVisible: boolean = false; // Control dropdown visibility

  constructor(private accountService: AccountService, private router: Router) {}

  ngOnInit() {
    // Subscribe to the account observable to detect login/logout
    this.accountService.account.subscribe(account => {
      console.log(account);
      this.account = account;     
      this.updateNavbarVisibility(this.router.url); // Update navbar visibility when account changes
    });

    // Check visibility initially
    this.updateNavbarVisibility(this.router.url);

    // Update visibility on route changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateNavbarVisibility(event.url);
      }
    });
  }

  updateNavbarVisibility(url: string) {
    const isLandingPage = url === '/' || url.includes('/landing-page');
    this.showNavbar = !isLandingPage || this.account !== null; // Show navbar if logged in, or not on landing page
  }

  logout() {
    this.accountService.logout();
    this.router.navigate(['/account/login-register']); // Ensure routing to login-register after logout
  }

  // Toggles the dropdown visibility on clicking the user name
  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  // Closes the dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent) {
    const clickedInside = (event.target as HTMLElement).closest('.dropdown');
    if (!clickedInside) {
      this.dropdownVisible = false; // Close dropdown if clicked outside
    }
  }
}
