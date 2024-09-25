import { Component, OnInit } from '@angular/core';
import { AccountService } from '@app/_services';
import { CampaignService } from '@app/_services/campaign.service';
import { Account } from '@app/_models/account';
import { Campaign } from '@app/_models/campaign';

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

  constructor(
    private accountService: AccountService,
    private campaignService: CampaignService
  ) {}

  ngOnInit(): void {
    // Fetch account data
    this.account = this.accountService.accountValue;

    // Load profile image
    this.loadProfileImage();

    // Fetch campaigns data
    this.campaignService.getCampaignsByAccountId(this.account.id).subscribe(
      (campaigns) => {
        this.campaigns = campaigns;
      },
      (error) => {
        console.error('Error fetching campaigns', error);
      }
    );
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
}
