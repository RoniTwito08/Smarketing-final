// src/components/LandingPage/SectionRenderer.tsx
import React, { useState, useEffect } from "react";
import { config } from "../../../config";

import Header from "../LandingPageSections/Header/Header";
import Footer from "../LandingPageSections/Footer/Footer";
import Hero from "../LandingPageSections/Hero/Hero";
import Features from "../LandingPageSections/Features/Features";
import Reviews from "../LandingPageSections/Reviews/Reviews";
import AboutUs from "../LandingPageSections/AboutUs/AboutUs";
import ContactUs from "../LandingPageSections/ContactUs/ContactUs";
import Gallery from "../LandingPageSections/Gallery/Gallery";
import ServicesSection from "../LandingPageSections/Services/Services";
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

const HowItWorksPlaceholder: React.FC<{ steps: StepItem[]; title?: string }> = ({ steps, title = "איך זה עובד" }) => (
  <section style={{ padding: "48px 16px" }}>
    <h2 style={{ marginTop: 0 }}>{title}</h2>
    <ol style={{ display: "grid", gap: 12, paddingInlineStart: 24 }}>
      {steps
        .sort((a, b) => a.step - b.step)
        .map((st, i) => (
          <li key={i}>
            <strong>{st.title}</strong> — {st.text}
          </li>
        ))}
    </ol>
  </section>
);

const PricingPlaceholder: React.FC<{ plans: Plan[]; title?: string; subtitle?: string; disclaimer?: string }> = ({
  plans,
  title = "חבילות ושירותים",
  subtitle,
  disclaimer,
}) => (
  <section style={{ padding: "48px 16px" }}>
    <h2 style={{ marginTop: 0 }}>{title}</h2>
    {subtitle ? <p style={{ marginTop: 0, opacity: 0.85 }}>{subtitle}</p> : null}
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}>
      {plans.map((p, i) => (
        <article
          key={i}
          style={{
            border: "1px solid #eee",
            borderRadius: 16,
            padding: 20,
            boxShadow: p.highlight ? "0 8px 24px rgba(0,0,0,.08)" : "none",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <h3 style={{ margin: 0 }}>{p.name}</h3>
            <div style={{ fontWeight: 700 }}>{p.priceMonthly}₪/חודש</div>
          </div>
          <ul style={{ margin: "12px 0", paddingInlineStart: 18 }}>
            {p.features.map((f, idx) => (
              <li key={idx}>{f}</li>
            ))}
          </ul>
          <button type="button">{p.cta}</button>
        </article>
      ))}
    </div>
    {disclaimer ? <p style={{ marginTop: 12, fontSize: 12, opacity: 0.7 }}>{disclaimer}</p> : null}
  </section>
);

const TrustPlaceholder: React.FC<{ stats?: Stat[]; badges?: string[]; title?: string }> = ({
  stats,
  badges,
  title = "למה לבחור בנו",
}) => (
  <section style={{ padding: "48px 16px" }}>
    <h2 style={{ marginTop: 0 }}>{title}</h2>
    {stats && stats.length > 0 && (
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))" }}>
        {stats.map((s, i) => (
          <div key={i} style={{ border: "1px solid #eee", borderRadius: 12, padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{s.value}</div>
            <div style={{ opacity: 0.8 }}>{s.label}</div>
          </div>
        ))}
      </div>
    )}
    {badges && badges.length > 0 && (
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
        {badges.map((b, i) => (
          <span key={i} style={{ border: "1px solid #ddd", borderRadius: 999, padding: "6px 10px", fontSize: 12 }}>
            {b}
          </span>
        ))}
      </div>
    )}
  </section>
);

const FAQPlaceholder: React.FC<{ items: QA[]; title?: string }> = ({ items, title = "שאלות נפוצות" }) => (
  <section style={{ padding: "48px 16px" }}>
    <h2 style={{ marginTop: 0 }}>{title}</h2>
    <div style={{ display: "grid", gap: 12 }}>
      {items.map((qa, i) => (
        <details key={i} style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
          <summary style={{ cursor: "pointer", fontWeight: 600 }}>{qa.q}</summary>
          <p style={{ marginTop: 8 }}>{qa.a}</p>
        </details>
      ))}
    </div>
  </section>
);

const SocialProofPlaceholder: React.FC<{ brands?: string[]; title?: string }> = ({
  brands,
  title = "בין לקוחותינו",
}) => (
  <section style={{ padding: "48px 16px" }}>
    <h2 style={{ marginTop: 0 }}>{title}</h2>
    {brands && brands.length > 0 ? (
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {brands.map((b, i) => (
          <span key={i} style={{ border: "1px solid #eee", borderRadius: 10, padding: "8px 12px" }}>
            {b}
          </span>
        ))}
      </div>
    ) : (
      <p style={{ opacity: 0.8 }}>—</p>
    )}
  </section>
);

const CTAVariantsPlaceholder: React.FC<{ items?: string[] }> = ({ items }) => (
  <section style={{ padding: "32px 16px", display: "flex", flexWrap: "wrap", gap: 12 }}>
    {(items || []).map((txt, i) => (
      <button key={i} type="button">
        {txt}
      </button>
    ))}
  </section>
);

const SEOPlaceholder: React.FC<{ title?: string; description?: string; keywords?: string[] }> = ({
  title,
  description,
  keywords,
}) => (
  <section style={{ padding: "24px 16px", borderTop: "1px dashed #eee", fontSize: 12, opacity: 0.85 }}>
    <div>
      <strong>SEO Title:</strong> {title || "—"}
    </div>
    <div>
      <strong>Description:</strong> {description || "—"}
    </div>
    <div>
      <strong>Keywords:</strong> {(keywords || []).join(", ") || "—"}
    </div>
  </section>
);

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
            content={Array.isArray(section.content) ? section.content : toArray(section.content)}
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
        return <Gallery />;

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
        return <HowItWorksPlaceholder title={section.title} steps={Array.isArray(section.steps) ? section.steps : []} />;

      case "pricing":
        return (
          <PricingPlaceholder
            title={section.title}
            subtitle={section.subtitle}
            plans={Array.isArray(section.plans) ? section.plans : []}
            disclaimer={section.disclaimer}
          />
        );

      case "trust":
        return (
          <TrustPlaceholder
            title={section.title}
            stats={Array.isArray(section.stats) ? section.stats : []}
            badges={Array.isArray(section.badges) ? section.badges : []}
          />
        );

      case "faq": {
        const qa: QA[] = Array.isArray(section.itemsQA)
          ? section.itemsQA
          : Array.isArray(section.content)
          ? (section.content as any[]).filter(
              (x) => x && typeof (x as any).q === "string" && typeof (x as any).a === "string"
            )
          : [];
        return <FAQPlaceholder title={section.title} items={qa} />;
      }

      case "socialProof":
        return <SocialProofPlaceholder title={section.title} brands={section.brands} />;

      case "ctaVariants":
        return (
          <CTAVariantsPlaceholder items={Array.isArray(section.itemsCTA) ? section.itemsCTA : toArray(section.content)} />
        );

      case "seo":
        return (
          <SEOPlaceholder
            title={section.title}
            description={typeof section.content === "string" ? section.content : section.description}
            keywords={Array.isArray(section.keywords) ? section.keywords : toArray(section.content)}
          />
        );

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
