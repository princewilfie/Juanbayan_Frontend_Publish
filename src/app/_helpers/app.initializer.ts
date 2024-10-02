import { AccountService } from '@app/_services';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export function appInitializer(accountService: AccountService) {
    return () => new Promise<void>(resolve => {  // Specify <void> as the type argument
        // attempt to refresh token on app startup to auto authenticate
        accountService.refreshToken()
            .pipe(
                catchError(error => {
                    console.error('Error refreshing token:', error); // Log the error
                    // Return an observable that completes successfully
                    return of(null); // or handle it as needed
                })
            )
            .subscribe(() => {
                resolve(); // Resolve the promise after the subscription completes
            });
    });
}
