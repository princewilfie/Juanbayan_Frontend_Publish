import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  totalDonations: number = 5000000; // Static value for now, replace with dynamic data later
  donationGoal: number = 10000000.00;

  totalUsers: number;
  totalCampaigns: number;
  totalVolunteers: number;
  totalWithdrawals: number;
  totalEvents: number;

  totalDonationsData = [50000, 30000, 70000, 20000];
  totalUsersData = [100, 120, 150, 170];
  totalCampaignsData = [10, 20, 30, 40];
  totalVolunteersData = [50, 60, 70, 80];
  totalWithdrawalsData = [10000, 20000, 30000, 40000];
  totalEventsData = [5, 10, 15, 20];

  constructor() {}

  ngOnInit(): void {
    // Replace with actual API calls once services are ready
    this.loadStaticData();
    this.initCharts();
  }

  loadStaticData(): void {
    // Set your static data here for now
    this.totalUsers = 400;
    this.totalCampaigns = 12;
    this.totalVolunteers = 80;
    this.totalWithdrawals = 350000;
    this.totalEvents = 20;
  }

  downloadReports(): void {
    const csvData = this.generateCSV();
    this.downloadFile(csvData, 'admin-reports.csv');
  }

  // Helper function to generate CSV content
  generateCSV(): string {
    let csvContent = 'Category,Jan,Feb,Mar,Apr\n'; // Header row
    csvContent += `Total Donations,${this.totalDonationsData.join(',')}\n`;
    csvContent += `Total Users,${this.totalUsersData.join(',')}\n`;
    csvContent += `Total Campaigns,${this.totalCampaignsData.join(',')}\n`;
    csvContent += `Total Volunteers,${this.totalVolunteersData.join(',')}\n`;
    csvContent += `Total Withdrawals,${this.totalWithdrawalsData.join(',')}\n`;
    csvContent += `Total Events,${this.totalEventsData.join(',')}\n`;

    return csvContent;
  }

  // Helper function to trigger file download
  downloadFile(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Initialize the charts for donations, users, campaigns, volunteers, withdrawals, and events
  initCharts(): void {
    // Donations chart
    const donationsCtx = document.getElementById('donationsChart') as HTMLCanvasElement;
    new Chart(donationsCtx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Total Donations (₱)',
          data: [50000, 30000, 70000, 20000, 100000, 150000, 120000, 50000, 30000, 100000, 50000, 30000],
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
          data: [100, 120, 150, 170, 200, 220, 250, 280, 300, 350, 370, 400],
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

    // Campaigns chart
    const campaignsCtx = document.getElementById('campaignsChart') as HTMLCanvasElement;
    new Chart(campaignsCtx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Total Campaigns',
          data: [2, 1, 3, 1, 4, 2, 2, 3, 1, 3, 2, 4],
          backgroundColor: 'rgba(255, 159, 64, 0.6)',
          borderColor: 'rgba(255, 159, 64, 1)',
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

    // Volunteers chart
    const volunteersCtx = document.getElementById('volunteersChart') as HTMLCanvasElement;
    new Chart(volunteersCtx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Total Volunteers',
          data: [5, 8, 7, 10, 15, 12, 20, 25, 30, 18, 15, 20],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)'
          ]
        }]
      },
      options: {
        responsive: true
      }
    });

    // Withdrawals chart
    const withdrawalsCtx = document.getElementById('withdrawalsChart') as HTMLCanvasElement;
    new Chart(withdrawalsCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Total Withdrawals (₱)',
          data: [30000, 50000, 25000, 45000, 60000, 70000, 50000, 45000, 55000, 40000, 50000, 35000],
          backgroundColor: 'rgba(255, 206, 86, 0.6)',
          borderColor: 'rgba(255, 206, 86, 1)',
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

    // Events chart
    const eventsCtx = document.getElementById('eventsChart') as HTMLCanvasElement;
    new Chart(eventsCtx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Total Events',
          data: [1, 3, 2, 4, 5, 6, 3, 5, 4, 6, 5, 4],
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)'
          ]
        }]
      },
      options: {
        responsive: true
      }
    });
  }
}
