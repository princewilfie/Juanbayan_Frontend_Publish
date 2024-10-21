import { Component, OnInit } from '@angular/core';
import { EventService } from '../_services/event.service';
import { AccountService } from '../_services/account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ParticipantService } from '../_services/participant.service';
import { Participant } from '../_models';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {
  createEventForm: FormGroup;
  updateEventForm: FormGroup; 
  selectedFiles: File[] | null = null;
  updateFiles: File[] | null = null; 
  loading = false;
  submitted = false;
  errorMessage: string | null = null;
  events: any[] = [];
  imagePreviews: string[] = [];
  updateImagePreviews: string[] = []; 
  showModal = false;
  showUpdateModal = false; 
  selectedEvent: any = null;
  isUpdateFormVisible = false; 
  participants: Participant[] = [];
  eventId: number;
  showParticipantsModal: boolean = false;

  // Define properties for different event statuses
  approveEvents: any[] = [];
  pendingEvents: any[] = [];
  rejectEvents: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private eventService: EventService,
    private accountService: AccountService,
    private participantService: ParticipantService
  ) {
    this.createEventForm = this.formBuilder.group({
      Event_Name: ['', Validators.required],
      Event_Description: ['', Validators.required],
      Event_Start_Date: ['', Validators.required],
      Event_End_Date: ['', Validators.required],
      Event_Location: ['', Validators.required],
      Event_Image: ['']
    });

    this.updateEventForm = this.formBuilder.group({
      Event_Name: ['', Validators.required],
      Event_Description: ['', Validators.required],
      Event_Start_Date: ['', Validators.required],
      Event_End_Date: ['', Validators.required],
      Event_Location: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    const account = this.accountService.accountValue;
    if (account?.id) {
      this.eventService.getEventsByAccountId(Number(account.id)).subscribe(
        (data: any[]) => {
          console.log('Events data:', data);
          // Filter events by approval status
          this.approveEvents = data.filter(event => event.Event_ApprovalStatus === 'Approved');
          this.pendingEvents = data.filter(event => event.Event_ApprovalStatus === 'Pending');
          this.rejectEvents = data.filter(event => event.Event_ApprovalStatus === 'Rejected');


          console.log('Approved Events:', this.approveEvents);
          console.log('Pending Events:', this.pendingEvents);
          console.log('Rejected Events:', this.rejectEvents);

        },
        (error) => {
          console.error('Error fetching events', error);
          this.errorMessage = 'Error fetching events: ' + error.message;
        }
      );
    } else {
      console.error('Account not found.');
      this.errorMessage = 'No account information found.';
    }
  }

  viewParticipants(eventId): void {
    // Clear participants before fetching new ones
    this.participants = [];
    this.showParticipantsModal = true;

    this.participantService.getEventParticipants(eventId).toPromise()
      .then((data: Participant[]) => {
        this.participants = data;  // Assign the fetched data to participants array
      })
      .catch((error) => {
        console.error('Error fetching participants', error);
      });
  }

  closeParticipantsModal(): void {
    this.showParticipantsModal = false;
  }

  openModal() {
    this.showModal = true;
    this.resetForm();
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
  }

  resetForm() {
    this.createEventForm.reset();
    this.selectedFiles = null;
    this.imagePreviews = [];
    this.errorMessage = null;
    this.submitted = false;
  }

  handleFileInput(event: any) {
    this.selectedFiles = event.target.files;
    this.imagePreviews = [];
    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          if (e.target?.result) {
            this.imagePreviews.push(e.target.result as string);
          }
        };
        fileReader.readAsDataURL(this.selectedFiles[i]);
      }
    }
  }

  createEvent() {
    this.submitted = true;
    const account = this.accountService.accountValue;

    if (this.createEventForm.invalid || !account?.id) {
      console.log('Form is invalid or account not found');
      return;
    }

    this.loading = true;

    const formData = new FormData();
    for (const key in this.createEventForm.controls) {
      if (this.createEventForm.get(key)) {
        formData.append(key, this.createEventForm.get(key)!.value);
      }
    }

    formData.append('Acc_ID', account.id.toString());

    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append('Event_Image', this.selectedFiles[i], this.selectedFiles[i].name);
      }
    }

    this.eventService.create(formData).subscribe(
      response => {
        this.loading = false;
        this.submitted = false;
        this.closeModal();
        this.loadEvents(); // Reload events to reflect changes
      },
      error => {
        this.loading = false;
        this.errorMessage = error.message;
      }
    );
  }

  selectEvent(event: any) {
    this.selectedEvent = event; 
    this.updateEventForm.patchValue(event); 
    this.updateImagePreviews = []; 
    this.isUpdateFormVisible = true;
  }

  

  openUpdateModal() {
    this.showUpdateModal = true;
    // Initialize form with selectedEvent data if needed
    if (this.selectedEvent) {
      this.updateEventForm.patchValue(this.selectedEvent);
    }
  }

  handleUpdateFileInput(event: any) {
    this.updateFiles = event.target.files;
    this.updateImagePreviews = [];
    if (this.updateFiles) {
      for (let i = 0; i < this.updateFiles.length; i++) {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          if (e.target?.result) {
            this.updateImagePreviews.push(e.target.result as string);
          }
        };
        fileReader.readAsDataURL(this.updateFiles[i]);
      }
    }
  }

  updateEvent() {
    const account = this.accountService.accountValue;

    if (this.updateEventForm.invalid || !account?.id || !this.selectedEvent?.Event_ID) {
      console.log('Form is invalid or account not found or event ID is missing');
      return;
    }

    const formData = new FormData();

    Object.keys(this.updateEventForm.controls).forEach(key => {
      formData.append(key, this.updateEventForm.get(key)?.value);
    });

    if (this.updateFiles) {
      for (let i = 0; i < this.updateFiles.length; i++) {
        formData.append('Event_Image', this.updateFiles[i], this.updateFiles[i].name);
      }
    }

    const eventId = this.selectedEvent?.Event_ID?.toString();

    if (eventId) {
      this.eventService.updateEvent(eventId, formData).subscribe(
        response => {
          console.log('Event updated successfully', response);
          const index = this.events.findIndex(event => event.Event_ID === this.selectedEvent.Event_ID);
          if (index !== -1) {
            this.events[index] = { ...this.events[index], ...response }; 
          }
          this.closeUpdateModal(); 
          alert('Event updated successfully.');
        },
        error => {
          console.error('Error updating event:', error);
          this.errorMessage = error.error?.message || 'Failed to update event. Unknown error occurred.';
        }
      );
    } else {
      console.error('No event ID found for updating the event.');
      this.errorMessage = 'No event ID found. Cannot update the event.';
    }
  }

  closeUpdateModal() {
    this.showUpdateModal = false; 
    this.selectedEvent = null;
    this.updateImagePreviews = []; 
    this.isUpdateFormVisible = false; 
  }

  closeEventDetails() {
    this.selectedEvent = null;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Rejected':
        return 'red';
      case 'Pending':
        return 'orange';
      case 'Approved':
        return 'green';
      default:
        return 'black'; 
    }
  }

  getImagePath(image: string): string {
    return image ? `http://localhost:4000/${image}` : 'assets/'; 
  }

  // New method to filter events by status
  getEventsByStatus(status: number): any[] {
    return this.events.filter(event => {
      if (status === 1) return event.Event_ApprovalStatus === 1; // Approved
      if (status === 0) return event.Event_ApprovalStatus === 0; // Pending
      if (status === -1) return event.Event_ApprovalStatus === -1; // Rejected
      return false;
    });
  }
}