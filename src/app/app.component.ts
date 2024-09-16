import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountService } from './_services';
import { Account, Role } from './_models';

@Component({
  selector: 'app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  Role = Role;
  account: Account | null = null; // Default to null for logged out state
  showNavbar: boolean = true; // Controls navbar visibility
  dropdownVisible: boolean = false; // Control dropdown visibility
  accountSubscription: Subscription | undefined;

  constructor(private accountService: AccountService, private router: Router) {}

  ngOnInit() {
    // Subscribe to the account observable to detect login/logout
    this.accountSubscription = this.accountService.account.subscribe(account => {
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

  ngOnDestroy() {
    // Unsubscribe from account observable to avoid memory leaks
    if (this.accountSubscription) {
      this.accountSubscription.unsubscribe();
    }
  }

  updateNavbarVisibility(url: string) {
    const accountRoutes = ['/account/login-register', '/account/forgot-password', '/account/verify-email', '/account/reset-password'];
    const adminRoutes = ['/admin', '/admin/dashboard', '/admin/accounts']; // Add your admin routes here
    
    // Check if the current route is an account-related route
    const isAccountRoute = accountRoutes.some(route => url.includes(route));
    const isAdminRoute = adminRoutes.some(route => url.includes(route));

    // Show navbar and footer on landing page and homepage when logged in, hide on account and admin routes
    if (isAccountRoute || isAdminRoute) {
      this.showNavbar = false;
    } else if (url.includes('/landing-page') || url.includes('/home')) {
      this.showNavbar = true;
    } else {
      this.showNavbar = this.account !== null; // Show navbar if logged in on other pages
    }
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

  // Handle back button navigation if user is logged out
  @HostListener('window:popstate', ['$event'])
  onPopState(event: Event) {
      if (!this.accountService.accountValue) {
          this.router.navigate(['/account/login-register']);  // Redirect to login if no account
      }
  }

}
