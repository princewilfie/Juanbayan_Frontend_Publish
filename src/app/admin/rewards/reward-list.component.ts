import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RewardService, AlertService } from '@app/_services';
import { Reward } from '@app/_models';
import Swal from 'sweetalert2'; // Import SweetAlert2
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
  loading = false;
  selectedFileName: string | null = null;

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
        Swal.fire('Error', 'Failed to load rewards', 'error');
      }
    );
  }

  openAddModal(): void {
    this.isEditing = false;
    this.rewardForm.reset({ reward_Status: 'Active' });
    this.currentRewardId = null;
    this.showModal('rewardModal');
  }

  openEditModal(reward: Reward): void {
    this.isEditing = true;
    this.currentRewardId = reward.id;
    this.rewardForm.patchValue(reward);
    this.showModal('rewardModal');
  }

  closeRewardModal(): void {
    const modalElement = document.getElementById('rewardModal');
    if (modalElement) {
      const modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.hide(); // Programmatically close the modal
    }
  }
  

  saveReward(): void {
    if (this.rewardForm.valid) {
      const formData = new FormData();
      Object.keys(this.rewardForm.controls).forEach((key) => {
        if (key === 'reward_Image') {
          formData.append(key, this.rewardForm.get(key)?.value);
        } else {
          formData.append(key, this.rewardForm.get(key)?.value);
        }
      });
      this.loading = true;
      if (this.isEditing && this.currentRewardId !== null) {
        this.rewardService.updateReward(this.currentRewardId, formData).subscribe({
          next: () => {
            Swal.fire('Success', 'Reward updated successfully', 'success');
            this.loadRewards();
            this.loading = false;
          },
          error: () => {
            this.loading = false;
            Swal.fire('Error', 'Error updating reward', 'error');
          }
        });
      } else {
        this.rewardService.createReward(formData).subscribe({
          next: () => {
            this.loading = false;
            Swal.fire('Success', 'Reward added successfully', 'success');
            this.loadRewards();
          },
          error: () => {
            this.loading = false;
            Swal.fire('Error', 'Error adding reward', 'error');
          }
        });
      }
      this.closeRewardModal();
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.selectedFileName = input.files[0].name;
    } else {
      this.selectedFileName = null;
    }
  }

  deleteReward(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this reward!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      this.loading = true;
      if (result.isConfirmed) {
        this.loading = false;
        this.rewardService.deleteReward(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Your reward has been deleted.', 'success');
            this.loadRewards();
          },
          error: () => {
            Swal.fire('Error', 'Error deleting reward', 'error');
          }
        });
      }
    });
  }

  private showModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
}
