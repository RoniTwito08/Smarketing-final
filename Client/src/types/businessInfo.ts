export type FormValues = {
  _id?: string;
  /* שם העסק (שדה חובה)  */
  businessName: string;

  /* סוג העסק (למשל "פיזי" או "דיגיטלי") (שדה חובה) */
  businessType: string;

  /* כתובת העסק (חובה אם businessType הוא "פיזי") */
  businessAddress?: string;

  /* תחום הפעילות של העסק (שדה חובה) */
  businessField: string;

  /* תחום פעילות מותאם אישית (אופציונלי) */
  customBusinessField?: string;

  /* פרטים נוספים על תחום העסק (אופציונלי) */
  businessFieldDetails?: string;

  /* באילו אזורים או מדינות השירות מוצע (שדה חובה) */
  serviceAreas: string;

  /* טווח הגיל של קהל היעד (שדה חובה) */
  // ageGroup: string;

  /* מין קהל היעד (שדה חובה, למשל "זכר"/"נקבה"/"שני המינים") */
  // gender: string;

  /* פלח שוק ספציפי שאליו רוצים למקד קמפיינים (שדה חובה) */
  // specificMarketSegment: string;

  /* תיאור הלקוחות הטיפוסיים המשתמשים בשירות (שדה חובה) */
  // typicalCustomers: string;

  /* תיאור השירות המסופק (שדה חובה) */
  serviceDescription: string;

  /* תיאור שירות חדש או ייחודי (שדה חובה) */
  uniqueService: string;

  /* תיאור חבילות שירות מיוחדות (שדה חובה) */
  specialPackages: string;

  /* תמריצים מיוחדים ללקוחות חדשים (לדוגמה חודש חינם) (שדה חובה) */
  incentives: string;

  /* קובץ לוגו יחיד (אופציונלי) */
  logoFile?: File;

  /* תמונות נוספות של העסק (אופציונלי) */
  businessImageFiles?: FileList;

  /* העדפות עיצוב (למשל סגנון מודרני, מינימליסטי וכו') (אופציונלי) */
  designPreferences?: string;

  /* קישורים לרשתות חברתיות לפי פלטפורמות (אופציונלי) */
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    linkedin?: string;
    other?: string;
  };

  /* לוגו שנשמר בשרת (נתיב תמונה) */
  logo?: string;

  /* נתיבי תמונות נוספות של העסק שנשמרו בשרת */
  businessImages?: string[];

  phonePrefix?: string;
  phoneNumberBody?: string;
  phoneNumber?: string; // השדה המאוחד שנשלח לבקאנד

  /**
   * מטרה לקמפיין. האפשרויות הן:
   * - "brandAwareness": הגדלת המודעות למותג שלך
   * - "reach": הגעה למספר גדול של אנשים
   * - "siteVisit": ביקור באתר/אפליקציה/חנות פיזית
   * - "engagement": מעורבות (קבלת יותר לייקים, תגובות או שיתופים)
   * - "videoViews": צפיות בווידאו
   * - "sales": הגדלת המכירות
   */
  objective?:
    | "brandAwareness"
    | "reach"
    | "siteVisit"
    | "engagement"
    | "videoViews"
    | "sales";
};
