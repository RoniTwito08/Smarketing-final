import cron from "node-cron";
import { runMarketingAlgo } from "../MarketingAlgorithms/index";
import { findBusinessInfoByUserId } from "../services/businessInfo.service";
import { GoogleAdsService } from "../services/googleAds/googleAds.service";
import userModel from "../models/user_models";
import {
  AdvertisingChannelType,
  Campaign,
  CampaignStatus,
} from "../services/googleAds/types";

console.log("Cron job is loading");

// everyday at 8:00 AM
async function handleDailyMarketingJob() {
  console.log("cron job is running now");
  try {
    const users = await userModel.find({ googleCustomerId: { $ne: null } });
    console.log("users " + users);

    for (const user of users) {
      try {
        const customerId = user.googleCustomerId;
        const userId = user._id?.toString();

        if (!userId || !customerId) continue;

        const rawBusiness = await findBusinessInfoByUserId(userId);

        const googleAdsService = new GoogleAdsService({
          clientId: process.env.GOOGLE_ADS_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
          developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
          refreshToken: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
          redirectUri: process.env.GOOGLE_ADS_REDIRECT_URI!,
          customerId: customerId,
        });

        // get all campigns of the user
        const campaigns: Campaign[] = await googleAdsService.getCampaigns();

        // for test:
        // enum CampaignStatus {
        //   ENABLED = "ENABLED",
        //   PAUSED = "PAUSED",
        //   REMOVED = "REMOVED",
        // }

        // enum AdvertisingChannelType {
        //   SEARCH = "SEARCH",
        //   DISPLAY = "DISPLAY",
        //   VIDEO = "VIDEO",
        //   SHOPPING = "SHOPPING",
        // }

        // Mocked campaigns for testing purposes
        // const campaigns: Campaign[] = [
        //   {
        //     id: "123456789",
        //     resourceName: "customers/5582899409/campaigns/123456789",
        //     name: "קמפיין בדיקה",
        //     status: CampaignStatus.ENABLED,
        //     advertisingChannelType: AdvertisingChannelType.SEARCH,
        //     startDate: "20250420",
        //     endDate: "20250520",
        //     campaignBudget: "customers/5582899409/campaignBudgets/1111111",
        //     biddingStrategyType: "MANUAL_CPC",
        //     manualCpc: { enhancedCpcEnabled: true },
        //     adGroupId: "987654321",
        //     metrics: {
        //       clicks: 100,
        //       impressions: 1000,
        //       costMicros: 5000000,
        //       conversions: 10,
        //       conversionsValue: 300,
        //       averageCpc: 500000,
        //       ctr: 0.1,
        //       averagePosition: 1,
        //       interactionRate: 0.2,
        //       averageCpm: 2000000,
        //       videoViewRate: 0,
        //       averageCpv: 0,
        //     },
        //     segments: {
        //       date: "2025-04-20",
        //       hour: "14",
        //       quarter: "Q2",
        //       month: "APRIL",
        //       week: "2025-W16",
        //       dayOfWeek: "FRIDAY",
        //       device: "DESKTOP",
        //       conversionAction: "Form Submission",
        //       conversionActionCategory: "LEAD",
        //       conversionActionName: "Lead Form",
        //       externalConversionSource: "WEBSITE",
        //     },
        //   },
        // ];

        console.log("campigns" + campaigns);

        for (const campaign of campaigns) {
          const result = await runMarketingAlgo(campaign, rawBusiness);
          console.log(result);

          const { suggestions } = result;

          const updateFields = {
            startDate: suggestions.startDate?.replace(/-/g, ""),
            endDate: suggestions.endDate?.replace(/-/g, ""),

            name: campaign.name,
            status: campaign.status,
            campaignBudget: campaign.campaignBudget,
          };

          const keywordIdeas = suggestions.llmSuggestions?.keywordIdeas ?? [];
          const formattedKeywords = keywordIdeas.map((kw) => ({
            text: kw,
            matchType: "BROAD", // בהמשך אולי לתת לגימיני להגדיר גם את הסוג של כל מילה
          }));

          let adGroupId = undefined;
          if (campaign.adGroupId) {
            const adGroupId = campaign.adGroupId;
          }

          try {
            await googleAdsService.updateCampaignAndKeywords(
              campaign.id,
              updateFields,
              adGroupId,
              formattedKeywords
            );
          } catch (err) {
            console.error(`Failed to update campaign "${campaign.name}":`, err);
          }
        }
      } catch (err) {
        console.error(`Error processing user ${user.email}:`, err);
      }
    }
  } catch (error) {
    console.error("Cron job failed:", error);
  }
}

cron.schedule("0 8 * * *", handleDailyMarketingJob);

// void handleDailyMarketingJob();
