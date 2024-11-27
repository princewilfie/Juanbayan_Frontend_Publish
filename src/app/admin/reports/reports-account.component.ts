import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AccountService } from '../../_services';
import { Account } from '../../_models';
import { Chart } from 'chart.js/auto';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-accounts-report',
  templateUrl: './reports-account.component.html',
  //styleUrls: ['./reports-account.component.css']
})
export class ReportsAccountComponent implements OnInit, AfterViewInit {
  accounts: Account[] = [];
  filteredAccounts: Account[] = [];
  chart: Chart | undefined;
  filter = {
    name: '',
    accType: '',
    status: ''
  };

  // Access the canvas element using ViewChild
  @ViewChild('accountsChart') accountsChart!: ElementRef<HTMLCanvasElement>;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  ngAfterViewInit() {
    this.createChart(); // Initialize the chart after the view is fully loaded
  }

  loadAccounts(): void {
    this.accountService.getAll().subscribe((accounts) => {
      this.accounts = accounts;
      this.filteredAccounts = accounts;
      this.updateChart();
    });
  }

  filterAccounts(): void {
    this.filteredAccounts = this.accounts.filter(account => {
      const matchesName = !this.filter.name || `${account.acc_firstname} ${account.acc_lastname}`.toLowerCase().includes(this.filter.name.toLowerCase());
      const matchesType = !this.filter.accType || account.acc_type === this.filter.accType;
      const matchesStatus = !this.filter.status || account.acc_status === this.filter.status;
      return matchesName && matchesType && matchesStatus;
    });
    this.updateChart();
  }

  downloadPDF(): void {
    const doc = new jsPDF();
    doc.text('Account Reports', 14, 20);

    const tableData = this.filteredAccounts.map(account => [
      account.id,
      account.acc_firstname,
      account.acc_lastname,
      account.acc_email,
      account.acc_totalpoints,
      account.acc_type,
      account.acc_status
    ]);

    (doc as any).autoTable({
      head: [['ID', 'First Name', 'Last Name', 'Email', 'Total Points', 'Type', 'Status']],
      body: tableData,
      startY: 30,
    });

    doc.save('JuanBayan-Accounts.pdf');
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
    this.accountService.getAll().subscribe(data => {
      this.downloadCSV(data, 'JuanBayan-Accounts.csv');
    });
  }

  createChart(): void {
    const ctx = this.accountsChart?.nativeElement.getContext('2d');

    if (!ctx) {
      console.error('Failed to acquire context for chart');
      return;
    }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Accounts Created',
          data: [],
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
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

  updateChart(): void {
    if (this.chart) {
      // Get unique months based on account creation date
      const monthLabels = this.getMonthlyLabels();
      const data = monthLabels.map(month =>
        this.filteredAccounts.filter(a => new Date(a.acc_created).getMonth() === month).length
      );

      this.chart.data.labels = monthLabels.map(month => this.getMonthName(month));
      this.chart.data.datasets[0].data = data;
      this.chart.update();
    }
  }

  getMonthlyLabels(): number[] {
    const months = this.filteredAccounts.map(a => new Date(a.acc_created).getMonth());
    return Array.from(new Set(months)).sort();
  }

  getMonthName(monthIndex: number): string {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return monthNames[monthIndex];
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
