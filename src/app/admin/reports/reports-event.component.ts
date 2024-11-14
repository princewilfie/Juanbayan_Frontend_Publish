import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { EventService } from '../../_services';
import { CommunityEvent } from '../../_models/communityevent';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-reports-event',
  templateUrl: './reports-event.component.html',
  //styleUrls: ['./reports-event.component.css']
})
export class ReportsEventComponent implements OnInit, AfterViewInit {
  events: CommunityEvent[] = [];
  filteredEvents: CommunityEvent[] = [];
  chart: Chart | undefined;

  // Filter options
  filter = {
    id: null as number | null,
    eventName: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
  };

  // Access the canvas element using ViewChild
  @ViewChild('eventsChart') eventsChart!: ElementRef<HTMLCanvasElement>;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  ngAfterViewInit() {
    this.createChart(); // Initialize the chart after the view is fully loaded
  }

  loadEvents(): void {
    this.eventService.getAll().subscribe((events) => {
      this.events = events;
      this.filteredEvents = events;
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
    this.eventService.getAll().subscribe(data => {
      this.downloadCSV(data, 'JuanBayan-Events.csv');
    });
  }
  filterEvents(): void {
    this.filteredEvents = this.events.filter(event => {
      return (!this.filter.id || event.Event_ID === this.filter.id) &&
             (!this.filter.eventName || event.Event_Name.includes(this.filter.eventName)) &&
             (!this.filter.startDate || new Date(event.Event_Start_Date) >= this.filter.startDate) &&
             (!this.filter.endDate || new Date(event.Event_End_Date) <= this.filter.endDate);
    });
    this.updateChart();
  }

  createChart(): void {
    const ctx = this.eventsChart?.nativeElement.getContext('2d');

    if (!ctx) {
      console.error('Failed to acquire context for chart');
      return;
    }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Event Count',
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
      const years = [...new Set(this.filteredEvents.map(e => new Date(e.Event_Start_Date).getMonth()))];
      const data = years.map(year =>
        this.filteredEvents.filter(e => new Date(e.Event_Start_Date).getMonth() === year).length
      );

      this.chart.data.labels = years;
      this.chart.data.datasets[0].data = data;
      this.chart.update();
    }
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
