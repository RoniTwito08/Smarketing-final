// controllers/aiController.ts
// Node 18+ (יש fetch גלובלי). אם אין — התקן node-fetch.
// שמור את הקובץ הזה כמו שהוא והחלף את הישן.

type FormValues = {
  businessName?: string;
  businessType?: string; // "פיזי" | "דיגיטלי"
  businessAddress?: string;
  businessField?: string; // כולל טקסט חופשי
  customBusinessField?: string;
  businessFieldDetails?: string;
  serviceAreas?: string;
  serviceDescription?: string;
  uniqueService?: string;
  specialPackages?: string;
  incentives?: string;
  designPreferences?: string;
  socialLinks?: Record<string, string>;
  objective?: "brandAwareness" | "reach" | "siteVisit" | "engagement" | "videoViews" | "sales";
  phonePrefix?: string;
  phoneNumberBody?: string;
};

type GeminiPlan = {
  question: string;
  updates?: Partial<FormValues>;
  done?: boolean;
};

const DEFAULT_ALLOWED_KEYS: (keyof Partial<FormValues>)[] = [
  "businessName",
  "businessType",
  "businessAddress",
  "businessField",
  "customBusinessField",
  "businessFieldDetails",
  "serviceAreas",
  "serviceDescription",
  "uniqueService",
  "specialPackages",
  "incentives",
  "designPreferences",
  "socialLinks",
  "objective",
  "phonePrefix",
  "phoneNumberBody",
];

function clean(s: string) {
  return (s || "").trim();
}

function normalizeHebrew(s: string) {
  const t = clean(s).toLowerCase();
  return t
    .replace(/\s+/g, " ")
    .replace(/[\"׳״']/g, "")
    .replace(/[.,;!?…]$/g, "");
}

function isPhysicalBusiness(text: string) {
  const t = normalizeHebrew(text);
  return /(פיז|חנות|מרפאה|משרד|סטודיו|קליניקה)/.test(t);
}

function isDigitalBusiness(text: string) {
  const t = normalizeHebrew(text);
  return /(דיגיטל|אונליין|אתר|אפי?ליקציה|אי-?קומרס)/.test(t);
}

function extractAddressCandidate(text: string) {
  const t = clean(text);
  // אם יש לפחות 2 תווים + רווח -> יתכן כתובת
  return t.length >= 4 ? t : "";
}

function extractFirstJson<T>(txt: string): T | null {
  if (!txt) return null;
  const cleaned = txt.replace(/```json|```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(cleaned.slice(start, end + 1)) as T;
  } catch {
    return null;
  }
}

function fallbackPlanner(
  qa: { questions: string[]; answers: string[] },
  current: Partial<FormValues>,
  lastAnswer: string
): GeminiPlan {
  const lastQ = qa.questions.at(-1) || "";
  const updates: Partial<FormValues> = {};
  const la = clean(lastAnswer);

  // 1) פתיחה
  if (qa.questions.length === 0) {
    return { question: "מה שם העסק שלך?", done: false };
  }

  // 2) businessName
  if (!current.businessName && /שם העסק/.test(lastQ)) {
    if (la) updates.businessName = la;
    return { question: "העסק שלך הוא פיזי או דיגיטלי?", updates, done: false };
  }

  // 3) businessType
  if (!current.businessType && (/פיזי|דיגיטלי/.test(lastQ) || /הוא פיזי או דיגיטלי/.test(lastQ))) {
    if (isPhysicalBusiness(la)) updates.businessType = "פיזי";
    else if (isDigitalBusiness(la)) updates.businessType = "דיגיטלי";
    return {
      question:
        (updates.businessType || current.businessType) === "פיזי"
          ? "מה כתובת העסק (רחוב/עיר)?"
          : "מה תחום הפעילות של העסק? (למשל: קוסמטיקאית, עו\"ד, בניית אתרים וכד׳)",
      updates: Object.keys(updates).length ? updates : undefined,
      done: false,
    };
  }

  // 4) כתובת אם העסק פיזי
  if ((current.businessType === "פיזי") && !current.businessAddress && /כתובת/.test(lastQ)) {
    const addr = extractAddressCandidate(la);
    if (addr) updates.businessAddress = addr;
    return {
      question: "מה תחום הפעילות של העסק? (למשל: קוסמטיקאית, עו\"ד, בניית אתרים וכד׳)",
      updates: Object.keys(updates).length ? updates : undefined,
      done: false,
    };
  }

  // 5) תחום הפעילות — קולט כל טקסט שאינו "אחר"
  if (!current.businessField && /מה תחום הפעילות/.test(lastQ)) {
    const n = normalizeHebrew(la);
    if (n && n !== "אחר") {
      updates.businessField = la;
      return {
        question: "תאר/י בקצרה את השירות המרכזי שאת/ה מספק/ת.",
        updates,
        done: false,
      };
    }
    // רק אם המשתמש כתב מפורשות "אחר" נבקש פירוט
    return { question: "אם בחרת 'אחר' – ציין/י את התחום במילים שלך:", done: false };
  }

  // 6) פירוט 'אחר'
  if (current.businessField === "אחר" && !current.customBusinessField && /ציין.? את התחום/.test(lastQ)) {
    if (la) updates.customBusinessField = la;
    return { question: "תאר/י בקצרה את השירות המרכזי שאת/ה מספק/ת.", updates, done: false };
  }

  // 7) תיאור השירות
  if (!current.serviceDescription && /השירות המרכזי/.test(lastQ)) {
    if (la) updates.serviceDescription = la;
    return { question: "באילו אזורים/מדינות את/ה מציע/ה את השירותים? (serviceAreas)", updates, done: false };
  }

  // 8) אזורי שירות
  if (!current.serviceAreas && /אזורי.?שירות|מדינות/.test(lastQ)) {
    if (la) updates.serviceAreas = la;
    return { question: "האם יש שירות חדש או ייחודי שאת/ה משיק/ה כרגע?", updates, done: false };
  }

  // 9) ייחודיות
  if (!current.uniqueService && /ייחודי/.test(lastQ)) {
    if (la) updates.uniqueService = la;
    return { question: "האם יש חבילות שירות מיוחדות שאת/ה מציע/ה?", updates, done: false };
  }

  // 10) חבילות
  if (!current.specialPackages && /חבילות/.test(lastQ)) {
    if (la) updates.specialPackages = la;
    return { question: "האם יש תמריצים ללקוחות חדשים? (חודש ראשון חינם/קופון/מתנה)", updates, done: false };
  }

  // 11) תמריצים
  if (!current.incentives && /תמריצים/.test(lastQ)) {
    if (la) updates.incentives = la;
    return { question: "מה המטרה העסקית המרכזית? (brandAwareness/reach/siteVisit/engagement/videoViews/sales)", updates, done: false };
  }

  // 12) מטרה עסקית
  if (!current.objective && /המטרה העסקית/.test(lastQ)) {
    return { question: "יש עוד משהו חשוב שתרצה/י להוסיף? אם לא — כתוב/י 'סיום' ונשמור.", done: false };
  }

  return { question: "נראה שאספנו את המידע הדרוש. כתוב/י 'סיום' ונשמור.", done: false };
}

export async function postNextQuestion(req: any, res: any) {
  try {
    const {
      qa = { questions: [], answers: [] },
      current = {},
      lastAnswer = "",
      allowedKeys = DEFAULT_ALLOWED_KEYS,
      maxQuestions = 10,
    }: {
      qa: { questions: string[]; answers: string[] };
      current: Partial<FormValues>;
      lastAnswer: string;
      allowedKeys?: (keyof Partial<FormValues>)[];
      maxQuestions?: number;
    } = req.body || {};

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const reachedLimit = (qa?.questions?.length || 0) >= maxQuestions;

    if (reachedLimit) {
      return res.json({ question: "הגענו למכסת השאלות. כתוב/י 'סיום' ונשמור.", done: true });
    }

    if (!GEMINI_API_KEY) {
      const plan = fallbackPlanner(qa, current, lastAnswer);
      return res.json(plan);
    }

    const prompt = `
אתה מראיין שמאפיין עסק. נתונים:
- qa: היסטוריית שאלות ותשובות מסונכרנת (qa.questions[i] -> qa.answers[i]).
- lastAnswer: תשובת המשתמש האחרונה.
- current: Partial<FormValues> — מותר רק למלא שדות קיימים, לא לשנות מבנה.
- allowedKeys: רק מפתחות אלו מותר להחזיר ב-updates.
מטרה: לשאול עד ${maxQuestions} שאלות ענייניות כדי למלא את FormValues.

כללים חשובים (אל תפר אותם):
1) אם נשאלה השאלה "מה תחום הפעילות של העסק?" והמשתמש ענה בטקסט שאינו "אחר" — **עדכן businessField לערך הטקסט הזה** ואל תשאל "אם בחרת 'אחר'".
2) תשאל "אם בחרת 'אחר'..." **רק אם** businessField === "אחר" בפועל.
3) אם businessType נקלט כ"פיזי", בקש כתובת; אם "דיגיטלי" דלג על כתובת.
4) אל תחזור על אותן שאלות.
5) אם ניתן להסיק ערכים לשדות מהתשובה — החזר אותם תחת updates, אך רק ממפתחות allowedKeys.
6) הפלט חייב להיות JSON תקין בלבד, ללא טקסט נוסף.

מבנה הפלט:
{
  "question": "שאלה הבאה בעברית",
  "updates": { /* אופציונלי: מפתחות מתוך allowedKeys */ },
  "done": false
}

== INPUT ==
qa = ${JSON.stringify(qa, null, 2)}
lastAnswer = ${JSON.stringify(lastAnswer)}
current = ${JSON.stringify(current || {}, null, 2)}
allowedKeys = ${JSON.stringify(allowedKeys)}
`;

    const geminiRes = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3, topP: 0.9, topK: 40 },
        }),
      }
    );

    const data = await geminiRes.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data ??
      "";

    let plan = extractFirstJson<GeminiPlan>(text) || null;

    // סינון updates למפתחות מותרים בלבד
    if (plan?.updates && typeof plan.updates === "object") {
      const filtered: Partial<FormValues> = {};
      for (const k of Object.keys(plan.updates) as (keyof Partial<FormValues>)[]) {
        if (allowedKeys.includes(k)) {
          if (k === "socialLinks" && typeof plan.updates[k] === "object" && plan.updates[k] !== null) {
            filtered.socialLinks = { ...(plan.updates.socialLinks || {}) };
          } else {
            (filtered as any)[k] = plan.updates[k];
          }
        }
      }
      plan.updates = filtered;
    }

    // אם ג'מיני לא נתן משהו סביר — fallback חכם
    if (!plan || !plan.question) {
      plan = fallbackPlanner(qa, current, lastAnswer);
    }

    return res.json(plan);
  } catch (err) {
    console.error("postNextQuestion error:", err);
    const plan = fallbackPlanner(
      (req.body?.qa || { questions: [], answers: [] }),
      (req.body?.current || {}),
      (req.body?.lastAnswer || "")
    );
    return res.json(plan);
  }
}
