import { Request, Response } from "express";
import path from "path";
import {
  generateContent,
  fetchPexelsImage,
} from "../services/landing_page_generator/textAndImage_generator";
import {
  BusinessData,
  CampaignInfo,
  UserEmailData,
} from "../services/landing_page_generator/businessInfoTypes_LP";

/* -------------------------------------------
   Helpers
-------------------------------------------- */

/** מנקה תווי קוד/Backticks ומנסה לאתר בלוק JSON חוקי מתוך מחרוזת.
 *  אם הפרסינג נכשל והועבר defaultValue – נחזיר אותו במקום לזרוק שגיאה. */
function extractJson<T = any>(raw: string, defaultValue?: T): T {
  const s = String(raw ?? "").trim();
  const firstBracket = s.indexOf("{");
  const firstBracketArr = s.indexOf("[");
  const start =
    firstBracket === -1
      ? firstBracketArr
      : firstBracketArr === -1
      ? firstBracket
      : Math.min(firstBracket, firstBracketArr);

  if (start >= 0) {
    const lastCurly = s.lastIndexOf("}");
    const lastSquare = s.lastIndexOf("]");
    const end = Math.max(lastCurly, lastSquare);
    if (end > start) {
      const jsonCandidate = s.slice(start, end + 1);
      try {
        return JSON.parse(jsonCandidate);
      } catch {}
    }
  }

  try {
    return JSON.parse(s);
  } catch {
    if (defaultValue !== undefined) return defaultValue;
    throw new Error("Failed to parse JSON from model output");
  }
}

/** מאמת מערך מחרוזות (זורק שגיאה אם לא תקין) */
function asStringArray(raw: unknown, name = "array"): string[] {
  if (!Array.isArray(raw)) throw new Error(`${name} is not an array`);
  for (const v of raw) {
    if (typeof v !== "string") {
      throw new Error(`${name} must contain only strings`);
    }
  }
  return raw as string[];
}

/** מאמת סלחני למערך אובייקטים – מחזיר רק את האובייקטים שמכילים את כל המפתחות */
function safeRequireArrayOfObjects<T extends object>(
  raw: unknown,
  requiredKeys: string[]
): T[] {
  if (!Array.isArray(raw)) return [];
  const ok = raw.filter((obj) => {
    if (typeof obj !== "object" || obj === null) return false;
    for (const k of requiredKeys) if (!(k in (obj as any))) return false;
    return true;
  }) as T[];
  return ok;
}

/** מאמת קשיח (כמו אצלך) – משמש היכן שתרצה להפיל שגיאה */
function requireArrayOfObjects<T extends object>(
  raw: unknown,
  requiredKeys: string[],
  name = "array"
): T[] {
  if (!Array.isArray(raw)) throw new Error(`${name} is not an array`);
  for (const obj of raw) {
    if (typeof obj !== "object" || obj === null) {
      throw new Error(`${name} must contain only objects`);
    }
    for (const k of requiredKeys) {
      if (!(k in (obj as any))) {
        throw new Error(`${name} object missing key "${k}"`);
      }
    }
  }
  return raw as T[];
}

/** יוצר שם קובץ לתמונה */
function imageFileName(base: string) {
  return `${Date.now()}_${base.replace(/\s+/g, "_")}.jpg`;
}

/* -------------------------------------------
   Types (locals)
-------------------------------------------- */

type ServiceItem = { title: string; description: string };
function isServiceItemArray(x: unknown): x is ServiceItem[] {
  return (
    Array.isArray(x) &&
    x.every(
      (o) =>
        o &&
        typeof o === "object" &&
        typeof (o as any).title === "string" &&
        typeof (o as any).description === "string"
    )
  );
}

/* -------------------------------------------
   LLM helpers
-------------------------------------------- */

async function getServicesFromLLM(businessName: string): Promise<ServiceItem[]> {
  const raw = await generateContent(`
החזר אך ורק JSON חוקי של מערך באורך 6.
כל איבר הוא אובייקט בדיוק עם שני שדות:
{ "title": "<כותרת קצרה עד 4 מילים>", "description": "<משפט אחד תיאורי קצר>" }
עברית בלבד. ללא טקסט נוסף מחוץ למערך.
עסק: "${businessName}"
  `);

  // 1) פרסינג סלחני עם fallback למערך ריק
  const parsed = extractJson<ServiceItem[]>(raw, []);

  // 2) ניקוי פריטים לא תקינים ושיופים
  const cleaned = safeRequireArrayOfObjects<ServiceItem>(parsed, [
    "title",
    "description",
  ])
    .map((x) => ({
      title: String(x.title || "").trim().slice(0, 40),
      description: String(x.description || "").trim(),
    }))
    .filter((x) => x.title && x.description)
    .slice(0, 6);

  return cleaned;
}

/* -------------------------------------------
   Controller: Generate Landing Page Context (Optimized with Parallelism)
-------------------------------------------- */

export const generateLandingPageContext = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const inputDetails: BusinessData = req.body.BusinessData;
    const campaignInfo: CampaignInfo = req.body.campaignInfo;
    const userInfo: UserEmailData = req.body.UserEmailData;

    const business = inputDetails.data;
    const fieldToTranslate =
      business.businessField === "אחר"
        ? business.customBusinessField
        : business.businessField;

    const brandTone =
      campaignInfo?.marketingLevel
        ? String(campaignInfo.marketingLevel)
        : "רגוע, מקצועי ומזמין";

    // עוזר קטן לקיצור
    const gen = (p: string) => generateContent(p);

    // ---------- שלב 1: מפעילים במקביל כבר עכשיו כל מה שלא תלוי במילת המפתח ----------
    const headerButtonTextPromise = gen(
      `כתוב קריאה לפעולה ממוקדת וקצרה עד 3 מילים לקמפיין שמטרתו: "${campaignInfo.campaginPurpose}".
החזר טקסט בעברית בלבד, ללא הסברים וללא סימני פיסוק מיותרים.`
    ).then((s) => s.trim());

    const sloganPromise = gen(
      `כתוב סלוגן קצר (עד 5 מילים) לעסק "${business.businessName}" בסגנון "${brandTone}".
החזר טקסט בעברית בלבד.`
    ).then((s) => s.trim());

    const navPromise = gen(
      `החזר מערך JSON של בדיוק 5 פריטי ניווט (מחרוזות קצרות בעברית) עבור דף נחיתה סטנדרטי (למשל: בית, שירותים, חבילות, לקוחות, צור קשר).
החזר אך ורק את המערך.`
    );

    const heroTitlePromise = gen(
      `כתוב כותרת שיווקית חזקה וברורה לעסק "${business.businessName}" בתחום "${fieldToTranslate}".
משפט אחד בעברית, ללא נקודה בסוף. טון: ${brandTone}.`
    ).then((s) => s.trim());

    const heroSubtitlePromise = gen(
      `כתוב תת-כותרת קצרה (שורה אחת) שמחדדת את ערך המוצר/השירות של "${business.businessName}".
עברית בלבד, ללא נקודה בסוף. טון: ${brandTone}.`
    ).then((s) => s.trim());

    const heroBulletsPromise = gen(
      `החזר מערך JSON של בדיוק 3 נקודות תועלת קצרות (עד 6 מילים כל אחת) עבור העסק "${business.businessName}".
עברית בלבד. ללא אמוג'י וללא קישוטים. החזר רק את המערך.`
    );

    const heroContentPromise = gen(
      `כתוב פסקה קצרה (עד 3 שורות) על "${business.businessName}" לשימוש כטקסט פתיחה בגיבור.
כלול בטבעיות:
- סוג עסק: ${business.businessType}
- תחום: ${business.businessFieldDetails}
- אזורי שירות: ${business.serviceAreas}
- שירותים: ${business.serviceDescription}
עברית בלבד, טון: ${brandTone}.`
    ).then((s) => s.trim());

    const secondaryBtnPromise = gen(
      `כתוב טקסט קצר לכפתור משני (עד 3 מילים) שמוביל לגלריה/פרויקטים.
עברית בלבד, ללא הסברים.`
    ).then((s) => s.trim());

    const featuresContentPromise = gen(`
החזר מערך JSON עם בדיוק 4 מחרוזות, כל אחת מתארת יתרון שיווקי לעסק "${business.businessName}" (עד 6 מילים).
דרישות:
• ללא תווי קישוט/אמוג'י
• עברית בלבד
• החזר רק את המערך`);

    const featuresTitlePromise = gen(
      `כתוב כותרת קצרה (עד 4 מילים) לסקשן יתרונות, עברית בלבד.`
    ).then((s) => s.trim());

    const aboutTextPromise = gen(`
כתוב פסקה אחת רציפה וברורה בעברית על העסק "${business.businessName}" בלבד, בלי להמציא מידע.
שלב בפסקה:
• הייחוד: "${business.uniqueService}"
• הטון/סגנון: "${business.designPreferences}"
• קהל היעד והגילאים: "${campaignInfo.targetAge}"
אל תחזיר JSON/קוד – רק את הטקסט עצמו, שורה אחת רציפה ללא שורות חדשות
    `).then((s) => s.trim());

    const missionPromise = gen(
      `כתוב משפט אחד שמציג את החזון/משימה של "${business.businessName}" בעברית, ללא נקודה בסוף`
    ).then((s) => s.trim());

    const servicesPromise = getServicesFromLLM(business.businessName);

    const howStepsPromise = gen(
      `החזר מערך JSON של בדיוק 4 אובייקטים המתארים תהליך עבודה ל-"${business.businessName}".
מבנה כל אובייקט: { "step": <מספר צעד 1-4>, "title": "<כותרת קצרה>", "text": "<משפט הסבר קצר>" }
עברית בלבד. החזר רק את המערך.`
    );

    const pricingPromise = gen(
      `עבור "${business.businessName}" החזר מערך JSON של בדיוק 3 חבילות מחיר.
מבנה:
[
  {
    "name": "בסיס",
    "priceMonthly": <מספר>,
    "features": ["תכונה 1","תכונה 2","תכונה 3","תכונה 4"],
    "cta": "התחילו עכשיו",
    "highlight": false
  },
  {...},
  {...}
]
דרישות:
• מחירים ריאליים לתחום "${fieldToTranslate}" בישראל
• עברית בלבד לשמות/פיצ'רים/CTA
• בדיוק 4 תכונות לכל חבילה
• החזר רק את המערך`
    );

    const pricingSubtitlePromise = gen(
      `כתוב שורת הסבר קצרה (עד 10 מילים) לפני טבלת החבילות.
עברית בלבד.`
    ).then((s) => s.trim());

    const pricingDisclaimerPromise = gen(
      `כתוב הערת הבהרה קצרה (עד 10 מילים) על המחירים (למשל לפני מע"מ/נתון לשינוי).
עברית בלבד.`
    ).then((s) => s.trim());

    const reviewsPromise = gen(`
כתוב 4 חוות דעת אותנטיות (2–3 משפטים כל אחת) על "${business.businessName}".
כללים:
• עברית בלבד, זמן הווה
• בלי שמות פרטיים/תארים/אמוג'י
• בלי מילים גנריות בלבד ("מצוין", "נהדר")
החזר אך ורק מערך JSON של 4 מחרוזות.`);

    const ratingAvgPromise = gen(
      `בחר ממוצע דירוג ריאלי בין 4.2 ל-5.0 כמספר עשרוני (למשל 4.7).
החזר מספר בלבד.`
    ).then((s) => Number(s.trim()));

    const ratingCountPromise = gen(
      `בחר מספר ריאלי של חוות דעת בין 24 ל-350 לעסק בתחום "${fieldToTranslate}".
החזר מספר בלבד.`
    ).then((s) => Number(s.trim()));

    const statsPromise = gen(
      `החזר מערך JSON של בדיוק 4 סטטיסטיקות אמון ל-"${business.businessName}".
מבנה כל פריט: { "label": "<תיאור קצר>", "value": "<מספר/אחוז/כמות קצרה>" }
דוגמאות: "לקוחות מרוצים", "פרויקטים שבוצעו", "שנות ניסיון", "זמן תגובה ממוצע".
עברית בלבד. החזר רק את המערך.`
    );

    const trustBadgesPromise = gen(
      `החזר מערך JSON של בדיוק 4 תגים/אמירות אמון (ללא אמוג'י), לדוגמה: "אחריות מלאה", "צוות מקצועי".
עברית בלבד, החזר רק את המערך.`
    );

    const faqPromise = gen(
      `החזר מערך JSON של בדיוק 6 שאלות ותשובות עבור "${business.businessName}".
מבנה: { "q": "<שאלה קצרה>", "a": "<תשובה קצרה (משפט-שניים)>" }
עברית בלבד. החזר רק את המערך.`
    );

    const contactSubtitlePromise = gen(
      `כתוב משפט קצר המעודד השארת פרטים/יצירת קשר, טון ${brandTone}, עברית בלבד.`
    ).then((s) => s.trim());

    const submitTextPromise = gen(
      `החזר טקסט קצר לכפתור שליחת טופס (עד 3 מילים), עברית בלבד.`
    ).then((s) => s.trim());

    const successMessagePromise = gen(
      `כתוב הודעת הצלחה קצרה לאחר שליחת טופס (משפט אחד), עברית בלבד.`
    ).then((s) => s.trim());

    const openingHoursPromise = gen(
      `החזר אובייקט JSON של שעות פעילות סטנדרטיות ל-"${business.businessName}".
מפתחות (keys) בעברית: "ראשון","שני","שלישי","רביעי","חמישי","שישי","שבת".
ערכים: טווחי שעות קצרים (למשל "09:00–18:00" או "סגור").
החזר רק את האובייקט.`
    );

    const mapQueryPromise = gen(
      `החזר מחרוזת כתובת/Query קצרה לניווט במפה עבור "${business.businessName}" ב-${business.serviceAreas}.
החזר מחרוזת בלבד.`
    ).then((s) => s.trim());

    const ctasPromise = gen(
      `החזר מערך JSON של בדיוק 6 טקסטי CTA קצרים (2–3 מילים) עבור "${business.businessName}".
עברית בלבד, החזר רק את המערך.`
    );

    const socialProofPromise = gen(
      `החזר מערך JSON של בדיוק 6 שמות מותג/אתרים/גופים שמתאימים להמחשת "לקוחות/אזכורים" (דמה/כללי) בתחום "${fieldToTranslate}" בישראל.
עברית בלבד. החזר רק את המערך.`
    );

    const seoPromise = gen(
      `החזר אובייקט JSON עבור SEO ל-"${business.businessName}".
מבנה:
{
  "title": "<עד 60 תווים>",
  "description": "<עד 150 תווים>",
  "keywords": ["מילת מפתח 1", "מילת מפתח 2", "..."] // בדיוק 8 מילות מפתח
}
עברית בלבד לכל השדות. החזר רק את האובייקט.`
    );

    const colorAndFontPromise = gen(
      `בחר פלטת צבעים וגופן ל-"${business.businessName}" (תחום: "${fieldToTranslate}") והחזר אובייקט JSON אחד:
דרישות:
- "primary": HEX בהיר-בינוני, מודרני ונעים (לא צהוב/כתום/אדום/שחור/לבן/אפור טהור)
- "secondary": HEX משלים/קומפלמנטרי עבור כפתורים/כותרות, שונה מה-primary
- "tertiary": HEX משלים נוסף (לא קרוב מדי ל-primary/secondary)
- "text": HEX עם ניגודיות מתאימה (WCAG ≥ 4.5:1) על גבי primary
- "font": שם משפחת גופן מ-Google Fonts (למשל "Rubik")
- "overlayAlpha": מספר עשרוני בין 0.15 ל-0.5 לשכבת כהות על תמונות רקע
- "gradients": אובייקט עם מחרוזות CSS Linear-Gradient עבור primary/secondary/tertiary (אופציונלי)
החזר רק את האובייקט, ללא טקסט נוסף.`
    );

    const goalsPromise = gen(
      `החזר מערך JSON של בדיוק 4 יעדי המרה עסקיים עבור "${business.businessName}" ("לידים", "שיחת ייעוץ", "הזמנה", "רכישה", וכו').
עברית בלבד. החזר רק את המערך.`
    );

    const microcopyPromise = gen(
      `החזר אובייקט JSON עם מיקרו-קופי (key:value) לשימוש באתר.
מפתחות לדוגמה: "form_name_placeholder","form_email_placeholder","form_phone_placeholder","form_message_placeholder","empty_state","loading","error_generic","retry","success_generic".
ערכים: משפטים קצרים בעברית. החזר רק את האובייקט.`
    );

    // ---------- שלב 2: מפיקים במקביל את מילת המפתח באנגלית (נדרשת לתמונות) ----------
    const businessFieldKeywordPromise = gen(
      `תרגם את התחום הבא למילת מפתח אחת באנגלית לחיפוש תמונות.
החזר מילה אחת בלבד, ללא שום טקסט נוסף, ללא סימני ציטוט.
${fieldToTranslate}`
    )
      .then((s) => s.trim().replace(/["'\s]/g, ""))
      .then((kw) => kw || "business");

    // ---------- שלב 3: תמונות – תלויות במילת המפתח בלבד ----------
    const heroImagePromise = businessFieldKeywordPromise.then(async (kw) => {
      const heroImageName = imageFileName(`${kw}_hero`);
      const heroImagePath = path.join(__dirname, "../pexels_images", heroImageName);
      return fetchPexelsImage(kw, heroImagePath);
    });

    const featuresImagePromise = businessFieldKeywordPromise.then(async (kw) => {
      const featureImgName = imageFileName(kw);
      const featureImgPath = path.join(__dirname, "../pexels_images", featureImgName);
      return fetchPexelsImage(kw, featureImgPath);
    });

    const galleryCoverPromise = businessFieldKeywordPromise.then(async (kw) => {
      const coverPath = path.join(
        __dirname,
        "../pexels_images",
        imageFileName(`${kw}_gallery`)
      );
      return fetchPexelsImage(`${kw}_portfolio`, coverPath);
    });

    // ---------- שלב 4: איסוף כל התוצאות במקביל ----------
    const [
      businessFieldKeyword,
      headerButtonText,
      slogan,
      navRaw,
      heroTitle,
      heroSubtitle,
      heroBulletsRaw,
      heroContent,
      secondaryBtnText,
      featuresContentRaw,
      featuresTitle,
      aboutTextRaw,
      mission,
      services,
      howStepsRaw,
      pricingRaw,
      pricingSubtitle,
      pricingDisclaimer,
      reviewsRaw,
      ratingAvg,
      ratingCount,
      statsRaw,
      trustBadgesRaw,
      faqRaw,
      contactSubtitle,
      submitText,
      successMessage,
      openingHoursRaw,
      mapQuery,
      ctasRaw,
      socialProofRaw,
      seoRaw,
      colorAndFontRaw,
      goalsRaw,
      microcopyRaw,
      heroImage,
      featuresImage,
      galleryCover,
    ] = await Promise.all([
      businessFieldKeywordPromise,
      headerButtonTextPromise,
      sloganPromise,
      navPromise,
      heroTitlePromise,
      heroSubtitlePromise,
      heroBulletsPromise,
      heroContentPromise,
      secondaryBtnPromise,
      featuresContentPromise,
      featuresTitlePromise,
      aboutTextPromise,
      missionPromise,
      servicesPromise,
      howStepsPromise,
      pricingPromise,
      pricingSubtitlePromise,
      pricingDisclaimerPromise,
      reviewsPromise,
      ratingAvgPromise,
      ratingCountPromise,
      statsPromise,
      trustBadgesPromise,
      faqPromise,
      contactSubtitlePromise,
      submitTextPromise,
      successMessagePromise,
      openingHoursPromise,
      mapQueryPromise,
      ctasPromise,
      socialProofPromise,
      seoPromise,
      colorAndFontPromise,
      goalsPromise,
      microcopyPromise,
      heroImagePromise,
      featuresImagePromise,
      galleryCoverPromise,
    ]);

    /* -------------------------------------------
       Parse + Assemble (לוגיקה ותוכן זהים להסבר המקורי)
    -------------------------------------------- */

    // HEADER
    const headerSection = {
      sectionName: "header",
      businessName: business.businessName,
      slogan,
      buttonText: headerButtonText,
      nav: extractJson<string[]>(navRaw),
      socialLinks: {
        facebook: business.socialMediaAccounts?.facebook || "",
        instagram: business.socialMediaAccounts?.instagram || "",
        tiktok: business.socialMediaAccounts?.tiktok || "",
        linkedin: business.socialMediaAccounts?.linkedin || "",
        youtube: business.socialMediaAccounts?.youtube || "",
      },
    };

    // HERO
    const heroSection = {
      sectionName: "hero",
      title: heroTitle,
      subtitle: heroSubtitle,
      content: heroContent,
      bullets: extractJson<string[]>(heroBulletsRaw),
      primaryButtonText: headerButtonText,
      secondaryButtonText: secondaryBtnText,
      image: heroImage,
    };

    // FEATURES
    const featuresSection = {
      sectionName: "features",
      title: featuresTitle,
      content: extractJson<string[]>(featuresContentRaw),
      image: featuresImage,
    };

    // ABOUT US
    const aboutUsSection = {
      sectionName: "aboutUs",
      title: "מי אנחנו",
      content: aboutTextRaw,
      mission,
    };

    // SERVICES
    const servicesSection = {
      sectionName: "services",
      title: "השירותים שלנו",
      items: services,
    };

    // HOW IT WORKS
    type StepItem = { step: number; title: string; text: string };
    const steps = requireArrayOfObjects<StepItem>(
      extractJson(howStepsRaw),
      ["step", "title", "text"],
      "howItWorks"
    );
    const howItWorksSection = {
      sectionName: "howItWorks",
      title: "איך זה עובד",
      steps,
    };

    // PRICING
    type Plan = {
      name: string;
      priceMonthly: number;
      features: string[];
      cta: string;
      highlight?: boolean;
    };
    const pricing = requireArrayOfObjects<Plan>(
      extractJson(pricingRaw),
      ["name", "priceMonthly", "features", "cta"],
      "pricing"
    );
    const pricingSection = {
      sectionName: "pricing",
      title: "חבילות ושירותים",
      subtitle: pricingSubtitle,
      plans: pricing.map((p, i) => ({ ...p, highlight: i === 1 ? true : !!p.highlight })),
      disclaimer: pricingDisclaimer,
    };

    // REVIEWS
    const reviewsArray = asStringArray(extractJson(reviewsRaw), "reviews");
    const reviewsSection = {
      sectionName: "reviews",
      title: "לקוחות מספרים",
      content: reviewsArray,
      ratingSummary: { average: ratingAvg, count: ratingCount },
    };

    // TRUST
    type Stat = { label: string; value: string };
    const stats = requireArrayOfObjects<Stat>(
      extractJson(statsRaw),
      ["label", "value"],
      "stats"
    );
    const trustSection = {
      sectionName: "trust",
      title: "למה לבחור בנו",
      stats,
      badges: extractJson<string[]>(trustBadgesRaw),
    };

    // FAQ
    type QA = { q: string; a: string };
    const faqItems = requireArrayOfObjects<QA>(
      extractJson(faqRaw),
      ["q", "a"],
      "faq"
    );
    const faqSection = {
      sectionName: "faq",
      title: "שאלות נפוצות",
      items: faqItems,
    };

    // GALLERY
    const gallerySection = {
      sectionName: "gallery",
      title: "מהעבודות שלנו",
      cover: galleryCover,
    };

    // CONTACT
    const contactUsSection = {
      sectionName: "contactUs",
      title: "צרו קשר",
      subtitle: contactSubtitle,
      fields: ["name", "phone", "email", "message"],
      submitText,
      successMessage,
      contactInfo: {
        email: userInfo.email,
        phone: business.phone || "",
        address: business.address || "",
        whatsapp: business.whatsapp || "",
      },
      openingHours: extractJson<Record<string, string>>(openingHoursRaw),
      mapQuery,
    };

    // CTA VARIANTS
    const ctaSection = {
      sectionName: "ctaVariants",
      items: extractJson<string[]>(ctasRaw),
    };

    // // SOCIAL PROOF
    // const socialProofSection = {
    //   sectionName: "socialProof",
    //   title: "בין לקוחותינו",
    //   brands: extractJson<string[]>(socialProofRaw),
    // };

    // SEO
    const seo = extractJson<{
      title: string;
      description: string;
      keywords: string[];
    }>(seoRaw);
    const seoSection = { sectionName: "seo", ...seo };

    // COLOR & FONT
    const colorAndFont = extractJson<{
      primary: string;
      secondary: string;
      tertiary: string;
      text: string;
      font: string;
      overlayAlpha: number;
      gradients: { primary?: string; secondary?: string; tertiary?: string };
    }>(colorAndFontRaw);

    // GOALS + Microcopy
    const goals = extractJson<string[]>(goalsRaw);
    const microcopy = extractJson<Record<string, string>>(microcopyRaw);

    // FOOTER
    const footerSection = {
      sectionName: "footer",
      socialMediaIcons: business.socialMediaAccounts,
      contactInfo: userInfo.email,
      copyRights: "©2025 כל הזכויות שמורות לצוות Smarketing",
      smallPrint: (
        await gen(`כתוב הודעת זכויות/פרטיות קצרה (משפט אחד), עברית בלבד.`)
      ).trim(),
    };

    const context = {
      meta: {
        brandTone,
        fieldKeyword: businessFieldKeyword,
        businessName: business.businessName,
        campaignPurpose: campaignInfo.campaginPurpose,
        targetAudience: campaignInfo.targetAudience,
        targetAge: campaignInfo.targetAge,
        targetGender: campaignInfo.targetGender,
        serviceAreas: business.serviceAreas,
      },
      headerSection,
      heroSection,
      featuresSection,
      aboutUsSection,
      servicesSection,
      howItWorksSection,
      pricingSection,
      reviewsSection,
      trustSection,
      faqSection,
      gallerySection,
      contactUsSection,
      ctaSection,
      seoSection,
      colorAndFont,
      goals,
      microcopy,
      footerSection,
    };

    res.status(200).json(context);
  } catch (error) {
    console.error("Error generating context:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/* -------------------------------------------
   Controller: Text Suggestions (unchanged logic)
-------------------------------------------- */

export const getTextSuggestions = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { text, tone, maxSentences = 3, variantCount = 3 } = req.body || {};
  try {
    const raw = await generateContent(`
שפר את הטקסט הבא כך שיהיה חד, מדויק ותואם את הטון: "${tone || "מקצועי ומזמין"}".
טקסט מקורי:
${text}

החזר JSON של בדיוק ${variantCount} וריאציות, כל וריאציה במשפטים קצרים עד ${maxSentences} משפטים.
מבנה:
[
  {"variant": 1, "text": "<הטקסט המשופר בעברית>"},
  {"variant": 2, "text": "<...>"},
  {"variant": 3, "text": "<...>"}
]
כללים:
- עברית בלבד
- ללא הסברים/כותרות נוספות
- אין אמוג'י/קישוטים
- לשמור על המסר המקורי אך לשפר ניסוח וזרימה
    `);

    const suggestion = extractJson<{ variant: number; text: string }[]>(raw, []);
    res.status(200).json({ suggestion });
  } catch (error) {
    console.error("Error generating text suggestions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
