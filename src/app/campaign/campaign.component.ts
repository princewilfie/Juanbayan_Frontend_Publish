import { Component, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { PaymentService } from '../_services/payment.service'; // Import the payment service


@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
})
export class CampaignComponent {
  campaigns = [
    {
      title: 'Campaign Title 1',
      description: 'Help us provide relief to families affected by recent floods in the region.',
      image: 'https://via.placeholder.com/350x200',
    },
    // Add more campaigns
  ];

  selectedCampaign: any = null;
  qrCodeUrl = 'https://via.placeholder.com/300'; // Replace with your actual QR code URL
  receiptPreview: string | ArrayBuffer | null = null;

  @ViewChild('campaignDetailModal') campaignDetailModal!: ElementRef;
  @ViewChild('donateModal') donateModal!: ElementRef;
  @ViewChild('uploadModal') uploadModal!: ElementRef;

  constructor(private renderer: Renderer2, private paymentService: PaymentService) {}

  openCampaignDetails(campaign: any) {
    this.selectedCampaign = campaign;
    this.openModal(this.campaignDetailModal);
  }

  openDonateModal() {
    this.closeModal(this.campaignDetailModal);
    this.openModal(this.donateModal);
  }

  openUploadModal() {
    this.closeModal(this.donateModal);
    this.openModal(this.uploadModal);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.receiptPreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  confirmUpload() {
    if (this.receiptPreview) {
      alert('Receipt uploaded successfully!');
      this.closeModal(this.uploadModal);
    }
  }

  openModal(modal: ElementRef) {
    const modalElement = modal.nativeElement;
    this.renderer.addClass(modalElement, 'show');
    this.renderer.setStyle(modalElement, 'display', 'block');
    this.renderer.setStyle(modalElement, 'opacity', '1');
  }

  closeModal(modal: ElementRef) {
    const modalElement = modal.nativeElement;
    this.renderer.removeClass(modalElement, 'show');
    this.renderer.setStyle(modalElement, 'display', 'none');
  }

  // Method to handle the donation and call the payment API
  initiateDonation() {
    const amount = 1000; // Example amount, you can get this dynamically
    this.paymentService.createPaymentIntent(amount).subscribe(
      (response: any) => {
        window.location.href = response.paymentUrl; // Redirect user to PayMongo GCash payment page
      },
      (error) => {
        console.error('Error initiating payment', error);
      }
    );
  }
}