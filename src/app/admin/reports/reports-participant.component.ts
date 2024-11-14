import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ParticipantService } from '../../_services';
import { Participant } from '../../_models/participant';
import { Chart } from 'chart.js/auto';

@Component({
  templateUrl: './reports-participant.component.html',
  //styleUrls: ['./reports-participant.component.css']
})
export class ReportsParticipantComponent implements OnInit, AfterViewInit {
  participants: Participant[] = [];
  filteredParticipants: Participant[] = [];
  chart: Chart | undefined;

  @ViewChild('volunteerChart') volunteerChart!: ElementRef<HTMLCanvasElement>;

  constructor(private participantService: ParticipantService) {}

  ngOnInit(): void {
    this.loadParticipants();
  }

  ngAfterViewInit() {
    this.createChart();
  }

  // Fetch all participants from the service
  loadParticipants(): void {
    this.participantService.getAllParticipants().subscribe((participants) => {
      this.participants = participants;
      this.filteredParticipants = participants;
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
    this.participantService.getAllParticipants().subscribe(data => {
      this.downloadCSV(data, 'JuanBayan-Participants.csv');
    });
  }

  // Initialize the chart
  createChart(): void {
    const ctx = this.volunteerChart?.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Failed to acquire context for chart');
      return;
    }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Volunteers Joined',
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

  // Update the chart data to show participants by month
  updateChart(): void {
    if (this.chart) {
      const monthLabels = this.getMonthlyLabels();
      const data = monthLabels.map(month =>
        this.filteredParticipants.filter(p => new Date(p.joinedAt).getMonth() === month).length
      );

      this.chart.data.labels = monthLabels.map(month => this.getMonthName(month));
      this.chart.data.datasets[0].data = data;
      this.chart.update();
    }
  }

  // Get unique months from participant join dates
  getMonthlyLabels(): number[] {
    const months = this.filteredParticipants.map(p => new Date(p.joinedAt).getMonth());
    return Array.from(new Set(months)).sort();
  }

  // Helper function to convert month number to name
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
