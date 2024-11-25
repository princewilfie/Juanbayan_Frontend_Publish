import { Component, OnInit } from '@angular/core';
import { NotificationService } from '@app/_services';
import { Router } from '@angular/router';

@Component({
  selector: 'notification',
  templateUrl: 'notification.component.html',
})
export class NotificationComponent implements OnInit {
  showNotificationDropdown: boolean = false;
  newNotifications: any[] = [];
  earlierNotifications: any[] = [];

  constructor(
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.notificationService.loadNotifications();
    this.notificationService.notifications$.subscribe((notifications) => {
      this.filterNotifications(notifications);
    });
  }

  filterNotifications(notifications: any[]) {
    const now = new Date();
    const oneDayInMillis = 24 * 60 * 60 * 1000;

    this.newNotifications = notifications.filter((n) => 
      !n.seen && new Date(now).getTime() - new Date(n.createdAt).getTime() < oneDayInMillis
    );

    this.earlierNotifications = notifications.filter((n) => 
      n.seen || new Date(now).getTime() - new Date(n.createdAt).getTime() >= oneDayInMillis
    );
  }

  viewNotification(notification: any) {
    this.notificationService.markAsSeen(notification.id);
    if (notification.id.startsWith('campaign')) {
      this.router.navigate(['/admin/campaigns']);
    } else if (notification.id.startsWith('event')) {
      this.router.navigate(['/admin/events']);
    } else if (notification.id.startsWith('withdraw')) {
      this.router.navigate(['/admin/withdraw']);
    }
    this.notificationService.removeNotification(notification.id); // Remove processed notifications
  }

  toggleNotificationDropdown() {
    this.showNotificationDropdown = !this.showNotificationDropdown;
  }

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
