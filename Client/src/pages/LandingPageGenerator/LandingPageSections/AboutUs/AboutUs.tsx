import aboutUsStyles from './aboutUs.module.css';
import { useState } from 'react';
import ActionsButtons from '../../LandingPageActions/ActionsButtons/ActionsButtons';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface AboutUsProps {
  content: string;
  onDelete?: () => void;
}

const AboutUs = ({ content, onDelete }: AboutUsProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [text, setText] = useState(content);
  const [templateIndex, setTemplateIndex] = useState(0);

  const handleBlur = (e: React.FocusEvent<HTMLParagraphElement>) => {
    setText(e.currentTarget.innerText);
  };

  const templates = [
  <p
    key="template1"
    className={`${aboutUsStyles.aboutUsText} ${aboutUsStyles.template1}`}
    contentEditable
    suppressContentEditableWarning
    onBlur={handleBlur}
  >
    {text}
  </p>,
  <p
    key="template2"
    className={`${aboutUsStyles.aboutUsText} ${aboutUsStyles.template2}`}
    contentEditable
    suppressContentEditableWarning
    onBlur={handleBlur}
  >
    <strong>About Our Team:</strong><br />
    {text}
  </p>,
  <p
    key="template3"
    className={`${aboutUsStyles.aboutUsText} ${aboutUsStyles.template3}`}
    contentEditable
    suppressContentEditableWarning
    onBlur={handleBlur}
  >
    🌟 {text} 🌟
  </p>
];


  const handleNext = () => setTemplateIndex((templateIndex + 1) % templates.length);
  const handlePrev = () => setTemplateIndex((templateIndex - 1 + templates.length) % templates.length);

  return (
    <section
      className={aboutUsStyles.aboutUsSection}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div className={aboutUsStyles.arrowButtons}>
          <button onClick={handlePrev}><FaArrowRight /></button>
          <button onClick={handleNext}><FaArrowLeft /></button>
        </div>
      )}
      
      {templates[templateIndex]}

      {isHovered && onDelete && (
        <div className={aboutUsStyles.actionBar}>
          <ActionsButtons onDelete={onDelete} sectionName="aboutUs" />
        </div>
      )}
    </section>
  );
};

export default AboutUs;
