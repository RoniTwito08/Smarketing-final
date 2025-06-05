export type BusinessData = {
  data: {
    _id: string;
    userId: string;
    businessName: string;
    businessType: string;
    businessAddress?: string;
    businessField: string;
    customBusinessField?: string;
    businessFieldDetails?: string;
    serviceAreas: string;
    serviceDescription: string;
    uniqueService: string;
    specialPackages: string;
    incentives: string;
    logo?: string;
    businessImages?: string[];
    designPreferences?: string;
    socialMediaAccounts?: string[];
    objective?: string;
    __v?: number;
  };
};

export type CampaignInfo = {
  budget: number;
  marketingLevel: string;
  campaginPurpose: string;
  actionToCall: string;
  campaignName: string;
  targetAudience: string;
  targetGender: string;
  language: string;
  targetLocation: string;
  targetAge: string;
};

export type UserEmailData = {
  email: string;
};
