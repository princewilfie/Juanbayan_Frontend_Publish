import { Component, OnInit,  ViewChild, TemplateRef } from '@angular/core';
import { CampaignService } from '../../_services';
import { Campaign } from '../../_models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html'
})
export class CampaignListComponent implements OnInit {

  @ViewChild('notesModal') notesModal: TemplateRef<any> | undefined;
  @ViewChild('detailsModal') detailsModal: TemplateRef<any> | undefined;
  @ViewChild('rejectionModal') rejectionModal: TemplateRef<any> | undefined;

  campaigns: Campaign[] = [];
  campaign: any;
  selectedCampaignImages: string[] = [];
  selectedNote: string | null = null;
  rejectionNote: string = '';
  selectedCampaignId: number | null = null;

  

  constructor(
    private campaignService: CampaignService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadCampaigns(); // Initial load
  }

  // Method to load all campaigns from the backend
  loadCampaigns(): void {
    this.campaignService.getAll().subscribe(
      (data: Campaign[]) => {
        this.campaigns = data.map(campaign => {
          // Parse Proof_Files for each campaign if it's stored as a JSON string
          campaign.Proof_Files = JSON.parse(campaign.Proof_Files || '[]');
          return campaign;
        });
      },
      error => {
        console.error('Error fetching campaigns:', error);
      }
    );
  }
  viewAllImages(content: any, campaign: Campaign): void {
    if (!campaign || !campaign.Campaign_ID) {
      console.error('Campaign not found or missing Campaign_ID');
      return;
    }
  
    this.campaignService.getProofFilesByCampaignId(campaign.Campaign_ID).subscribe(
      (data: any) => {
        console.log('Received campaign image data:', data);
        if (data && data.proofFiles) {
          this.selectedCampaignImages = data.proofFiles;
          console.log('Selected Campaign Images:', this.selectedCampaignImages);
        } else {
          this.selectedCampaignImages = [];
          console.log('No images found for this campaign.');
        }
  
        const modalRef = this.modalService.open(content);
        modalRef.result.then(
          (result) => {
            console.log('Modal closed:', result);
          },
          (reason) => {
            console.log('Modal dismissed:', reason);
          }
        );
      },
      error => {
        console.error('Error fetching campaign images:', error);
      }
    );
  }
  
  // Approve a campaign and reload the list after
  approveCampaign(id: number): void {
    this.campaignService.approve(id).subscribe(
      (response: Campaign) => {
        console.log('Campaign approved:', response);  // Log the approved campaign
        this.loadCampaigns();  // Reload the campaign list after approval
       // Show SweetAlert success message for approval
       Swal.fire({
        icon: 'success',
        title: 'Campaign Approved!',
        text: 'The campaign has been approved successfully.',
        showConfirmButton: false,
        timer: 1500
      });
    },
    error => {
      console.error('Error approving campaign:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Something went wrong while approving the campaign. Please try again.',
      });
    }
    );
  }

  openRejectionModal(campaignId: number): void {
    this.selectedCampaignId = campaignId;
    if (this.rejectionModal) {
      this.modalService.open(this.rejectionModal, { centered: true });
    } else {
      console.error('Rejection modal is undefined.');
    }
  }

  // Method to confirm the rejection with a note
confirmRejectCampaign(campaignId: number, modal: any): void {
  if (!this.rejectionNote.trim()) {
    Swal.fire({
      icon: 'error',
      title: 'Empty Field!',
      text: 'Please add reason for rejection.',
      showConfirmButton: false,
      timer: 1500
    });
    return;
  }
  
  // Call the reject API with the note
  this.campaignService.reject(campaignId, this.rejectionNote).subscribe(
    (response: Campaign) => {
      this.rejectionNote = ''; // Clear the note after submission
      this.loadCampaigns(); // Reload campaign list after rejection
      modal.close(); // Close the modal
            // Show SweetAlert success message for rejection
            Swal.fire({
              icon: 'success',
              title: 'Campaign Rejected!',
              text: 'The campaign has been rejected successfully.',
              showConfirmButton: false,
              timer: 1500
            });
          },
          error => {
            console.error('Error rejecting campaign:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Something went wrong while rejecting the campaign. Please try again.',
            });
          }
  );
}
  
  // Optionally add this method if you need better campaign status handling
  getCampaignStatus(status: number): string {
    return status === 1 ? 'Active' : 'Inactive';
  }

  showCampaignDetails(campaign: Campaign): void {
    this.campaign = campaign; // Set the selected campaign for display
    console.log('Selected Campaign:', campaign);
    
    // Optionally, open a modal to show the details
    this.modalService.open(this.detailsModal, { centered: true });
  }

  openNotesModal(campaignId: number) {
    this.campaignService.getCampaignNotes(campaignId).subscribe(
      (note: any) => {
        console.log('API response for notes:', note);
        
        // Adjusted condition to handle the 'notes' property
        if (note && typeof note === 'object' && 'notes' in note) {
          this.selectedNote = note.notes; // Access the 'notes' property
        } else if (typeof note === 'string') {
          this.selectedNote = note; // Handle if it's a plain string
        } else {
          this.selectedNote = 'No valid note found for this campaign.';
        }
        
        this.modalService.open(this.notesModal, { centered: true });
      },
      (error) => {
        console.error('Error fetching campaign notes:', error);
        this.selectedNote = 'Error fetching notes. Please try again later.';
      }
    );
  }  

  closeModal(modal: any) {
    modal.close();
    this.selectedNote = null; // Reset the selected note
  }

}