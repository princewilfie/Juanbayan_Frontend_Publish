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
    this.rewardService.getAllAdmin().subscribe(
        (data: Reward[]) => {
            console.log('Rewards loaded:', data); // Log the data for verification
            this.rewards = data;
        },
        (error) => {
            console.error('Error loading rewards:', error); // Log the error if any
            this.alertService.error('Failed to load rewards');
        }
    );
}

deleteReward(id: number): void {
  if (confirm('Are you sure you want to delete this reward?')) {
      this.rewardService.deleteReward(id) // Send the ID as a string
          .subscribe({
              next: () => {
                  this.alertService.success('Reward deleted successfully'); // Success message
                  this.loadRewards(); // Refresh the list after deletion
              },
              error: (error) => {
                  console.error(error); // Log the error for debugging
                  this.alertService.error('Error deleting reward'); // Error message
              }
          });
  }
}

}
