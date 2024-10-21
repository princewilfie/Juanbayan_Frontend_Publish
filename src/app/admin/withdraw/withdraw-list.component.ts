import { Component, OnInit } from '@angular/core';
import { WithdrawService } from '@app/_services';
import { Withdraw } from '@app/_models';

@Component({
  selector: 'app-withdrawal-list',
  templateUrl: './withdraw-list.component.html'
})
export class WithdrawalListComponent implements OnInit {
  withdrawals: Withdraw[] = [];

  constructor(private withdrawService: WithdrawService) {}

  ngOnInit(): void {
    this.loadWithdrawals(); // Initial load
  }

  // Method to load all withdrawals from the backend
  loadWithdrawals(): void {
    this.withdrawService.getAll().subscribe(
      (data: Withdraw[]) => {
        this.withdrawals = data;
      },
      error => {
        console.error('Error fetching withdrawals:', error);
      }
    );
  }

  // Approve a withdrawal request
  approveWithdrawal(id: number): void {
    this.withdrawService.approveWithdrawal(id).subscribe(
      response => {
        console.log('Withdrawal approved:', response);  // Log the approved withdrawal
        this.loadWithdrawals();  // Reload the withdrawal list after approval
      },
      error => {
        console.error('Error approving withdrawal:', error);
      }
    );
  }

  // Reject a withdrawal request
  rejectWithdrawal(id: number): void {
    this.withdrawService.rejectWithdrawal(id).subscribe(
      response => {
        this.loadWithdrawals(); // Reload withdrawal list after rejection
      },
      error => {
        console.error('Error rejecting withdrawal:', error);
      }
    );
  }
}
