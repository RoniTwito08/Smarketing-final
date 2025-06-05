import { SmartCampaignData } from "./types/marketingTypes";

export function generatePrompt(
  smartCampaign: SmartCampaignData,
  analysis: ReturnType<typeof import("./analyzer").analyzePerformance>,
  issues: string[]
): string {
  const { businessInfo, campaignSetup } = smartCampaign;

  return `
You are a smart marketing assistant.

Business: ${businessInfo.businessName} (${
    businessInfo.businessField === "אחר"
      ? businessInfo.customBusinessField
      : businessInfo.businessField
  })
Unique Selling Point: ${businessInfo.uniqueService}
Service Description: ${businessInfo.serviceDescription}
Location/Service Area: ${businessInfo.serviceAreas}
Special Packages: ${businessInfo.specialPackages}
New Customer Incentives: ${businessInfo.incentives}
Objective: ${businessInfo.objective ?? "not specified"}

Campaign Name: ${campaignSetup.campaignName}
Budget: $${campaignSetup.budget}/day
Main Goal: ${campaignSetup.goal}
Campaign Dates: ${campaignSetup.duration.start.toDateString()} → ${campaignSetup.duration.end.toDateString()}
Scheduled Time: ${campaignSetup.scheduledTime ?? "Not specified"}

📊 Performance Summary:
- CTR: ${(analysis.ctr * 100).toFixed(1)}%
- Conversion Rate: ${(analysis.conversionRate * 100).toFixed(1)}%
- Avg CPC: $${analysis.avgCpc.toFixed(2)}
- Cost per Conversion: ${
    analysis.costPerConversion
      ? `$${analysis.costPerConversion.toFixed(2)}`
      : "N/A"
  }
- Average Position: ${analysis.averagePosition ?? "N/A"}
- Interaction Rate: ${analysis.interactionRate ?? "N/A"}
- CPM: ${analysis.averageCpm ?? "N/A"}
- CPV: ${analysis.averageCpv ?? "N/A"}
- Video View Rate: ${analysis.videoViewRate ?? "N/A"}

Detected Issues:
${issues.map((issue) => "- " + issue).join("\n")}

👉 Please generate:
1. A new ad headline and description
2. 3–5 keyword suggestions
3. A new landing page headline

Return your response in the following JSON format:

{
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "scheduledTime": "HH:MM",
  "llmSuggestions": {
    "adHeadline": "...",
    "adDescription": "...",
    "keywordIdeas": ["...", "..."],
    "landingHeadline": "..."
  }
}

Return only valid JSON. Do not include explanations, markdown, or any other text.
`.trim();
}

//דוגמא לאיך שזה נשלח לצאט

// You are a smart marketing assistant.

// Business: Zen Flow Yoga (Health & Wellness)
// Unique Selling Point: Daily morning yoga designed for busy professionals
// Service Description: Group and private yoga sessions tailored to busy schedules
// Location/Service Area: Tel Aviv, Ramat Gan
// Special Packages: 10-session morning pass with 15% discount
// New Customer Incentives: First session free + free mat
// Objective: sales

// Campaign Name: April Zen Boost
// Advertising Channel: SEARCH
// Budget: $30/day
// Main Goal: sales
// Campaign Dates: Mon Apr 1 2025 → Wed Apr 30 2025
// Scheduled Time: 07:00

// 📊 Performance Summary:
// - CTR: 1.2%
// - Conversion Rate: 2.9%
// - Avg CPC: $1.80
// - Cost per Conversion: $9.75
// - Average Position: 3.6
// - Interaction Rate: 0.04
// - CPM: 12.5
// - CPV: 0.08
// - Video View Rate: 0.14

// Detected Issues:
// - Low CTR – users see the ad but don’t click. Improve headlines or targeting.
// - Low conversion rate – users click but don’t convert. Improve landing page.
// - Low average position – your ads may not be getting enough visibility.
// - Low interaction rate – users are not engaging with your ad.
// - High cost per conversion – consider adjusting bid strategy or targeting.

// 👉 Please generate:
// 1. A new ad headline and description
// 2. 3–5 keyword suggestions
// 3. A new landing page headline

// Return your response in the following JSON format:

// {
//   "startDate": "2025-04-01",
//   "endDate": "2025-04-30",
//   "scheduledTime": "07:00",
//   "llmSuggestions": {
//     "adHeadline": "...",
//     "adDescription": "...",
//     "keywordIdeas": ["...", "..."],
//     "landingHeadline": "..."
//   }
// }
