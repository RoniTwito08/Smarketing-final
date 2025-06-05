import { BusinessInfo } from "../models/businessInfo_models";
import { Campaign } from "../services/googleAds/types";
import {
  GooglePerformanceData,
  CampaignSetup,
  SlimBusinessInfo,
} from "./../MarketingAlgorithms/types/marketingTypes";

//ממיר את האובייקט הגדול של אליאס לנתונים של לחיצות וכו בלבד
// ניתן לגשת לאובייקט של אליאס ואדם באימפורטים למעלה

type CampaignMetrics = NonNullable<Campaign["metrics"]>;

//המרה של מטריקות קמפיין מגוגל לאובייקט של נתוני קמפיין
export function convertGoogleCampaign(
  campaign: Campaign
): GooglePerformanceData {
  const metrics: Partial<CampaignMetrics> = campaign.metrics ?? {};
  //מוודא שזה לא יקרוס אם אין נתוני קמפיין עדיין מגוגל

  const clicks = metrics.clicks ?? 0;
  const conversions = metrics.conversions ?? 0;
  const costMicros = metrics.costMicros ?? 0;

  return {
    campaignId: campaign.id,
    impressions: metrics.impressions ?? 0,
    clicks,
    conversions,
    ctr: metrics.ctr ?? 0,
    avgCpc: metrics.averageCpc ?? 0,
    totalCost: costMicros / 1e6,
    costPerConversion:
      conversions > 0 ? costMicros / conversions / 1e6 : undefined,
    conversionValue: metrics.conversionsValue,
    averagePosition: metrics.averagePosition,
    interactionRate: metrics.interactionRate,
    averageCpm: metrics.averageCpm,
    averageCpv: metrics.averageCpv,
    videoViewRate: metrics.videoViewRate,
  };
}

//המרה של קמפיין מגוגל לאובייקט של הגדרות קמפיין
export function convertCampaignToSetup(campaign: Campaign): CampaignSetup {
  const micros = campaign.targetSpend?.targetSpendingAmountMicros;
  const budget = micros ? parseInt(micros) / 1e6 : 0;

  const goal =
    campaign.optimizationGoalSetting?.optimizationGoalTypes?.[0] ?? // קח את המטרה הראשונה
    "CONVERSIONS";

  return {
    campaignName: campaign.name,
    budget,
    goal: goal.toLowerCase(), //סתם שיהיה באותיות קטנות
    duration: {
      start: new Date(campaign.startDate),
      end: new Date(campaign.endDate),
    },
    scheduledTime: campaign.scheduledTime,
  };
}

//המרה של נתוני עסק של אביב ברג'יסטר לאובייקט של נתוני עסק
export function convertBusinessInfoToSlim(raw: any): SlimBusinessInfo {
  const info = raw.toObject ? raw.toObject() : raw; // optional: flatten Mongoose doc

  return {
    businessName: String(info.businessName), //צריך להמיר כי זה סטרינגים של מודיול אז זה שונה ממה שלמעלה
    businessType: String(info.businessType),
    businessField: String(info.businessField),
    customBusinessField:
      info.businessField === "אחר" && info.customBusinessField
        ? String(info.customBusinessField)
        : undefined,
    businessFieldDetails: info.businessFieldDetails
      ? String(info.businessFieldDetails)
      : undefined,
    serviceAreas: String(info.serviceAreas),
    serviceDescription: String(info.serviceDescription),
    uniqueService: String(info.uniqueService),
    specialPackages: String(info.specialPackages),
    incentives: String(info.incentives),
    objective: info.objective as SlimBusinessInfo["objective"],
  };
}
