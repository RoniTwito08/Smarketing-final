import React, {
  useState,
  useEffect,
  useRef,
  MutableRefObject,
  CSSProperties,
} from "react";
import {
  DropResult,
  DragDropContext,
  Droppable,
  Draggable,
} from "react-beautiful-dnd";
import SectionRenderer from "./sectionRendering";
import Sidebar from "../SideBar/sideBar";
import MobileView from "../SideBar/MobileView/MobileView";
import TabletView from "../SideBar/TabletView/TabletView";
import DesktopView from "../SideBar/DesktopView/DesktopView";
import styles from "./landingPageStyles.module.css";
import "./CampaignForm.css";
import { useAuth } from "../../../context/AuthContext";
import { IoRocketOutline } from "react-icons/io5";
import { MdCancel } from "react-icons/md";
import { config } from "../../../config";
// import TourPopup from "../LandingPageSections/TourPopup/TourPopup";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

interface CampaignForm {
  creatorId: string;
  campaignName: string;
  campaignContent: string;
  budget: number;
  marketingLevel: string;
  campaginPurpose: string;
  actionToCall: string;
  targetAudience: string;
  targetGender: string;
  language: string;
  targetLocation: string;
  targetAge: string;
  campaignImage: File | null;
}

interface RemovedSection {
  section: any;
  index: number;
}

interface CampaignPopupProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: CampaignForm) => void;
}

const defaultTheme = {
  primaryColor: "#ffffff",
  secondaryColor: "#ffffff",
  tertiaryColor: "#ffffff",
  textColor: "#000000",
  font: "sans-serif",
  overlayAlpha: 0.3,
  gradients: {
    primary: "none",
    secondary: "none",
    tertiary: "none",
  },
};

const initialForm: CampaignForm = {
  creatorId: "1234567890",
  campaignName: "",
  campaignContent:
    "",
  budget: 250,
  marketingLevel: "גבוהה",
  campaginPurpose: "הגברת מודעות למותג",
  actionToCall: "הירשמו עכשיו",
  targetAudience: "לקוחות חדשים ומתעניינים",
  targetGender: "שני המינים",
  language: "עברית",
  targetLocation: "ישראל",
  targetAge: "25-45",
  campaignImage: null,
};

export const CampaignPopup: React.FC<CampaignPopupProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const { user } = useAuth();
  if (!user || !user._id) {
    throw new Error("User is not authenticated or userId is missing");
  }

  const [form, setForm] = useState<CampaignForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [landingPageData, setLandingPageData] = useState<any[] | null>(null);

  const [colors, setColors] = useState(defaultTheme);
  const [userFont, setUserFont] = useState(defaultTheme.font);

  const [removedSections, setRemovedSections] = useState<RemovedSection[]>([]);
  const [responsiveView, setResponsiveView] = useState<
    "desktop" | "tablet" | "mobile" | ""
  >("");

  const landingPageRef = useRef<HTMLDivElement>(
    null
  ) as MutableRefObject<HTMLDivElement | null>;

  const [showMobilePopup, setShowMobilePopup] = useState(false);
  const [showTabletPopup, setShowTabletPopup] = useState(false);
  const [showDesktopPopup, setShowDesktopPopup] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // const [tourStep, setTourStep] = useState(0);
  // const [showTour, setShowTour] = useState(true);

  // הכנתי רפרנסים גם לסקשנים עתידיים
  const sectionRefs = {
    header: useRef<HTMLDivElement>(null),
    hero: useRef<HTMLDivElement>(null),
    features: useRef<HTMLDivElement>(null),
    services: useRef<HTMLDivElement>(null),
    howItWorks: useRef<HTMLDivElement>(null),
    pricing: useRef<HTMLDivElement>(null),
    trust: useRef<HTMLDivElement>(null),
    faq: useRef<HTMLDivElement>(null),
    socialProof: useRef<HTMLDivElement>(null),
    ctaVariants: useRef<HTMLDivElement>(null),
    gallery: useRef<HTMLDivElement>(null),
    contactUs: useRef<HTMLDivElement>(null),
    footer: useRef<HTMLDivElement>(null),
    seo: useRef<HTMLDivElement>(null),
  } as const;

  // const tourSteps = [
  //   { ref: sectionRefs.hero, title: "סקשן כותרת ראשית", description: "כאן תוכל לערוך את הכותרת הראשית והכותרת המשנית." },
  //   { ref: sectionRefs.features, title: "סקשן פיצ'רים", description: "כאן אפשר לשנות את היתרונות והשירותים שלך." },
  //   // { ref: sectionRefs.reviews, title: "סקשן ביקורות", description: "כאן תוכל לשנות ביקורות מלקוחות מרוצים." },
  //   // { ref: sectionRefs.aboutUs, title: "סקשן אודותינו", description: "כאן תוכל לשנות מידע על העסק שלך." },
  //   { ref: sectionRefs.gallery, title: "סקשן גלריה", description: "כאן תוכל להוסיף תמונות נוספות מהגלריה שלך ולשנות את מיקומן." },
  //   { ref: sectionRefs.contactUs, title: "סקשן צור קשר", description: "כאן הלקוחות יכולים להשאיר פרטים ליצירת קשר." },
  //   { ref: sectionRefs.footer, title: "סקשן תחתון", description: "מכאן הלקוחות ישלחו את הפרטים אליך." },
  // ];

  // נעילת גלילה במסך מלא
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (landingPageRef.current) {
      landingPageRef.current.style.fontFamily = userFont;
    }
  }, [userFont]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => {
      if (name === "budget") {
        const num = Number(value);
        return { ...prev, [name]: isNaN(num) ? prev.budget : num };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // מידע עסקי
      const businessInfoRes = await fetch(`${config.apiUrl}/business-info/${user._id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!businessInfoRes.ok) throw new Error("שגיאה בהבאת מידע עסקי");
      const businessData = await businessInfoRes.json();
      if (!businessData) throw new Error("שגיאה בהבאת מידע עסקי");

      // מייל משתמש
      const userRes = await fetch(`${config.apiUrl}/users/${user._id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!userRes.ok) throw new Error("שגיאה בהבאת מידע משתמש");
      const userJson = await userRes.json();
      if (!userJson?.email) throw new Error("לא נמצא אימייל משתמש");

      // בקשת יצירת הקשר לדף הנחיתה
      const response = await fetch(
        `${config.apiUrl}/landing-page-generator/generateLandingPageContext`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            campaignInfo: form,
            BusinessData: businessData,
            UserEmailData: { email: userJson.email }, // ✅ תיקון: אובייקט ולא מחרוזת
          }),
        }
      );
      if (!response.ok) throw new Error("שגיאה ביצירת דף הנחיתה");

      const data = await response.json();

      // הפיכת האובייקט למערך סקשנים—רק מה שיש לו sectionName נשמר לסדר
      const sectionsArray = Object.values(data)
        .filter((v: any) => v && typeof v === "object" && "sectionName" in v)
        .map((s: any) => ({ id: s.id ?? crypto.randomUUID(), ...s }));
      setLandingPageData(sectionsArray);

      setLandingPageData(sectionsArray);
      setSubmitted(true);

      // צבעים/פונטים מתוך colorAndFont או colorAndFontPrompt
      const palette = (data.colorAndFont || data.colorAndFontPrompt || {}) as any;
      if (palette?.primary || palette?.primaryColor) {
        const primary = (palette.primary || palette.primaryColor || defaultTheme.primaryColor).trim?.() || defaultTheme.primaryColor;
        const secondary = (palette.secondary || palette.secondaryColor || defaultTheme.secondaryColor).trim?.() || defaultTheme.secondaryColor;
        const tertiary = (palette.tertiary || palette.tertiaryColor || defaultTheme.tertiaryColor).trim?.() || defaultTheme.tertiaryColor;
        const text = (palette.text || palette.textColor || defaultTheme.textColor).trim?.() || defaultTheme.textColor;
        const font = (palette.font || defaultTheme.font).trim?.() || defaultTheme.font;
        const overlayAlpha = typeof palette.overlayAlpha === "number" ? palette.overlayAlpha : defaultTheme.overlayAlpha;
        const gradients = {
          primary: palette.gradients?.primary || "none",
          secondary: palette.gradients?.secondary || "none",
          tertiary: palette.gradients?.tertiary || "none",
        };

        setColors({
          primaryColor: primary,
          secondaryColor: secondary,
          tertiaryColor: tertiary,
          textColor: text,
          font,
          overlayAlpha,
          gradients,
        });
        setUserFont(font);
      } else {
        // ברירת מחדל
        setColors(defaultTheme);
        setUserFont(defaultTheme.font);
      }
    } catch (err: any) {
      setError(err?.message || "שגיאה בלתי צפויה");
    } finally {
      setLoading(false);
    }
  };

  // לוג דיבוג
  useEffect(() => {
    if (landingPageData) {
      console.log("Landing Page Data:", landingPageData);
    }
  }, [landingPageData]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination || !landingPageData) return;
    const newSections = Array.from(landingPageData);
    const [removed] = newSections.splice(result.source.index, 1);
    newSections.splice(result.destination.index, 0, removed);
    setLandingPageData(newSections);
  };

  const handleColorChange = (
    primaryColor: string,
    secondaryColor: string,
    tertiaryColor: string,
    textColor: string
  ) => {
    setColors((prev: any) => ({
      ...prev,
      primaryColor,
      secondaryColor,
      tertiaryColor,
      textColor,
    }));
  };

  useEffect(() => {
      const root = document.documentElement;

      root.style.setProperty("--primary-color", colors.primaryColor);
      root.style.setProperty("--secondary-color", colors.secondaryColor);
      root.style.setProperty("--tertiary-color", colors.tertiaryColor);
      root.style.setProperty("--text-color", colors.textColor);
      root.style.setProperty("--font", userFont);
      root.style.setProperty("--overlay-alpha", String(colors.overlayAlpha ?? 0.3));

      // ❌ אל תיגע כאן בגרדיאנטים יותר
      // root.style.setProperty("--primary-gradient",  ... );
      // root.style.setProperty("--secondary-gradient", ... );
      // root.style.setProperty("--tertiary-gradient",  ... );
    }, [colors, userFont]);

  const handleFontChange = (font: string) => {
    document.documentElement.style.setProperty("--font", font);
    setUserFont(font);
    setColors((prev: any) => ({ ...prev, font }));
  };

  // Drop-in replacement
// Drop-in replacement
const cleanForProduction = (root: HTMLElement) => {
  // 1) להסיר אלמנטים של עריכה/טולבר/”שלוש נקודות”
  const removeSelectors = [
    // כלים פנימיים/גנריים
    '.actionButtonsContainer',
    '.actionBar',
    '[data-resize-handle]',
    '[class*="arrowButtons"]',

    // טולבר כללי (כולל CSS-Modules)
    '[class*="toolbar"]',
    '[class*="_toolbar_"]',

    // כפתורי אייקון/עריכה/אשפה (כולל CSS-Modules)
    '[class*="iconBtn"]',
    '[class*="_iconBtn_"]',
    '[class*="editBtn"]',
    '[class*="_editBtn_"]',
    '[class*="trashBtn"]',
    '[class*="_trashBtn_"]',

    // “שלוש נקודות” ליד כפתורי CTA (כולל CSS-Modules)
    '[class*="ctaEditLink"]',
    '[class*="_ctaEditLink_"]',

    // כפתורי מחיקת CTA (כולל CSS-Modules)
    '[class*="ctaRemove"]',
    '[class*="_ctaRemove"]',
    '[class*="ctaRemoveIn"]',
    '[class*="_ctaRemoveIn_"]',

    // כפתור “X” למחיקת כרטיסים בביקורות וכו׳
    '[class*="closeCardBtn"]',
    '[class*="_closeCardBtn_"]',
  ].join(',');
  root.querySelectorAll(removeSelectors).forEach((el) => el.remove());
  root
      .querySelectorAll('section[data-gallery][data-has-images="false"]')
      .forEach((el) => el.remove());
  // 1a) ללכוד "שלוש נקודות" גם אם אין מחלקה ידועה (⋯ … ⋮ ︙ •••) – כפתורים/לינקים בלבד
  const ELLIPSIS = new Set(['⋯','…','⋮','︙','•••','...']);
  root.querySelectorAll('button, a').forEach((el) => {
    const txt = (el.textContent || '').trim();
    const t = (el.getAttribute('title') || el.getAttribute('aria-label') || '').trim();
    const isEllipsis = ELLIPSIS.has(txt) || /^[\u22EF\u2026\u22EE\uFE19.]{1,3}$/.test(txt);
    const isEditorHint = ['התאמה','עריכת קישור','הגדרת קישור','הוסף כפתור','מחק כפתור','מחק סקשן']
      .some((hint) => t.includes(hint));
    if (isEllipsis || isEditorHint) el.remove();
  });

  // 2) ניקוי אטריביוטים זמניים של דראג/עריכה/ARIA
  [
    'data-rbd-draggable-id',
    'data-rbd-draggable-context-id',
    'data-rbd-drag-handle-draggable-id',
    'data-rbd-drag-handle-context-id',
    'data-react-beautiful-dnd-draggable',
    'data-react-beautiful-dnd-droppable',
    'data-draggable',
    'draggable',
    'tabindex',
    'role',
    'aria-describedby',
    'aria-grabbed',
    'aria-dropeffect',
    'aria-expanded',
    'aria-pressed',
  ].forEach((attr) => {
    root.querySelectorAll(`[${attr}]`).forEach((el) => el.removeAttribute(attr));
  });

  // 3) ביטול contenteditable + האזהרה שלו
  root.querySelectorAll('[contenteditable]').forEach((el) => el.removeAttribute('contenteditable'));
  root.querySelectorAll('[suppresscontenteditablewarning]').forEach((el) =>
    el.removeAttribute('suppresscontenteditablewarning')
  );

  // 4) אם נשארו עטיפות טולבר ריקות – ניקוי
  root.querySelectorAll('[class*="toolbar"], [class*="_toolbar_"]').forEach((el) => {
    if (!el.children.length) el.remove();
  });
};


  const handleSaveLandingPage = async () => {
    setIsSidebarOpen(false);

    setTimeout(async () => {
      if (!landingPageRef.current) return;

      const clone = landingPageRef.current.cloneNode(true) as HTMLElement;
      cleanForProduction(clone);
      clone.querySelectorAll("[data-resize-handle]").forEach((el) => el.remove());
      const landingPageHTML = clone.innerHTML;

      const completeHTML = `
        <!DOCTYPE html>
        <html style="background-color: ${colors.primaryColor};">
          <head>
            <meta charset="UTF-8">
            <title>Landing Page</title>

            <link rel="stylesheet" href="${config.apiUrl}/dist/assets/index-CDc9PVyG.css">

         

            <style>
              :root {
                --primary-color: ${colors.primaryColor};
                --secondary-color: ${colors.secondaryColor};
                --tertiary-color: ${colors.tertiaryColor};
                --text-color: ${colors.textColor};
                --font: ${userFont};
                --primary-gradient: ${getComputedStyle(document.documentElement).getPropertyValue("--primary-gradient")};
                --secondary-gradient: ${getComputedStyle(document.documentElement).getPropertyValue("--secondary-gradient")};
                --tertiary-gradient: ${getComputedStyle(document.documentElement).getPropertyValue("--tertiary-gradient")};
                --overlay-alpha: ${getComputedStyle(document.documentElement).getPropertyValue("--overlay-alpha")};
              }
              html, body {
                height: 100%;
                margin: 0;
                padding: 0;
                background-image: var(--primary-gradient);
                background-repeat: no-repeat;
                background-size: cover;
                background-attachment: fixed;
                font-family: ${userFont} !important;
              }
            </style>
          </head>
          <body style="background-color: ${colors.primaryColor};">
            ${landingPageHTML}
            <script>
              document.addEventListener("DOMContentLoaded", function () {
                var form = document.querySelector("form");
                if (!form) return;

                var fullNameInput = form.querySelector("input[name='fullName']");
                var emailInput    = form.querySelector("input[name='email']");
                var phoneInput    = form.querySelector("input[name='phone']");
                var messageInput  = form.querySelector("textarea[name='message']");
                var userIdInput   = form.querySelector("input[name='userId']");

                // ★ אם ה-API יושב על אותו דומיין (Reverse-proxy) – השאר ריק ויהיה מסלול יחסי
                // אחרת, שים פה את ה-base המלא, למשל: "https://api.mydomain.com"
                var API_BASE = ""; 

                var statusBox = document.createElement("p");
                statusBox.style.marginTop = "10px";
                statusBox.style.color = "#444";
                form.appendChild(statusBox);

                form.addEventListener("submit", async function (e) {
                  e.preventDefault();
                  statusBox.textContent = "שולח...";

                  var payload = {
                    name:    (fullNameInput && fullNameInput.value) || "",
                    email:   (emailInput && emailInput.value) || "",
                    phone:   (phoneInput && phoneInput.value) || "",
                    message: (messageInput && messageInput.value) || "",
                    userId:  (userIdInput && userIdInput.value) || "",
                  };

                  try {
                    var res = await fetch(API_BASE + "/leads/createLead", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    });

                    if (!res.ok) {
                      var txt = "";
                      try { txt = await res.text(); } catch(e) {}
                      throw new Error("שליחה נכשלה (" + res.status + ") " + txt);
                    }

                    statusBox.textContent = "✅ הפרטים נשלחו בהצלחה!";
                    setTimeout(function() { statusBox.textContent = ""; }, 3000);
                    form.reset();
                  } catch (err) {
                    console.error("שגיאה בשליחה:", err);
                    statusBox.textContent = "❌ שגיאה בשליחת הפרטים";
                  }
                });

                // כפתור גלילה לקטע יצירת קשר
                var scrollButton  = document.getElementById("headerButtonContainer");
                var contactTarget = document.getElementById("contact-us-root") || document.querySelector(".contactUs");
                if (scrollButton && contactTarget) {
                  scrollButton.addEventListener("click", function() {
                    contactTarget.scrollIntoView({ behavior: "smooth", block: "start" });
                  });
                }
              });
            </script>
          </body>
        </html>
      `;

      try {
        const saveResponse = await fetch(`${config.apiUrl}/api/saveLandingPage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            html: completeHTML,
            userPrimaryColor: colors.primaryColor,
            userSecondaryColor: colors.secondaryColor,
            userTertiaryColor: colors.tertiaryColor,
            userTextColor: colors.textColor,
            userFont: userFont,
          }),
        });
        if (!saveResponse.ok) {
          toast.error("בעיה בשמירת דף הנחיתה!");
          return;
        }

        const savedLandingPage = await saveResponse.json();

        const campaignData = {
          ...form,
          creatorId: user._id,
          landingPage: savedLandingPage.file,
          campaignURL: `/landing-page/${savedLandingPage.file}`,
        };

        const campaignResponse = await fetch(`${config.apiUrl}/campaigns`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(campaignData),
        });
        if (!campaignResponse.ok) {
          toast.error("שגיאה בשמירת הקמפיין במסד הנתונים");
          return;
        }
        const campaignResult = await campaignResponse.json();
        console.log("Campaign created:", campaignResult);

        toast.success("קמפיין ודף נחיתה נשמרו בהצלחה!");

        setTimeout(() => {
          onSubmit?.(form);
          onClose?.();
          handleClose();
        }, 2000);
      } catch (error) {
        console.error(error);
        toast.error("שגיאה בשמירת דף הנחיתה והקמפיין");
      }
    }, 500);
  };

  const handleDelete = (index: number, section: any) => {
    setRemovedSections((prev) => [...prev, { section, index }]);
    setLandingPageData((prev) => {
      if (!prev) return [];
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleRestore = (item: RemovedSection) => {
    setLandingPageData((prev) => {
      if (!prev) return [item.section];
      const newSections = [...prev];
      newSections.splice(item.index, 0, item.section);
      return newSections;
    });
    setRemovedSections((prev) => prev.filter((rs) => rs !== item));
  };

  const handleResponsiveChange = (view: "desktop" | "tablet" | "mobile" | "") => {
    setResponsiveView(view);
  };

  const handleClose = () => {
    setForm(initialForm);
    setLandingPageData(null);
    setSubmitted(false);
    setShowMobilePopup(false);
    setShowTabletPopup(false);
    setShowDesktopPopup(false);
    setRemovedSections([]);
    setIsSidebarOpen(false);
    setResponsiveView("");
    onClose?.();
  };

  if (!open) return null;

  const containerStyle: CSSProperties = {
    "--primary-color": colors.primaryColor,
    "--secondary-color": colors.secondaryColor,
    "--tertiary-color": colors.tertiaryColor,
    "--text-color": colors.textColor,
  } as any;

  return (
    <div className="campaign-page" dir="rtl">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {submitted && landingPageData ? (
        <div className="builder-shell">
          {/* כותרת דביקה בראש המקטע */}
          <div className="page-header">
            <p className="promptText">האם אתה מעוניין לשגר את דף הנחיתה?</p>
            <div className="buttonGroup">
              <button className="cancelBtn" onClick={handleClose}>
                <MdCancel className="icon" />
                <span>ביטול</span>
              </button>
              <button className="launchBtn" onClick={handleSaveLandingPage}>
                <IoRocketOutline className="icon" />
                <span>שמור קמפיין</span>
              </button>
            </div>
          </div>

          {/* {showTour && (
            <TourPopup
              step={tourStep}
              totalSteps={tourSteps.length}
              title={tourSteps[tourStep].title}
              description={tourSteps[tourStep].description}
              targetRef={tourSteps[tourStep].ref}
              onNext={() => setTourStep((prev) => prev + 1)}
              onBack={() => setTourStep((prev) => prev - 1)}
              onSkip={() => setShowTour(false)}
            />
          )} */}

          {/* תוכן הבילדר עם גלילה פנימית */}
          <div className="builder-content">
            <div className={styles.landingPageLayout}>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="sections">
                  {(provided) => (
                    <div
                      className={`${styles.sectionsContainer} ${
                        isSidebarOpen ? styles.withSidebar : ""
                      } ${responsiveView ? styles[responsiveView] : ""}`}
                      ref={(node) => {
                        if (node) {
                          landingPageRef.current = node;
                          provided.innerRef(node);
                        }
                      }}
                      {...provided.droppableProps}
                      style={containerStyle}
                    >
                      {landingPageData.map((section: any, index: number) => (
                        <Draggable
                          key={section.id || `${section.sectionName}-${index}`}
                          draggableId={section.id || `${section.sectionName}-${index}`}
                          index={index}
                          isDragDisabled={["header", "hero", "footer"].includes(
                            section.sectionName || ""
                          )}
                        >
                          {(providedDraggable) => (
                            <div
                              ref={providedDraggable.innerRef}
                              {...providedDraggable.draggableProps}
                              {...providedDraggable.dragHandleProps}
                            >
                              <SectionRenderer
                                section={section}
                                onDeleteSection={() => handleDelete(index, section)}
                                refMap={sectionRefs as any}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              <Sidebar
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                onOk={handleSaveLandingPage}
                onColorChange={handleColorChange}
                onFontChange={handleFontChange}
                removedSections={removedSections}
                onRestore={handleRestore}
                onResponsiveChange={handleResponsiveChange}
                setShowMobilePopup={setShowMobilePopup}
                setShowTabletPopup={setShowTabletPopup}
                setShowDesktopPopup={setShowDesktopPopup}
              />

              {responsiveView === "mobile" && showMobilePopup && (
                <MobileView onClose={() => setShowMobilePopup(false)}>
                  <div className={styles.sectionsContainer}>
                    {landingPageData.map((section: any, index: number) => (
                      <SectionRenderer key={index} section={section} />
                    ))}
                  </div>
                </MobileView>
              )}

              {responsiveView === "tablet" && showTabletPopup && (
                <TabletView onClose={() => setShowTabletPopup(false)}>
                  <div className={styles.sectionsContainer}>
                    {landingPageData.map((section: any, index: number) => (
                      <SectionRenderer key={index} section={section} />
                    ))}
                  </div>
                </TabletView>
              )}

              {responsiveView === "desktop" && showDesktopPopup && (
                <DesktopView onClose={() => setShowDesktopPopup(false)}>
                  <div className={styles.sectionsContainer}>
                    {landingPageData.map((section: any, index: number) => (
                      <SectionRenderer key={index} section={section} />
                    ))}
                  </div>
                </DesktopView>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="form-shell">
          <div className="form-hero">
            <h2 className="form-hero__title">צור קמפיין חדש</h2>
            <p className="form-hero__subtitle">
              בחר פרטים, הגדר מטרות ושגר דף נחיתה מעוצב בלחיצה אחת.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="form-card" noValidate>
            <div className="form-grid">
              {/* שם הקמפיין */}
              <div className="field">
                <input
                  id="campaignName"
                  name="campaignName"
                  placeholder="שם הקמפיין"
                  value={form.campaignName}
                  onChange={handleChange}
                  className="control"
                  type="text"
                  autoComplete="off"
                />
                <label htmlFor="campaignName" className="fl-label">
                  שם הקמפיין
                </label>
              </div>

              {/* קריאה לפעולה */}
              <div className="field">
                <input
                  id="actionToCall"
                  name="actionToCall"
                  placeholder="קריאה לפעולה"
                  value={form.actionToCall}
                  onChange={handleChange}
                  className="control"
                  type="text"
                  autoComplete="off"
                />
                <label htmlFor="actionToCall" className="fl-label">
                  קריאה לפעולה
                </label>
              </div>

              {/* מיקום יעד */}
              <div className="field">
                <input
                  id="targetLocation"
                  name="targetLocation"
                  placeholder="מיקום יעד"
                  value={form.targetLocation}
                  onChange={handleChange}
                  className="control"
                  type="text"
                  autoComplete="off"
                />
                <label htmlFor="targetLocation" className="fl-label">
                  מיקום יעד
                </label>
              </div>

              {/* גיל יעד */}
              <div className="field">
                <input
                  id="targetAge"
                  name="targetAge"
                  placeholder="למשל 25-45"
                  value={form.targetAge}
                  onChange={handleChange}
                  className="control"
                  type="text"
                  autoComplete="off"
                />
                <label htmlFor="targetAge" className="fl-label">
                  גיל יעד
                </label>
              </div>

              {/* רמת שיווק */}
              <div className="field select-field">
                <select
                  id="marketingLevel"
                  name="marketingLevel"
                  value={form.marketingLevel}
                  onChange={handleChange}
                  className="control"
                >
                  <option value="">בחר רמה</option>
                  <option value="נמוכה">נמוכה</option>
                  <option value="בינונית">בינונית</option>
                  <option value="גבוהה">גבוהה</option>
                </select>
                <label htmlFor="marketingLevel" className="fl-label">
                  רמת שיווק
                </label>
              </div>

              {/* מטרת הקמפיין */}
              <div className="field select-field">
                <select
                  id="campaginPurpose"
                  name="campaginPurpose"
                  value={form.campaginPurpose}
                  onChange={handleChange}
                  className="control"
                >
                  <option value="">בחר מטרה</option>
                  <option value="הגברת מודעות למותג">הגברת מודעות למותג</option>
                  <option value="השגת לידים">השגת לידים</option>
                  <option value="קידום מכירות">קידום מכירות</option>
                </select>
                <label htmlFor="campaginPurpose" className="fl-label">
                  מטרת הקמפיין
                </label>
              </div>

              {/* קהל יעד */}
              <div className="field select-field">
                <select
                  id="targetAudience"
                  name="targetAudience"
                  value={form.targetAudience}
                  onChange={handleChange}
                  className="control"
                >
                  <option selected value="לקוחות חדשים">לקוחות חדשים</option>
                  <option value="לקוחות קיימים">לקוחות קיימים</option>
                  <option value="עסקים">עסקים</option>
                </select>
                <label htmlFor="targetAudience" className="fl-label">
                  קהל יעד
                </label>
              </div>

              {/* מין קהל יעד */}
              <div className="field select-field">
                <select
                  id="targetGender"
                  name="targetGender"
                  value={form.targetGender}
                  onChange={handleChange}
                  className="control"
                >
                  <option value="">בחר מין</option>
                  <option value="גברים">גברים</option>
                  <option value="נשים">נשים</option>
                  <option value="שני המינים">שני המינים</option>
                </select>
                <label htmlFor="targetGender" className="fl-label">
                  מין קהל היעד
                </label>
              </div>

              {/* שפה */}
              <div className="field select-field">
                <select
                  id="language"
                  name="language"
                  value={form.language}
                  onChange={handleChange}
                  className="control"
                >
                  <option value="">בחר שפה</option>
                  <option value="עברית">עברית</option>
                  <option value="אנגלית">אנגלית</option>
                  <option value="ערבית">ערבית</option>
                </select>
                <label htmlFor="language" className="fl-label">
                  שפה
                </label>
              </div>

              {/* תקציב (Range) */}
              <div className="field range-field">
                <label htmlFor="budget" className="range-label">
                  תקציב שיווק יומי: <b>{Math.round(form.budget)} ₪</b>
                </label>
                <input
                  id="budget"
                  type="range"
                  name="budget"
                  min="1"
                  max="1000"
                  step="10"
                  value={Math.round(form.budget) || 250} 
                  onChange={handleChange}
                  className="range-control"
                />
                <div className="range-scale" aria-hidden="true">
                  <span>1</span><span>250</span><span>500</span><span>750</span><span>1000</span>
                </div>
              </div>

              {/* תיאור הקמפיין */}
              <div className="field field--textarea">
                <textarea
                  id="campaignContent"
                  name="campaignContent"
                  placeholder="תיאור קצר על הקמפיין, מבצעים, USP וכד׳…"
                  value={form.campaignContent}
                  onChange={handleChange}
                  className="control"
                  rows={5}
                />
                <label htmlFor="campaignContent" className="fl-label">
                  תיאור הקמפיין
                </label>
              </div>
            </div>

            <div className="page-actions">
              <button className="cancel-btn" type="button" onClick={handleClose}>
                ❌ ביטול
              </button>

              <button className="submit-btn btn-gradient" type="submit" disabled={loading}>
                {loading ? (
                  <div className="btn-loader-wrapper">
                    <span className="loader loader-in-btn" />
                    טוען...
                  </div>
                ) : (
                  <>🚀 צור קמפיין</>
                )}
              </button>
            </div>

            {error && <p className="text-red-500">❌ {error}</p>}
          </form>
        </div>
      )}
    </div>
  );
};

export default CampaignPopup;
