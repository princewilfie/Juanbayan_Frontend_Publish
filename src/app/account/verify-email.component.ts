import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';

enum EmailStatus {
    Verifying,
    Failed
}

@Component({ templateUrl: 'verify-email.component.html' })
export class VerifyEmailComponent implements OnInit {
    EmailStatus = EmailStatus;
    emailStatus = EmailStatus.Verifying;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        const token = this.route.snapshot.queryParams['token'];
    
        if (token) {
            this.accountService.verifyEmail(token)
                .pipe(first())
                .subscribe({
                    next: () => {
                        this.alertService.success('Verification successful, you can now login', { keepAfterRouteChange: true });
                        this.router.navigate(['../login'], { relativeTo: this.route });
                    },
                    error: error => {
                        this.emailStatus = EmailStatus.Failed;
                        this.alertService.error(error.message || 'Verification failed');
                    }
                });
        } else {
            this.emailStatus = EmailStatus.Failed;
            this.alertService.error('Invalid verification token.');
        }
    }
    
}
