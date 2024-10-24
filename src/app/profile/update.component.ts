import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { MustMatch } from '@app/_helpers';
import Swal from 'sweetalert2'; // Import SweetAlert

@Component({ templateUrl: 'update.component.html' })
export class UpdateComponent implements OnInit {
    account = this.accountService.accountValue;
    form: FormGroup;
    loading = false;
    submitted = false;
    deleting = false;
    selectedFile: File | null = null;
    previewUrl: string | ArrayBuffer | null = null;
    originalFormValues: any; // To store the initial form values for comparison

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

        // Save the initial form values
        this.originalFormValues = this.form.getRawValue();
    }

    get f() { return this.form.controls; }

    // Compare current form values with the original form values to detect changes
    formHasChanged(): boolean {
        const currentFormValues = this.form.getRawValue();
        return JSON.stringify(currentFormValues) !== JSON.stringify(this.originalFormValues) || this.selectedFile !== null;
    }

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

        // Check if any changes were made
        if (!this.formHasChanged()) {
            // No changes were made, just navigate without showing any alert
            this.router.navigate(['../'], { relativeTo: this.route });
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
                    // Show success SweetAlert for successful update
                    Swal.fire({
                        icon: 'success',
                        title: 'Update Successful',
                        text: 'The account has been updated successfully!',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        // After the alert is dismissed, navigate back to the previous page
                        this.router.navigate(['../'], { relativeTo: this.route });
                    });
                },
                error: error => {
                    // Show error SweetAlert for failed update
                    Swal.fire({
                        icon: 'error',
                        title: 'Update Failed',
                        text: `There was an error updating the account: ${error}`,
                        confirmButtonText: 'OK'
                    });
                    this.loading = false;
                }
            });
    }

    onDelete() {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to delete your account? This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                this.deleting = true;
                this.accountService.delete(this.account.id)
                    .pipe(first())
                    .subscribe(() => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Account Deleted',
                            text: 'Your account has been deleted successfully!',
                            confirmButtonText: 'OK'
                        }).then(() => {
                            // Navigate or perform other actions after deletion
                        });
                    });
            }
        });
    }
}