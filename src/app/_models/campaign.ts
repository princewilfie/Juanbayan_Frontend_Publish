export class Campaign {
    Campaign_ID?: number;
    Acc_ID: number;
    Campaign_Name: string;
    Campaign_Description: string;
    Campaign_TargetFund: number;
    Campaign_CurrentRaised?: number;
    Campaign_Start: Date;
    Campaign_End: Date;
    Campaign_Status: number;
    Category_ID: number;
    Campaign_Feedback?: number | null;
    Campaign_Image?: string;
    Campaign_ApprovalStatus: string;
    acc_firstname? : string;
    acc_lastname? : string;
    Proof_Files? : string;
    Campaign_Notes? : string;
}