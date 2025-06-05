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
      content:
        await generateContent(`כתוב מערך JSON של 4 יתרונות בולטים של העסק "${business.businessName}".
                כל יתרון יתחיל ב־✔️, יהיה שיווקי, קצר (עד 6 מילים), ולא מועתק מהקלט.
                פורמט:
                [
                "✔️ שירות אישי ומהיר",
                "✔️ מחירים תחרותיים"
                ]
                עברית בלבד.`),
      image: await fetchPexelsImage(
        businessFieldKeyword,
        imageFeatureGeneratePath
      ),
    };

    const reviewsSection = {
      sectionName: "reviews",
      content: await generateContent(`
                כתוב 4 חוות דעת קצרות ואותנטיות על העסק "${business.businessName}". 
                כל חוות דעת תהיה בדיוק שני משפטים קצרים, בעברית בלבד, בזמן הווה, ללא שמות פרטיים וללא סימני פיסוק מיותרים.

                החזר תשובה בפורמט הבא – מערך טקסטים בפורמט JSON תקני:
                [
                "אני מרגיש שיפור אמיתי בכושר שלי האימונים מותאמים לי אישית",
                "המאמנים מקצועיים ומעודדים כל אימון עובר בצורה מעולה",
                "ההאווירה נעימה אני מרגיש חלק מקבוצה תומכת",
                "השירות מצוין אני ממליץ על שמשון אימונים אישיים לכל אחד"
                ]

                אל תוסיף טקסט לפני או אחרי, רק את המערך כמו בדוגמה למעלה.
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
      primaryColor: await generateContent(`
            בחר צבע ראשי אחד בלבד בפורמט hex (למשל #AABBCC) עבור עסק בשם "${business.businessName}" בתחום "${fieldToTranslate}". 
            הצבע חייב להיות:
            - בהיר, מודרני ונעים לעין
            - מתאים למיתוג דיגיטלי
            - שונה בכל פעם
            - **לא** צהוב, כתום, אדום, שחור, לבן או אפור

            התוצאה צריכה להיות רק קוד צבע תקני (hex), ללא תיאור נוסף.
            `),

      secondaryColor: await generateContent(`
            בהתחשב בצבע הראשי שנבחר לעסק "${business.businessName}", בחר צבע משלים שמתאים בהרמוניה אליו אך שונה ממנו בצורה עדינה.
            הצבע צריך להיות מודרני, אסתטי, ולא צהוב, כתום, שחור, לבן או אפור.
            החזר קוד hex בלבד. בלי טקסט נוסף. כל פעם צבע שונה.
            `),

      tertiaryColor: await generateContent(`
            בחר צבע שלישי שישלים את הצבע הראשי והצבע המשלים שכבר נבחרו לעסק "${business.businessName}".
            הצבע צריך להיות שונה מהשניים הקודמים אך בהרמוניה איתם. אל תשתמש בשחור, לבן, אפור, צהוב או כתום.
            חפש צבע שמתאים לעולם הדיגיטל והמובייל. החזר hex בלבד.
            `),

      textColor: await generateContent(`
            בחר צבע טקסט ברור ונעים לעין שמתאים על רקע הצבע הראשי של העסק "${business.businessName}". הקפד שהצבע יהיה קריא ונוח לגולשים.
            החזר hex בלבד. בלי טקסט נוסף.
            `),

      font: await generateContent(`
            בחר שם פונט אחד בלבד שמתאים לעסק "${business.businessName}" במראה מודרני ונקי. 
            הפונט צריך להיות זמין ב-Google Fonts. דוגמה: "Rubik", "Inter", "Assistant", "Open Sans".
            החזר רק את שם הפונט ללא טקסט נוסף.
            `),
    };

    const context = {
      headerSection,
      heroSection,
      featuresSection,
      reviewsSection,
      aboutUsSection,
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
