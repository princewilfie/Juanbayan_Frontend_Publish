import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { MustMatch } from '@app/_helpers';

@Component({ templateUrl: 'update.component.html' })
export class UpdateComponent implements OnInit {
    account = this.accountService.accountValue;
    form: FormGroup;
    loading = false;
    submitted = false;
    deleting = false;
    selectedFile: File | null = null;
    previewUrl: string | ArrayBuffer | null = null;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        console.log('Account ID:', this.account.id);
        this.form = this.formBuilder.group({
            acc_firstname: [this.account.acc_firstname, Validators.required],
            acc_lastname: [this.account.acc_lastname, Validators.required],
            acc_pnumber: [this.account.acc_pnumber, [Validators.pattern('^[0-9]{10,12}$')]],
            acc_passwordHash: ['', [Validators.minLength(6)]],
            confirmPassword: [''],
            acc_image: [null] // Add image control to the form
        }, {
            validator: MustMatch('acc_passwordHash', 'confirmPassword')
        });
    }

    get f() { return this.form.controls; }

    onFileChange(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;

            // Show a preview of the image
            const reader = new FileReader();
            reader.onload = () => {
                this.previewUrl = reader.result;
            };
            reader.readAsDataURL(file);
        }
    }

    onSubmit() {
        this.submitted = true;

        this.alertService.clear();

        if (this.form.invalid) {
            return;
        }

        if (!this.account.id) {
            console.error('Account ID is missing');
            this.alertService.error('Account ID is missing');
            this.loading = false;
            return;
        }

        this.loading = true;

        // Create a FormData object to hold form values and the image file
        const formData = new FormData();
        formData.append('acc_firstname', this.form.get('acc_firstname').value);
        formData.append('acc_lastname', this.form.get('acc_lastname').value);
        formData.append('acc_pnumber', this.form.get('acc_pnumber').value);
        formData.append('acc_passwordHash', this.form.get('acc_passwordHash').value);

        if (this.selectedFile) {
            formData.append('acc_image', this.selectedFile); // Add the image to formData
        }

        this.accountService.update(this.account.id, formData)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Update successful', { keepAfterRouteChange: true });
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    onDelete() {
        if (confirm('Are you sure?')) {
            this.deleting = true;
            this.accountService.delete(this.account.id)
                .pipe(first())
                .subscribe(() => {
                    this.alertService.success('Account deleted successfully', { keepAfterRouteChange: true });
                });
        }
    }
}
