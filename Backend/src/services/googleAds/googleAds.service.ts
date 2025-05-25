import { request } from "gaxios";
import { AuthService } from "./auth.service";
import {
  Campaign,
  CampaignStatistics,
  GoogleAdsConfig,
  CampaignStatus,
  AdvertisingChannelType,
} from "./types";
import dotenv from 'dotenv';
import campaignModel from "../../models/campaign_modles"; 
import userModel from "../../models/user_models";
// Load environment variables
dotenv.config({ path: './Backend/.env_dev' });

interface GoogleAdsCreateCustomerResponse {
  customerClient: {
    id: string;
    descriptiveName?: string;
    currencyCode?: string;
    timeZone?: string;
  };
}

export class GoogleAdsService {
  private baseUrl = "https://googleads.googleapis.com/v17";
  private authService: AuthService;
  private customerId: string;
  private developerToken: string;

  constructor(config: GoogleAdsConfig) {
    this.authService = new AuthService(config);
    this.customerId = config.customerId;
    this.developerToken = config.developerToken;

  }

  private async getHeaders() {
    const accessToken = process.env.GOOGLE_ADD_ACCESS_TOKEN; // Use the access token from the environment
    return {
      Authorization: `Bearer ${accessToken}`,
      "developer-token": this.developerToken,
      "login-customer-id": '5175124700',
    };
  }

  // create ad under campaign
  async createAd(adData: {
    adGroupId: string;
    finalUrl: string;
    headlines: string[];
    descriptions: string[];
  }, customerId?: string) {
    const targetCustomerId = customerId || this.customerId;

    const body = {
      operations: [
        {
          create: {
            adGroup: `customers/${targetCustomerId}/adGroups/${adData.adGroupId}`,
            ad: {
              finalUrls: [adData.finalUrl],
              responsiveSearchAd: {
                headlines: adData.headlines.map((headline) => ({ text: headline })),
                descriptions: adData.descriptions.map((description) => ({ text: description })),
              },
            },
          },
        },
      ],  
    };

    const response = await request({
      url: `${this.baseUrl}/customers/${targetCustomerId}/adGroupAds:mutate`,
      method: "POST",
      headers: await this.getHeaders(), 
      data: body,
    });

    const result = (response.data as any).results?.[0];
    if (!result) {
      throw new Error("Failed to create Ad: No response data");
    } 

    return result;
  }

  // ------------------------------------------------------
  // Create Ad Group (for a campaign)
  // ------------------------------------------------------
  async createAdGroup(
    adGroupData: {
      name: string;
      campaignResourceName: string;
      status: "ENABLED" | "PAUSED" | "REMOVED";
    },
    customerId?: string
  ): Promise<{ id: string; resourceName: string; name: string }> {
    const targetCustomerId = customerId || this.customerId;

    const body = {
      operations: [
        {
          create: {
            name: adGroupData.name,
            campaign: adGroupData.campaignResourceName,
            status: adGroupData.status,
          },
        },
      ],
    };

    const response = await request({
      url: `${this.baseUrl}/customers/${targetCustomerId}/adGroups:mutate`,
      method: "POST",
      headers: await this.getHeaders(),
      data: body,
    });

    const result = (response.data as any).results?.[0];
    if (!result) {
      throw new Error("Failed to create Ad Group: No response data");
    }

    const resourceName = result.resourceName;
    const adGroupId = resourceName.split("/").pop(); // get ID from "customers/123/adGroups/456"

    return {
      id: adGroupId,
      resourceName,
      name: adGroupData.name,
    };
  }

  // ------------------------------------------------------

  // ------------------------------------------------------
  // 1) GET ALL CAMPAIGNS
  // ------------------------------------------------------
  async getCampaigns(): Promise<Campaign[]> {
    // delete from query:
    //         campaign.manual_cpc,
    //        campaign.target_spend,
    const today = new Date();
    const start = new Date();
    start.setDate(today.getDate() - 30);

    const formatDate = (d: Date) => d.toISOString().split("T")[0]; // YYYY-MM-DD
    const startDate = formatDate(start);
    const endDate = formatDate(today);

    const query = `
      SELECT 
        campaign.resource_name,
        campaign.id,
        campaign.name,
        campaign.status,
        campaign.advertising_channel_type,
        campaign.start_date,
        campaign.end_date,
        campaign.campaign_budget,
        campaign.bidding_strategy_type,
        metrics.clicks,
        metrics.impressions,
        metrics.cost_micros,
        metrics.conversions,
        metrics.conversions_value,
        metrics.average_cpc,
        metrics.ctr,
        segments.date
      FROM campaign
      WHERE campaign.status != 'REMOVED'
      AND segments.date BETWEEN '${startDate}' AND '${endDate}'
    `; // <-- entire query is now a backtick-enclosed string
    try {

      const response = await request({
        url: `${this.baseUrl}/customers/${this.customerId}/googleAds:search`, // <--- backticks
        method: "POST",
        headers: await this.getHeaders(),
        data: { query },
      });
      return this.transformCampaignResponse(response.data);
    } catch (error: any) {
      console.log(error);
      const googleError = error?.response?.data;

      console.error("❌ Google Ads API error:", {
        code: googleError?.error?.code,
        message: googleError?.error?.message,
        status: googleError?.error?.status,
        details: googleError?.error?.details,
        requestId: googleError?.error?.details?.[0]?.requestId,
      });

      if (googleError?.error?.details?.[0]?.errors) {
        console.error("🔍 Google Ads errors array:");
        for (const err of googleError.error.details[0].errors) {
          console.error(JSON.stringify(err, null, 2));
        }
      }

      throw new Error("Failed to fetch campaigns from Google Ads API.");
    }
  }

  private transformCampaignResponse(data: any): Campaign[] {
    if (!data.results) return [];

    return data.results.map((result: any) => {
      const c = result.campaign;
      const m = result.metrics;
      return {
        id: c.id,
        resourceName: c.resourceName,
        name: c.name,
        status: c.status,
        advertisingChannelType: c.advertisingChannelType,
        startDate: c.startDate,
        endDate: c.endDate,
        campaignBudget: c.campaignBudget,
        biddingStrategyType: c.biddingStrategyType,
        manualCpc: c.manualCpc,
        targetSpend: c.targetSpend,
        metrics: m
          ? {
              clicks: Number(m.clicks),
              impressions: Number(m.impressions),
              costMicros: Number(m.costMicros),
              conversions: Number(m.conversions),
              conversionsValue: Number(m.conversionsValue),
              averageCpc: Number(m.averageCpc),
              ctr: Number(m.ctr),
            }
          : undefined,
      } as Campaign;
    });
  }

  // ------------------------------------------------------
  // 2) GET CAMPAIGN STATISTICS (BY DATE RANGE)
  // ------------------------------------------------------
  async getCampaignStatistics(
    campaignId: string,
    startDate: string,
    endDate: string
  ): Promise<CampaignStatistics[]> {
    const headers = await this.getHeaders();
    console.log("Request headers:", headers);
    
    const query = `
      SELECT 
        campaign.id, 
        campaign.name,
        metrics.impressions, 
        metrics.clicks, 
        metrics.conversions, 
        metrics.cost_micros,
        segments.date
      FROM campaign
      WHERE campaign.id = '${campaignId}'
        AND segments.date BETWEEN '${startDate}' AND '${endDate}'
    `; // backtick-enclosed
    // get campaign's connected customer google id
    // get createor id from campaign first 
    // get creatorId from campaign, then get user by creatorId, then get user's googleCustomerId
    const campaign = await campaignModel.findOne({ googleCampaignId: campaignId });
    const creatorId = campaign?.creatorId;
    const user = await userModel.findOne({ _id: creatorId });
    const customerId = user?.googleCustomerId;
    const response = await request({
      url: `${this.baseUrl}/customers/${customerId}/googleAds:search`,
      method: "POST",
      headers: headers,
      data: { query },
    });

    return this.transformStatisticsResponse(response.data);
  }

  private transformStatisticsResponse(data: any): CampaignStatistics[] {
    if (!data.results) return [];

    return data.results.map((result: any) => ({
      campaignId: result.campaign.id,
      campaignName: result.campaign.name,
      impressions: Number(result.metrics.impressions),
      clicks: Number(result.metrics.clicks),
      conversions: Number(result.metrics.conversions),
      costMicros: Number(result.metrics.costMicros),
      date: result.segments.date,
    }));
  }

  // ------------------------------------------------------
  // 3) CREATE CAMPAIGN
  // ------------------------------------------------------
  async createCampaign(
    campaign: Omit<Campaign, "id">,
    customerId?: string,
    budgetAmountMicros?: number,
    finalUrl?: string // ⬅️ דף הנחיתה

  ): Promise<Campaign> {
    const targetCustomerId = customerId || this.customerId;

    // Step 1: Create a Campaign Budget first
    const budgetName = `Budget for ${campaign.name} - ${Date.now()}`;
    const finalBudgetAmountMicros = budgetAmountMicros || 50_000_000; // Use provided or default

    const budgetOperation = {
      create: {
        name: budgetName,
        amountMicros: finalBudgetAmountMicros,
        deliveryMethod: "STANDARD", 
        explicitlyShared: false,
      },
    };

    let campaignBudgetResourceName: string;
    try {
      // Define budget response type based on actual log output
      type BudgetCreateResponse = {
        results?: Array<{ resourceName?: string }>;
        // No partialFailureError expected at this level for this endpoint type
      };
      const budgetResponse = await request<BudgetCreateResponse>({
        url: `${this.baseUrl}/customers/${targetCustomerId}/campaignBudgets:mutate`,
        method: "POST",
        headers: await this.getHeaders(),
        // Send operations directly, not nested under mutateOperations for budget
        data: { operations: [budgetOperation] }, 
      });

      // Log the actual response data for debugging

      // Correctly parse the budget creation response
      const budgetResourceName = budgetResponse.data?.results?.[0]?.resourceName;
      
      if (!budgetResourceName) {
         // No need to check for partialFailureError here as this is not a mutateOperationResponse
         console.error("Failed to create campaign budget. Full Response:", JSON.stringify(budgetResponse.data, null, 2));
         throw new Error("Failed to create campaign budget; resource name missing in response.");
      }
      campaignBudgetResourceName = budgetResourceName;

    } catch (error: any) {
      console.error("Caught error during createCampaignBudget API call:");
      if (error.response && error.response.data) {
         console.error("Detailed Google Ads API Error (Budget):", JSON.stringify(error.response.data.error || error.response.data, null, 2));
      } else {
        console.error("Generic Error (Budget):", error.message);
      }
      throw new Error("Failed to create campaign budget via Google Ads API.");
    }

    // Step 2: Create the Campaign using the new budget's resource name
    const campaignOperation = {
      // Use mutateOperations array for campaign creation
      mutateOperations: [ 
        {
          campaignOperation: {
            create: {
              name: campaign.name,
              status: campaign.status,
              advertisingChannelType: campaign.advertisingChannelType,
              startDate: campaign.startDate,
              endDate: campaign.endDate,
              manualCpc: {}, 
              campaignBudget: campaignBudgetResourceName, // Use the dynamically created budget
            },
          },
        },
      ],
    };
    
    try {
      // Define a more accurate response type including potential partial failure
      type CampaignMutateResponse = {
        mutateOperationResponses?: Array<{
          campaignResult?: { resourceName?: string }; 
          partialFailureError?: any; 
        }>;
      };

      const response = await request<CampaignMutateResponse>({
        url: `${this.baseUrl}/customers/${targetCustomerId}/googleAds:mutate`,
        method: "POST",
        headers: await this.getHeaders(),
        // Send campaignOperation directly for campaign mutate
        data: campaignOperation, 
      });

      if (!response.data) {
        throw new Error("Failed to create campaign; no response data.");
      }

      console.log("Response from createCampaign:", response.data);

      // Use mutateOperationResponses based on the defined type
      const campaignResult = response.data.mutateOperationResponses?.[0]; 

      // Check for partial failure error first
      if (campaignResult && campaignResult.partialFailureError) {
        console.error("Partial failure error during campaign creation:", JSON.stringify(campaignResult.partialFailureError, null, 2));
        throw new Error("Partial failure during campaign creation; check logs for details.");
      }

      // Check response status if not a partial failure
      if (response.status !== 200) {
        console.error("Error creating campaign. Status:", response.status);
        console.error("Full response data:", JSON.stringify(response.data, null, 2));
        throw new Error(`Google Ads API Error: Status ${response.status}`);
      }

      // Access campaignResult correctly
      const campaignResponseData = campaignResult?.campaignResult; 
      const resourceName = campaignResponseData?.resourceName;

      if (!resourceName) {
        // This case might be covered by the partial failure check, but good to keep
        console.error("Campaign data missing in successful response:", JSON.stringify(response.data, null, 2));
        throw new Error("Failed to create campaign; no resourceName returned.");
      }

      // Extract the ID from the resource name (e.g., customers/123/campaigns/456 -> 456)
      const campaignId = resourceName.split('/').pop();
      if (!campaignId) {
         console.error("Could not parse campaignId from resourceName:", resourceName);
         throw new Error("Failed to parse campaignId from resourceName.");
      }

      // Return the known campaign data along with the ID and resourceName from the response
      return {
        ...campaign, // Spread the original input data (name, status, dates etc.)
        id: campaignId, // Use the variable holding the parsed ID
        resourceName: resourceName, // The resourceName from the API response
      } as Campaign;

    } catch (error: any) {
      console.error("Caught error during createCampaign API call:");
      // Log detailed error from GaxiosError response if available
      if (error.response && error.response.data) {
         console.error("Detailed Google Ads API Error:", JSON.stringify(error.response.data.error || error.response.data, null, 2));
      } else {
        // Log the generic error message if no detailed response data
        console.error("Generic Error:", error.message);
      }
      // Log the GaxiosError object itself for more context if needed
      // console.error("Full GaxiosError object:", error); 
      throw new Error("Failed to create campaign via Google Ads API."); // Re-throw a generic error
    }
  }

  // ------------------------------------------------------
  // 4) UPDATE CAMPAIGN (bidding, budget, dates, etc.)
  // ------------------------------------------------------
  /**
   * Update a single Google Ads campaign by ID (using mutate).
   *
   * @param campaignId The existing campaign's ID in Google Ads.
   * @param updates    An object of fields to update, e.g.:
   *  {
   *    name: 'New Campaign Name',
   *    status: 'PAUSED',
   *    startDate: '20250101',
   *    endDate: '20251231',
   *    campaignBudget: 'customers/123/campaignBudgets/456', // resource name
   *    biddingStrategyType: 'MANUAL_CPC',
   *    manualCpc: { enhancedCpcEnabled: true },
   *    targetSpend: {
   *      cpcBidCeilingMicros: "1000000",
   *      targetSpendingAmountMicros: "5000000"
   *    }
   *  }
   */
  async updateCampaign(
    campaignId: string,
    updates: Partial<Campaign>
  ): Promise<Campaign> {
    // Resource name format: "customers/{customerId}/campaigns/{campaignId}"
    const resourceName = `customers/${this.customerId}/campaigns/${campaignId}`;

    // Build 'update' object
    const updateFields: any = { resourceName };

    // Basic fields
    if (updates.name) {
      updateFields.name = updates.name;
    }
    if (updates.status) {
      updateFields.status = updates.status;
    }
    if (updates.startDate) {
      updateFields.startDate = updates.startDate;
    }
    if (updates.endDate) {
      updateFields.endDate = updates.endDate;
    }

    // Budget field (resource name like "customers/123/campaignBudgets/456")
    if (updates.campaignBudget) {
      updateFields.campaignBudget = updates.campaignBudget;
    }

    // Bidding strategy
    if (updates.biddingStrategyType) {
      updateFields.biddingStrategyType = updates.biddingStrategyType;
    }
    if (updates.manualCpc) {
      updateFields.manualCpc = updates.manualCpc;
    }
    if (updates.targetSpend) {
      updateFields.targetSpend = updates.targetSpend;
    }

    // Gather updateMask paths (snake_case)
    const paths: string[] = [];
    if (updates.name) paths.push("name");
    if (updates.status) paths.push("status");
    if (updates.startDate) paths.push("start_date");
    if (updates.endDate) paths.push("end_date");
    if (updates.campaignBudget) paths.push("campaign_budget");
    if (updates.biddingStrategyType) paths.push("bidding_strategy_type");
    if (updates.manualCpc) paths.push("manual_cpc");
    if (updates.targetSpend) paths.push("target_spend");

    const requestBody = {
      operations: [
        {
          update: updateFields,
          updateMask: {
            paths,
          },
        },
      ],
    };

    const response = await request<{ results?: Array<{ campaign: Campaign }> }>(
      {
        url: `${this.baseUrl}/customers/${this.customerId}/campaigns:mutate`,
        method: "POST",
        headers: await this.getHeaders(),
        data: requestBody,
      }
    );

    const updatedCampaignData = response.data.results?.[0]?.campaign;
    if (!updatedCampaignData) {
      throw new Error("Failed to update campaign; missing response data.");
    }

    return {
      id: updatedCampaignData.id,
      resourceName: updatedCampaignData.resourceName,
      name: updatedCampaignData.name,
      status: updatedCampaignData.status,
      advertisingChannelType: updatedCampaignData.advertisingChannelType,
      startDate: updatedCampaignData.startDate,
      endDate: updatedCampaignData.endDate,
      campaignBudget: updatedCampaignData.campaignBudget,
      biddingStrategyType: updatedCampaignData.biddingStrategyType,
    } as Campaign;
  }

  // ------------------------------------------------------
  // 5) CREATE CUSTOMER CLIENT
  // ------------------------------------------------------
  async createCustomerClient(customerInfo: {
    businessName: string;
    currencyCode: string;
    timeZone: string;
  }): Promise<string> {
    try {
      const headers = await this.getHeaders();

      const requestConfig = {
        url: `${this.baseUrl}/customers/${this.customerId}:createCustomerClient`,
        method: "POST" as const,
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        data: {
          customerClient: {
            descriptiveName: customerInfo.businessName,
            currencyCode: customerInfo.currencyCode,
            timeZone: customerInfo.timeZone,
          },
        },
        validateStatus: (status: number) => true,
      };
      // if no customer id, create a new one
      const response = await request<{ resourceName: string }>(requestConfig);
      console.log("Response from createCustomerClient:", response.data);

      if (response.status !== 200) {
        throw new Error(
          `Google Ads API Error: ${response.status} - ${JSON.stringify(
            response.data
          )}`
        );
      }

      if (!response.data?.resourceName) {
        throw new Error("No customer resource name returned in response");
      }

      // Extract customer ID from resourceName (format: "customers/1234567890")
      const customerId = response.data.resourceName.split('/')[1];
      return customerId;
    } catch (error: any) {
      console.error("Detailed error in createCustomerClient:", {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  }

  // ------------------------------------------------------
  // 6) KEYWORD MANAGEMENT (Ad Group Criteria)
  // ------------------------------------------------------

  /**
   * Add keywords to a given ad group (CREATE operation).
   * @param adGroupId e.g. "123456"
   * @param keywords  e.g. [{ text: "shoes", matchType: "BROAD" }, ...]
   */
  async addKeywordsToAdGroup(
    adGroupId: string,
    keywords: { text: string; matchType: string }[],
    customerId?: string
  ) {
    const targetCustomerId = customerId || this.customerId;
    const adGroupResourceName = `customers/${targetCustomerId}/adGroups/${adGroupId}`;

    const operations = keywords.map((k) => ({
      create: {
        adGroup: adGroupResourceName,
        status: "ENABLED",
        keyword: {
          text: k.text,
          matchType: k.matchType, // e.g. 'BROAD', 'PHRASE', 'EXACT'
        },
      },
    }));

    const response = await request({
      url: `${this.baseUrl}/customers/${targetCustomerId}/adGroupCriteria:mutate`,
      method: "POST",
      headers: await this.getHeaders(),
      data: { operations },
    });

    // Each operation result is in response.data.results
    return (
      (response.data as any).results?.map((r: any) => r.adGroupCriterion) || []
    );
  }

  /**
   * Update an existing keyword (ad group criterion).
   * @param adGroupId   e.g. "123456"
   * @param criterionId e.g. "7890"  (the unique ID for that keyword)
   * @param updates     e.g. { text?: 'new text', matchType?: 'EXACT', status?: 'PAUSED' }
   */
  async updateKeyword(
    adGroupId: string,
    criterionId: string,
    updates: { text?: string; matchType?: string; status?: string },
    customerId?: string
  ) {
    const targetCustomerId = customerId || this.customerId;
    const resourceName = `customers/${targetCustomerId}/adGroupCriteria/${adGroupId}~${criterionId}`;

    const updateObj: any = { resourceName };
    const paths: string[] = [];

    // If we're updating text or matchType, nest inside `keyword` object
    if (updates.text || updates.matchType) {
      updateObj.keyword = {};
      if (updates.text) {
        updateObj.keyword.text = updates.text;
        paths.push("keyword.text");
      }
      if (updates.matchType) {
        updateObj.keyword.matchType = updates.matchType;
        paths.push("keyword.match_type");
      }
    }
    // status is a top-level field
    if (updates.status) {
      updateObj.status = updates.status;
      paths.push("status");
    }

    const body = {
      operations: [
        {
          update: updateObj,
          updateMask: { paths },
        },
      ],
    };

    const response = await request({
      url: `${this.baseUrl}/customers/${targetCustomerId}/adGroupCriteria:mutate`,
      method: "POST",
      headers: await this.getHeaders(),
      data: body,
    });

    const data = response.data as { results?: { adGroupCriterion: any }[] };
    return data.results?.[0]?.adGroupCriterion;
  }

  /**
   * Remove a keyword from an ad group by resource name (REMOVE operation).
   * @param adGroupId   e.g. "123456"
   * @param criterionId e.g. "7890"
   */
  async removeKeyword(
    adGroupId: string, 
    criterionId: string,
    customerId?: string
  ) {
    const targetCustomerId = customerId || this.customerId;
    const resourceName = `customers/${targetCustomerId}/adGroupCriteria/${adGroupId}~${criterionId}`;

    const body = {
      operations: [
        {
          remove: resourceName,
        },
      ],
    };

    const response = await request({
      url: `${this.baseUrl}/customers/${targetCustomerId}/adGroupCriteria:mutate`,
      method: "POST",
      headers: await this.getHeaders(),
      data: body,
    });

    return (response.data as any).results?.[0]?.adGroupCriterion;
  }

  /**
   * Update campaign and handle keyword updates (if provided).
   *
   * @param campaignId The ID of the campaign to update.
   * @param campaignUpdates Partial campaign fields to update.
   * @param adGroupId Optional Ad Group ID for keyword updates.
   * @param keywords Optional array of keyword updates/additions.
   */
  async updateCampaignAndKeywords(
    campaignId: string,
    campaignUpdates: Partial<Campaign>, 
    adGroupId?: string,
    keywords?: Array<{
      text: string;
      matchType: string;
      criterionId?: string;
      status?: string;
    }>,
    customerId?: string
  ): Promise<Campaign> {
    // Step 1: Update campaign fields
    const updatedCampaign = await this.updateCampaign(
      campaignId,
      campaignUpdates
    );

    // Step 2: Handle keywords
    if (adGroupId && Array.isArray(keywords) && keywords.length > 0) {
      for (const kw of keywords) {
        if (kw.criterionId) {
          await this.updateKeyword(
            adGroupId, 
            kw.criterionId, 
            {
              text: kw.text,
              matchType: kw.matchType,
              status: kw.status,
            },
            customerId
          );
        } else {
          await this.addKeywordsToAdGroup(
            adGroupId, 
            [{ text: kw.text, matchType: kw.matchType }],
            customerId
          );
        }
      }
    }

    return updatedCampaign;
  }
}
