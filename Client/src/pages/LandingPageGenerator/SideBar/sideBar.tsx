// Sidebar.tsx
import { useEffect } from "react";
import { motion } from "framer-motion";
import { IoChatbubbleEllipsesOutline, IoDesktopSharp } from "react-icons/io5";
import { IoIosRemoveCircleOutline, IoIosColorFilter } from "react-icons/io";
import { AiOutlineFontColors, AiOutlineExclamationCircle } from "react-icons/ai";
import { FaTimes, FaMobileAlt, FaTabletAlt } from "react-icons/fa";
import { MdOutlinePhoneIphone } from "react-icons/md";
import styles from "../CampaignForm/landingPageStyles.module.css";
import { useState } from "react";
import ColorCombo from "./ColorCombo/ColorCombo";
import { colorComboData } from "./sideBarData";
import Font from "./Fonts/Font";
import { FontData } from "./sideBarData";
import Chat from "./Chat/Chat";
import SidebarTourPopup from "./SidebarTourPopup/SidebarTourPopup";
import { useRef } from "react";

interface RemovedSection {
  section: any;
  index: number;
}

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onOk: () => void;
  onColorChange: (
    primaryColor: string,
    secondaryColor: string,
    tertiaryColor: string,
    textColor: string
  ) => void;
  onFontChange: (font: string) => void;
  removedSections: RemovedSection[];
  onRestore: (item: RemovedSection) => void;
  onResponsiveChange: (view: "desktop" | "tablet" | "mobile" | "") => void;
  setShowMobilePopup: (val: boolean) => void;
  setShowTabletPopup: (val: boolean) => void;
  setShowDesktopPopup: (val: boolean) => void;
}

const Sidebar = ({
  isOpen,
  setIsOpen,
  onOk,
  onColorChange,
  onFontChange,
  removedSections,
  onRestore,
  onResponsiveChange,
  setShowMobilePopup,
  setShowTabletPopup,
  setShowDesktopPopup,
}: SidebarProps) => {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [_responsiveView, setResponsiveView] = useState<"desktop" | "tablet" | "mobile" | "">("");
  const [isLinearColors, setIsLinearColors] = useState(false);
  const [originalColors, setOriginalColors] = useState({
    primaryColor: '',
    secondaryColor: '',
    tertiaryColor: '',
    textColor: ''
  });
  const actionsRef = useRef<HTMLDivElement>(null);
const colorRef = useRef<HTMLDivElement>(null);
const fontRef = useRef<HTMLDivElement>(null);
const removeRef = useRef<HTMLDivElement>(null);
const chatRef = useRef<HTMLDivElement>(null);
const responsiveRef = useRef<HTMLDivElement>(null);

const [sidebarTourStep, setSidebarTourStep] = useState(0);
const [showSidebarTour, setShowSidebarTour] = useState(false);

const sidebarTourSteps = [
  {
    ref: actionsRef,
    title: "פעולות כלליות",
    description: "כאן תוכל לשנות את מבנה הדף, מיקום סקשנים ועוד.",
  },
  {
    ref: colorRef,
    title: "צבעים",
    description: "בחר קומבינציית צבעים מותאמת למותג שלך.",
  },
  {
    ref: fontRef,
    title: "גופנים",
    description: "בחר גופן שישדר את סגנון העסק שלך.",
  },
  {
    ref: removeRef,
    title: "הסרת סקשנים",
    description: "הצג או הסתר סקשנים מדף הנחיתה שלך.",
  },
  {
    ref: chatRef,
    title: "צ׳אט עם AI",
    description: "כאן תוכל לקבל עזרה מהבינה המלאכותית.",
  },
  {
    ref: responsiveRef,
    title: "רספונסיביות",
    description: "צפה בדף שלך במובייל, טאבלט ודסקטופ.",
  },
];


  const handleIconClick = (icon: string) => {
    
    if (icon === "chat") {
      setSelectedIcon(icon === selectedIcon ? null : icon);
      setIsOpen(true);
    } else if (icon === "ok") {
      onOk();
    } else if (icon === "responsive") {
      setSelectedIcon(icon === selectedIcon ? null : icon);
      setIsOpen(true);
      setResponsiveView("");
      onResponsiveChange("");
    } else {
      setIsOpen(true);
      setSelectedIcon(icon === selectedIcon ? null : icon);
    }
  };

  const handleClickColorChange = (
    primaryColor: string,
    secondaryColor: string,
    tertiaryColor: string,
    textColor: string
  ) => {
    setOriginalColors({ primaryColor, secondaryColor, tertiaryColor, textColor });
    document.documentElement.style.setProperty("--primary-color", primaryColor);
    document.documentElement.style.setProperty("--secondary-color", secondaryColor);
    document.documentElement.style.setProperty("--tertiary-color", tertiaryColor);
    document.documentElement.style.setProperty("--text-color", textColor);
    document.documentElement.style.setProperty("--primary-gradient", "none");
    setIsLinearColors(false);
    onColorChange(primaryColor, secondaryColor, tertiaryColor, textColor);
  };

  const handleLinearToggle = () => {
    setIsLinearColors(prev => !prev);
  };

  useEffect(() => {
    if (isLinearColors) {
      document.documentElement.style.setProperty("--primary-gradient", `linear-gradient(135deg, ${originalColors.primaryColor}, ${originalColors.secondaryColor})`);
      document.documentElement.style.setProperty("--secondary-gradient", `linear-gradient(135deg, ${originalColors.secondaryColor}, ${originalColors.tertiaryColor})`);
      document.documentElement.style.setProperty("--tertiary-gradient", `linear-gradient(135deg, ${originalColors.tertiaryColor}, ${originalColors.primaryColor})`);
    } else {
      document.documentElement.style.setProperty("--primary-gradient", "none");
      document.documentElement.style.setProperty("--secondary-gradient", "none");
      document.documentElement.style.setProperty("--tertiary-gradient", "none");
    }
  }, [isLinearColors, originalColors]);  
  

  const handleClickFontChange = (font: string) => {
    document.documentElement.style.setProperty("--font", font);
    onFontChange(font);
  };
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <>
      <motion.div
        className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}
        initial={{ width: "5%" }}
        animate={{ width: isOpen ? (isMobile ? "50%" : "25%") : (isMobile ? "15%" : "8%") }}
        transition={{ duration: 0.9 }}
      >
        <div className={styles.sidebarHeader}>
          {isOpen && (
            <button className={styles.closeButton} onClick={() => setIsOpen(false)}>
              <FaTimes size={25} />
            </button>
          )}
        </div>
        <nav className={styles.sidebarMenu}>
          <div
          ref={actionsRef}
            className={styles.sidebarItem}
            onClick={() => handleIconClick("actions")}
            data-tooltip="פעולות"
            
          >
            <AiOutlineExclamationCircle size={30} />
            {isOpen && <span>פעולות</span>}
            
          </div>

          <div
          ref={colorRef}
            className={styles.sidebarItem}
            onClick={() => handleIconClick("color")}
            data-tooltip="צבעים"
            
          >
            <IoIosColorFilter size={30} />
            {isOpen && <span>צבעים</span>}
          </div>

          <div
          ref={fontRef}
            className={styles.sidebarItem}
            onClick={() => handleIconClick("font")}
            data-tooltip="גופנים"
            
          >
            <AiOutlineFontColors size={30} />
            {isOpen && <span>גופנים</span>}
          </div>

          <div
          ref={removeRef}
            className={styles.sidebarItem}
            onClick={() => handleIconClick("removeSection")}
            data-tooltip="הסרת סקשנים"
          >
            <IoIosRemoveCircleOutline size={30} />
            {isOpen && <span>הסרת סקשנים</span>}
          </div>

          <div
          ref={chatRef}
            className={styles.sidebarItem}
            onClick={() => handleIconClick("chat")}
            data-tooltip="צ'אט"
          >
            <IoChatbubbleEllipsesOutline size={30} />
            {isOpen && <span>צ'אט</span>}
          </div>

          <div
          ref={responsiveRef}
            className={styles.sidebarItem}
            onClick={() => handleIconClick("responsive")}
            data-tooltip="רספונסיבי"
          >
            <MdOutlinePhoneIphone size={30} />
            {isOpen && <span>רספונסיבי</span>}
          </div>
          
          
        </nav>

        {isOpen && <div className={styles.divider}></div>}
        {isOpen && (
          <div className={styles.subMenuContainer}>
            {selectedIcon === "color" && (
              <div>
                <button className={styles.linearButton} onClick={handleLinearToggle}>
                  {isLinearColors ? "צבעים רגילים" : "צבעים ליניאריים"}
                </button>
                <div className={styles.subMenuColors}>
                  {colorComboData.map((colorCombo, index) => (
                    <ColorCombo
                      key={index}
                      {...colorCombo}
                      onColorComboSelect={() =>
                        handleClickColorChange(
                          colorCombo.primaryColor,
                          colorCombo.secondaryColor,
                          colorCombo.tertiaryColor,
                          colorCombo.textColor
                        )
                      }
                    />
                  ))}
                </div>
              </div>
            )}
            {selectedIcon === "responsive" && (
              <div className={styles.responsiveExplanation}>
                <p>בחרו את התצוגה הרצויה:</p>
                <div className={styles.responsiveDevices}>
                  <div
                    className={styles.devicePreview}
                    onClick={() => {
                      setResponsiveView("desktop");
                      onResponsiveChange("desktop");
                      setShowDesktopPopup(true);
                    }}
                  >
                    <IoDesktopSharp size={40} />
                    <p>Desktop</p>
                  </div>
                  <div
                    className={styles.devicePreview}
                    onClick={() => {
                      setResponsiveView("tablet");
                      onResponsiveChange("tablet");
                      setShowTabletPopup(true);
                    }}
                  >
                    <FaTabletAlt size={40} />
                    <p>Tablet</p>
                  </div>
                  <div
                    className={styles.devicePreview}
                    onClick={() => {
                      setResponsiveView("mobile");
                      onResponsiveChange("mobile");
                      setShowMobilePopup(true);
                    }}
                  >
                    <FaMobileAlt size={40} />
                    <p>Mobile</p>
                  </div>
                </div>
              </div>
            )}
            {selectedIcon === "actions" && (
              <div className={styles.actionsExplanation}>
                <button onClick={() => {
                  setShowSidebarTour(true);
                  setSidebarTourStep(0);
                }} className={styles.startTourButton}>
                  <AiOutlineExclamationCircle size={30} />
                  תרצה הדרכה מהירה על הסיידבר?
                </button>
                <p>
                  ברוכים הבאים למערכת שלנו – כאן תוכלו לעשות כל מה שתמיד חלמתם עליו עבור דף הנחיתה שלכם!
                </p>
                <ul>
                  <li>לשנות את הסדר של הסקשנים ולהתאים את מיקום האובייקטים, כולל שינוי מיקום הסקשן ההירו.</li>
                  <li>להתאים את צבעי הדף בעזרת קולור קומבו מותאם לעסק שלכם, לשדר מקצועיות ואווירה ייחודית.</li>
                  <li>לבחור את הפונט המושלם שמתאים לאופי ולמסר של העסק שלכם.</li>
                  <li>להוסיף או למחוק סקשנים בקלות, כך שתמיד יהיה לכם דף נחיתה עדכני ונגיש.</li>
                  <li>לשנות את הטקסטים כך שיתאימו בדיוק לצרכים שלכם – ואפילו לקבל הצעות ייעול טקסטואלי.</li>
                  <li>להנות מתצוגה רספונסיבית שמתאימה למובייל, דסקטופ וטאבלט.</li>
                  <li>להתאים את הטון השיווקי ולהעביר את המסר בצורה מקצועית ומושכת.</li>
                </ul>
                <p>בואו להפוך את דף הנחיתה שלכם לכלי שיווקי עוצמתי ומותאם אישית!</p>

              </div>
            )}
            
            {selectedIcon === "font" && (
              <div className={styles.subMenuFonts}>
                {FontData.map((font, index) => (
                  <Font
                    key={index}
                    {...font}
                    onFontSelect={() => handleClickFontChange(font.font)}
                  />
                ))}
              </div>
            )}
            {selectedIcon === "chat" && (
              <div style={{ marginTop: "10px", width: "100%" }}>
                <Chat />
              </div>
            )}
            {selectedIcon === "removeSection" && (
              <div className={styles.removedSections}>
                <p>סקשנים שהוסרו:</p>
                {removedSections.length === 0 ? (
                  <div className={styles.removedSection}>
                    <p>אין סקשנים מוסרים.</p>
                  </div>
                ) : (
                  <div>
                    {removedSections.map((item, idx) => (
                      <div key={idx} className={styles.removedSection}>
                        <button onClick={() => onRestore(item)}>שחזר</button>
                        <p>{item.section.sectionName}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {selectedIcon === "marketingTone" && (
              <div className={styles.marketingToneExplanation}>
                <p>בחרו את הסגנון המתאים לעסק שלכם:</p>
                <div className={styles.marketingToneOptions}>
                  <div className={styles.toneOption}>
                    <p>צעיר ומודרני</p>
                  </div>
                  <div className={styles.toneOption}>
                    <p>פורמלי ומקצועי</p>
                  </div>
                  <div className={styles.toneOption}>
                    <p>חמים ואישי</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {showSidebarTour && (
          <SidebarTourPopup
            title={sidebarTourSteps[sidebarTourStep].title}
            description={sidebarTourSteps[sidebarTourStep].description}
            targetRef={sidebarTourSteps[sidebarTourStep].ref}
            step={sidebarTourStep}
            totalSteps={sidebarTourSteps.length}
            onNext={() => {
              if (sidebarTourStep < sidebarTourSteps.length - 1) {
                setSidebarTourStep(prev => prev + 1);
              } else {
                setShowSidebarTour(false);
              }
            }}
            onBack={() => {
              if (sidebarTourStep > 0) {
                setSidebarTourStep(prev => prev - 1);
              }
            }}
            onSkip={() => setShowSidebarTour(false)}
          />
        )}

      </motion.div>
    </>
  );
};

export default Sidebar;
