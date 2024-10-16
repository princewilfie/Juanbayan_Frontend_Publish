import { Component, OnInit, TemplateRef } from '@angular/core';
import { AccountService, CampaignService, RewardService } from '@app/_services'; // Import RedeemRewardService
import { Account } from '@app/_models/account';
import { Campaign } from '@app/_models/campaign';
import { Reward } from '@app/_models/reward';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

  constructor(
    private accountService: AccountService,
    private campaignService: CampaignService,
    private rewardService: RewardService,
    private modalService: NgbModal
  ) {}

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
        this.campaigns = campaigns;
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

  // Triggered when the user clicks on the profile picture
  openFileSelector(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => this.onImageSelected(event);
    input.click();
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
        console.error('Address is required.');
        alert('Please provide a delivery address.');
        return;
    }

    const accountId = Number(this.account.id);

    // Call the redeemReward method with the correct types and order
    this.rewardService.redeemReward(rewardId, address, accountId).subscribe({
        next: (response) => {
            console.log('Reward redeemed successfully:', response);
            alert('Reward redeemed successfully!'); // Notify user
            this.selectedItem = null; // Reset selected item
            this.modalService.dismissAll(); // Close the modal if needed
            // Additional handling like updating the UI or state
        },
        error: (error) => {
            console.error('Error redeeming reward:', error);
            alert('Error redeeming reward. Please try again.'); // Notify user
            // You could show more detailed error messages based on the error response
        },
    });
}

  
}
