import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CampaignService } from '../_services/campaign.service';
import { Campaign } from '../_models/campaign'; // Adjust based on your actual path
import { Router } from '@angular/router';
import { Comment, Like } from '../_models';
import { CommentService, AccountService, LikeService } from '../_services';

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

  constructor(
    private route: ActivatedRoute,
    private campaignService: CampaignService,
    private router: Router,
    private commentService: CommentService,
    private accountService: AccountService,
    private likeService: LikeService
  ) {}

  ngOnInit(): void {
    const campaignId = this.route.snapshot.paramMap.get('id');
    this.accountId = this.accountService.accountValue ? +this.accountService.accountValue.id : null;

    if (campaignId) {
      this.loadCampaignDetails(Number(campaignId));
      this.loadComments(+campaignId);
      this.loadLikes(+campaignId); // Ensure to pass the campaign ID for likes
    }
  }


  // Load campaign details by ID
  loadCampaignDetails(campaignId: number): void {
    this.campaignService.getById(campaignId).subscribe(
      (data: Campaign) => {
        this.campaign = data;
      },
      (error) => {
        this.errorMessage = 'Error loading campaign details: ' + error.message;
      }
    );
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
