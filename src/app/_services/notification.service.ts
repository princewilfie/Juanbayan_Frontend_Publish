import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CampaignService } from './campaign.service';
import { EventService } from './event.service';
import { WithdrawService } from './withdraw.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationsSource = new BehaviorSubject<any[]>([]); // Centralized notifications
  notifications$ = this.notificationsSource.asObservable(); // Observable for subscription

  constructor(
    private campaignService: CampaignService,
    private eventService: EventService,
    private withdrawService: WithdrawService
  ) {}

  loadNotifications() {
    this.loadCampaignNotifications();
    this.loadEventNotifications();
    this.loadWithdrawNotifications();
  }

  private loadCampaignNotifications() {
    this.campaignService.getAllCampaigns().subscribe(
      (campaigns) => {
        const campaignNotifications = campaigns
          .filter(campaign => campaign.Campaign_ApprovalStatus === 'Waiting For Approval') // Only pending
          .map((campaign) => ({
            id: `campaign-${campaign.Campaign_ID}`,
            name: campaign.Campaign_Name,
            message: campaign.updatedAt !== campaign.createdAt
              ? 'A campaign has been updated.'
              : 'A new campaign has been created.',
            createdAt: campaign.updatedAt || campaign.createdAt,
            seen: false,
          }));
        this.updateNotifications(campaignNotifications);
        console.log(campaignNotifications);
      },
      (error) => {
        console.error('Error fetching campaigns:', error);
      }
    );
  }

  
  private loadEventNotifications() {
    this.eventService.getAll().subscribe(
      (events) => {
        const eventNotifications = events
          .filter(event => event.Event_ApprovalStatus === 'Pending') // Only pending
          .map((event) => ({
            id: `event-${event.Event_ID}`,
            name: event.Event_Name,
            message: event.updatedAt !== event.createdAt
              ? 'An event has been updated.'
              : 'A new event has been created.',
            createdAt: event.updatedAt || event.createdAt,
            seen: false,
          }));
        this.updateNotifications(eventNotifications);
        console.log(eventNotifications);
      },
      (error) => {
        console.error('Error fetching events:', error);
      }
    );
  } 

  private loadWithdrawNotifications() {
    this.withdrawService.getAll().subscribe(
      (withdrawals) => {
        const withdrawNotifications = withdrawals
          .filter(withdraw => withdraw.Status === 'Pending') // Only pending
          .map((withdraw) => ({
            id: `withdraw-${withdraw.Withdraw_ID}`,
            name: `${withdraw.acc_firstname} ${withdraw.acc_lastname}`,
            message: `A withdrawal of ${withdraw.Withdraw_Amount} is pending.`,
            createdAt: withdraw.Request_Date,
            seen: false,
          }));
        this.updateNotifications(withdrawNotifications);
        console.log(withdrawNotifications);
      },
      (error) => {
        console.error('Error fetching withdrawals:', error);
      }
    );
  }

  private updateNotifications(newNotifications: any[]) {
    const currentNotifications = this.notificationsSource.getValue();
  
    // Merge new notifications with existing ones, avoiding duplicates by ID
    const mergedNotifications = [
      ...currentNotifications.filter(
        (existingNotification) =>
          !newNotifications.some((newNotification) => newNotification.id === existingNotification.id)
      ),
      ...newNotifications,
    ];
  
    // Sort all notifications by `createdAt` in descending order (latest first)
    mergedNotifications.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  
    // Update the notifications source
    this.notificationsSource.next(mergedNotifications);
  }


  markAsSeen(id: string) {
    const notifications = this.notificationsSource.getValue();
    const notification = notifications.find((n) => n.id === id);
    if (notification) {
      notification.seen = true;
      this.notificationsSource.next(notifications);
    }
  }

  removeNotification(id: string) {
    const notifications = this.notificationsSource.getValue();
    const updatedNotifications = notifications.filter(n => n.id !== id);
    this.notificationsSource.next(updatedNotifications);
  }
}
