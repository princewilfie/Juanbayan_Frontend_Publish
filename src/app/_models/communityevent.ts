// src/app/models/event.model.ts
export interface CommunityEvent {
    Event_ID?: number; // Optional for new events
    Acc_ID: number;
    Event_Name: string;
    Event_Description: string;
    Event_Start_Date: Date;
    Event_End_Date: Date;
    Event_Location: string;
    Event_Status: number;
    Event_Image?: string; // Optional for fetching events
    Event_ApprovalStatus: string;
    Admin_Notes?: string;
}