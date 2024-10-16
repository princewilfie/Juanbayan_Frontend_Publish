import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CampaignService } from '../_services/campaign.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Campaign } from '../_models';
import { AccountService } from '../_services/account.service';
@Component({
  selector: 'app-create-campaign',
  templateUrl: './create-campaign.component.html',
  styleUrls: ['./create-campaign.component.css']
})
export class CreateCampaignComponent implements OnInit {

  @ViewChild('campaignDetailModal') campaignDetailModal!: TemplateRef<any>;

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

  // Arrays to store campaigns by their status
  approvedCampaigns: any[] = [];
  pendingCampaigns: any[] = [];
  rejectedCampaigns: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private campaignService: CampaignService,
    private modalService: NgbModal,
    private router: Router,
    private accountService: AccountService
  ) {
    this.createCampaignForm = this.formBuilder.group({
      Campaign_Name: ['', Validators.required],
      Campaign_Description: ['', Validators.required],
      Campaign_TargetFund: ['', Validators.required],
      Campaign_Start: ['', Validators.required],
      Campaign_End: ['', Validators.required],
      Campaign_Category: ['', Validators.required],
      Campaign_Image: [null]
    });

    this.editCampaignForm = this.formBuilder.group({
      Campaign_Name: ['', Validators.required],
      Campaign_Description: ['', Validators.required],
      Campaign_TargetFund: ['', Validators.required],
      Campaign_Start: ['', Validators.required],
      Campaign_End: ['', Validators.required],
      Campaign_Category: ['', Validators.required],
      Campaign_Image: [null]
    });
  }

  ngOnInit() {
    this.loadCampaigns();
  }

  loadCampaigns() {
    const account = this.accountService.accountValue;
    this.campaignService.getCampaignsByAccountId(Number(account.id)).subscribe(
      (data: any[]) => {
        this.approvedCampaigns = data.filter(campaign => campaign.Campaign_Status === 1); // Approved campaigns
        this.pendingCampaigns = data.filter(campaign => campaign.Campaign_Status === 0); // Pending campaigns
        this.rejectedCampaigns = data.filter(campaign => campaign.Campaign_Status === 2); // Rejected campaigns
      },
      (error) => {
        console.error('Error fetching campaigns', error);
        this.errorMessage = 'Error fetching campaigns: ' + error.message;
      }
    );
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

    if (this.selectedFile) {
      formData.append('Campaign_Image', this.selectedFile, this.selectedFile.name);
    }

    this.campaignService.create(formData).subscribe(
      response => {
        this.loading = false;
        this.submitted = false;
        this.closeCreateCampaignModal();
        this.loadCampaigns(); 
        alert('Campaign created successfully!');
      },
      error => {
        this.loading = false;
        this.errorMessage = error.message; 
      }
    );
  }

  getImagePath(image: string): string {
    return image ? `http://localhost:4000/${image}` : 'assets/'; 
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
      Campaign_Category: campaign.Campaign_Category,
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
      // Check if the campaign was previously approved (Campaign_Status = 1)
      if (this.selectedCampaign?.Campaign_Status === 1 || this.selectedCampaign?.Campaign_Status === 2) {
        // Reset the status to "Waiting For Approval" (Campaign_Status = 0)
        formData.append('Campaign_Status', '0');  // Explicitly convert the number to a string
      }
  
      // Call the service to update the campaign
      this.campaignService.updateCampaign(campaignId, formData).subscribe(
        response => {
          console.log('Campaign updated successfully', response);
          this.loadCampaigns(); // Reload campaigns to reflect the changes
          this.closeEditModal(); // Close the edit modal
          alert('Campaign updated successfully and is now pending approval.');
        },
        error => {
          console.error('Error updating campaign:', error);
          this.errorMessage = error.error?.message || 'Failed to update campaign. Unknown error occurred.';
        }
      );
    } else {
      console.error('No campaign ID found for updating the campaign.');
      this.errorMessage = 'No campaign ID found. Cannot update the campaign.';
    }
  }
  

  openConfirmationModal(campaign: Campaign, content: TemplateRef<any>) {
    this.selectedCampaign = campaign; 
    this.modalRef = this.modalService.open(content, { centered: true });
  }

  deleteCampaign(campaignId: number) {
    this.campaignService.deleteCampaign(campaignId).subscribe(
      response => {
        console.log('Campaign deleted successfully', response);
        this.loadCampaigns();  
        this.closeModal();  
        alert('Campaign deleted successfully!');
      },
      error => {
        console.error('Error deleting campaign:', error);
        this.errorMessage = error.message || 'Failed to delete campaign.';
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