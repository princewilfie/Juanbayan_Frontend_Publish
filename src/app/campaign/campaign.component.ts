import { Component } from '@angular/core';
declare var bootstrap: any;

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.css']
})

export class CampaignComponent {
  selectedCampaignTitle: string = '';
  selectedCampaignDescription: string = '';
  selectedCampaignImage: string = '';
  donationAmount: number | null = null;
  showDonationAlert: boolean = false;
  receiptPreview: string | ArrayBuffer | null = '';

  openCampaignDetail(title: string, description: string, image: string) {
    this.selectedCampaignTitle = title;
    this.selectedCampaignDescription = description;
    this.selectedCampaignImage = image;
    this.openModal('campaignDetailModal');
  }

  openDonateModal() {
    this.closeModal('campaignDetailModal');
    this.openModal('donateModal');
  }

  showQRCode() {
    if (this.donationAmount && this.donationAmount > 0) {
      this.closeModal('donateModal');
      this.openModal('qrCodeModal');
    } else {
      this.showDonationAlert = true;
    }
  }

  openUploadModal() {
    this.closeModal('qrCodeModal');
    this.openModal('uploadModal');
  }

  closeModal(modalId: string) {
    const modal = document.getElementById(modalId);
    if (modal) {
      const bootstrapModal = new bootstrap.Modal(modal);
      bootstrapModal.hide();
    }
  }

  openModal(modalId: string) {
    const modal = document.getElementById(modalId);
    if (modal) {
      const bootstrapModal = new bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }

  previewReceipt(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.receiptPreview = reader.result;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  confirmReceipt() {
    // Logic to handle receipt confirmation
    alert('Receipt confirmed!');
    this.closeModal('uploadModal');
  }
}
