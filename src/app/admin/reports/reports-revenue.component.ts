import { Component, OnInit } from '@angular/core';
import { DonationService } from '../../_services';
import { ChartData, ChartOptions } from 'chart.js';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-reports-revenue',
  templateUrl: './reports-revenue.component.html',
  styleUrls: ['./reports-revenue.component.css']
})
export class ReportsRevenueComponent implements OnInit {
  feeAmounts: any[] = [];
  totalFeeAmount: number = 0;
  chart: Chart | undefined;

  // Chart Data for Bar Chart
  public barChartData: ChartData = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Total Revenue',
      backgroundColor: '#42A5F5', // Bar color
      borderColor: '#1E88E5', // Border color for bars
      borderWidth: 1
    }]
  };

  constructor(private donationService: DonationService) {}

  ngOnInit(): void {
    this.getFeeAmounts();
  }

  getFeeAmounts(): void {
    this.donationService.getFeeAmounts().subscribe(
      data => {
        this.feeAmounts = data.feeAmounts;
        this.totalFeeAmount = data.totalFeeAmount;
        this.prepareChartData();
      },
      error => {
        console.error('Error fetching fee amounts:', error);
      }
    );
  }

  prepareChartData(): void {
    const monthlyRevenue = {};

    // Group revenue by month
    this.feeAmounts.forEach(fee => {
      const month = new Date(fee.date_created).toLocaleString('default', { month: 'short' }) + ' ' + new Date(fee.date_created).getFullYear();
      if (!monthlyRevenue[month]) {
        monthlyRevenue[month] = 0;
      }
      monthlyRevenue[month] += fee.fee_amount;
    });

    // Prepare chart data
    this.barChartData.labels = Object.keys(monthlyRevenue);
    this.barChartData.datasets[0].data = Object.values(monthlyRevenue);

    // Update the chart after data processing
    this.updateChart();
  }

  updateChart(): void {
    const canvas = document.getElementById('barChartCanvas') as HTMLCanvasElement;
    if (canvas && !this.chart) {
      this.chart = new Chart(canvas, {
        type: 'bar', // Change from 'line' to 'bar'
        data: this.barChartData,
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    } else if (this.chart) {
      this.chart.update();
    }
  }

  // CSV Download Functionality
  downloadReport(): void {
    const csvData = this.convertToCSV(this.feeAmounts);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'revenue-report.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  convertToCSV(data: any[]): string {
    const headers = 'Donation ID,Fee Amount\n';
    const rows = data.map(item => `${item.donation_id},${item.fee_amount}`).join('\n');
    return headers + rows;
  }
}
