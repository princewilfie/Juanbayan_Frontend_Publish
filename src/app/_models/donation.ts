export interface Donation {
  donation_id?: number;
  acc_id: number;
  campaign_id: number;
  donation_amount: number;
  donation_date?: Date;
  acc_firstname?: string;
  acc_lastname?: string;
  acc_image?: string;
  fee_amount?: number;
}
