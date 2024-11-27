import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CampaignService } from '../../_services';
import { Campaign } from '../../_models';
import { Chart } from 'chart.js/auto';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  templateUrl: './reports-campaign.component.html',
  //styleUrls: ['./reports-campaign.component.css']
})
export class ReportsCampaignComponent implements OnInit, AfterViewInit {
  campaigns: Campaign[] = [];
  filteredCampaigns: Campaign[] = [];
  chart: Chart | undefined;

  // Filter options
  filter = {
    id: null as number | null,
    campaignName: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
  };

  // Access the canvas element using ViewChild
  @ViewChild('campaignsChart') campaignsChart!: ElementRef<HTMLCanvasElement>;

  constructor(private campaignService: CampaignService) {}

  ngOnInit(): void {
    this.loadCampaigns();
  }

  ngAfterViewInit() {
    this.createChart(); // Initialize the chart after the view is fully loaded
  }

  loadCampaigns(): void {
    this.campaignService.getAllCampaigns().subscribe((campaigns) => {
      this.campaigns = campaigns;
      this.filteredCampaigns = campaigns;
      this.updateChart();
    });
    console.log("Campaign data:", this.campaigns);
  }


  filterCampaigns(): void {
    console.log('Current Filters:', this.filter); // Log current filter values
  
    // Parse dates if provided
    const filterStartDate = this.filter.startDate ? new Date(this.filter.startDate) : null;
    const filterEndDate = this.filter.endDate ? new Date(this.filter.endDate) : null;
  
    // Apply filtering
    this.filteredCampaigns = this.campaigns.filter(campaign => {
      const matchesId = !this.filter.id || campaign.Campaign_ID === +this.filter.id;
      const matchesName = !this.filter.campaignName || campaign.Campaign_Name.toLowerCase().includes(this.filter.campaignName.toLowerCase());
      const matchesStartDate = !filterStartDate || new Date(campaign.Campaign_Start) >= filterStartDate;
      const matchesEndDate = !filterEndDate || new Date(campaign.Campaign_End) <= filterEndDate;
  
      console.log(
        `Checking Campaign ID ${campaign.Campaign_ID}:`,
        { matchesId, matchesName, matchesStartDate, matchesEndDate }
      );
  
      return matchesId && matchesName && matchesStartDate && matchesEndDate;
    });
  
    console.log('Filtered Campaigns:', this.filteredCampaigns); // Log filtered campaigns
    this.updateChart(); // Update the chart with the filtered data
  }

  downloadAsPDF(): void {
    const doc = new jsPDF();

    // Add title to the PDF
    doc.setFontSize(18);
    doc.text('Campaign Reports', 14, 20);

    // Prepare data for the table
    const tableData = this.filteredCampaigns.map((campaign) => [
      campaign.Campaign_ID,
      campaign.Campaign_Name,
      campaign.Campaign_TargetFund,
      campaign.Campaign_CurrentRaised,
      campaign.Category_ID,
      new Date(campaign.Campaign_Start).toLocaleDateString(),
      new Date(campaign.Campaign_End).toLocaleDateString(),
    ]);

    // Add table to the PDF
    (doc as any).autoTable({
      head: [['ID', 'Name', 'Target Fund', 'Current Raised', 'Category', 'Start Date', 'End Date']],
      body: tableData,
      startY: 30,
    });

    // Save the PDF
    doc.save('CampaignReports.pdf');
  }  
  

  createChart(): void {
    const ctx = this.campaignsChart?.nativeElement.getContext('2d');

    if (!ctx) {
      console.error('Failed to acquire context for chart');
      return;
    }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Campaign Count',
          data: [],
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
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
      const categories = [...new Set(this.filteredCampaigns.map(c => c.Category_ID))];
      const data = categories.map(category =>
        this.filteredCampaigns.filter(c => c.Category_ID === category).length
      );

      this.chart.data.labels = categories;
      this.chart.data.datasets[0].data = data;
      this.chart.update();
    }
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
    this.campaignService.getAllCampaigns().subscribe(data => {
      this.downloadCSV(data, 'JuanBayan-Campaigns.csv');
    });
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
