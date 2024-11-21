import { Component, OnInit } from '@angular/core';
import { CampaignService } from '../_services/campaign.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Campaign } from '../_models/campaign';
import { Withdraw } from '../_models';
import { WithdrawService } from '../_services';

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
})
export class CampaignComponent implements OnInit {
  campaigns: Campaign[] = [];
  selectedCampaign?: Campaign;
  qrCodeUrl: string = 'assets/gcash_qr.png'; // Static QR code URL for GCash
  receiptPreview?: string; // To hold the receipt preview for the upload modal
  testimonies: Withdraw[] = [];

  constructor(
    private campaignService: CampaignService, 
    private modalService: NgbModal,
    private withdrawService: WithdrawService) {}

  ngOnInit(): void {
    this.fetchApprovedCampaigns();

    this.withdrawService.getAll().subscribe((data: Withdraw[]) => {
      this.testimonies = data.filter(withdraw => withdraw.Testimony); // Only include entries with testimony
    });
  }

  // Fetch only approved campaigns (Campaign_Status = 1)
  fetchApprovedCampaigns(): void {
    this.campaignService.getAllCampaigns().subscribe((campaigns: Campaign[]) => {
      this.campaigns = campaigns.filter(campaign => campaign.Campaign_Status === 1);
    });
  }

  // Open campaign details modal
  openCampaignDetails(campaign: Campaign, content: any): void {
    this.selectedCampaign = campaign;
    this.modalService.open(content, { centered: true });
  }

  // Open donation modal
  openDonateModal(content: any): void {
    this.modalService.open(content, { centered: true });
  }

  // Close modal
  closeModal(modalRef: any): void {
    modalRef.dismiss();
  }

  // Handle receipt file change and display a preview
  onFileChange(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => this.receiptPreview = e.target.result;
    reader.readAsDataURL(file);
  }

  // Placeholder for donation initiation
  initiateDonation(): void {
    alert('Donation initiated!');
  }

  // Placeholder for receipt upload confirmation
  confirmUpload(): void {
    alert('Receipt uploaded successfully!');
  }


  currentIndex = 0;

    prevSlide() {
        this.currentIndex = (this.currentIndex === 0) ? this.testimonies.length - 1 : this.currentIndex - 1;
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.testimonies.length;
    }

  getImagePath(image: string): string {
    return image ? `http://localhost:4000/${image}` : 'assets/'; 
  }

  
}