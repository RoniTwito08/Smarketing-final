/* istanbul ignore file */ // ignore for coverage

import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { Campaign, BusinessInfo } from "../services/googleAds/types";

dotenv.config();

console.log("Google Gemini API Key:", process.env.KEYWORDS_GEMINI_API_KEY);
const genAI = new GoogleGenerativeAI(process.env.KEYWORDS_GEMINI_API_KEY || "");

export async function getGeminiKeywordsFromCampaign(
  campaign: Campaign,
  business: BusinessInfo
): Promise<{ keywordText: string; matchType: string }[]> {
  console.log("gemini function called with campaign:", campaign);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = `
  You are a Google Ads marketing assistant.
  
  Your task is to generate 2-3 **relevant and optimized marketing keyword ideas** for a Google Ads campaign, based on both the campaign settings and the business profile.
  
  📊 Campaign Information:
  - Name: ${campaign.name}
  - Type: ${campaign.advertisingChannelType}
  - Goal: ${
    campaign.optimizationGoalSetting?.optimizationGoalTypes?.[0] ??
    "Not specified"
  }
  - Start Date: ${campaign.startDate}
  - End Date: ${campaign.endDate}
  - Budget (micros): ${
    campaign.targetSpend?.targetSpendingAmountMicros ?? "N/A"
  }
  - Scheduled Time: ${campaign.scheduledTime ?? "Not specified"}
  
  🏢 Business Information:
  - Business Name: ${business.businessName}
  - Type: ${business.businessType}
- Field: ${
    business.businessField === "אחר"
      ? business.customBusinessField || "Other"
      : business.businessField
  }  - Niche: ${business.businessFieldDetails ?? "N/A"}
  - Location / Service Areas: ${business.serviceAreas}
  - Description: ${business.serviceDescription}
  - Unique Value: ${business.uniqueService}
  - Special Offers: ${business.specialPackages}
  - Incentives: ${business.incentives}
  - Objective: ${business.objective ?? "N/A"}
  - Design Preferences: ${business.designPreferences ?? "N/A"}
  - Social Platforms: ${
    Object.entries(business.socialLinks ?? {})
      .filter(([_, v]) => v)
      .map(([k, v]) => k)
      .join(", ") || "None"
  }
  
  👉 Based on all this information, generate keyword ideas that match:
  - The business's unique offering
  - Its target audience and services
  - The campaign's objective and scope
  
  Return the result as a **valid JSON array**, where each keyword object contains:
  - keywordText: the actual keyword (string)
  - matchType: one of ["EXACT", "PHRASE", "BROAD"]
  
  📦 Example output:
  [
    {
      "keywordText": "עורך דין חוזים",
      "matchType": "EXACT"
    },
    {
      "keywordText": "ייעוץ משפטי לעסקים",
      "matchType": "PHRASE"
    }
  ]
  
  ⚠️ Do NOT include any explanation or markdown. Return only the raw JSON array.
  `.trim();

  const result = await model.generateContent(prompt);
  const text = (await result.response.text()).trim();

  const cleaned = text
    .replace(/```json\s*/i, "")
    .replace(/```$/, "")
    .trim();

  return JSON.parse(cleaned);
}
