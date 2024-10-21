export interface Withdraw {
    Withdraw_ID: number;
    Campaign_ID: number;
    acc_id: string; 
    Bank_account: string;
    Acc_number: number;
    Withdraw_Amount: number; 
    Status: string;
    Request_Date: Date;
}