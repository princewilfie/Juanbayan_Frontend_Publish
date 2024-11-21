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
    const monthlyRevenue: { [key: string]: number } = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
    this.feeAmounts.forEach(fee => {
      if (!fee.donation_date) {
        console.warn('Missing date in fee:', fee);
        return; // Skip if date_created is undefined
      }
  
      const date = new Date(fee.donation_date);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date in fee:', fee.donation_date);
        return; // Skip invalid dates
      }
  
      // Extract the month name and year
      const month = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  
      // Accumulate revenue for the month
      if (!monthlyRevenue[month]) {
        monthlyRevenue[month] = 0;
      }
      monthlyRevenue[month] += fee.fee_amount;
    });
  
    // Sort the months by date
    const sortedMonths = Object.keys(monthlyRevenue).sort((a, b) => {
      const [aMonth, aYear] = a.split(' ');
      const [bMonth, bYear] = b.split(' ');
      return new Date(`${aMonth} 1 ${aYear}`).getTime() - new Date(`${bMonth} 1 ${bYear}`).getTime();
    });
  
    // Update chart data
    this.barChartData.labels = sortedMonths;
    this.barChartData.datasets[0].data = sortedMonths.map(month => monthlyRevenue[month]);
  
    // Update the chart
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
