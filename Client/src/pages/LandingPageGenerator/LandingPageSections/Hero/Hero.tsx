import { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import heroStyles from "./hero.module.css";

interface HeroProps {
  title: string;
  content: string;
  buttonText: string;
}

export default function Hero({ title, content, buttonText }: HeroProps) {
  const [textValues, setTextValues] = useState<{ [key: string]: string }>({
    "1": title,
    "2": content,
    "3": buttonText,
  });

  const [templateIndex, setTemplateIndex] = useState(0);

  useEffect(() => {
    setTextValues({ "1": title, "2": content, "3": buttonText });
  }, [title, content, buttonText]);

  const handleBlur = (id: string, e: React.FocusEvent<HTMLElement>) => {
    const newText = e.currentTarget.innerText;
    setTextValues((prev) => ({ ...prev, [id]: newText }));
  };

  const templates = [
    <section className={heroStyles.heroContainer} key="classic">
      <div className={heroStyles.heroContent}>
        <h3
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => handleBlur("1", e)}
          className={heroStyles.heroTitle}
        >
          {textValues["1"]}
        </h3>
        <p
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => handleBlur("2", e)}
          className={heroStyles.heroText}
        >
          {textValues["2"]}
        </p>
        <button
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => handleBlur("3", e)}
          className={heroStyles.heroButton}
        >
          {textValues["3"]}
        </button>
      </div>
    </section>,

    <section className={heroStyles.splitLayout} key="split">
      <div className={heroStyles.splitLeft}>
        <h3
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => handleBlur("1", e)}
          className={heroStyles.heroTitle}
        >
          {textValues["1"]}
        </h3>
        <p
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => handleBlur("2", e)}
          className={heroStyles.heroText}
        >
          {textValues["2"]}
        </p>
        <button
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => handleBlur("3", e)}
          className={heroStyles.heroButton}
        >
          {textValues["3"]}
        </button>
      </div>
      <div className={heroStyles.splitRight}></div>
    </section>,

    <section className={heroStyles.overlayHero} key="overlay">
      <div className={heroStyles.overlayContent}>
        <h3
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => handleBlur("1", e)}
          className={heroStyles.overlayTitle}
        >
          {textValues["1"]}
        </h3>
        <p
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => handleBlur("2", e)}
          className={heroStyles.overlayText}
        >
          {textValues["2"]}
        </p>
        <button
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => handleBlur("3", e)}
          className={heroStyles.overlayButton}
        >
          {textValues["3"]}
        </button>
      </div>
    </section>,
  ];

  return (
    <div className={heroStyles.wrapper}>
      <div className={heroStyles.arrowButtons}>
        <button onClick={() => setTemplateIndex((templateIndex - 1 + templates.length) % templates.length)}>
          <FaArrowRight />
        </button>
        <button onClick={() => setTemplateIndex((templateIndex + 1) % templates.length)}>
          <FaArrowLeft />
        </button>
      </div>
      {templates[templateIndex]}
    </div>
  );
}
