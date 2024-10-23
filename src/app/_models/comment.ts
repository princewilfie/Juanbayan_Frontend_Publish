export class Comment {
    Comment_ID?: number;
    Campaign_ID: number;
    Acc_ID: number;
    Comment_Text: string;
    Created_At?: Date;
    
    // Virtual fields to show associated account data
    acc_firstname?: string;
    acc_lastname?: string;
    acc_image?: string;
  }