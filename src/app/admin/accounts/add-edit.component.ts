import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { MustMatch } from '@app/_helpers';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;

        this.form = this.formBuilder.group({
            acc_firstname: ['', Validators.required],
            acc_lastname: ['', Validators.required],
            acc_email: ['', [Validators.required, Validators.email]],
            acc_pnumber: ['', [Validators.required, Validators.pattern('^[0-9]{10,12}$')]],
            acc_passwordHash: ['', [Validators.minLength(6), this.isAddMode ? Validators.required : Validators.nullValidator]],
            acc_role: ['User', Validators.required],
            acc_image: [null], // this will store the image file
            confirmPassword: [''],
            acc_acceptTerms: [false, Validators.requiredTrue] // Ensure this is set to false initially
        }, {
            validator: MustMatch('acc_passwordHash', 'confirmPassword')
        });
        

        if (!this.isAddMode) {
            this.accountService.getById(this.id)
                .pipe(first())
                .subscribe(x => {
                    this.form.patchValue(x);
                    // Remove password and confirmPassword fields when editing
                    this.form.updateValueAndValidity();
                });
        }
    }

    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
        this.alertService.clear();

        this.loading = true;
        if (this.isAddMode) {
            this.createAccount();
        } else {
            this.updateAccount();
        }
    }
    

    private createAccount() {
    const formData = this.form.value;

    console.log("Creating account with data:", formData); // Log to inspect

    this.accountService.create(formData)
        .pipe(first())
        .subscribe({
            next: () => {
                this.alertService.success('Account created successfully', { keepAfterRouteChange: true });
                this.router.navigate(['../'], { relativeTo: this.route });
            },
            error: error => {
                console.error('Create account error:', error);
                this.alertService.error('Failed to create account');
                this.loading = false;
            }
        });
}


    private updateAccount() {
        this.accountService.update(this.id, this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Update successful', { keepAfterRouteChange: true });
                    this.router.navigate(['../../'], { relativeTo: this.route });
                },
                error: error => {
                    console.error('Update account error:', error);
                    this.alertService.error('Failed to update account');
                    this.loading = false;
                }
            });
    }
}
