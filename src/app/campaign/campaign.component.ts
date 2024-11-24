import { Component, OnInit } from '@angular/core';
import { CampaignService } from '../_services/campaign.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Campaign } from '../_models/campaign';
import { Withdraw, Category } from '../_models';
import { WithdrawService, CategoryService, EventService } from '../_services';

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
  categories: Category[] = [];
  filteredCampaigns: Campaign[] = [];
  searchQuery: string = '';
  activeApprovedEvents: any[] = []; // Only active, approved events
  
  constructor(
    private campaignService: CampaignService, 
    private modalService: NgbModal,
    private withdrawService: WithdrawService,
    private categoryService: CategoryService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.fetchApprovedCampaigns();
    this.fetchCategories();

    this.withdrawService.getAll().subscribe((data: Withdraw[]) => {
      this.testimonies = data.filter(withdraw => withdraw.Testimony); // Only include entries with testimony
    });

    // load events
    this.loadActiveApprovedEvents();
  }

  // Fetch only active, approved events
  loadActiveApprovedEvents() {
    this.eventService.getApprovedActiveEvents().subscribe(
      (data: any[]) => {
        this.activeApprovedEvents = data;
        console.log("Fetched events:", this.activeApprovedEvents);
      },
      (error) => {
        console.error('Error fetching events:', error);
      }
    );
  }

   // Search campaigns based on the search query
  searchCampaigns(): void {
    if (!this.searchQuery.trim()) {
      this.filteredCampaigns = [...this.campaigns]; // Reset to all campaigns if search is empty
      return;
    }

    const lowerQuery = this.searchQuery.toLowerCase();
    this.filteredCampaigns = this.campaigns.filter(campaign =>
      (campaign.Campaign_Name?.toLowerCase() || '').includes(lowerQuery) ||
      (campaign.Campaign_Description?.toLowerCase() || '').includes(lowerQuery)
    
    );
  }

  // Fetch only approved campaigns (Campaign_Status = 1)

  fetchApprovedCampaigns(): void {
    this.campaignService.getAllCampaigns().subscribe((campaigns: Campaign[]) => {
      this.campaigns = campaigns.filter(campaign => campaign.Campaign_Status === 1);
      
      // Calculate Progress_Percentage for each campaign
      this.campaigns = this.campaigns.map(campaign => {
        const progress = campaign.Campaign_TargetFund
          ? (campaign.Campaign_CurrentRaised || 0) / campaign.Campaign_TargetFund * 100
          : 0;
        // Add the calculated progress to each campaign
        return { ...campaign, Progress_Percentage: progress };
      });
  
      this.filteredCampaigns = [...this.campaigns]; // Initialize filteredCampaigns with all approved campaigns
    });
  }
  
  
  filterCampaignsByCategory(categoryId: number): void {
    if (!categoryId) {
      // If no category is selected, reset to show all campaigns
      this.filteredCampaigns = [...this.campaigns];
    } else {
      // Filter campaigns by category ID
      this.filteredCampaigns = this.campaigns.filter(
        campaign => campaign.Category_ID === categoryId
      );
    }
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

  fetchCategories(): void {
    this.categoryService.getAllCategories().subscribe((categories: Category[]) => {
      this.categories = categories;
    });
  }
  
  getCampaignStatus(status: number | string): string {
    const statusMap: { [key: number]: string } = {
      1: 'Active',
      2: 'Inactive',
    };
  
    if (typeof status === 'number') {
      return statusMap[status] || 'Unknown';
    }
  
    return status.toLowerCase() === 'active' ? 'Active' : 'Inactive';
  }
}