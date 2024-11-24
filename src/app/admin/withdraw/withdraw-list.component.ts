import { Component, OnInit } from '@angular/core';
import { WithdrawService } from '@app/_services';
import { Withdraw } from '@app/_models';
import Swal from 'sweetalert2'; // Import SweetAlert2

@Component({
  selector: 'app-withdrawal-list',
  templateUrl: './withdraw-list.component.html',
})
export class WithdrawalListComponent implements OnInit {
  withdrawals: Withdraw[] = [];
  loading = false;

  constructor(private withdrawService: WithdrawService) {}

  ngOnInit(): void {
    this.loadWithdrawals(); // Initial load
  }

  // Method to load all withdrawals from the backend
  loadWithdrawals(): void {
    this.loading = true; // Set loading state
    this.withdrawService.getAll().subscribe(
      (data: Withdraw[]) => {
        this.withdrawals = data;
        this.loading = false; // Reset loading state after data is loaded
      },
      (error) => {
        this.loading = false; // Reset loading state on error
        Swal.fire('Error', 'Error fetching withdrawals', 'error');
      }
    );
  }

  // Approve a withdrawal request with SweetAlert confirmation
  approveWithdrawal(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to approve this withdrawal request?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, approve it!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true; // Set loading state
        this.withdrawService.approveWithdrawal(id).subscribe(
          (response) => {
            Swal.fire('Approved!', 'The withdrawal has been approved.', 'success');
            this.loadWithdrawals(); // Reload the withdrawal list after approval
          },
          (error) => {
            this.loading = false; // Reset loading state on error
            Swal.fire('Error', 'Error approving withdrawal', 'error');
          }
        );
      }
    });
  }

  // Reject a withdrawal request with SweetAlert confirmation
  rejectWithdrawal(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to reject this withdrawal request?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, reject it!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true; // Set loading state
        this.withdrawService.rejectWithdrawal(id).subscribe(
          (response) => {
            Swal.fire('Rejected!', 'The withdrawal has been rejected.', 'success');
            this.loadWithdrawals(); // Reload the withdrawal list after rejection
          },
          (error) => {
            this.loading = false; // Reset loading state on error
            Swal.fire('Error', 'Error rejecting withdrawal', 'error');
          }
        );
      }
    });
  }
}
