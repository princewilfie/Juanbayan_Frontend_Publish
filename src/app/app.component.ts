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
  account: Account | null = null; // Set to null initially, representing no user logged in
  showNavbar = false; // Initialize as false to hide by default
  dropdownVisible = false; // Control dropdown visibility
  private accountSubscription: Subscription | undefined;
  isSidebarOpen = false;

  constructor(private accountService: AccountService, private router: Router) {}

  ngOnInit() {
    // Subscribe to the account observable to detect login/logout
    this.accountSubscription = this.accountService.account.subscribe(account => {
      this.account = account;
      this.updateNavbarVisibility(this.router.url); // Update navbar visibility on login/logout
      this.isSidebarOpen = false;
    });

    // Initial visibility check
    this.updateNavbarVisibility(this.router.url);

    // Update navbar visibility on route changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateNavbarVisibility(event.url);
      }
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
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

    // Check if the current route is an account-related route
    const isAccountRoute = accountRoutes.some(route => url.includes(route));

    if (isAccountRoute) {
      this.showNavbar = false; // Hide navbar on account-related routes
    } else {
      this.showNavbar = this.account !== null; // Show navbar only if account is not null (user is logged in)
    }
  }

  logout() {
    this.accountService.logout();
    this.router.navigate(['account/login-register']); // Redirect to login on logout
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
