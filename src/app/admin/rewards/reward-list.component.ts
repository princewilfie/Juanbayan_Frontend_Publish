import { Component, OnInit } from '@angular/core';
import { RewardService, AlertService } from '@app/_services';  // Assuming AlertService is for notifications
import { Reward } from '@app/_models'; // Import the Reward model for better typing

@Component({
  selector: 'app-reward-list',
  templateUrl: './reward-list.component.html',
})
export class RewardListComponent implements OnInit {
  rewards: Reward[] = [];  // Use the Reward model for typing

  constructor(
    private rewardService: RewardService,
    private alertService: AlertService // Add the AlertService for feedback to users
  ) {}

  ngOnInit(): void {
    this.loadRewards();
  }

  loadRewards(): void {
    this.rewardService.getAllRewards().subscribe( // Use the correct method name
      (data: Reward[]) => {
        this.rewards = data; // Assuming data is of type Reward[]
      },
      (error) => {
        this.alertService.error('Failed to load rewards'); // Error handling
      }
    );
  }

  deleteReward(id: string): void {  // Accept id as a string
    const numericId = +id; // Convert id to a number
    if (confirm('Are you sure you want to delete this reward?')) {
      this.rewardService.deleteReward(numericId).subscribe( // Pass the numeric ID
        () => {
          this.alertService.success('Reward deleted successfully'); // Success message
          this.loadRewards(); // Refresh the list after deletion
        },
        (error) => {
          this.alertService.error('Error deleting reward'); // Error message
        }
      );
    }
  }
}
