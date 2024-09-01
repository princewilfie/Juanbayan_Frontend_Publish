import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AccountService } from '@app/_services';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
    constructor(
        private router: Router,
        private accountService: AccountService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const account = this.accountService.accountValue;
        const targetRoute = state.url;
    
        console.log('AuthGuard - Account Value:', account);
    
        if (account) {
            if (route.data.roles && !route.data.roles.includes(account.acc_role)) {
                console.log('Role not authorized:', account.acc_role);
                this.router.navigate(['/']);
                return false;
            }
    
            // Avoid redirect loop
            if (account.acc_role === 'Admin' && targetRoute !== '/admin') {
                console.log('Redirecting to Admin');
                this.router.navigate(['/admin']);
                return false;
            }
    
            console.log('Role authorized:', account.acc_role);
            return true;
        }
    
        console.log('Not logged in, redirecting to login page');
        this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
    
    
}