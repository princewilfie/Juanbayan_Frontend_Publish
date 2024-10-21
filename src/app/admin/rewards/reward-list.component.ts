import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RewardService, AlertService } from '@app/_services';
import { Reward } from '@app/_models';

declare var bootstrap: any; // To use Bootstrap modal functionality

@Component({
  selector: 'app-reward-list',
  templateUrl: './reward-list.component.html',
})
export class RewardListComponent implements OnInit {
  rewards: Reward[] = [];
  rewardForm: FormGroup;
  isEditing: boolean = false;
  currentRewardId: number | null = null;

  constructor(
    private rewardService: RewardService,
    private alertService: AlertService,
    private formBuilder: FormBuilder
  ) {
    this.rewardForm = this.formBuilder.group({
      reward_Name: ['', Validators.required],
      reward_Description: ['', Validators.required],
      reward_PointCost: [0, [Validators.required, Validators.min(1)]],
      reward_Quantity: [0, [Validators.required, Validators.min(1)]],
      reward_Status: [' ', Validators.required],
      reward_Image: [null]
    });
  }

  ngOnInit(): void {
    this.loadRewards();
  }

  loadRewards(): void {
    this.rewardService.getAllAdmin().subscribe(
      (data: Reward[]) => {
        this.rewards = data;
      },
      (error) => {
        this.alertService.error('Failed to load rewards');
      }
    );
  }

  openAddModal(): void {
    this.isEditing = false;
    this.rewardForm.reset({ reward_Status: 'Active' });
    this.currentRewardId = null;

    const modal = new bootstrap.Modal(document.getElementById('rewardModal'));
    modal.show();
  }

  openEditModal(reward: Reward): void {
    this.isEditing = true;
    this.currentRewardId = reward.id;
    this.rewardForm.patchValue(reward);

    const modal = new bootstrap.Modal(document.getElementById('rewardModal'));
    modal.show();
  }

  saveReward(): void {
    if (this.rewardForm.valid) {
      // Create a FormData object
      const formData = new FormData();
  
      // Append the form fields to the FormData object
      Object.keys(this.rewardForm.controls).forEach((key) => {
        if (key === 'reward_Image') {
          // Append image file directly
          formData.append(key, this.rewardForm.get(key)?.value);
        } else {
          // Append other form data as strings
          formData.append(key, this.rewardForm.get(key)?.value);
        }
      });
  
      // Distinguish between add and edit mode
      if (this.isEditing && this.currentRewardId !== null) {
        // Edit reward
        this.rewardService.updateReward(this.currentRewardId, formData).subscribe({
          next: () => {
            this.alertService.success('Reward updated successfully');
            this.loadRewards();
          },
          error: () => {
            this.alertService.error('Error updating reward');
          }
        });
      } else {
        // Add new reward
        this.rewardService.createReward(formData).subscribe({
          next: () => {
            this.alertService.success('Reward added successfully');
            this.loadRewards();
          },
          error: () => {
            this.alertService.error('Error adding reward');
          }
        }); 
      }
  
      // Close modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('rewardModal'));
      modal.hide();
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.rewardForm.patchValue({
        reward_Image: file
      });
    }
  }

  deleteReward(id: number): void {
    if (confirm('Are you sure you want to delete this reward?')) {
      this.rewardService.deleteReward(id).subscribe({
        next: () => {
          this.alertService.success('Reward deleted successfully');
          this.loadRewards();
        },
        error: () => {
          this.alertService.error('Error deleting reward');
        }
      });
    }
  }
}
