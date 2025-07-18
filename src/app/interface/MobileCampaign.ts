export interface MobileCampaign {
    campaignsId: number;
    title: string;
    description: string | null; 
    imageUrl: string | null; 
    startDate: Date; 
    endDate: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}