import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from './_services';
import { Account, Role } from './_models';

@Component({
    selector: 'app',
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
    Role = Role;
    account: Account;

    constructor(private accountService: AccountService, private router: Router) {
        this.accountService.account.subscribe(x => this.account = x);
    }

    ngOnInit() {
        // Check if the user is logged in and redirect accordingly
        if (this.account) {
            // Handle redirection to default dashboard based on role
            if (this.router.url === '/' && this.account.acc_role) {
                if (this.account.acc_role === Role.Admin) {
                    this.router.navigate(['/admin']);
                } else {
                    this.router.navigate(['/profile']);
                }
            }
        }
    }

    logout() {
        this.accountService.logout();
    }
}
