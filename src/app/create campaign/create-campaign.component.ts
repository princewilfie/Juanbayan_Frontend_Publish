import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CampaignService } from '../_services/campaign.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Campaign } from '../_models';
import { AccountService } from '../_services/account.service';
import Swal from 'sweetalert2'; // Import SweetAlert
import { DonationService, CategoryService } from '../_services';
import { Donation, Category } from '../_models';


@Component({
  selector: 'app-create-campaign',
  templateUrl: './create-campaign.component.html',
  styleUrls: ['./create-campaign.component.css']
})
export class CreateCampaignComponent implements OnInit {

  @ViewChild('campaignDetailModal') campaignDetailModal!: TemplateRef<any>;
  @ViewChild('donorsModal') donorsModal: any;

  createCampaignForm: FormGroup;
  editCampaignForm: FormGroup;
  selectedFile: File | null = null; 
  loading = false;
  submitted = false;
  errorMessage: string | null = null;
  campaigns: any[] = [];
  receiptPreview?: string; 
  selectedCampaign?: Campaign;
  modalRef: any; 
  isDetailModalOpen = false;
  donor: Donation[] = [];
  showDonorsModal: boolean = false;
  campaignId: number;
  categories: Category[] = [];
  selectedProofFiles: File[] = [];

  // Arrays to store campaigns by their status
  approvedCampaigns: any[] = [];
  pendingCampaigns: any[] = [];
  rejectedCampaigns: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private campaignService: CampaignService,
    private modalService: NgbModal,
    private router: Router,
    private accountService: AccountService,
    private donationService: DonationService,
    private categoryService: CategoryService
  ) {
    this.createCampaignForm = this.formBuilder.group({
      Campaign_Name: ['', Validators.required],
      Campaign_Description: ['', Validators.required],
      Campaign_TargetFund: ['', Validators.required],
      Campaign_Start: ['', Validators.required],
      Campaign_End: ['', Validators.required],
      Category_ID: ['', Validators.required],
      Campaign_Image: [null],
      Proof_Files: [null],
      Campaign_Notes: ['']
    });

    this.editCampaignForm = this.formBuilder.group({
      Campaign_Name: ['', Validators.required],
      Campaign_Description: ['', Validators.required],
      Campaign_TargetFund: ['', Validators.required],
      Campaign_Start: ['', Validators.required],
      Campaign_End: ['', Validators.required],
      Category_ID: ['', Validators.required],
      Campaign_Image: [null],
      Proof_Files: [null],
      Campaign_Notes: ['']
    });
  }

  ngOnInit() {
    this.loadCampaigns();
    this.loadCategories();
  }

  loadCampaigns() {
    const account = this.accountService.accountValue;
    this.campaignService.getCampaignsByAccountId(Number(account.id)).subscribe(
      (data: any[]) => {
        this.approvedCampaigns = data.filter(campaign => campaign.Campaign_ApprovalStatus === 'Approved'); // Approved campaigns
        this.pendingCampaigns = data.filter(campaign => campaign.Campaign_ApprovalStatus === 'Waiting For Approval'); // Pending campaigns
        this.rejectedCampaigns = data.filter(campaign => campaign.Campaign_ApprovalStatus === 'Rejected'); // Rejected campaigns

        // Check if campaigns were approved or rejected
        this.checkCampaignStatus();
      },
      (error) => {
        console.error('Error fetching campaigns', error);
        this.errorMessage = 'Error fetching campaigns: ' + error.message;
      }
    );
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe(
      (data: Category[]) => {
        this.categories = data; // Assign the fetched categories to the variable
      },
      (error) => {
        console.error('Error fetching categories', error);
      }
    );
  }

  onProofFilesSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      // Convert the file list to an array and store it in selectedProofFiles
      this.selectedProofFiles = Array.from(files);
      console.log(this.selectedProofFiles); // Optional: to log the selected files
    }
  }

  checkCampaignStatus() {
    // Use session storage to prevent showing alerts multiple times
    const alertsShown = sessionStorage.getItem('alertsShown');

    // If alerts have already been shown, do not show them again
    if (alertsShown) {
      return;
    }

    let delay = 0;

    // Notify for each approved campaign with a delay
    this.approvedCampaigns.forEach(campaign => {
      setTimeout(() => {
        Swal.fire({
          icon: 'success',
          title: 'Campaign Approved',
          text: `Your campaign "${campaign.Campaign_Name}" has been approved.`,
          confirmButtonText: 'OK'
        });
      }, delay);
      delay += 1000; // Delay increases by 1 second (1000 milliseconds) for each campaign
    });

    // Notify for each rejected campaign with a delay
    this.rejectedCampaigns.forEach(campaign => {
      setTimeout(() => {
        Swal.fire({
          icon: 'error',
          title: 'Campaign Not Approved',
          text: `Your campaign "${campaign.Campaign_Name}" was not approved.`,
          confirmButtonText: 'OK'
        });
      }, delay);
      delay += 1000; // Delay increases by 1 second for each campaign
    });

    // Set the flag in session storage to prevent showing the alerts again
    sessionStorage.setItem('alertsShown', 'true');
  }

  openCreateCampaignModal(content: TemplateRef<any>) {
    this.modalRef = this.modalService.open(content, { size: 'lg' });
  }

  closeCreateCampaignModal() {
    this.resetCreateForm();
    this.closeModal();
  }

  resetCreateForm() {
    this.createCampaignForm.reset();
    this.selectedFile = null;
    this.errorMessage = null;
    this.submitted = false;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  createCampaign() {
    this.submitted = true;

    if (this.createCampaignForm.invalid) {
      return; 
    }

    this.loading = true;

    const account = this.accountService.accountValue;
    const formData = new FormData();
    for (const key in this.createCampaignForm.controls) {
      formData.append(key, this.createCampaignForm.get(key)?.value);
    }

    formData.append('Acc_ID', Number(account.id).toString());
    formData.append('Campaign_Status', (0).toString());  // Explicitly convert the number to a string

    this.selectedProofFiles.forEach((file, index) => {
      formData.append('Proof_Files', file, file.name); // Proof_Files[] will hold all files
    });

    if (this.selectedFile) {
      formData.append('Campaign_Image', this.selectedFile, this.selectedFile.name);
    }

    this.campaignService.create(formData).subscribe(
      response => {
        this.loading = false;
        this.submitted = false;
        this.closeCreateCampaignModal();
        this.loadCampaigns(); 
        
        // SweetAlert success for creating a campaign
        Swal.fire({
          icon: 'success',
          title: 'Campaign Created',
          text: 'Your campaign has been created successfully!',
          confirmButtonText: 'OK'
        });
      },
      error => {
        this.loading = false;
        this.errorMessage = error.message;

        // SweetAlert failure for creating a campaign
        Swal.fire({
          icon: 'error',
          title: 'Campaign Creation Failed',
          text: `Failed to create campaign: ${error.message}`,
          confirmButtonText: 'OK'
        });
      }
    );
  }

  getImagePath(image: string): string {
    return image = `http://localhost:4000/${image}` || 'assets/'; 
  }

  viewCampaignDetails(campaignId: number): void {
    this.router.navigate(['campaign-details', campaignId]); 
  }

  openCampaignDetails(campaign: Campaign, content: TemplateRef<any>): void {
    this.selectedCampaign = campaign;
    this.modalRef = this.modalService.open(content, { centered: true });
    this.isDetailModalOpen = true;
  }

  openEditCampaignModal(campaign: Campaign, content: TemplateRef<any>): void {
    this.selectedCampaign = campaign;

    this.editCampaignForm.patchValue({
      Campaign_Name: campaign.Campaign_Name,
      Campaign_Description: campaign.Campaign_Description,
      Campaign_TargetFund: campaign.Campaign_TargetFund,
      Category_ID: campaign.Category_ID,
      Campaign_Start: campaign.Campaign_Start,
      Campaign_End: campaign.Campaign_End
    });

    this.closeDetailModal(); // Close the detail modal before opening edit modal
    this.modalRef = this.modalService.open(content, { centered: true });
  }

  updateCampaign() {
    if (this.editCampaignForm.invalid) {
      return;
    }
  
    const formData = new FormData();
    Object.keys(this.editCampaignForm.controls).forEach(key => {
      formData.append(key, this.editCampaignForm.get(key)?.value);
    });
  
    // If a new image is selected, append it to the form data
    if (this.selectedFile) {
      formData.append('Campaign_Image', this.selectedFile, this.selectedFile.name);
    }
  
    const campaignId = this.selectedCampaign?.Campaign_ID?.toString();
    if (campaignId) {
      if (this.selectedCampaign?.Campaign_Status === 1 || this.selectedCampaign?.Campaign_Status === 2) {
        formData.append('Campaign_Status', '0');  // Explicitly convert the number to a string
      }
  
      this.campaignService.updateCampaign(campaignId, formData).subscribe(
        response => {
          this.loadCampaigns(); 
          this.closeEditModal(); 

          // SweetAlert success for updating a campaign
          Swal.fire({
            icon: 'success',
            title: 'Campaign Updated',
            text: 'Your campaign has been updated successfully and is now pending approval.',
            confirmButtonText: 'OK'
          });
        },
        error => {
          this.errorMessage = error.error?.message || 'Failed to update campaign.';

          // SweetAlert failure for updating a campaign
          Swal.fire({
            icon: 'error',
            title: 'Campaign Update Failed',
            text: `Failed to update campaign: ${this.errorMessage}`,
            confirmButtonText: 'OK'
          });
        }
      );
    } else {
      this.errorMessage = 'No campaign ID found. Cannot update the campaign.';

      // SweetAlert for missing campaign ID
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: this.errorMessage,
        confirmButtonText: 'OK'
      });
    }
  }

  
  viewDonors(campaignId: number): void {
    this.donor = []; // Clear donors before fetching new ones
    this.showDonorsModal = true; // Show the modal
  
    this.donationService.getDonationsByCampaignId(campaignId).subscribe(
      (donors: Donation[]) => {
        this.donor = donors; // Store donors in the component
        this.modalService.open(this.donorsModal);
        console.log(this.donor);
      },
      (error) => {
        console.error('Error fetching donors', error);
  
        // Show an error message with SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Error Fetching Donors',
          text: error.message,
          confirmButtonText: 'OK'
        });
      }
    );
  }
  
  closeDonorsModal(): void {
    this.modalService.dismissAll();
  }
  openConfirmationModal(campaign: Campaign, content: TemplateRef<any>) {
    this.selectedCampaign = campaign; 
    this.modalRef = this.modalService.open(content, { centered: true });
  }

  deleteCampaign(campaignId: number) {
    this.campaignService.deleteCampaign(campaignId).subscribe(
      response => {
        this.loadCampaigns();  
        this.closeModal();  

        // SweetAlert success for deleting a campaign
        Swal.fire({
          icon: 'success',
          title: 'Campaign Deleted',
          text: 'Your campaign has been deleted successfully!',
          confirmButtonText: 'OK'
        });
      },
      error => {
        this.errorMessage = error.message || 'Failed to delete campaign.';

        // SweetAlert failure for deleting a campaign
        Swal.fire({
          icon: 'error',
          title: 'Campaign Deletion Failed',
          text: `Failed to delete campaign: ${this.errorMessage}`,
          confirmButtonText: 'OK'
        });
      }
    );
  }  

  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.dismiss(); 
      this.modalRef = null; // Reset modal reference
    }
  }

  closeDetailModal(): void {
    this.isDetailModalOpen = false; // Reset detail modal state
    this.closeModal(); // Close the detail modal
  }

  closeEditModal(): void {
    this.closeModal(); // Close the edit modal
    if (this.selectedCampaign) {
      this.openCampaignDetails(this.selectedCampaign, this.campaignDetailModal); // Reopen the detail modal with correct template
    }
  }
  
  onFileChange(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => this.receiptPreview = e.target.result;
    reader.readAsDataURL(file);
  }

  formatCategory(category: number): string {
    switch (category) {
      case 1: return 'category-financial';
      case 2: return 'category-education';
      case 3: return 'category-hospital';
      default: return 'category-other';
    }
  }
}