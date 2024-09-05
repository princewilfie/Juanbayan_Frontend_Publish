import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AccountService } from './_services';
import { Account, Role } from './_models';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent implements OnInit {
    Role = Role;
    account: Account;
    showNavbar: boolean = true; // Controls navbar visibility

    constructor(private accountService: AccountService, private router: Router) {}

    ngOnInit() {
        this.accountService.account.subscribe(x => this.account = x);
        
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
        // Treat '/' as the landing page to hide navbar
        const isLandingPage = url === '/' || url.includes('/landing-page');
        console.log('Current URL:', url); // Debug logging
        this.showNavbar = !isLandingPage;
    }

    logout() {
        this.accountService.logout();
    }
}
