import { Campaign } from "../../services/googleAds/types";

export interface GooglePerformanceData {
  campaignId: string;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  avgCpc: number;
  totalCost: number;
  costPerConversion?: number;
  conversionValue?: number;
  averagePosition?: number;
  interactionRate?: number;
  averageCpm?: number;
  averageCpv?: number;
  videoViewRate?: number;
}

export interface CampaignSetup {
  campaignName: string;
  budget: number;
  goal: string;
  duration: {
    start: Date;
    end: Date;
  };
  scheduledTime?: string;
}

export interface SlimBusinessInfo {
  businessName: string;
  businessType: string;
  businessField: string;
  customBusinessField?: string;
  businessFieldDetails?: string;
  serviceAreas: string;
  serviceDescription: string;
  uniqueService: string;
  specialPackages: string;
  incentives: string;
  objective?:
    | "brandAwareness"
    | "reach"
    | "siteVisit"
    | "engagement"
    | "videoViews"
    | "sales";
}

export interface SmartCampaignData {
  googleData: GooglePerformanceData;
  businessInfo: SlimBusinessInfo;
  campaignSetup: CampaignSetup;
}

//זה הטייפ שאני אשלח לגוגל כדי לעדכן הגדרות קמפיין
export interface CampaignUpdatePayload
  //בגדול לוקח את הטייפ של עומר ובוחר רק את השדות שאני רוצה + מוסיף על זה שדות חדשים
  extends Pick<Campaign, "id" | "startDate" | "endDate" | "scheduledTime"> {
  llmSuggestions: {
    adHeadline: string;
    adDescription: string;
    keywordIdeas: string[];
  };
}

//EXAMPLE USAGE:

// const update: CampaignUpdatePayload = {
//   id: "abc123",
//   startDate: "2025-04-01",
//   endDate: "2025-04-30",
//   scheduledTime: "09:00",
//   llmSuggestions: {
//     adHeadline: "Start Your Day With Zen Yoga",
//     adDescription: "Tailored yoga sessions for busy professionals. Join now!",
//     keywordIdeas: ["morning yoga Tel Aviv", "yoga for busy people"]
//   }
// };
