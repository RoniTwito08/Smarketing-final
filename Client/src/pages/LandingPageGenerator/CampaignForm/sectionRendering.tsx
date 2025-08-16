// src/components/LandingPage/SectionRenderer.tsx
import React, { useState, useEffect } from "react";
import { config } from "../../../config";
import Pricing from "../LandingPageSections/Pricing/Pricing";
import Header from "../LandingPageSections/Header/Header";
import Footer from "../LandingPageSections/Footer/Footer";
import Hero from "../LandingPageSections/Hero/Hero";
import Features from "../LandingPageSections/Features/Features";
import Reviews from "../LandingPageSections/Reviews/Reviews";
import AboutUs from "../LandingPageSections/AboutUs/AboutUs";
import ContactUs from "../LandingPageSections/ContactUs/ContactUs";
import Gallery from "../LandingPageSections/Gallery/Gallery";
import ServicesSection from "../LandingPageSections/Services/Services";
import HowItWorks from "../LandingPageSections/HowItWorks/HowItWorks";
import Trust from "../LandingPageSections/Trust/Trust";
import FAQ from "../LandingPageSections/FAQ/FAQ";
import SocialProof from "../LandingPageSections/SocialProof/SocialProof";
// import CTAVariants from "../LandingPageSections/CTA/CTAVariants"; 
import { businessInfoService } from "../../../services/besinessInfo.service";
import { useAuth } from "../../../context/AuthContext";

/* ---------- Types (כמו שהיו) ---------- */
type SocialLinks =
  | string[]
  | {
      facebook?: string;
      instagram?: string;
      tiktok?: string;
      linkedin?: string;
      youtube?: string;
      twitter?: string;
      pinterest?: string;
    };

type ServiceItem = { title: string; description: string };
type StepItem = { step: number; title: string; text: string };
type Plan = {
  name: string;
  priceMonthly: number;
  features: string[];
  cta: string;
  highlight?: boolean;
};
type QA = { q: string; a: string };
type Stat = { label: string; value: string };

interface Section {
  sectionName?: string;
  title?: string;
  subtitle?: string;
  content?: string | string[];
  image?: string;
  logo?: string;
  buttonText?: string;
  businessName?: string;
  backgroundPicture?: string;
  slogan?: string;
  nav?: string[];
  primaryButtonText?: string;
  secondaryButtonText?: string;
  bullets?: string[];
  items?: ServiceItem[];
  steps?: StepItem[];
  plans?: Plan[];
  disclaimer?: string;
  ratingSummary?: { average: number; count: number };
  stats?: Stat[];
  badges?: string[];
  mission?: string;
  itemsQA?: QA[];
  cover?: string;
  brands?: string[];
  itemsCTA?: string[];
  socialMediaIcons?: SocialLinks;
  contactInfo?: string;
  location?: string;
  copyRights?: string;
  openingHours?: Record<string, string>;
  mapQuery?: string;
  description?: string;
  keywords?: string[];
}

interface SectionRendererProps {
  section: Section;
  onDeleteSection?: () => void;
  refMap?: Record<string, React.RefObject<HTMLDivElement>>;
}

/* ---------- Utils (מותר מחוץ לקומפוננטה) ---------- */
const apiImage = (maybePath?: string) => {
  if (!maybePath) return "";
  if (/^https?:\/\//i.test(maybePath)) return maybePath; // כבר URL מלא
  const file = maybePath.split("/").pop() || "";
  return file ? `${config.apiUrl}/api/pexels_images/${file}` : maybePath;
};

const toArray = (val?: string | string[]): string[] => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return String(val)
    .split(/\r?\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);
};


/* --------------------------------------
   Component
--------------------------------------- */
const SectionRenderer: React.FC<SectionRendererProps> = ({ section, onDeleteSection, refMap }) => {
  // ⬇️ כל ה-Hooks נכנסים לכאן (בתוך הקומפוננטה!)
  const { user, accessToken } = useAuth();
  const userId = user?._id;

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (userId && accessToken && !logoPreview) {
      businessInfoService
        .getBusinessInfo(userId, accessToken)
        .then((data) => {
          const logoPath = data?.data?.logo;
          if (!cancelled && typeof logoPath === "string" && logoPath.trim()) {
            setLogoPreview(`${config.apiUrl}/${logoPath.replace(/^\/+/, "")}`);
          }
          if (!cancelled) setPhone(data?.data?.phone || null);
        })
        .catch((err) => {
          console.error("Failed to fetch business info:", err);
        });
    }
    return () => {
      cancelled = true;
    };
  }, [userId, accessToken, logoPreview]);

  if (!section || !section.sectionName) return null;

  const renderSection = () => {
    switch (section.sectionName) {
      case "header":
        return (
          <Header
            businessName={section.businessName}
            title={section.title || ""}
            buttonText={section.buttonText || section.primaryButtonText || ""}
          />
        );

      case "hero":
        return (
          <Hero
            title={section.title || ""}
            content={typeof section.content === "string" ? section.content : (section.content || []).join("\n")}
            buttonText={section.buttonText || section.primaryButtonText || ""}
          />
        );

      case "features":
        return (
          <Features
            content={Array.isArray(section.content) ? section.content : toArray(section.content)}
            image={apiImage(section.image)}
            onDelete={onDeleteSection}
          />
        );

      case "reviews":
        return (
          <Reviews
            title={section.title}
            subtitle={undefined} // או טקסט שתבחר
            content={Array.isArray(section.content) ? section.content : (section.content || "")}
            ratingSummary={section.ratingSummary}
            onDelete={onDeleteSection}
          />
        );

      case "aboutUs":
        return (
          <AboutUs
            title={section.title}
            mission={section.mission}
            content={Array.isArray(section.content) ? section.content : (section.content || "")}
            image={logoPreview ?? undefined}
            phone={phone ?? undefined}
            onDelete={onDeleteSection}
          />
        );

      case "contactUs":
        return (
          <div id="contact-us-root">
            <ContactUs />
          </div>
        );

      case "gallery":
        return (
          <Gallery
            title={section.title}
            subtitle={section.subtitle}
            cover={section.cover}
            images={Array.isArray((section as any).images) ? (section as any).images : undefined}
            onDelete={onDeleteSection}
            showHeader
          />
        );
        
      case "footer":
        return (
          <Footer
            contactInfo={section.contactInfo || ""}
            location={section.location || ""}
            copyRight={section.copyRights || ""}
          />
        );

      case "services":
        return (
          <ServicesSection
            title={section.title}
            items={Array.isArray(section.items) ? section.items : undefined}
            onDelete={onDeleteSection}
          />
        );

      case "howItWorks":
        return (
          <HowItWorks
            steps={section.steps}
            title="איך זה עובד"
            subtitle="כל התהליך אצלנו פשוט, מהיר ושקוף – משלב הייעוץ ועד להשלמת העבודה."
            showHeader
            onDelete={() => console.log("delete section")}
          />
        );

      case "pricing":
        return (
          <Pricing
            title="חבילות ושירותים"
            subtitle="בחרו את מה שמתאים לכם – גמיש, שקוף וברור."
            plans={section.plans}
            disclaimer="המחירים לפני מע״מ ויכולים להשתנות."
            onDelete={() => console.log("delete pricing section")}
          />
        );

      case "trust":
        return (
          <Trust
            title={section.title}
            subtitle={section.subtitle}
            stats={Array.isArray(section.stats) ? section.stats : undefined}
            badges={Array.isArray(section.badges) ? section.badges : undefined}
            onDelete={onDeleteSection}
          />
        );

      case "faq": {
        // type guard קטן כדי לנרמל נתונים אם מגיעים ממקור ישן
        const isQA = (x: any): x is QA =>
          x && typeof x.q === "string" && typeof x.a === "string";

        const qa: QA[] = Array.isArray(section.itemsQA)
          ? section.itemsQA
          : Array.isArray(section.items)
          ? (section.items as any[]).filter(isQA)
          : Array.isArray(section.content)
          ? (section.content as any[])
              .filter(isQA)
          : [];

        // נרמול סופי + סינון ריקים
        const safeQA = qa
          .map(({ q, a }) => ({ q: String(q || "").trim(), a: String(a || "").trim() }))
          .filter(x => x.q && x.a);

        return (
          <FAQ
            title={section.title || "שאלות נפוצות"}
            subtitle={section.subtitle}
            items={safeQA}
            onDelete={onDeleteSection}
            showHeader
          />
        );
      }


      case "socialProof":
        return (
          <SocialProof
            title={section.title}
            brands={Array.isArray(section.brands) ? section.brands : []}
            onDelete={onDeleteSection}
          />
        );
      // case "ctaVariants":
      //   return (
      //     <CTAVariants
      //       items={Array.isArray(section.itemsCTA) ? section.itemsCTA : toArray(section.content)}
      //       onDelete={onDeleteSection}
      //       showHeader
      //     />
      //   );

      default:
        return null;
    }
  };

  return (
    <div ref={refMap?.[section.sectionName || ""]} className={section.sectionName}>
      {renderSection()}
    </div>
  );
};

export default SectionRenderer;
