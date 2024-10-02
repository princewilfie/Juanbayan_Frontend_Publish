import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { RewardService, AlertService } from '@app/_services';

@Component({ templateUrl: 'reward-addedit.component.html' })
export class RewardsAddEditComponent implements OnInit {
    form: UntypedFormGroup;
    id: number; // Change id to number for type safety
    isAddMode: boolean;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private rewardService: RewardService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.id = +this.route.snapshot.params['id']; // Convert id to number
        this.isAddMode = !this.id;

        // Update form controls to match backend model field names
        this.form = this.formBuilder.group({
            reward_Name: ['', Validators.required],
            reward_Description: ['', Validators.required],
            reward_PointCost: ['', [Validators.required, Validators.min(1)]],
            reward_Quantity: ['', [Validators.required, Validators.min(1)]],
            reward_Status: ['', Validators.required]
        });

        if (!this.isAddMode) {
            this.rewardService.getRewardById(this.id)
                .pipe(first())
                .subscribe(x => this.form.patchValue(x));
        }
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
        if (this.isAddMode) {
            this.createReward();
        } else {
            this.updateReward();
        }
    }

    private createReward() {
        this.rewardService.createReward(this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Reward created successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    private updateReward() {
        this.rewardService.updateReward(this.id, this.form.value)
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
}
