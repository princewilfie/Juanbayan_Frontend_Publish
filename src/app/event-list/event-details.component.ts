import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../_services/event.service';
import { EventCommentService } from '../_services/eventComment.service';
import { EventLikeService } from '../_services/eventLike.service';
import { EventComment } from '../_models/eventComment';
import { EventLike } from '../_models/eventLike';
import { AccountService } from '../_services/account.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  event: any;
  comments: EventComment[] = [];
  newComment: EventComment = { Comment_Text: '', Event_ID: 0, Acc_ID: 0 }; 
  likeCount: number = 0;
  hasLiked: boolean = false;
  userId: number = 1;
  totalComments: number = 0;
  isTermsModalVisible: boolean = false;
  accountId: number = 0;
  eventId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private eventCommentService: EventCommentService,
    private eventLikeService: EventLikeService,
    private accountService: AccountService
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

    const account = this.accountService.accountValue;
    if (account && account.id) {
      this.accountId = Number(account.id);
    } else {
      console.error('No account is logged in.');
    }
  }

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

  addComment() {
    if (this.newComment.Comment_Text.trim()) {
      this.newComment.Event_ID = this.event.Event_ID;
      this.newComment.Acc_ID = this.accountId;
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

  loadLikes() {
    if (this.event) {
      this.eventLikeService.getLikesByEventId(this.event.Event_ID).subscribe(
        (likes) => {
          this.likeCount = likes.length;
          this.hasLiked = likes.some(like => like.Acc_ID === this.userId);
        },
        (error) => {
          console.error('Error loading likes:', error);
        }
      );
    }
  }

  toggleLike() {
    if (this.hasLiked) {
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
        Acc_ID: this.userId
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

  getEventUrl(): string {
    return `http://juanbayan.com.ph/event/${this.event?.eventId}`;
  }

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

  getImagePath(imageName: string): string {
    return imageName ? `http://localhost:4000/assets/${imageName}` : 'assets/';
  }

  showTermsModal() {
    this.isTermsModalVisible = true;
  }

  closeTermsModal() {
    this.isTermsModalVisible = false;
  }

  confirmVolunteer() {
    if (this.accountId && this.event?.Event_ID) {
      this.eventService.joinEvent(this.accountId, this.event.Event_ID).subscribe(
        () => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'You have successfully joined as a volunteer!'
          });
          this.closeTermsModal();
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.error.message || 'Error joining event'
          });
          this.closeTermsModal();
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'Unable to join the event. Account or Event ID is missing.'
      });
    }
  }
  
  
  
}
