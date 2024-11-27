import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { EventService } from '../../_services';
import { CommunityEvent } from '../../_models/communityevent';
import { Chart } from 'chart.js/auto';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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

  downloadPDF(): void {
    const doc = new jsPDF();
  
    // Add title
    doc.text('Event Report', 14, 10);
  
    // Prepare data for the table
    const tableData = this.filteredEvents.map(event => [
      event.Event_ID,
      event.Event_Name,
      event.Event_Location,
      new Date(event.Event_Start_Date).toLocaleDateString(),
      new Date(event.Event_End_Date).toLocaleDateString(),
    ]);
  
    // Add table
    (doc as any).autoTable({
      head: [['ID', 'Name', 'Location', 'Start Date', 'End Date']],
      body: tableData,
    });
  
    // Download the PDF
    doc.save('JuanBayan-Events.pdf');
  }

  filterEvents(): void {
    this.filteredEvents = this.events.filter(event => {
      const eventStartDate = new Date(event.Event_Start_Date);
      const eventEndDate = new Date(event.Event_End_Date);

      // Check for filter criteria
      const idMatch = !this.filter.id || event.Event_ID === this.filter.id;
      const nameMatch = !this.filter.eventName || event.Event_Name.toLowerCase().includes(this.filter.eventName.toLowerCase());
      const startDateMatch = !this.filter.startDate || eventStartDate >= this.filter.startDate;
      const endDateMatch = !this.filter.endDate || eventEndDate <= this.filter.endDate;

      return idMatch && nameMatch && startDateMatch && endDateMatch;
    });

    // Update the chart with filtered data
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
    if (!this.chart) {
      console.error('Chart is not initialized');
      return;
    }
  
    // Ensure the filtered events are not empty
    if (!this.filteredEvents || this.filteredEvents.length === 0) {
      console.warn('No events available to display on the chart');
      this.chart.data.labels = [];
      this.chart.data.datasets[0].data = [];
      this.chart.update();
      return;
    }
  
    // Map month indices to month names
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  
    try {
      // Extract unique months from filtered events
      const months = [...new Set(this.filteredEvents.map(e => {
        const date = new Date(e.Event_Start_Date);
        if (isNaN(date.getTime())) {
          console.error('Invalid date format in event:', e.Event_Start_Date);
          return null;
        }
        return date.getMonth();
      }))].filter(month => month !== null);
  
      // Sort months in ascending order
      months.sort((a, b) => a - b);
  
      // Map month indices to month names
      const labels = months.map(month => monthNames[month]);
  
      // Count the number of events for each month
      const data = months.map(month =>
        this.filteredEvents.filter(e => new Date(e.Event_Start_Date).getMonth() === month).length
      );
  
      // Update chart labels and data
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = data;
  
      // Update the chart to reflect changes
      this.chart.update();
    } catch (error) {
      console.error('Error while updating the chart:', error);
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
