import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { DonationService } from '../../_services';
import { Donation } from '../../_models/donation';
import { Chart } from 'chart.js/auto';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  templateUrl: './reports-donation.component.html',
  //styleUrls: ['./reports-donation.component.css']
})
export class ReportsDonationComponent implements OnInit, AfterViewInit {
  donations: Donation[] = [];
  filteredDonations: Donation[] = [];
  totalDonations: number = 0;
  startDate!: string;
  endDate!: string;
  searchTerm: string = '';

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
      this.filteredDonations = donations;
      this.calculateTotal();
      this.updateChart();
    });
  }


  filterDonations(): void {
    const start = this.startDate ? new Date(this.startDate) : null;
    const end = this.endDate ? new Date(this.endDate) : null;

    this.filteredDonations = this.donations.filter(donation => {
      const donationDate = new Date(donation.donation_date);
      const matchesDate =
        (!start || donationDate >= start) && (!end || donationDate <= end);
      const matchesSearch = donation.acc_firstname.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            donation.acc_lastname.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesDate && matchesSearch;
    });

    this.calculateTotal();
  }

  calculateTotal(): void {
    this.totalDonations = this.filteredDonations.reduce((sum, donation) => sum + donation.donation_amount, 0);
  }

  pdfdownload(): void {
    const doc = new jsPDF();
    let finalY = 20; // Initial Y position for the content

    // Table generation
    (doc as any).autoTable({
        head: [['Donation ID', 'First Name', 'Last Name', 'Amount', 'Donation Date']],
        body: this.filteredDonations.map(d => [
            d.donation_id,
            d.acc_firstname,
            d.acc_lastname,
            `P${d.donation_amount}`,
            new Date(d.donation_date).toLocaleDateString()
        ]),
        startY: finalY,
        didDrawCell: (data: any) => {
            finalY = data.cursor.y; // Capture the current Y position
        },
    });

    // Add text after the table
    doc.text(`Total Donations: P${this.totalDonations}`, 14, finalY + 10);

    // Save the PDF
    doc.save('JuanBayan-Donations.pdf');
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

  downloadAnimation() {
    const downloadButton = document.querySelector('.btn-circle-download') as HTMLElement;
    downloadButton.classList.add('load');

    setTimeout(() => {
        downloadButton.classList.add('done');
    }, 1000);

    setTimeout(() => {
        downloadButton.classList.remove('load', 'done');
    }, 5000);
  }
}
