import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AccountService } from '@app/_services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private accountService: AccountService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const account = this.accountService.accountValue;

        // Check if user is logged in
        if (account) {

            // Check if route is restricted by role
            if (route.data.roles && !route.data.roles.includes(account.acc_role)) {
                // Role not authorized so redirect to the home page
                this.router.navigate(['/landing-page']);
                return false;
            }
            
            // Authorized so return true
            return true;
        }

        this.router.navigate(['/account/login-register'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}
