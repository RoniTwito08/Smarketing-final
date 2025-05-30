import reviewsStyles from "./reviews.module.css";
import { FaStar, FaStarHalfAlt, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useEffect, useState } from "react";
import ActionsButtons from "../../LandingPageActions/ActionsButtons/ActionsButtons";

interface ReviewsProps {
  content: string[];
  onDelete?: () => void;
}

const Reviews = ({ content, onDelete }: ReviewsProps) => {
  const [randomIndex, setRandomIndex] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [reviews, setReviews] = useState<string[]>([]);
  const [templateIndex, setTemplateIndex] = useState(0);

  useEffect(() => {
    const cleaned = content
      .slice(2, content.length - 3)
      .map(r => r.replace(/['",]/g, "").trim());
    setReviews(cleaned);
  }, [content]);

  useEffect(() => {
    if (reviews.length) setRandomIndex(Math.floor(Math.random() * reviews.length));
  }, [reviews]);

  const handleBlur = (i: number, e: React.FocusEvent<HTMLParagraphElement>) => {
    const newText = e.currentTarget.innerText;
    setReviews(prev => {
      const copy = [...prev];
      copy[i] = newText;
      return copy;
    });
  };

  const renderStars = (i: number) =>
    i === randomIndex
      ? (
        <>
          <FaStar /><FaStar /><FaStar /><FaStar /><FaStarHalfAlt />
        </>
      ) : (
        <>
          <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
        </>
      );

  const templates = [
    <div className={reviewsStyles.gridContainer} key="grid">
      {reviews.map((txt, i) => (
        <div className={`${reviewsStyles.reviewCardBase} ${reviewsStyles.gridCard}`} key={i}>
          <img
            src={i % 2 ? "/src/assets/womenReviewer.png" : "/src/assets/menReviewer.png"}
            className={reviewsStyles.pic}
            alt="Reviewer"
          />
          <p
            className={reviewsStyles.reviewText}
            contentEditable
            suppressContentEditableWarning
            onBlur={e => handleBlur(i, e)}
          >
            {txt}
          </p>
          <div className={reviewsStyles.stars}>{renderStars(i)}</div>
        </div>
      ))}
    </div>,

    <div className={reviewsStyles.mediaContainer} key="media">
      {reviews.map((txt, i) => (
        <div className={`${reviewsStyles.reviewCardBase} ${reviewsStyles.mediaCard}`} key={i}>
          <img
            src={i % 2 ? "/src/assets/womenReviewer.png" : "/src/assets/menReviewer.png"}
            className={reviewsStyles.pic}
            alt="Reviewer"
          />
          <div>
            <p
              className={reviewsStyles.reviewText}
              contentEditable
              suppressContentEditableWarning
              onBlur={e => handleBlur(i, e)}
            >
              {txt}
            </p>
            <div className={reviewsStyles.stars}>{renderStars(i)}</div>
          </div>
        </div>
      ))}
    </div>,

    <div className={reviewsStyles.stackedContainer} key="stacked">
      {reviews.map((txt, i) => (
        <div className={`${reviewsStyles.reviewCardBase} ${reviewsStyles.stackedCard}`} key={i}>
          <img
            src={i % 2 ? "/src/assets/womenReviewer.png" : "/src/assets/menReviewer.png"}
            className={reviewsStyles.pic}
            alt="Reviewer"
          />
          <p
            className={reviewsStyles.reviewText}
            contentEditable
            suppressContentEditableWarning
            onBlur={e => handleBlur(i, e)}
          >
            {txt}
          </p>
          <div className={reviewsStyles.stars}>{renderStars(i)}</div>
        </div>
      ))}
    </div>,
  ];

  const prevTemplate = () =>
    setTemplateIndex(prev => (prev - 1 + templates.length) % templates.length);
  const nextTemplate = () =>
    setTemplateIndex(prev => (prev + 1) % templates.length);


return (
  <section
    className={reviewsStyles.reviewsSection}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  >
    <div className={reviewsStyles.wrapper}>
      <div className={reviewsStyles.arrowButtons}>
        <button onClick={prevTemplate}><FaArrowRight /></button>
        <button onClick={nextTemplate}><FaArrowLeft /></button>
      </div>

      {templates[templateIndex]}
    </div>

    {isHovered && onDelete && (
      <div className={reviewsStyles.actionBar}>
        <ActionsButtons onDelete={onDelete} sectionName="reviews" />
      </div>
    )}
  </section>
);

};

export default Reviews;
