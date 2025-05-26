import React, { useState, useEffect, useRef, MutableRefObject, CSSProperties } from "react";
import { DropResult, DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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
import TourPopup from "../LandingPageSections/TourPopup/TourPopup";

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
};

const CampaignPopup: React.FC<CampaignPopupProps> = ({ open, onClose , onSubmit }) => {
  const { user } = useAuth();
  if (!user || !user._id) {
    throw new Error("User is not authenticated or userId is missing");
  }

  const [form, setForm] = useState<CampaignForm>({
    creatorId: "1234567890",
    campaignName: "קמפיין אביב 2025",
    campaignContent: "קמפיין מיוחד לעונת האביב עם הנחות בלעדיות למוצרים נבחרים!",
    budget: 100,
    marketingLevel: "גבוה",
    campaginPurpose: "הגברת מודעות למותג",
    actionToCall: "הצטרפו עכשיו",
    targetAudience: "לקוחות חדשים ומתעניינים",
    targetGender: "שני המינים",
    language: "עברית",
    targetLocation: "ישראל",
    targetAge: "25-45",
    campaignImage: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [landingPageData, setLandingPageData] = useState<any[]|null>(null);
  const [colors, setColors] = useState(defaultTheme);
  const [userFont, setUserFont] = useState(defaultTheme.font);
  const [removedSections, setRemovedSections] = useState<RemovedSection[]>([]);
  const [responsiveView, setResponsiveView] = useState<"desktop" | "tablet" | "mobile" | "">("");
  const landingPageRef = useRef<HTMLDivElement>(null) as MutableRefObject<HTMLDivElement | null>;
  const [showMobilePopup, setShowMobilePopup] = useState(false);
  const [showTabletPopup, setShowTabletPopup] = useState(false);
  const [showDesktopPopup, setShowDesktopPopup] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [showTour, setShowTour] = useState(true);

 const sectionRefs = {
  hero: useRef<HTMLDivElement>(null),
  features: useRef<HTMLDivElement>(null),
  reviews: useRef<HTMLDivElement>(null),
  aboutUs: useRef<HTMLDivElement>(null),
  footer: useRef<HTMLDivElement>(null),
  header: useRef<HTMLDivElement>(null),
  contactUs: useRef<HTMLDivElement>(null),
  gallery: useRef<HTMLDivElement>(null),
};
const tourSteps = [
  {
    ref: sectionRefs.hero,
    title: "סקשן כותרת ראשית",
    description: "כאן תוכל לערוך את הכותרת הראשית והכותרת המשנית.",
  },
  {
    ref: sectionRefs.features,
    title: "סקשן פיצ'רים",
    description: "כאן אפשר לשנות את היתרונות והשירותים שלך.",
  },
  {
    ref: sectionRefs.reviews,
    title: "סקשן ביקורות",
    description: "כאן תוכל לשנות ביקורות מלקוחות מרוצים.",
  },
  {
    ref: sectionRefs.aboutUs,
    title: "סקשן אודותינו",
    description: "כאן תוכל לשנות מידע על העסק שלך.",
  },
  {
    ref: sectionRefs.gallery,
    title: "סקשן גלריה",
    description: "כאן תוכל להוסיף תמונות נוספות מהגלריה שלך ולשנות את מיקומם",
  },
  {
    ref: sectionRefs.contactUs,
    title: "סקשן צור קשר",
    description: "כאן הלקוחות יכולים להשאיר פרטים ליצירת קשר.",
  },
  
  {
    ref: sectionRefs.footer,
    title: "סקשן תחתון",
    description: "מכאן הלקחות ישלחו את הפרטים אליך",
  },
];
 
  useEffect(() => {
    if (landingPageRef.current) {
      landingPageRef.current.style.fontFamily = userFont;
    }
  }, [userFont]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const businessInfo = await fetch(`${config.apiUrl}/business-info/${user._id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!businessInfo.ok) {
      setError("שגיאה בהבאת מידע עסקי");
      return;
    }
    const BusinessData = await businessInfo.json();
    if (!BusinessData) {
      setError("שגיאה בהבאת מידע עסקי");
      return;
    }
    console.log("Business Data:", BusinessData);
    const userEmail = await fetch(`${config.apiUrl}/users/${user._id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!userEmail.ok) {
      setError("שגיאה בהבאת מידע עסקי");
      return;
    }
    const userEmailData = await userEmail.json();
    if (!userEmailData) {
      setError("שגיאה בהבאת מידע עסקי");
      return;
    }
    document.body.style.overflow = "auto";
    console.log("User Email Data:", userEmailData.email);
    try {
      const response = await fetch(`${config.apiUrl}/landing-page-generator/generateLandingPageContext`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignInfo: form,
          BusinessData: BusinessData,
          UserEmailData: userEmailData.email,
        }),
      });
      if (!response.ok) throw new Error("שגיאה ביצירת דף הנחיתה");
      const data = await response.json();
      console.log("Landing Page Data:", data);
      
      if (data) {
        const sectionsArray = Object.keys(data).map((key) => data[key]);
        setLandingPageData(sectionsArray);
        setSubmitted(true);
        
      }
    } catch (err) {
      if (err instanceof Error) setError(err.message || "שגיאה בלתי צפויה");
      else setError("שגיאה בלתי צפויה");
    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    if (!landingPageData) return;
    const theme = landingPageData[8];  // Make sure this index exists and contains a valid theme
    
    if (theme && theme.primaryColor) {
      setColors({
        primaryColor: theme.primaryColor.trim(),
        secondaryColor: theme.secondaryColor.trim(),
        tertiaryColor: theme.tertiaryColor.trim(),
        textColor: "#333333",  // or any other color you prefer
        font: theme.font.trim(),
      });
      setUserFont(theme.font.trim());
    } else {
      console.error("Invalid theme data");
    }
  }, [landingPageData]);
  
  

  useEffect(() => {
    if (landingPageData) {
      console.log("Landing Page Data:", landingPageData);
    }
  }, [landingPageData]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newSections = Array.from(landingPageData || []);
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
    setColors({ primaryColor, secondaryColor, tertiaryColor, textColor, font: userFont });
  };

  useEffect(() => {
    document.documentElement.style.setProperty("--primary-color", colors.primaryColor);
    document.documentElement.style.setProperty("--secondary-color", colors.secondaryColor);
    document.documentElement.style.setProperty("--tertiary-color", colors.tertiaryColor);
    document.documentElement.style.setProperty("--text-color", colors.textColor);
    document.documentElement.style.setProperty("--font", userFont);
  }, [colors, userFont]);
  
  
  const handleFontChange = (font: string) => {
    document.documentElement.style.setProperty("--font", font);
    setUserFont(font);
  };

  const handleSaveLandingPage = async () => {
    setIsSidebarOpen(false);
    
    setTimeout(async () => {
      if (!landingPageRef.current) return;
  
      const clone = landingPageRef.current.cloneNode(true) as HTMLElement;
      clone.querySelectorAll("[data-resize-handle]").forEach(el => el.remove());
      const landingPageHTML = clone.innerHTML;
  
      const completeHTML = `
        <!DOCTYPE html>
        <html style="background-color: ${colors.primaryColor};">
          <head>
            <meta charset="UTF-8">
            <title>Landing Page</title>
            <link rel="stylesheet" href="${config.apiUrl}/dist/assets/index-CzkOOIZN.css">
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
                const form = document.querySelector("form");
                const fullNameInput = form.querySelector("input[name='fullName']");
                const emailInput = form.querySelector("input[name='email']");
                const phoneInput = form.querySelector("input[name='phone']");
                const messageInput = form.querySelector("textarea[name='message']");
                const userIdInput = form.querySelector("input[name='userId']");

                const statusBox = document.createElement("p");
                statusBox.style.marginTop = "10px";
                statusBox.style.color = "#444";
                form.appendChild(statusBox);

                form.addEventListener("submit", async function (e) {
                  e.preventDefault();
                  statusBox.textContent = "שולח...";

                  try {
                    const response = await fetch("${config.apiUrl}/leads/createLead", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        name: fullNameInput.value,
                        email: emailInput.value,
                        phone: phoneInput.value,
                        message: messageInput.value,
                        userId: userIdInput.value
                      }),
                    });

                    if (!response.ok) throw new Error("שליחה נכשלה");
                    statusBox.textContent = "✅ הפרטים נשלחו בהצלחה!";
                    form.reset();
                  } catch (error) {
                    console.error("שגיאה בשליחה:", error);
                    statusBox.textContent = "❌ שגיאה בשליחת הפרטים";
                  }
                });
                const scrollButton = document.getElementById("headerButtonContainer");
                const contactTarget = document.getElementById("contact-us-root") || document.querySelector(".contactUs");

                if (scrollButton && contactTarget) {
                  scrollButton.addEventListener("click", () => {
                    contactTarget.scrollIntoView({ behavior: "smooth", block: "start" });
                  });
                }
              });
            </script>

            <script type="module" src="${config.apiUrl}/dist/assets/index-9HPqurC3.js"></script>
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
          alert("Error saving landing page");
          return;
        }

        const savedLandingPage = await saveResponse.json();
  
        const campaignData = {
          ...form,
          creatorId: user._id,
          landingPage: savedLandingPage.file,
          campaignURL: `https://Smarketing.cs.colman.ac.il/landing-page/${savedLandingPage.file}`,
        };
  
        const campaignResponse = await fetch(`${config.apiUrl}/campaigns`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(campaignData),
        });
        if (!campaignResponse.ok) {
          alert("Error saving campaign in DB");
          return;
        }
        const campaignResult = await campaignResponse.json();
        console.log("Campaign created:", campaignResult);
        
        alert("Landing page saved successfully!");
    

        if(onSubmit) {
          onSubmit(form);
        }

        if (onClose) {
          onClose();
        }
        handleClose();

        
      } catch (error) {
        console.error(error);
        alert("Error saving landing page and campaign");
      }
    }, 500);
  };
  

  const handleDelete = (index: number, section: any) => {
    setRemovedSections((prev) => [...prev, { section, index }]);
    setLandingPageData((prev) => {
      if (!prev) return [];
      return prev.filter((_, i) => i !== index);  // Ensure that you remove the section correctly
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
    setForm({ ...form, campaignName: "", campaignContent: "" });
    setLandingPageData(null);
    setSubmitted(false);
    setShowMobilePopup(false);
    setShowTabletPopup(false);
    setShowDesktopPopup(false);
    window.location.reload();
    onClose();
  };

  if (!open) return null;

  const containerStyle: CSSProperties = {
    "--primary-color": colors.primaryColor,
    "--secondary-color": colors.secondaryColor,
    "--tertiary-color": colors.tertiaryColor,
    "--text-color": colors.textColor,
    //backgroundColor: colors.primaryColor,     // ← paint the background directly
  } as any;
  
  
  return (
    <div>
      
      {error && <p className="text-red-500">❌ {error}</p>}
  
      {submitted && landingPageData ? (
        <div className="popup-overlay">
          <div
            className="popup popup-landing"
            dir="rtl"
            style={{
              maxHeight: "90vh",
              overflowY: "auto",
              width: "95%",
            }}
          >
            {showTour && (
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
)}

            <div className="popup-header">
              <p className="promptText">
                האם אתה מעוניין לשגר את דף הנחיתה?
              </p>
              <div className="buttonGroup">
                <button className="cancelBtn" onClick={handleClose}>
                  <MdCancel className="icon" />
                  <span>ביטול</span>
                </button>
                <button className="launchBtn" onClick={handleSaveLandingPage}>
                  <IoRocketOutline className="icon" />
                  <span>שגר קמפיין</span>
                </button>
              </div>
            </div>

  
            <div className={styles.landingPageLayout}>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="sections">
                  {(provided) => (
                    <div
                    className={`${styles.sectionsContainer} ${isSidebarOpen ? styles.withSidebar : ""} ${
                      responsiveView ? styles[responsiveView] : ""
                    }`}
                    ref={(node) => {
                      if (node) {
                        landingPageRef.current = node;
                        provided.innerRef(node);
                      }
                    }}
                    {...provided.droppableProps}
                    style={containerStyle}
                  >
                  
                      {landingPageData.map((section, index) => (
                        <Draggable
                        draggableId={section.sectionName + index}  // This should be unique
                        index={index}
                        isDragDisabled={["header", "hero", "footer"].includes(section.sectionName || "")}
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
                                refMap={sectionRefs}
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
        <div className="popup-overlay-form">
          <div className="popup-form" dir="rtl">
            <h2>צור קמפיין חדש</h2>
            <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <input
                name="campaignName"
                placeholder="שם הקמפיין"
                value={form.campaignName}
                onChange={handleChange}
              />

             <div className="form-group">
  <label>תקציב: {Math.round(form.budget)} ₪</label>
  <input
    type="range"
    name="budget"
    min="1"
    max="100"
    step="10"
    value={Math.round(form.budget)}
    onChange={handleChange}
  />
</div>


              <div className="form-group">
                <label>רמת שיווק</label>
                <select
                  name="marketingLevel"
                  value={form.marketingLevel}
                  onChange={handleChange}
                >
                  <option value="">בחר רמה</option>
                  <option value="נמוכה">נמוכה</option>
                  <option value="בינונית">בינונית</option>
                  <option value="גבוהה">גבוהה</option>
                </select>
              </div>

              <div className="form-group">
                <label>מטרת הקמפיין</label>
                <select
                  name="campaginPurpose"
                  value={form.campaginPurpose}
                  onChange={handleChange}
                >
                  <option value="">בחר מטרה</option>
                  <option value="הגברת מודעות למותג">הגברת מודעות למותג</option>
                  <option value="השגת לידים">השגת לידים</option>
                  <option value="קידום מכירות">קידום מכירות</option>
                </select>
              </div>

              <input
                name="actionToCall"
                placeholder="קריאה לפעולה"
                value={form.actionToCall}
                onChange={handleChange}
              />

              <div className="form-group">
                <label>קהל יעד</label>
                <select
                  name="targetAudience"
                  value={form.targetAudience}
                  onChange={handleChange}
                >
                  <option value="">בחר קהל</option>
                  <option value="לקוחות חדשים">לקוחות חדשים</option>
                  <option value="לקוחות קיימים">לקוחות קיימים</option>
                  <option value="עסקים">עסקים</option>
                </select>
              </div>

              <div className="form-group">
                <label>מין קהל היעד</label>
                <select
                  name="targetGender"
                  value={form.targetGender}
                  onChange={handleChange}
                >
                  <option value="">בחר מין</option>
                  <option value="גברים">גברים</option>
                  <option value="נשים">נשים</option>
                  <option value="שני המינים">שני המינים</option>
                </select>
              </div>

              <div className="form-group">
                <label>שפה</label>
                <select
                  name="language"
                  value={form.language}
                  onChange={handleChange}
                >
                  <option value="">בחר שפה</option>
                  <option value="עברית">עברית</option>
                  <option value="אנגלית">אנגלית</option>
                  <option value="ערבית">ערבית</option>
                </select>
              </div>

              <input
                name="targetLocation"
                placeholder="מיקום יעד"
                value={form.targetLocation}
                onChange={handleChange}
              />

              <input
                name="targetAge"
                placeholder="גיל יעד (למשל 25-45)"
                value={form.targetAge}
                onChange={handleChange}
              />

              <textarea
                name="campaignContent"
                placeholder="תיאור הקמפיין"
                value={form.campaignContent}
                onChange={handleChange}
              />
            </div>

  
              <div className="popup-actions">
                <button className="cancel-btn" type="button" onClick={handleClose}>
                  ביטול
                </button>
                <button className="submit-btn" type="submit" disabled={loading}>
                  {loading ? (
                    <div className="btn-loader-wrapper">
                      <span className="loader loader-in-btn"></span>
                      טוען...
                    </div>
                  ) : (
                    "צור קמפיין"
                  )}
                </button>

              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignPopup;
