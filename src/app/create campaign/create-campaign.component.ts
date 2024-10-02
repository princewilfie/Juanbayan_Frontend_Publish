import { Component, OnInit, TemplateRef } from '@angular/core';
import { CampaignService } from '../_services/campaign.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-campaign',
  templateUrl: './create-campaign.component.html',
  styleUrls: ['./create-campaign.component.css']
})
export class CreateCampaignComponent implements OnInit {
  createCampaignForm: FormGroup;
  selectedFile: File | null = null; 
  loading = false;
  submitted = false;
  errorMessage: string | null = null;
  campaigns: any[] = []; 
  accountId: number = 1; // Replace with logic to get the actual account ID

  constructor(
    private formBuilder: FormBuilder,
    private campaignService: CampaignService,
    private modalService: NgbModal,
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
  }

  ngOnInit() {
    this.loadCampaigns(); // Load campaigns on initialization
  }

  loadCampaigns() {
    this.campaignService.getCampaignsByAccountId(this.accountId).subscribe(
      (data: any[]) => {
        this.campaigns = data; // Populate campaigns array
      },
      (error) => {
        console.error('Error fetching campaigns', error);
        this.errorMessage = 'Error fetching campaigns: ' + error.message;
      }
    );
  }

  openCreateCampaignModal(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'lg' });
  }

  closeCreateCampaignModal() {
    this.resetForm(); // Reset form on closing
    this.modalService.dismissAll();
  }

  resetForm() {
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
      return; // Stop if form is invalid
    }

    this.loading = true;

    const formData = new FormData();
    for (const key in this.createCampaignForm.controls) {
      formData.append(key, this.createCampaignForm.get(key)?.value);
    }

    formData.append('Acc_ID', this.accountId.toString());
    formData.append('Campaign_Status', '0'); // Default status to Pending

    if (this.selectedFile) {
      formData.append('Campaign_Image', this.selectedFile, this.selectedFile.name);
    }

    this.campaignService.create(formData).subscribe(
      response => {
        this.loading = false;
        this.submitted = false;
        this.closeCreateCampaignModal();
        this.loadCampaigns(); // Refresh the campaign list
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

  formatCategory(category: number): string {
    switch (category) {
      case 1: return 'category-financial';
      case 2: return 'category-education';
      case 3: return 'category-hospital';
      default: return 'category-other';
    }
  }
}