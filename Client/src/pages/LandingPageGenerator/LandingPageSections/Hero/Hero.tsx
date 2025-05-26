import { useState, useEffect } from "react";
import heroStyles from "./hero.module.css";

interface HeroProps {
  title: string;
  content: string;
  buttonText: string;
}

type ItemType = {
  id: string;
  type: "title" | "content" | "button";
};

const items: ItemType[] = [
  { id: "1", type: "title" },
  { id: "2", type: "content" },
  { id: "3", type: "button" },
];

function Hero({ title, content, buttonText }: HeroProps) {
  const [textValues, setTextValues] = useState<{ [key: string]: string }>({
    "1": title,
    "2": content,
    "3": buttonText,
  });

  useEffect(() => {
    setTextValues({ "1": title, "2": content, "3": buttonText });
  }, [title, content, buttonText]);

  const handleBlur = (id: string, e: React.FocusEvent<HTMLElement>) => {
    const newText = e.currentTarget.innerText;
    setTextValues((prev) => ({ ...prev, [id]: newText }));
  };

  const renderContent = (item: ItemType) => {
    const commonProps = {
      contentEditable: true,
      suppressContentEditableWarning: true,
      onBlur: (e: React.FocusEvent<HTMLElement>) => handleBlur(item.id, e),
      className:
        item.type === "title"
          ? heroStyles.heroTitle
          : item.type === "content"
          ? heroStyles.heroText
          : heroStyles.heroButton,
    };

    switch (item.type) {
      case "title":
        return <h3 {...commonProps}>{textValues[item.id]}</h3>;
      case "content":
        return <p {...commonProps}>{textValues[item.id]}</p>;
      default:
        return null;
    }
  };

  return (
    <section className={heroStyles.heroContainer}>
      <div className={heroStyles.heroContent}>
        {items.map((item) => (
          <div key={item.id} className={heroStyles.heroItem}>
            {renderContent(item)}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Hero;
