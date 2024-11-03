import { Component, OnInit, Renderer2} from '@angular/core';
import { AccountService, CampaignService, EventService } from '../_services';
import { CalendarOptions } from '@fullcalendar/core'; // FullCalendar types
import dayGridPlugin from '@fullcalendar/daygrid'; // DayGrid plugin
import Chart from 'chart.js/auto';
import { Campaign } from '../_models';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html'
})
export class OverviewComponent implements OnInit {
  accounts: [];
  campaigns: Campaign[] = [];
  totalUsers: number;
  totalGoal: number = 0;
  totalCollection: number = 0;
  progressPercentage: number = 0;
  totalCampaigns: number;
  totalEvents: number;
  totalVolunteers: number;

  // FullCalendar configuration
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin], // Include the plugin
    events: [] // Will be populated dynamically with event data
  };

  constructor(
    private accountService: AccountService,
    private campaignService: CampaignService,
    private eventService: EventService,
    private renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.initCharts();
    this.updateProgressBar();
    this.loadApprovedCampaigns();
  }

  loadData(): void {
    // Get users from service and calculate total users
    this.accountService.getAll().subscribe(accounts => {
      this.totalUsers = accounts.length; // Assuming users is an array of user objects
    });

    // Get campaigns and count total campaigns
    this.campaignService.getAll().subscribe(campaigns => {
      this.totalCampaigns = campaigns.length;
    });

    // Get events and count total events
    this.eventService.getAll().subscribe(events => {
      this.totalEvents = events.length;

      // Dynamically load events into FullCalendar
      this.calendarOptions.events = events.map(event => ({
        title: event.Event_Name, // Ensure these match your actual event data structure
        date: event.Event_End_Date
      }));
    });

  }

  loadApprovedCampaigns(): void {
    this.campaignService.getApprovedCampaigns().subscribe({
      next: (data) => {
        this.campaigns = data;
        this.calculateTotals();
      },
      error: (err) => {
        console.error('Error loading campaigns:', err);
      }
    });
  }

  updateProgressBar(): void {
    const progress = this.totalGoal ? (this.totalCollection / this.totalGoal) * 100 : 0;
    this.progressPercentage = progress;
    const progressBarElement = document.getElementById('progress') as HTMLElement;
    if (progressBarElement) {
      this.renderer.setStyle(progressBarElement, 'width', `${this.progressPercentage}%`);
    }
  }

  calculateTotals(): void {
    this.totalGoal = this.campaigns.reduce((sum, campaign) => sum + campaign.Campaign_TargetFund, 0);
    this.totalCollection = this.campaigns.reduce((sum, campaign) => sum + (campaign.Campaign_CurrentRaised || 0), 0);
    
    // Calculate progress percentage, making sure to avoid division by zero
    this.progressPercentage = this.totalGoal ? (this.totalCollection / this.totalGoal) * 100 : 0;
    this.updateProgressBar();
  }


  // Initialize the charts for donations and user progress
  initCharts(): void {
    // Donations chart
    const donationsCtx = document.getElementById('donationsChart') as HTMLCanvasElement;
    new Chart(donationsCtx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Total Donations (₱)',
          data: [50000, 30000, 70000, 20000, 100000, 150000, 120000, 50000, 30000, 100000, 50000, 30000], // Replace with dynamic data if available
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Users chart
    const usersCtx = document.getElementById('usersChart') as HTMLCanvasElement;
    new Chart(usersCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Total Users',
          data: [100, 120, 150, 170, 200, 220, 250, 280, 300, 350, 370, 400], // Replace with dynamic data if available
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
          fill: true
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
