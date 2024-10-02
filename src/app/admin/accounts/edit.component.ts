import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';

@Component({ templateUrl: 'edit.component.html' })
export class EditComponent implements OnInit {
    form: UntypedFormGroup;
    id: string;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];

        this.form = this.formBuilder.group({
            acc_firstname: ['', Validators.required],
            acc_lastname: ['', Validators.required],
            acc_email: ['', [Validators.required, Validators.email]],
            acc_pnumber: ['', Validators.required],
            acc_role: ['', Validators.required],
            acc_status: ['', Validators.required]
        });

        // If you want to populate the form with existing data, you can fetch it here
        this.accountService.getById(this.id).pipe(first()).subscribe(account => {
            this.form.patchValue(account);
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
        this.updateAccount();
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
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    goBack() {
        this.router.navigate(['./'], { relativeTo: this.route });
    }
}
