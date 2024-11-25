import { Component, OnInit } from '@angular/core';
import { NotificationService } from '@app/_services';
import { Router } from '@angular/router';

@Component({
  selector: 'notification',
  templateUrl: 'notification.component.html',
})
export class NotificationComponent implements OnInit {
  showNotificationDropdown: boolean = false;
  notifications: any[] = []; // All notifications combined and sorted

  constructor(
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.notificationService.loadNotifications();
    this.notificationService.notifications$.subscribe((notifications) => {
      console.log('All Notifications:', notifications);
      this.notifications = this.sortNotifications(notifications); // Merge and sort notifications
    });
  }

  // Sort notifications by createdAt in descending order
  private sortNotifications(notifications: any[]): any[] {
    return notifications.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // Handle notification click
  viewNotification(notification: any) {
    this.notificationService.markAsSeen(notification.id); // Mark notification as seen
    this.notificationService.removeNotification(notification.id); // Remove after processing

    // Navigate to the appropriate page based on notification type
    if (notification.id.startsWith('campaign')) {
      this.router.navigate(['/admin/campaigns']);
    } else if (notification.id.startsWith('event')) {
      this.router.navigate(['/admin/events']);
    } else if (notification.id.startsWith('withdraw')) {
      this.router.navigate(['/admin/withdraw']);
    }
  }

  toggleNotificationDropdown() {
    this.showNotificationDropdown = !this.showNotificationDropdown;
  }

  // Format timestamp for human-readable display
  formatTimestamp(createdAt: string): string {
    const now = new Date();
    const notificationDate = new Date(createdAt);
    const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  }
}
