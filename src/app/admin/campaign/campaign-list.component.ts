import { Component, OnInit } from '@angular/core';
import { CampaignService } from '../../_services';
import { Campaign } from '../../_models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html'
})
export class CampaignListComponent implements OnInit {

  campaigns: Campaign[] = [];
  campaign: any;
  selectedCampaignImages: string[] = [];
  selectedNote: string | null = null;
  rejectionNote: string = '';
  selectedCampaignId: number | null = null;
  showRejectionModal = false;
  showImageModal = false;
  showNotesModal = false;
  showDetailsModal = false;
  loading = false;

  constructor(
    private campaignService: CampaignService
  ) {}

  ngOnInit(): void {
    this.loadCampaigns();
  }

  loadCampaigns(): void {
    this.campaignService.getAll().subscribe(
      (data: Campaign[]) => {
        this.campaigns = data.map(campaign => {
          campaign.Proof_Files = JSON.parse(campaign.Proof_Files || '[]');
          return campaign;
        });
      },
      error => {
        console.error('Error fetching campaigns:', error);
      }
    );
  }

  // View Campaign Images
  viewAllImages(campaign: Campaign): void {
    if (!campaign || !campaign.Campaign_ID) {
      console.error('Campaign object is invalid or missing Campaign_ID');
      return;
    }

    this.selectedCampaignId = campaign.Campaign_ID;
    this.campaignService.getProofFilesByCampaignId(campaign.Campaign_ID).subscribe(
      (data: any) => {
        this.selectedCampaignImages = data?.proofFiles || [];
        this.showImageModal = true;
        this.closeRejectionModal();
        this.closeNotesModal();
        this.closeDetailsModal();
      },
      error => {
        console.error('Error fetching campaign images:', error);
      }
    );
  }

  // Approve Campaign
  approveCampaign(id: number): void {
    this.loading = true;  // Show spinner
    this.campaignService.approve(id).subscribe(
      (response: Campaign) => {
        this.loadCampaigns();  // Reload campaigns after approval
        this.loading = false;  // Hide spinner
        Swal.fire({
          icon: 'success',
          title: 'Campaign Approved!',
          text: 'The campaign has been approved successfully.',
          showConfirmButton: false,
          timer: 1500
        });
      },
      error => {
        this.loading = false;  // Hide spinner in case of error
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Something went wrong while approving the campaign. Please try again.',
        });
      }
    );
  }
  // Reject Campaign
  openRejectionModal(campaignId: number): void {
    this.selectedCampaignId = campaignId;
    this.showRejectionModal = true;
    this.closeImageModal();
    this.closeNotesModal();
    this.closeDetailsModal();
  }

 // Reject Campaign
confirmRejectCampaign(campaignId: number): void {
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

  this.loading = true;  // Show spinner
  this.campaignService.reject(campaignId, this.rejectionNote).subscribe(
    (response: Campaign) => {
      this.rejectionNote = '';  // Clear the rejection note after rejection
      this.loadCampaigns();  // Reload campaigns after rejection
      this.showRejectionModal = false;  // Close rejection modal
      this.loading = false;  // Hide spinner
      Swal.fire({
        icon: 'success',
        title: 'Campaign Rejected!',
        text: 'The campaign has been rejected successfully.',
        showConfirmButton: false,
        timer: 1500
      });
    },
    error => {
      this.loading = false;  // Hide spinner in case of error
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Something went wrong while rejecting the campaign. Please try again.',
      });
    }
  );
}

  closeRejectionModal(): void {
    this.showRejectionModal = false;
  }

  closeImageModal(): void {
    this.showImageModal = false;
  }

  closeNotesModal(): void {
    this.showNotesModal = false;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
  }

  showCampaignDetails(campaign: Campaign): void {
    this.campaign = campaign;
    this.showDetailsModal = true;
    this.closeImageModal();
    this.closeRejectionModal();
    this.closeNotesModal();
  }

  openNotesModal(campaignId: number): void {
    this.campaignService.getCampaignNotes(campaignId).subscribe(
      (note: any) => {
        this.selectedNote = note?.notes || 'No valid note found for this campaign.';
        this.showNotesModal = true;
        this.closeRejectionModal();
        this.closeImageModal();
        this.closeDetailsModal();
      },
      error => {
        this.selectedNote = 'Error fetching notes. Please try again later.';
      }
    );
  }

  getCampaignStatus(status: string): string {
    // Logic to return status label
    return status === 'active' ? 'Active' : 'Inactive';
  }
}
