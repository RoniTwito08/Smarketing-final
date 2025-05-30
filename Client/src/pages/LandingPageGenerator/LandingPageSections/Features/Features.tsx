import { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaCheckCircle } from "react-icons/fa";
import ActionsButtons from "../../LandingPageActions/ActionsButtons/ActionsButtons";
import featuresStyles from "./features.module.css";

interface FeaturesProps {
  content: string[];
  image: string;
  onDelete?: () => void;
}

export default function Features({ content, image, onDelete }: FeaturesProps) {
  const [services, setServices] = useState<string[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [templateIndex, setTemplateIndex] = useState(0);

  useEffect(() => {
    const cleaned = content
      .slice(2, content.length - 3)
      .map(s => s.replace(/['",]/g, "").trim())
      .slice(0, 4);         // תמיד 4 פיצ’רים
    setServices(cleaned);
  }, [content]);

  const handleBlur = (i: number, e: React.FocusEvent<HTMLSpanElement>) => {
    const txt = e.currentTarget.innerText;
    setServices(prev => {
      const copy = [...prev];
      copy[i] = txt;
      return copy;
    });
  };

  const template0 = (
    <div className={featuresStyles.twoColLayout}>
      <img src={image} className={featuresStyles.featuresImage} />
      <ul className={featuresStyles.featuresList}>
        {services.map((s, i) => (
          <li key={i} className={featuresStyles.featureItem}>
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={e => handleBlur(i, e)}
              className={featuresStyles.featureText}
            >
              {s}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );

  const template1 = (
    <div className={featuresStyles.glassWrapper}>
      <img src={image} className={featuresStyles.glassImage} />
      <div className={featuresStyles.glassGrid}>
        {services.map((s, i) => (
          <div key={i} className={featuresStyles.glassCard}>
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={e => handleBlur(i, e)}
              className={featuresStyles.featureText}
            >
              {s}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const template2 = (
  <div className={featuresStyles.fancyWrapper}>
    <div className={featuresStyles.fancyHero}>
      <img src={image} className={featuresStyles.fancyImage} />
    </div>
    {/* ארבעת הקלפים – כל אחד מקבל הטיה שונה */}
    <div className={featuresStyles.fancyCards}>
      {services.map((s, i) => (
        <div
          key={i}
          className={featuresStyles.fancyCard}
          style={{ "--tilt": `${i % 2 === 0 ? -6 : 6}deg` } as React.CSSProperties}
        >
          <FaCheckCircle />
          <span
            contentEditable
            suppressContentEditableWarning
            onBlur={e => handleBlur(i, e)}
            className={featuresStyles.featureText}
          >
            {s}
          </span>
        </div>
      ))}
    </div>
  </div>
);


  const templates = [template0, template1, template2];

  return (
    <section
      className={featuresStyles.featuresSection}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div className={featuresStyles.arrowButtons}>
          <button onClick={() => setTemplateIndex((templateIndex - 1 + templates.length) % templates.length)}>
            <FaArrowRight />
          </button>
          <button onClick={() => setTemplateIndex((templateIndex + 1) % templates.length)}>
            <FaArrowLeft />
          </button>
        </div>
      )}

      {templates[templateIndex]}

      {isHovered && onDelete && (
        <div className={featuresStyles.actionBar}>
          <ActionsButtons onDelete={onDelete} sectionName="features" />
        </div>
      )}
    </section>
  );
}
