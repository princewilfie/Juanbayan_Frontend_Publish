import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountService } from './_services';
import { Account, Role } from './_models';

@Component({
  selector: 'app',
  templateUrl: 'app.component.html',
  // styleUrls: ['app.component.css'] // Uncomment if using external CSS
})
export class AppComponent implements OnInit, OnDestroy {
  Role = Role;
  account: Account | null = null; // Default to null for logged out state
  showNavbar = true; // Controls navbar visibility
  dropdownVisible = false; // Control dropdown visibility
  private accountSubscription: Subscription | undefined;

  constructor(private accountService: AccountService, private router: Router) {}

  ngOnInit() {
    // Subscribe to the account observable to detect login/logout
    this.accountSubscription = this.accountService.account.subscribe(account => {
      this.account = account;
      this.updateNavbarVisibility(this.router.url); // Update navbar visibility when account changes
    });

    // Initial visibility check
    this.updateNavbarVisibility(this.router.url);

    // Update visibility on route changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateNavbarVisibility(event.url);
      }
    });
  }

  ngOnDestroy() {
    // Unsubscribe from account observable to avoid memory leaks
    this.accountSubscription?.unsubscribe();
  }

  private updateNavbarVisibility(url: string) {
    const accountRoutes = [
      '/account/login-register',
      '/account/forgot-password',
      '/account/verify-email',
      '/account/reset-password'
    ];
    const adminRoutes = [
      '/admin',
      '/admin/dashboard',
      '/admin/accounts' // Add your admin routes here
    ];

    // Determine visibility based on the current URL
    const isAccountRoute = accountRoutes.some(route => url.includes(route));
    const isAdminRoute = adminRoutes.some(route => url.includes(route));

    if (isAccountRoute || isAdminRoute) {
      this.showNavbar = false;
    } else if (url.includes('/landing-page') || url.includes('/home')) {
      this.showNavbar = true;
    } else {
      this.showNavbar = this.account !== null; // Show navbar if logged in on other pages
    }
  }
  
  logout() {
    const token = localStorage.getItem('token'); // Get the token from local storage
    if (token) {
      this.accountService.logout(token); // Pass the token to the logout method
    } else {
      this.accountService.logout1(); // If no token found, just call logout without token
    }

    this.router.navigate(['/account/login-register']); // Redirect to login-register after logout
    this.showNavbar = false; // Hide the navbar immediately after logging out
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

  // Handle back button navigation if user is logged out
  @HostListener('window:popstate', ['$event'])
  onPopState(event: Event) {
    if (!this.accountService.accountValue) {
      this.router.navigate(['/account/login-register']);  // Redirect to login if no account
    }
  }
}
