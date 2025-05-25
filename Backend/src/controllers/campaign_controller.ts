import { Request, Response } from "express";
import campaignModel from "../models/campaign_modles";
import userModel from "../models/user_models";
import path from "path";
import fs from "fs";
import { GoogleAdsService } from "../services/googleAds/googleAds.service"; 
import { googleAdsConfig } from "../config/google.config"; 
import { CampaignStatus, AdvertisingChannelType } from "../services/googleAds/types";
import {getGeminiKeywordsFromCampaign} from "../controllers/gemini_controller"; // Adjust the import path as necessary
import mongoose from "mongoose";
import businessInfoModel from "../models/businessInfo_models";
const googleAdsService = new GoogleAdsService(googleAdsConfig);

export const createCampaign = async (req: Request, res: Response) => {
  try {
    const newCampaign = new campaignModel({ ...req.body });
    await newCampaign.save();
    res.status(201).json(newCampaign);
  } catch (error) {
    res.status(500).json({ error: "Internal server error", details: error });
  }
};

export const getAllCampaigns = async (req: Request, res: Response) => {
  try {
    //get only campaigns by user id
    const campaigns = await campaignModel.find({ creatorId: req.body.userId });
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCampaignById = async (req: Request, res: Response): Promise<void> => {
  try {
    const campaign = await campaignModel.findById(req.params.id).populate("feedbacks");
    if (!campaign) {
      res.status(404).json({ error: "Campaign not found" });
      return;
    }

    res.status(200).json(campaign);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateCampaign = async (req: Request, res: Response): Promise<void> => {
  try {
    const campaign = await campaignModel.findById(req.params.id);
    if (!campaign) {
      res.status(404).json({ error: "Campaign not found" });
      return;
    }

    const updated = await campaignModel.findByIdAndUpdate(req.params.id, {
      ...req.body,
    }, { new: true });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteCampaign = async (req: Request, res: Response): Promise<void> => {
  try {
    const campaign = await campaignModel.findById(req.params.id);
    if (!campaign) {
      res.status(404).json({ error: "Campaign not found" });
      return;
    }

    // מחיקה ללא טיפול בתמונה
    await campaignModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Campaign deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const markInterest = async (req: Request, res: Response): Promise<void> => {
  const { campaignId } = req.params;
  const { userId } = req.body;

  try {
    const campaign = await campaignModel.findById(campaignId);
    if (!campaign) {
      res.status(404).json({ error: "Campaign not found" });
      return;
    }

    if (!campaign.interestedUsers?.includes(userId)) {
      campaign.interestedUsers = [...(campaign.interestedUsers || []), userId];
      await campaign.save();
    }

    res.status(200).json({ message: "Marked as interested", interested: campaign.interestedUsers.length });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const removeInterest = async (req: Request, res: Response): Promise<void> => {
  const { campaignId } = req.params;
  const { userId } = req.body;

  try {
    const campaign = await campaignModel.findById(campaignId);
    if (!campaign) {
      res.status(404).json({ error: "Campaign not found" });
      return;
    }

    campaign.interestedUsers = campaign.interestedUsers?.filter((id) => id !== userId);
    await campaign.save();

    res.status(200).json({ message: "Interest removed", interested: campaign.interestedUsers?.length });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const fetchGoogleCampaigns = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId } = req.query;
    if (!customerId || typeof customerId !== 'string') {
      res.status(400).json({ error: 'Missing or invalid customerId' });
      return;
    }

    const campaigns = await googleAdsService.getCampaigns();
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch campaigns', details: error });
  }
};

export const fetchCampaignStatistics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;
    const { id } = req.params;

    if (!startDate || !endDate) {
      res.status(400).json({ error: "Missing startDate or endDate" });
      return;
    }

    const stats = await googleAdsService.getCampaignStatistics(
      id,
      startDate as string,
      endDate as string
    );

    
    const summary = stats.reduce(
      (acc, item) => {
        acc.clicks += item.clicks;
        acc.impressions += item.impressions;
        acc.conversions += item.conversions;
        acc.costMicros += item.costMicros;
        return acc;
      },
      {
        clicks: 0,
        impressions: 0,
        conversions: 0,
        costMicros: 0,
      }
    );

    const ctr = summary.impressions ? summary.clicks / summary.impressions : 0;

    res.status(200).json({
      ...summary,
      ctr,
      dailyBreakdown: stats,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch campaign statistics", details: error });
  }
};

export const launchGoogleAdsCampaign = async (req: Request, res: Response): Promise<void> => {
  try {
    // Destructure budget from request body
    const { businessName, objective, userId, campaignMongoId, budget } = req.body;

    if (!userId) {
      res.status(400).json({ error: "Missing userId" });
      return ;
    }

    if (!campaignMongoId) {
      res.status(400).json({ error: "Missing campaignMongoId" });
      return;
    }
    // Validate budget (ensure it's a positive number)
    if (budget === undefined || typeof budget !== 'number' || budget <= 0) {
      res.status(400).json({ error: "Missing or invalid budget value" });
      return;
    
    }
    if (!mongoose.Types.ObjectId.isValid(campaignMongoId)) {
      res.status(400).json({ error: "Invalid campaignMongoId format" });
      return;
    }
    const user = await userModel.findById(userId);
    const googleCustomerIdFromDb = user?.googleCustomerId;
    let customerId = null;
    if (!googleCustomerIdFromDb) {
    customerId = await googleAdsService.createCustomerClient({
      businessName,
      currencyCode: "ILS",
      timeZone: "Asia/Jerusalem"
    });
    await userModel.findByIdAndUpdate(userId, {
      googleCustomerId: customerId
    });
  }else{
    customerId = googleCustomerIdFromDb;
  }

    
    const today = new Date();
    const startDate = today.toISOString().split("T")[0].replace(/-/g, "");
    const endDate = new Date(today.setMonth(today.getMonth() + 1))
      .toISOString()
      .split("T")[0]
      .replace(/-/g, "");

    // Convert budget from ILS to micros (multiply by 1,000,000)
    const budgetMicros = budget * 1_000_000;

    // Generate a unique campaign name using a timestamp
    const uniqueCampaignName = `קמפיין של ${businessName} - ${Date.now()}`;

    const campaign = await googleAdsService.createCampaign({
      name: uniqueCampaignName,
      status: CampaignStatus.PAUSED,
      advertisingChannelType: AdvertisingChannelType.SEARCH,
      startDate,
      endDate,
    }, customerId, budgetMicros);

    
    const adgroupfromdb = await campaignModel.findById(campaignMongoId);
    let adGroupId = adgroupfromdb?.adGroupId;
    
    if (!adGroupId) {
      const newAdGroup = await googleAdsService.createAdGroup({
        name: businessName,
        campaignResourceName: campaign.resourceName!,
        status: "ENABLED",
      }, customerId);
      adGroupId = newAdGroup.id;
    }

    // Add detailed logging right before the failing call

    const updatedCampaignDoc = await campaignModel.findByIdAndUpdate(campaignMongoId, {
      adGroupId: adGroupId,
      googleCampaignId: campaign.id,
    }, { new: true });

    // Generate keywords using Gemini
    // const keywords = await getGeminiKeywordsFromCampaign(campaign);
    const keywords = [
      { keywordText: "ייעוץ משפטי לעסקים", matchType: "PHRASE" },
      { keywordText: "עורך דין לעסקים", matchType: "EXACT" }
    ];
    if (adGroupId) {
      await googleAdsService.addKeywordsToAdGroup(
        adGroupId, 
        keywords.map(kw => ({ 
          text: kw.keywordText, 
          matchType: kw.matchType 
        })),
        customerId
      );
      console.log("Keywords added to ad group");
    } else {
      console.log("Failed to create or retrieve ad group ID");
      throw new Error("Failed to create or retrieve ad group ID");
    }
    // Retrieve the campaign document to get the campaignURL, campaignName, and campaignContent
    const campaignDoc = await campaignModel.findById(campaignMongoId);
    if (!campaignDoc || !campaignDoc.campaignURL) {
      res.status(400).json({ error: "Campaign URL not found" });
      return;
    }

    
    // Create an ad under the campaign
    if (adGroupId) {
      // lets take the bisunessName from businessinfos collection
      const businessInfo = await businessInfoModel.findOne({ userId: userId });
      const businessName = String(businessInfo?.businessName || "Default Business Name");
      const businessAddress = String(businessInfo?.businessAddress || "Default Business Address");
      await googleAdsService.createAd({
        adGroupId: adGroupId,
        finalUrl: campaignDoc.campaignURL,
        headlines: [
          campaignDoc.campaignName, // Use the campaign name as a headline
          businessName, // Use the campaign content as a description
          businessAddress, // Use the campaign content as a description
        ],
        descriptions: [
          campaignDoc.campaignName, // Use the campaign name as a headline
          businessName, // Use the campaign content as a description
          businessAddress, // Use the campaign content as a description
        ],
      }, customerId);
    } else {
      throw new Error("Failed to create or retrieve ad group ID");
    }
    console.log('vvvvvvvvvvvvvvvvvvv');

    res.status(201).json({
      message: "Campaign launched successfully",
      customerId,
      campaign,
    });
  } catch (error: any) {
    if (error?.response?.data?.error) {
      console.error("35:Error launching campaign:", JSON.stringify(error.response.data.error, null, 2));
    } else {
      console.error("43:Error launching campaign:", error);
    }
    res.status(500).json({ error: "Failed to launch campaign" });
  }
};

export const getAllCampaignsByUserId = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  try {
    const campaigns = await campaignModel.find({ creatorId: userId });

    // Fetch and update stats for each campaign
    await Promise.all(campaigns.map(async (campaign) => {
      if (campaign.googleCampaignId) {
        const query = `
          SELECT
            campaign.id,
            campaign.name,
            metrics.impressions,
            metrics.clicks,
            metrics.conversions,
            metrics.cost_micros,
            segments.date
          FROM
            campaign
          WHERE
            campaign.id = '${campaign.googleCampaignId}'
            AND segments.date BETWEEN '2024-01-01' AND '2030-12-31'
        `;

     
        try {
          const statsArr = await googleAdsService.getCampaignStatistics(
            campaign.googleCampaignId,
            "2024-01-01", // Start date for stats
            "2030-12-31"  // End date for stats
          );

          console.log("Received stats:", statsArr);

          if (statsArr && statsArr.length > 0) {
            const stats = statsArr[0];
            campaign.clicks = stats.clicks;
            campaign.impressions = stats.impressions;
            campaign.conversions = stats.conversions;
            campaign.costMicros = stats.costMicros;
            await campaign.save();
          }
        } catch (error) {
          console.error("Error fetching stats for campaign ID:", campaign.googleCampaignId, error);
        }
      }
    }));

    res.status(200).json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



