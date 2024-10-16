export interface Donation {
  donation_id?: number;
  acc_id: number;
  campaign_id: number;
  donation_amount: number;
  donation_date?: Date;
}
