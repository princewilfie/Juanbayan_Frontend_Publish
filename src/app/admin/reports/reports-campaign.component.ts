import { Component, OnInit } from '@angular/core';
import { CampaignService } from '../../_services';
import { Campaign } from '../../_models';
import { Chart } from 'chart.js/auto';

@Component({
  templateUrl: './reports-campaign.component.html',
  styleUrls: ['./reports-campaign.component.css']
})
export class ReportsCampaignComponent implements OnInit {
  campaigns: Campaign[] = [];
  filteredCampaigns: Campaign[] = [];
  chart: any;
  filter = {
    id: null as number | null,
    event: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
  };

  constructor(private campaignService: CampaignService) {}

  ngOnInit(): void {
    this.loadCampaigns();
  }

  loadCampaigns(): void {
    this.campaignService.getAllCampaigns().subscribe((campaigns) => {
      this.campaigns = campaigns;
      this.filteredCampaigns = campaigns;
      this.updateChart();
    });
  }

  filterCampaigns(): void {
    this.filteredCampaigns = this.campaigns.filter(campaign => {
      return (!this.filter.id || campaign.Campaign_ID === this.filter.id) &&
             (!this.filter.event || campaign.Campaign_Name.includes(this.filter.event)) &&
             (!this.filter.startDate || new Date(campaign.Campaign_Start) >= this.filter.startDate) &&
             (!this.filter.endDate || new Date(campaign.Campaign_End) <= this.filter.endDate);
    });
    this.updateChart();
  }

  updateChart(): void {
    if (this.chart) this.chart.destroy();
    
    const categories = [...new Set(this.filteredCampaigns.map(c => c.Campaign_Category))];
    const data = categories.map(category =>
      this.filteredCampaigns.filter(c => c.Campaign_Category === category).length
    );

    this.chart = new Chart('campaignsChart', {
      type: 'bar',
      data: {
        labels: categories,
        datasets: [{
          label: 'Campaign Count',
          data: data,
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
}
