import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { RewardService, AlertService } from '@app/_services';

@Component({ templateUrl: 'reward-addedit.component.html' })
export class RewardsAddEditComponent implements OnInit {
    form: UntypedFormGroup;
    id: number;
    isAddMode: boolean;
    loading = false;
    submitted = false;
    selectedImage: File | null = null;
    imagePreview: string | ArrayBuffer | null = null;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private rewardService: RewardService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.id = +this.route.snapshot.params['id'];
        this.isAddMode = !this.id;

        this.form = this.formBuilder.group({
            reward_Name: ['', Validators.required],
            reward_Description: ['', Validators.required],
            reward_PointCost: ['', [Validators.required, Validators.min(1)]],
            reward_Quantity: ['', [Validators.required, Validators.min(1)]],
            reward_Status: ['', Validators.required],
            reward_Image: [null]
        });

        if (!this.isAddMode) {
            this.rewardService.getRewardById(this.id)
                .pipe(first())
                .subscribe(x => {
                    this.form.patchValue(x);
                    if (x.reward_Image) {
                        this.imagePreview = x.reward_Image;
                    }
                });
        }
    }

    onImageSelected(event: Event) {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            this.selectedImage = file;
            const reader = new FileReader();
            reader.onload = () => {
                this.imagePreview = reader.result;
            };
            reader.readAsDataURL(file);
        }
    }

    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
        this.alertService.clear();

        if (this.form.invalid) {
            return;
        }

        this.loading = true;

        const formData = new FormData();
        Object.keys(this.form.controls).forEach(key => {
            formData.append(key, this.form.get(key)?.value);
        });

        if (this.selectedImage) {
            formData.append('reward_Image', this.selectedImage);
        }

        if (this.isAddMode) {
            this.createReward(formData);
        } else {
            this.updateReward(formData);
        }
    }

    private createReward(formData: FormData) {
        this.rewardService.createReward(formData)
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

    private updateReward(formData: FormData) {
        this.rewardService.updateReward(this.id, formData)
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
