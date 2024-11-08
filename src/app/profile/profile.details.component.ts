import { Component, OnInit, TemplateRef } from '@angular/core';
import { AccountService, CampaignService, RewardService, WithdrawService, AlertService, EventService, ParticipantService } from '@app/_services'; // Import RedeemRewardService
import { Account } from '@app/_models/account';
import { Campaign } from '@app/_models/campaign';
import { Reward } from '@app/_models/reward';
import { Participant } from '../_models';
import { CommunityEvent } from '../_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Withdraw } from '@app/_models/withdraw';
import Swal from 'sweetalert2'; // Import SweetAlert

@Component({
  selector: 'app-details',
  templateUrl: './profile.details.component.html',
})
export class DetailsComponent implements OnInit {
  account: Account;
  campaigns: Campaign[] = [];
  currentSection: string = 'activities'; // Default section
  selectedImage: File | null = null;
  imagePreview: string | null = null; // For showing a preview of the selected image
  rewards: Reward[] = [];
  deliveryInfo = { name: '', address: '', phone: '' }; // Info for delivery
  selectedItem: Reward | null = null; // Hold the selected reward item
  selectedBank: string = '';
  accountNumber: string = '';
  banks: string[] = ['Bank of the Philippine Islands', 'GCash', 'PayPal', 'Banco De Oro', 'UnionBank', 'ChinaBank'];
  amount: number = 0; 
  selectedRequest: Campaign | null = null;
  events: CommunityEvent[] = [];
  joinedEvents: Participant[];
  accomplishedEvents: any[] = [];

  constructor(
    private accountService: AccountService,
    private campaignService: CampaignService,
    private rewardService: RewardService,
    private withdrawService: WithdrawService,
    private alertService: AlertService,
    private modalService: NgbModal,
    private eventService: EventService,
    private participantService : ParticipantService
  ) {}

  openFundRequestModal(modal: TemplateRef<any>, campaign: Campaign) {
    this.selectedRequest = campaign;
    this.modalService.open(modal);
  }

  submitFundRequest(modal: any): void {
    if (!this.selectedBank || !this.accountNumber) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please select a bank and enter an account number.',
        confirmButtonText: 'OK'
      });
      return;
    } 
  
    const fundRequestData: Omit<Withdraw, "Withdraw_ID" | "Request_Date" | "Status"> = {
      Bank_account: this.selectedBank,
      Acc_number: Number(this.accountNumber),
      Campaign_ID: this.selectedRequest ? this.selectedRequest.Campaign_ID : null,
      acc_id: this.account.id, // Replace with the actual account ID
      Withdraw_Amount: this.amount, // Replace with the actual amount to withdraw
    };
  
    this.withdrawService.requestWithdrawal(fundRequestData).subscribe(
      response => {
        console.log('Withdrawal request successful:', response);
        console.log('Modal instance:', modal);
        if (modal) {
          modal.dismiss();
        } else {
          console.error('modal is undefined');
        }
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Withdrawal request submitted successfully!',
          confirmButtonText: 'OK'
        });
      },
      error => {
        console.error('Error requesting withdrawal:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error processing your request. Please try again.',
          confirmButtonText: 'OK'
        });
      }
    );
  }
  

  ngOnInit(): void {
    // Fetch account data
    this.account = this.accountService.accountValue;
  
    // Debug log the account value
    console.log('Account Data:', this.account);
  
    // Ensure account is defined
    if (!this.account) {
      console.error('Account is not defined');
      alert('Account information is not available. Please log in again.');
      return;
    }
  
    // Ensure account.id is a number
    const accountId = Number(this.account.id);
    if (isNaN(accountId)) {
      console.error('Invalid account ID:', this.account.id);
      return;
    }
  
    // Fetch campaigns data
    this.campaignService.getCampaignsByAccountId(accountId).subscribe(
      (campaigns) => {
        this.campaigns = campaigns || [];
      },
      (error) => {
        console.error('Error fetching campaigns', error);
      }
    );
  
    this.rewardService.getAllRewards().subscribe(
      (rewards) => {
        this.rewards = rewards;
      },
      (error) => {
        console.error('Error fetching rewards', error);
      }
    );

    this.eventService.getEventsByAccountId(accountId).subscribe(
      (events) => {
        this.events = events || []; // Store events data
        this.filterAccomplishedEvents(); // Filter accomplished events
        console.log('Fetched events:', this.events);
      },
      (error) => {
        console.error('Error fetching events:', error);
      }
    );

  // Fetch joined events data
  this.participantService.getJoinedEvents(accountId).subscribe(
    (joinedEvents: Participant[]) => {
      this.joinedEvents = joinedEvents;  // Store joined events data
      console.log('Joined Events:', this.joinedEvents);  // Debug log for joined events
    },
    (error) => {
      console.error('Error fetching joined events:', error);
    }
  );

  }

  filterAccomplishedEvents() {
    if (!this.events || this.events.length === 0) {
      console.warn('No events available to filter');
      return; // Exit early if events is undefined or empty
    }
    const today = new Date(); // Current date
    this.accomplishedEvents = this.events.filter(event => new Date(event.Event_End_Date) < today);
  }
  
  getImagePath(image: string): string {
    return image ? `http://localhost:4000/${image}` : 'assets/'; 
  }

  // accomplished campaigns
  getAccomplishedCampaigns() {
    const today = new Date();
    return this.campaigns.filter(campaign => new Date(campaign.Campaign_End) <= today);
  }

  loadProfileImage(): void {
    const savedImage = localStorage.getItem(`profileImage_${this.account.id}`);
    if (savedImage) {
      this.imagePreview = savedImage; // Load saved image
    } else {
      this.imagePreview = this.account.acc_image || null; // Load the account's image if no saved image
    }
  }

  updateAccount(newAccount: Account): void {
    this.account = newAccount; // Update the account

    // Load the new account's image
    this.loadProfileImage(); // Call to load the image for the new account
  }

  showSection(section: string): void {
    this.currentSection = section; // Set the current section based on the button clicked
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedImage = input.files[0];

      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        localStorage.setItem(`profileImage_${this.account.id}`, this.imagePreview); // Save to local storage with account ID
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  uploadImage(): void {
    if (this.selectedImage) {
      const formData = new FormData();
      formData.append('image', this.selectedImage);

      this.accountService.updateProfileImage(formData).subscribe(
        (response) => {
          // Update the local account image
          this.account.acc_image = response.acc_image; // Ensure this matches the response structure
          this.imagePreview = null; // Reset preview after upload
          localStorage.setItem(`profileImage_${this.account.id}`, this.account.acc_image); // Save updated image to local storage with account ID
          console.log('Profile image updated successfully!');
        },
        (error) => {
          console.error('Error updating profile image', error);
        }
      );
    } else {
      console.error('No image selected');
    }
  }

  submitChangePassword(currentPassword: string, newPassword: string, confirmPassword: string): void {
    // Validate new password and confirm password
    if (newPassword !== confirmPassword) {
      document.getElementById('passwordError').style.display = 'block';
      return;
    }
      document.getElementById('passwordError').style.display = 'none';

    // Call the service to reset password
    const token = this.accountService.accountValue?.acc_resetToken; // Access the token correctly
    if (!token) {
      console.error('Reset token is not available');
      return;
    }

    this.accountService.resetPassword(token, newPassword, confirmPassword).subscribe(
      response => {
        console.log('Password changed successfully!');
        // Optionally, you can reset the form or give feedback to the user
      },
      error => {
        console.error('Error changing password', error);
        // You might want to display an error message to the user here
      }
    );
  }

  openRewardModal(content: TemplateRef<any>, reward: Reward) {
    // Assign the selected reward to selectedItem
    this.selectedItem = reward;
    // Open the modal
    this.modalService.open(content, { size: 'lg' });
  }

  redeem(rewardId: number, address: string) {
    // Ensure address is provided
    if (!address || address.trim() === '') {
        Swal.fire({
            icon: 'warning',
            title: 'Address Required',
            text: 'Please provide a delivery address to redeem the reward.',
        });
        return;
    }

    const accountId = Number(this.account.id);

    this.rewardService.redeemReward(rewardId, address, accountId).subscribe({
        next: (response) => {
            // Show success SweetAlert
            Swal.fire({
                icon: 'success',
                title: 'Reward Redeemed',
                text: 'You have successfully redeemed the reward!',
                confirmButtonText: 'OK'
            }).then(() => {
                this.selectedItem = null; // Reset selected item
                this.modalService.dismissAll(); // Close the modal if needed
                // Additional handling like updating the UI or state
            });
        },
        error: (error) => {
            console.error('Error redeeming reward:', error);
            
            // Check if the error message is "Insufficient points to redeem the reward"
            if (error === 'Insufficient points to redeem the reward') {
                // Show SweetAlert for insufficient points
                Swal.fire({
                    icon: 'error',
                    title: 'Insufficient Points',
                    text: 'You do not have enough points to redeem this reward.',
                    confirmButtonText: 'OK'
                });
            } else {
                // Show general error SweetAlert
                Swal.fire({
                    icon: 'error',
                    title: 'Redemption Failed',
                    text: 'An error occurred while redeeming the reward. Please try again later.',
                    confirmButtonText: 'OK'
                });
            }
        }
    });
}

  
}