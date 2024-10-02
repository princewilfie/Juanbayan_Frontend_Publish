import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Account } from '@app/_models';

const baseUrl = `${environment.apiUrl}/accounts`;

@Injectable({ providedIn: 'root' })
export class AccountService {
    private accountSubject: BehaviorSubject<Account>;
    public account: Observable<Account>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.accountSubject = new BehaviorSubject<Account>(null);
        this.account = this.accountSubject.asObservable();
    }

    public get accountValue(): Account {
        return this.accountSubject.value;
    }

    login(acc_email: string, acc_passwordHash: string) {
        return this.http.post<any>(`${baseUrl}/authenticate`, { acc_email, acc_passwordHash }, { withCredentials: true })
            .pipe(map(account => {
                console.log("Login response:", account); // Log the account object
                this.accountSubject.next(account);
                this.startRefreshTokenTimer();
                
                // Store the refresh token in local storage
                if (account.refreshToken) {
                    localStorage.setItem('refreshToken', account.refreshToken);
                } else {
                    console.error("No refresh token in login response");
                }
                
                return account;
            }));
    }
    

    logout() {
        console.log("Account before logout:", this.accountValue);
        
        // Retrieve the refresh token from local storage
        const token = localStorage.getItem('refreshToken');
        if (!token) {
            console.error("No refresh token found for logout.");
            return; // Exit if no token is found
        }
        
        this.http.post<any>(`${baseUrl}/revoke-token`, { token }, { withCredentials: true }).subscribe(() => {
            localStorage.removeItem('refreshToken'); // Clear the token
            this.stopRefreshTokenTimer();
            this.accountSubject.next(null);
            this.router.navigate(['account/login-register']);
        });
    }
    

    refreshToken() {
        const token = localStorage.getItem('refreshToken'); // Get the token from local storage
        return this.http.post<any>(`${baseUrl}/refresh-token`, { token }, { withCredentials: true })
            .pipe(map((account) => {
                this.accountSubject.next(account);
                this.startRefreshTokenTimer();
                
                // Update the local storage with the new refresh token
                if (account.refreshToken) {
                    localStorage.setItem('refreshToken', account.refreshToken);
                }
                
                return account;
            }));
    }
    register(account: Account) {
        return this.http.post(`${baseUrl}/register`, account);
    }

    verifyEmail(token: string) {
        return this.http.post(`${baseUrl}/verify-email`, { token });
    }
    
    forgotPassword(email: string) {
        return this.http.post(`${baseUrl}/forgot-password`, { email });
    }
    
    validateResetToken(token: string) {
        return this.http.post(`${baseUrl}/validate-reset-token`, { token });
    }
    
    resetPassword(token: string, password: string, confirmPassword: string) {
        return this.http.post(`${baseUrl}/reset-password`, { token, password, confirmPassword });
    }

    getAll() {
        return this.http.get<Account[]>(baseUrl);
    }

    getById(id: string) {
        return this.http.get<Account>(`${baseUrl}/${id}`);
    }
    
    create(params) {
        return this.http.post(baseUrl, params);
    }
    
    update(id, params) {
        return this.http.put(`${baseUrl}/${id}`, params)
            .pipe(map((account: any) => {
                // update the current account if it was updated
                if (account.id === this.accountValue.id) {
                    // publish updated account to subscribers
                    account = { ...this.accountValue, ...account };
                    this.accountSubject.next(account);
                }
                return account;
            }));
    }
    
    delete(id: string) {
        return this.http.delete(`${baseUrl}/${id}`)
            .pipe(finalize(() => {
                // auto logout if the logged in account was deleted
                if (id === this.accountValue.id)
                    this.logout();
            }));
    }

    // helper methods

    private refreshTokenTimeout;

    private startRefreshTokenTimer() {
        // parse json object from base64 encoded jwt token
        const jwtToken = JSON.parse(atob(this.accountValue.jwtToken.split('.')[1]));

        // set a timeout to refresh the token a minute before it expires
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);
        this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }

    updateProfileImage(formData: FormData): Observable<any> {
        return this.http.post(`${baseUrl}/update-profile-image`, formData, {
          withCredentials: true
        });
      }
      
}