import mongoose, { Schema } from "mongoose";

export interface BusinessInfo {
  userId: String;
  // שלב 1
  businessName: String;
  businessType: String;
  businessAddress?: String;
  businessField: String;
  businessFieldDetails?: String;
  serviceAreas: String;
  phoneNumber?: String;

  // שלב 2
  ageGroup: String;
  gender: String;
  specificMarketSegment: String;
  typicalCustomers: String;

  // שלב 3
  serviceDescription: String;
  uniqueService: String;
  specialPackages: String;
  incentives: String;

  // שלב 4
  logo: String;
  businessImages: [String];
  designPreferences?: String;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    linkedin?: string;
    other?: string;
  };

  // שלב 5
  objective: String;
}
const BusinessInfoModel = new mongoose.Schema<BusinessInfo>({
  userId: { type: String, required: true },
  // שלב 1
  businessName: { type: String, required: true },
  businessType: { type: String, required: true },
  businessAddress: { type: String },
  businessField: { type: String, required: true },
  businessFieldDetails: { type: String },
  serviceAreas: { type: String, required: true },
  phoneNumber: { type: String },

  // שלב 2
  // ageGroup: { type: String, required: true },
  // gender: { type: String, required: true },
  // specificMarketSegment: { type: String, required: true },
  // typicalCustomers: { type: String, required: true },

  // שלב 3
  serviceDescription: { type: String, required: true },
  uniqueService: { type: String, required: true },
  specialPackages: { type: String, required: true },
  incentives: { type: String, required: true },

  // שלב 4
  logo: { type: String },
  businessImages: {
    type: [String],
    default: [],
  },

  designPreferences: { type: String },
  socialLinks: {
    facebook: { type: String },
    instagram: { type: String },
    tiktok: { type: String },
    linkedin: { type: String },
    other: { type: String },
  },

  // שלב 5
  objective: {
    type: String,
    enum: [
      "brandAwareness",
      "reach",
      "siteVisit",
      "engagement",
      "videoViews",
      "sales",
    ],
    default: undefined,
  },
});

const businessInfoModel = mongoose.model<BusinessInfo>(
  "BusinessInfo",
  BusinessInfoModel
);

export default businessInfoModel;
