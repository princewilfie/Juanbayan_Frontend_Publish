import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TermsAndConditionsModalComponent } from './event-terms-condition.component';
import { EventService } from '../_services/event.service';
import { EventCommentService } from '../_services/eventComment.service';
import { EventLikeService } from '../_services/eventLike.service';
import { EventComment } from '../_models/eventComment';
import { EventLike } from '../_models/eventLike';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  event: any;
  comments: EventComment[] = [];
  newComment: EventComment = { Comment_Text: '', Event_ID: 0, Acc_ID: 0 }; // Initialize as needed
  likeCount: number = 0;
  hasLiked: boolean = false;
  userId: number = 1;
  totalComments: number;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private modalService: NgbModal, 
    private eventCommentService: EventCommentService,
    private eventLikeService: EventLikeService
  ) {}

  ngOnInit() {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.eventService.getById(+eventId).subscribe(
        (data) => {
          this.event = data;
          this.loadComments();
          this.loadLikes();
        },
        (error) => {
          console.error('Error fetching event details:', error);
        }
      );
    }
  }

  

   // Load comments
   loadComments() {
    if (this.event) {
      this.eventCommentService.getCommentsByEventId(this.event.Event_ID).subscribe(
        (comments) => {
          this.comments = comments;
          this.totalComments = comments.length;
        },
        (error) => {
          console.error('Error loading comments:', error);
        }
      );
    }
  }

  // Add a new comment
  addComment() {
    if (this.newComment.Comment_Text.trim()) {
      this.newComment.Event_ID = this.event.Event_ID;
      this.newComment.Acc_ID = this.userId; // Replace with actual user logic
      this.eventCommentService.createEventComment(this.newComment).subscribe(
        (comment) => {
          this.comments.push(comment);
          this.newComment.Comment_Text = '';
        },
        (error) => {
          console.error('Error adding comment:', error);
        }
      );
    }
  }

  // Load likes
  loadLikes() {
    if (this.event) {
      this.eventLikeService.getLikesByEventId(this.event.Event_ID).subscribe(
        (likes) => {
          this.likeCount = likes.length;
          this.hasLiked = likes.some(like => like.Acc_ID === this.userId); // Check if the current user has liked
        },
        (error) => {
          console.error('Error loading likes:', error);
        }
      );
    }
  }

  // Toggle like
  toggleLike() {
    if (this.hasLiked) {
      // Unlike logic (assuming you have a like ID to delete)
      this.eventLikeService.deleteEventLike(this.event.Event_ID).subscribe(
        () => {
          this.likeCount--;
          this.hasLiked = false;
        },
        (error) => {
          console.error('Error unliking:', error);
        }
      );
    } else {
      const newLike: EventLike = {
        Event_ID: this.event.Event_ID,
        Acc_ID: this.userId // Replace with actual user logic
      };
      this.eventLikeService.createEventLike(newLike).subscribe(
        () => {
          this.likeCount++;
          this.hasLiked = true;
        },
        (error) => {
          console.error('Error liking:', error);
        }
      );
    }
  }

  // Generate dynamic campaign URL
  getEventUrl():string {
    return `http://juanbayan.com.ph/event/${this.event?.eventId}`; // Replace with your actual base URL
  }

  // Social media sharing methods
  shareToFacebook(url: string): void {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank');
  }

  shareToTwitter(url: string): void {
    const twitterUrl = `https://twitter.com/share?url=${encodeURIComponent(url)}&text=Check+out+this+event!`;
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

  // Define getImagePath method here
  getImagePath(imageName: string): string {
    return imageName ? `http://localhost:4000/assets/${imageName}` : 'assets/';
  }

  openTermsAndConditionsModal() {
    const modalRef = this.modalService.open(TermsAndConditionsModalComponent, {
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.accId = 1; // Set account ID here (replace 1 with actual ID)
    modalRef.componentInstance.eventId = this.event.Event_ID;

    modalRef.result.then(
      (result) => {
        if (result) {
          console.log('User confirmed to join as a volunteer');
        }
      },
      (reason) => {
        console.log('User dismissed the modal');
      }
    );
  }
}