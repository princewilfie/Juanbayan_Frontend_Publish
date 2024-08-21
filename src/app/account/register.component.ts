import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { MustMatch } from '@app/_helpers';

@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            acc_firstname: ['', Validators.required],
            acc_lastname: ['', Validators.required],
            acc_email: ['', [Validators.required, Validators.email]],
            acc_pnumber: ['', [Validators.required, Validators.pattern('^[0-9]{10,12}$')]],
            acc_passwordHash: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required],
            acc_acceptTerms: [true, Validators.requiredTrue]
        }, {
            validator: MustMatch('acc_passwordHash', 'confirmPassword')
        });        
    }
    

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;

         // Add acc_totalpoints to the registration payload with default value of 0
         const registrationPayload = {
            ...this.form.value,
            acc_totalpoints: 0 // Set default value for acc_totalpoints
        };
        
        this.accountService.register(registrationPayload)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Registration successful, please check your email for verification instructions', { keepAfterRouteChange: true });
                    this.router.navigate(['../login'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }
}