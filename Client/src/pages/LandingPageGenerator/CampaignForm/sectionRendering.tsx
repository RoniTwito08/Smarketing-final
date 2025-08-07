// SectionRenderer.tsx
import Footer from "../LandingPageSections/Footer/Footer";
import Hero from "../LandingPageSections/Hero/Hero";
import Features from "../LandingPageSections/Features/Features";
import Reviews from "../LandingPageSections/Reviews/Reviews";
import AboutUs from "../LandingPageSections/AboutUs/AboutUs";
import ContactUs from "../LandingPageSections/ContactUs/ContactUs";
import Gallery from "../LandingPageSections/Gallery/Gallery";
import { config } from "../../../config";
import React from "react";

interface Section {
  sectionName?: string;
  image?: string;
  logo?: string;
  title?: string;
  content?: string;
  buttonText?: string;
  socialMediaIcons?: string[];
  contactInfo?: string;
  location?: string;
  copyRights?: string;
  businessName?: string;
  backgroundPicture?: string;
}

interface SectionRendererProps {
  section: Section;
  onDeleteSection?: () => void;
  refMap?: Record<string, React.RefObject<HTMLDivElement>>;
}

const SectionRenderer = ({ section, onDeleteSection, refMap }: SectionRendererProps) => {
  if (!section || !section.sectionName) return null;

  const renderSection = () => {
    switch (section.sectionName) {
      case "hero":
        return (
          <Hero
            title={section.title || ""}
            content={section.content || ""}
            buttonText={section.buttonText || ""}
          />
        );
      case "features":
        return (
          <Features
            content={section.content ? section.content.split("\n") : []}
            image={
              `${config.apiUrl}/api/pexels_images/` +
              (section.image?.split("/").pop() || "")
            }
            onDelete={onDeleteSection}
          />
        );
      case "reviews":
        return (
          <Reviews
            content={section.content ? section.content.split("\n") : []}
            onDelete={onDeleteSection}
          />
        );
      case "aboutUs":
        return (
          <AboutUs
            content={section.content || ""}
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
      default:
        return null;
    }
  };

  return (
    <div
      ref={refMap?.[section.sectionName || ""]}
      className={section.sectionName}
    >
      {renderSection()}
    </div>
  );
};

export default SectionRenderer;
