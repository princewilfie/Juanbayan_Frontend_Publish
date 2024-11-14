import { Component, ViewEncapsulation } from '@angular/core';
import { Router} from '@angular/router';
import { AccountService } from '../_services';
import { Account } from '../_models';

@Component({
    templateUrl: 'layout.component.html',
    styleUrls: ['layout.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class LayoutComponent {
    account: Account;

    constructor(
        private accountService: AccountService,
        private router: Router

    ) {}

    ngOnInit(): void {
        // Fetch account data
        this.account = this.accountService.accountValue;
      
        // Debug log the account value
        console.log('Account Data:', this.account);
    
    }
    logout() {
        this.accountService.logout();
        this.router.navigate(['account/login-register']); // Redirect to login on logout
      }   
}


