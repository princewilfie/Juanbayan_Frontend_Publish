import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AccountService } from '@app/_services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private accountService: AccountService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const account = this.accountService.accountValue;
        const targetRoute = state.url;

        console.log('AuthGuard - Account Value:', account);

        if (account) {
            // Check if the route requires specific roles
            if (route.data.roles && !route.data.roles.includes(account.acc_role)) {
                console.log('Role not authorized:', account.acc_role);
                this.router.navigate(['/']);
                return false;
            }

            // Avoid redirect loop: Redirect users based on their role
            if (account.acc_role === 'Admin' && targetRoute !== '/admin') {
                console.log('Redirecting to Admin');
                this.router.navigate(['/admin']);
                return false;
            }

            if (account.acc_role !== 'Admin' && targetRoute === '/admin') {
                console.log('Redirecting to User Profile');
                this.router.navigate(['/profile']);
                return false;
            }

            console.log('Role authorized:', account.acc_role);
            return true;
        }

        console.log('Not logged in, redirecting to landing page');
        // Redirect to landing page for non-logged-in users
        this.router.navigate(['/']);
        return false;
    }
}
