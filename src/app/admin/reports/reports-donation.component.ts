import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { DonationService } from '../../_services';
import { Donation } from '../../_models/donation';
import { Chart } from 'chart.js/auto';

@Component({
  templateUrl: './reports-donation.component.html',
  styleUrls: ['./reports-donation.component.css']
})
export class ReportsDonationComponent implements OnInit, AfterViewInit {
  donations: Donation[] = [];
  @ViewChild('donationChart') donationChart!: ElementRef<HTMLCanvasElement>;
  chart: Chart | undefined;

  constructor(private donationService: DonationService) {}

  ngOnInit(): void {
    this.loadDonations();
  }

  ngAfterViewInit() {
    this.createChart();
  }

  // Load all donations and prepare chart data
  loadDonations(): void {
    this.donationService.getAllDonations().subscribe((donations) => {
      this.donations = donations;
      this.updateChart();
    });
  }

  // Convert data to CSV and trigger download
  private downloadCSV(data: any[], fileName: string): void {
    const csvContent = data.map(row => Object.values(row).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // Download Campaigns Report
  download(): void {
    this.donationService.getAllDonations().subscribe(data => {
      this.downloadCSV(data, 'JuanBayan-Donations.csv');
    });
  }

  // Initialize the chart
  createChart(): void {
    const ctx = this.donationChart?.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Failed to acquire context for chart');
      return;
    }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Total Donations ($)',
          data: [],
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  // Update the chart with monthly donation totals
  updateChart(): void {
    if (this.chart) {
      const monthLabels = this.getMonthlyLabels();
      const data = monthLabels.map(month => 
        this.donations
          .filter(d => new Date(d.donation_date).getMonth() === month)
          .reduce((sum, d) => sum + d.donation_amount, 0)
      );

      this.chart.data.labels = monthLabels.map(month => this.getMonthName(month));
      this.chart.data.datasets[0].data = data;
      this.chart.update();
    }
  }

  // Get unique months from donation dates
  getMonthlyLabels(): number[] {
    const months = this.donations.map(d => new Date(d.donation_date).getMonth());
    return Array.from(new Set(months)).sort();
  }

  // Convert month number to name
  getMonthName(month: number): string {
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
    return monthNames[month];
  }
}
