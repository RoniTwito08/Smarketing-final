import { Request, Response } from "express";
import {
  generateContent,
  fetchPexelsImage,
} from "../services/landing_page_generator/textAndImage_generator";
import {
  BusinessData,
  CampaignInfo,
  UserEmailData,
} from "../services/landing_page_generator/businessInfoTypes_LP";
import path from "path";

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

    const businessFieldKeyword =
      await generateContent(`תרגם את התחום הבא למילת מפתח מדויקת אחת באנגלית שמתארת אותו בצורה פשוטה לחיפוש תמונה.
            לדוגמה: "בתי קפה" → "coffee"
            החזר רק מילה אחת ללא טקסט נוסף:
            ${fieldToTranslate}`);

    const nameOfMainPicture = `${
      Date.now() + businessFieldKeyword.replace(/\s+/g, "_")
    }.jpg`;
    const imageFeatureGeneratePath = path.join(
      __dirname,
      "../pexels_images",
      nameOfMainPicture
    );

    const headerSection = {
      sectionName: "header",
      businessName: business.businessName,
      buttonText:
        await generateContent(`כתוב קריאה לפעולה ממוקדת ומושכת (3 מילים לכל היותר) עבור קמפיין שמטרתו: "${campaignInfo.campaginPurpose}".
                לדוגמה: "צרו קשר", "התחילו עכשיו".
                החזר רק טקסט בעברית, בלי הסברים.`),
    };

    const heroSection = {
      sectionName: "hero",
      title:
        await generateContent(`כתוב כותרת שיווקית חזקה וברורה לעסק בשם "${business.businessName}" בתחום "${fieldToTranslate}".
                שמור על משפט אחד בלבד בעברית. ללא סימני פיסוק מיותרים.`),
      content:
        await generateContent(`כתוב פסקה קצרה וממוקדת על העסק "${business.businessName}".
                כלול:
                - סוג עסק: ${business.businessType}
                - פירוט התחום: ${business.businessFieldDetails}
                - אזורי שירות: ${business.serviceAreas}
                - שירותים: ${business.serviceDescription}
                - קהל יעד: ${campaignInfo.targetAudience}, גיל: ${campaignInfo.targetAge}, מין: ${campaignInfo.targetGender}
                שלוש שורות לכל היותר. בעברית בלבד.`),
      buttonText: headerSection.buttonText,
    };

    const featuresSection = {
      sectionName: "features",

      content: await generateContent(`
        החזר מערך JSON שמכיל **בדיוק** 4 מחרוזות, כל אחת מתארת יתרון שיווקי של
        העסק "${business.businessName}" (עד 6 מילים). 

        דרישות:
        • אל תתחיל את המשפט ב-✔️, אל תוסיף תווי קישוט.  
        • עברית בלבד, ללא תעתיק אנגלי.  
        • אין להעתיק משפטים מהקלט.  
        • החזר אך ורק את המערך, למשל:
          [
            "שירות אישי ומהיר",
            "מחירים תחרותיים",
            "ניסיון של 10 שנים",
            "תמיכה 24/7"
          ]
      `),

      image: await fetchPexelsImage(
        businessFieldKeyword,
        imageFeatureGeneratePath
      ),
    };


    const reviewsSection = {
        sectionName: "reviews",
        content: await generateContent(`
      כתוב 4 חוות דעת אותנטיות ומפורטות על העסק "${business.businessName}" בשפה העברית.

      • כל חוות דעת תהיה באורך של 2–3 משפטים קצרים אך בעלי תוכן ממשי, בגובה העיניים, לא כלליים מדי.
      • כתוב בזמן הווה, בצורה אנושית, כאילו מדובר בלקוח אמיתי שמספר על החוויה שלו.
      • אל תכלול שמות פרטיים, תארים או סימני פיסוק עודפים.
      • החוות דעת יכולות לכלול רגשות, התרשמות מהשירות, מהמקצועיות, מהאווירה או מהתוצאה.
      • הימנע מתיאורים גנריים מדי ("מצוין", "נהדר") ונסה לנסח תיאורים בעלי ערך אמיתי ומשכנע.

      החזר תשובה **בדיוק** בפורמט הבא — מערך מחרוזות בפורמט JSON תקני, ללא טקסט לפני או אחרי:
      [
        "הגעתי במקרה ועכשיו אני מרגיש הרבה יותר אנרגטי האימונים עוזרים לי לשמור על שגרה בריאה בלי מאמץ מיותר",
        "מהרגע הראשון קיבלתי יחס אישי ומכבד האווירה נעימה והתוצאות לא איחרו לבוא",
        "השירות מדויק המדריכים סבלניים ויש תחושת קהילה אמיתית בכל מפגש",
        "לא ציפיתי להרגיש כל כך בנוח אבל מהר מאוד הרגשתי חלק מהמקום אני ממשיך להגיע כל שבוע בהנאה"
      ]
        `),
      };

    const aboutUsSection = {
      sectionName: "aboutUs",
      content:
        await generateContent(`כתוב פסקת "אודות" מקצועית ב־5 שורות עבור העסק "${business.businessName}".
                כלול:
                - מה מייחד את השירות: ${business.uniqueService}
                - גיל קהל יעד: ${campaignInfo.targetAge}
                - סגנון עיצוב או טון מותג: ${business.designPreferences}
                הימנע מנקודות בסוף שורות. בעברית בלבד.`),
    };

    const gallerySection = { sectionName: "gallery" };
    const contactUsSection = { sectionName: "contactUs" };

    const footerSection = {
      sectionName: "footer",
      socialMediaIcons: business.socialMediaAccounts,
      contactInfo: userInfo.email,
      copyRights: "©2025 כל הזכויות שמורות לצוות Smarketing",
    };

    const colorAndFontPrompt = {
  /* ───────── 1. PRIMARY COLOR ───────── */
  primaryColor: await generateContent(`
    Choose ONE primary background color for a landing-page of the company
    “${business.businessName}”, operating in the field “${fieldToTranslate}”.

    Requirements:
    • Return a single valid HEX code (e.g. #AABBCC).
    • The hue must be light-to-mid, modern, pleasant to the eye.
    • Do NOT use yellow, orange, red, black, white, or pure gray.
    • Output NOTHING except the HEX code.
  `),

  /* ───────── 2. SECONDARY COLOR (CTA / HEADINGS) ───────── */
  secondaryColor: await generateContent(`
    Pick ONE complementary accent color for CTA buttons / headings
    that works harmoniously with the primary color ${"${primaryColor}"}.

    Rules:
    • Must be clearly different from ${"${primaryColor}"} (hue shift ≥ 15°).
    • Modern and aesthetic; NOT yellow, orange, black, white, or pure gray.
    • Output ONLY a valid HEX code (no text, no prefix).
  `),

  /* ───────── 3. TERTIARY COLOR (ICONS / HOVER) ───────── */
  tertiaryColor: await generateContent(`
    Choose ONE tertiary color that completes the palette of
    1) ${"${primaryColor}"} and 2) ${"${secondaryColor}"}.

    Rules:
    • Distinct from both previous colors (hue shift ≥ 15° from each).
    • Avoid black, white, gray, yellow, orange.
    • Output ONLY a single HEX code.
  `),

  /* ───────── 4. TEXT COLOR ───────── */
  textColor: await generateContent(`
    Select ONE body-text color that is easily readable on
    the primary background ${"${primaryColor}"}.

    Requirements:
    • Must meet WCAG contrast ratio ≥ 4.5:1 against ${"${primaryColor}"}.
    • Must differ significantly: hue shift ≥ 30° OR value/brightness shift ≥ 40%.
    • Output ONLY one HEX code.
  `),

  /* ───────── 5. FONT ───────── */
  font: await generateContent(`
    Provide ONE Google-Fonts family name (e.g. "Inter", "Rubik")
    that gives a modern, clean, mobile-friendly look for the company
    “${business.businessName}”.

    Return ONLY the font name and nothing else.
  `),
};

    const context = {
      headerSection,
      heroSection,
      aboutUsSection,
      reviewsSection,
      featuresSection,
      
      gallerySection,
      contactUsSection,
      footerSection,
      colorAndFontPrompt,
    };

    res.status(200).json(context);
  } catch (error) {
    console.error("Error generating context:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTextSuggestions = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { text, tone } = req.body;
  try {
    const prompt = `שפר את הטקסט הבא כך שיהיה חד, מדויק ותואם את הטון המבוקש: "${tone}".
            הטקסט:
            ${text}
            הנחיות:
            - כתוב בעברית בלבד
            - אל תחרוג מ־3 משפטים
            - אל תוסיף הסברים או הקדמות
            החזר רק את הנוסח המשופר:`;
    const suggestion = await generateContent(prompt);
    res.status(200).json({ suggestion });
  } catch (error) {
    console.error("Error generating text suggestions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
