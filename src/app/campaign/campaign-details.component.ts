import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CampaignService } from '../_services/campaign.service';
import { Campaign } from '../_models/campaign'; // Adjust based on your actual path
import { Router } from '@angular/router';
import { Comment, Like } from '../_models';
import { CommentService, AccountService, LikeService } from '../_services';
import { DonationService } from '../_services/donation.service';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
})
export class CampaignDetailsComponent implements OnInit {
  campaign: Campaign | undefined;
  comments: Comment[] = [];
  errorMessage: string | null = null;
  accountId: number | null = null;
  newComment: Comment = { Campaign_ID: 0, Acc_ID: 0, Comment_Text: '' };
  likes: Like[] = [];
  hasLiked: boolean = false;
  campaignId: number | null = null;
  likeCount: number = 0;
  donationForm: FormGroup;
  progressPercentage = 0;
  donors: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private campaignService: CampaignService,
    private router: Router,
    private commentService: CommentService,
    private accountService: AccountService,
    private likeService: LikeService,
    private modalService: NgbModal,
    private donationService: DonationService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    const campaignId = this.route.snapshot.paramMap.get('id');
    this.accountId = this.accountService.accountValue ? +this.accountService.accountValue.id : null;

    if (campaignId) {
      this.loadCampaignDetails(campaignId);
      this.loadComments(+campaignId);
      this.loadLikes(+campaignId);
      this.loadDonors(+campaignId);
    }

    // Initialize the donation form
    this.donationForm = this.fb.group({
      donationAmount: ['', [Validators.required, Validators.min(0.01)]],
    });

  }

  loadDonors(campaignId: number): void {
    this.donationService.getDonationsByCampaignId(campaignId).subscribe(
      (data: any[]) => {
        this.donors = data;
      },
      (error) => {
        console.error('Error loading donors:', error);
        this.errorMessage = 'Error loading donors: ' + error.message;
      }
    );
  }

  // Load campaign details by ID
  loadCampaignDetails(campaignId: string): void {
    this.campaignService.getById(+campaignId).subscribe(
      (data: Campaign) => {
        this.campaign = data;
        this.updateProgress(); // Update the progress bar after fetching the campaign details
      },
      (error) => {
        this.errorMessage = 'Error loading campaign details: ' + error.message;
      }
    );
  }

   // Update the donation progress percentage dynamically
   updateProgress(): void {
    console.log('Updating progress...');
    if (this.campaign) {
      this.progressPercentage = ((this.campaign.Campaign_CurrentRaised ?? 0) / this.campaign.Campaign_TargetFund) * 100;
    }
  }


  openDonationModal(content: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'donateModalLabel', backdrop: false });
  }

  // Confirm the donation and handle the donation process
  async confirmDonation(): Promise<void> {
    if (!this.donationForm || !this.donationForm.get('donationAmount')) {
      Swal.fire({
        icon: 'error',
        title: 'Form Error',
        text: 'Donation form is not properly initialized.',
      });
      return;
    }
  
    const donationAmount = this.donationForm.get('donationAmount')?.value;
  
    if (!this.campaign || !this.accountService.accountValue) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Data',
        text: 'Campaign or account information is missing.',
      });
      return;
    }
  
    if (donationAmount < 1) { 
      Swal.fire({
        icon: 'warning',
        title: 'Minimum Donation Required',
        text: 'Please enter a minimum donation of PHP 1.',
      });
      return;
    }
  
    Swal.fire({
      title: 'Confirm Donation',
      text: `You are about to donate ₱${donationAmount} to the ${this.campaign?.Campaign_Name} campaign. Proceed?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, donate now!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with GCash payment
        this.donationService.createGcashPayment({
          amount: donationAmount,
          campaignId: this.campaign?.Campaign_ID,
          accId: this.accountService.accountValue.id,
          description: `Donation for ${this.campaign?.Campaign_Name}`,
          remarks: 'Campaign Donation',
        }).subscribe(
          (response: any) => {
            const checkoutUrl = response.checkout_url;
            if (checkoutUrl) {
              Swal.fire({
                title: 'Redirecting to GCash',
                text: 'You will be redirected to the GCash checkout page to complete your donation.',
                icon: 'info',
                timer: 3000,
                showConfirmButton: false,
              }).then(() => {
                window.open(checkoutUrl, '_blank');  // Open GCash checkout in a new tab
                
                this.donationService.createDonation({
                  acc_id: Number(this.accountService.accountValue.id),
                  campaign_id: Number(this.campaign?.Campaign_ID),
                  donation_amount: Number(donationAmount),
                })
                // Update the campaign details after a successful donation
                this.updateCampaignDonation(donationAmount);
              });


              this.modalService.dismissAll();
            } else {
              Swal.fire({
                title: 'Error',
                text: 'Failed to initiate payment. Please try again.',
                icon: 'error',
                confirmButtonText: 'Okay',
              });
            }
          },
          (error) => {
            Swal.fire({
              title: 'Payment Error',
              text: 'There was an error initiating the GCash payment. Please try again later.',
              icon: 'error',
              confirmButtonText: 'Okay'
            });
            console.error('Error initiating GCash payment:', error);
          }
        );
      }
    });
  }

  updateCampaignDonation(donationAmount: number): void {
    if (this.campaign) {
      // Add the donation amount to the current raised amount
      this.campaign.Campaign_CurrentRaised = (this.campaign.Campaign_CurrentRaised ?? 0) + donationAmount;
  
      // Update the progress bar based on the new donation
      this.updateProgress();
      // Optionally show a success message
      Swal.fire({
        icon: 'success',
        title: 'Donation Successful',
        text: `Thank you for donating ₱${donationAmount}. The campaign has been updated.`,
      });
    }
  }
  

  // Load comments by campaign ID
  loadComments(campaignId: number): void {
    this.commentService.getByCampaignId(campaignId).subscribe(
      (data: Comment[]) => {
        this.comments = data.map(comment => ({
          ...comment,
          userfname: comment.acc_firstname,
          userlname: comment.acc_lastname,
          userimage: comment.acc_image,
        }));
      },
      (error) => {
        this.errorMessage = 'Error loading comments: ' + error.message;
      }
    );
  }

  // Load likes for the current campaign
  loadLikes(campaignId: number): void {
    this.likeService.getLikesByCampaignId(campaignId).subscribe(
      (data: Like[]) => {
        this.likes = data;
        this.likeCount = data.length; // Set like count
        this.hasLiked = !!this.likes.find(like => like.Acc_ID === this.accountId);
      },
      (error) => {
        console.error('Error loading likes: ', error);
      }
    );
  }

  // Toggle like/unlike
  toggleLike(): void {
    if (this.hasLiked) {
      const like = this.likes.find(like => like.Acc_ID === this.accountId);
      if (like) {
        this.likeService.deleteLike(like.Like_ID!).subscribe(() => {
          this.hasLiked = false;
          this.loadLikes(this.campaign?.Campaign_ID!);  // Reload likes after unliking
        });
      }
    } else {
      const newLike: Like = {
        Campaign_ID: this.campaign?.Campaign_ID!,
        Acc_ID: this.accountId!,
        Created_At: new Date()
      };
      this.likeService.createLike(newLike).subscribe(() => {
        this.hasLiked = true;
        this.loadLikes(this.campaign?.Campaign_ID!);  // Reload likes after liking
      });
    }
  }
  // Add a comment to the campaign
  addComment(): void {
    if (this.accountId && this.newComment.Comment_Text && this.newComment.Comment_Text.trim()) {
      this.newComment.Campaign_ID = this.campaign?.Campaign_ID || 0;
      this.newComment.Acc_ID = this.accountId; // Set the account ID

      this.commentService.create(this.newComment).subscribe(
        (comment: Comment) => {
          this.comments.push(comment); // Add new comment to the list
          this.newComment.Comment_Text = ''; // Clear the comment input field
        },
        (error) => {
          this.errorMessage = 'Error adding comment: ' + error.message;
        }
      );
    } else {
      this.errorMessage = 'Please enter a comment.';
    }
  }

  // Generate dynamic campaign URL
  getCampaignUrl(): string {
    return `http://juanbayan.com.ph/campaign/${this.campaign?.Campaign_ID}`; // Replace with your actual base URL
  }

  // Social media sharing methods
  shareToFacebook(url: string): void {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank');
  }

  shareToTwitter(url: string): void {
    const twitterUrl = `https://twitter.com/share?url=${encodeURIComponent(url)}&text=Check+out+this+campaign!`;
    window.open(twitterUrl, '_blank');
  }

  shareToInstagram(url: string): void {
    alert('Instagram doesn\'t allow direct sharing from the web. Link copied to clipboard.');
    this.copyToClipboard(url);
  }

  copyToClipboard(text: string): void {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
  }

  getImagePath(image: string): string {
    return image ? `http://localhost:4000/${image}` : 'assets/'; 
  }

  goBack(): void {
    this.router.navigate(['/campaign']); // Update the route as needed
  }
}
