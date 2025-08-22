export type BusinessData = {
  data: {
    _id: string;
    userId: string;

    /* --- מידע בסיסי --- */
    businessName: string;
    businessType: string;
    businessField: string;
    customBusinessField?: string;
    businessFieldDetails?: string;

    /* --- מיקום ואזורי פעילות --- */
    businessAddress?: string;
    address?: string;             // כתובת ראשית מלאה
    serviceAreas: string;
    mapCoordinates?: { lat: number; lng: number };

    /* --- שירותים והצעה עסקית --- */
    serviceDescription: string;
    uniqueService: string;
    specialPackages?: string;
    incentives?: string;          // תמריצים ללקוחות
    objective?: string;           // מטרה כללית של העסק/הקמפיין

    /* --- פרטי קשר --- */
    phone?: string;
    whatsapp?: string;
    email?: string;
    contactPerson?: string;

    /* --- עיצוב ומיתוג --- */
    logo?: string;
    businessImages?: string[];    // גלריית תמונות כללית
    designPreferences?: string;   // צבעים, פונטים, סגנון
    brandTone?: string;           // טון המותג ("קליל", "רציני", "יוקרתי")

    /* --- נוכחות דיגיטלית --- */
    socialMediaAccounts?: {
      facebook?: string;
      instagram?: string;
      tiktok?: string;
      linkedin?: string;
      youtube?: string;
      twitter?: string;
      pinterest?: string;
    };

    /* --- שעות פעילות --- */
    openingHours?: Record<string, string>; // { "ראשון": "09:00–18:00", ... }

    /* --- SEO --- */
    seoTitle?: string;            // עד 60 תווים
    seoDescription?: string;      // עד 150 תווים
    seoKeywords?: string[];       // רשימת מילות מפתח

    /* --- תמחור וחבילות --- */
    packages?: {
      name: string;
      priceMonthly: number;
      features: string[];
      cta: string;
      highlight?: boolean;
    }[];

    /* --- מיקרו־קופי --- */
    microcopy?: Record<string, string>; // { "form_name_placeholder": "הכנס שם", ... }

    /* --- סטטיסטיקות/אמון --- */
    stats?: {
      label: string;
      value: string;
    }[];
    badges?: string[];

    /* --- תכנים נוספים לדף הנחיתה --- */
    missionStatement?: string;
    heroSubtitle?: string;
    heroBullets?: string[];
    reviews?: string[];

    /* --- טכנית --- */
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
