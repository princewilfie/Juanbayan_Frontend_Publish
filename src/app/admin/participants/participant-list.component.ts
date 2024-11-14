import { Component, OnInit } from '@angular/core';
import { ParticipantService } from '../../_services/participant.service';
import { Participant } from '../../_models';

@Component({
  selector: 'app-participant-list',
  templateUrl: './participant-list.component.html'
})
export class ParticipantListComponent implements OnInit {
  participants: Participant[] = [];

  constructor(private participantService: ParticipantService) {}

  ngOnInit(): void {
    this.loadParticipants(); // Load participants on component initialization
  }

  // Method to load all participants from the backend
  loadParticipants(): void {
    this.participantService.getAllParticipants().subscribe(
      (data: Participant[]) => {
        this.participants = data;
      },
      error => {
        console.error('Error fetching participants:', error);
      }
    );
  }

  // Optional: Add method to handle additional actions like viewing details, etc.
}
