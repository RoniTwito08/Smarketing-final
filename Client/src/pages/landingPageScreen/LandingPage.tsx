import HeroSection from "./Hero Section/HeroSection";
import SecondSection from "./Second Section/SecondSection";
import Explanations from "./Explanations/Explanations";
import FooterComp from "./components/Footer/FooterClient";
import explainPicture from "../../assets/explainPicture.png";

const LandingPage: React.FC = ({}) => {
  return (
    <div style={styles} className="page">
      <HeroSection />
      <SecondSection />
      <div id="explanations" style={styles.explanationsWrapper}>
        <Explanations
          direction="row"
          Header="About Us"
          imageSource={explainPicture}
          text={
            <>
              <p style={paragraphStyle}>
                אנחנו מחברים חוכמה לשיווק בעולם הדיגיטלי.
              </p>
              <p style={paragraphStyle}>
                עם פלטפורמה חדשנית וידידותית, אנחנו מאפשרים לעסקים ליצור דפי
                נחיתה מותאמים אישית, לנהל קמפיינים בלחיצת כפתור ולצפות בתוצאות
                בזמן אמת.
              </p>
              <p style={paragraphStyle}>
                קל, חכם, ומדויק – כך ההצלחה שלך הופכת למציאות.
              </p>
              <p style={paragraphStyle}>
                גלול למטה וגלו איך להפוך כל רעיון להזדמנות מנצחת!
              </p>
            </>
          }
        />
        <Explanations
          direction="row-reverse"
          Header="?Why Us"
          imageSource={explainPicture}
          text={
            <>
              <p style={paragraphStyle}>
                <b>⚡ מהירות ויעילות:</b> בנו דפי נחיתה והפעילו קמפיינים
                שיווקיים תוך דקות בודדות
              </p>
              <p style={paragraphStyle}>
                <b>✨ פשטות בשימוש:</b> ממשק אינטואיטיבי שמקל עליכם לנהל שיווק
                דיגיטלי בקלות ובמהירות
              </p>
              <p style={paragraphStyle}>
                <b>📊 תוצאות בזמן אמת:</b> עקבו אחרי נתוני הקמפיינים שלכם בזמן
                אמת
              </p>
              <p style={paragraphStyle}>
                <b>🎯 מותאם לצרכים שלכם:</b> פתרון שמתאים לכל תחום עסקי, עם
                גמישות מלאה לעסק שלך
              </p>
              <p style={paragraphStyle}>
                <b>🧩 הכל במקום אחד:</b> שילוב מושלם של יצירת דף נחיתה איכותי
                ושיווק חכם של הקמפיין
              </p>
            </>
          }
        />
        <Explanations
          direction="row"
          Header="How It Works"
          imageSource={explainPicture}
          text={
            <>
              <p style={paragraphStyle}>תהליך פשוט בשלושה שלבים בלבד:</p>
              <p style={paragraphStyle}>
                1️⃣ נרשמים לאתר וממלאים פרטים על העסק.
              </p>
              <p style={paragraphStyle}>
                2️⃣ יוצרים דף נחיתה מעוצב ומותאם אישית.
              </p>
              <p style={paragraphStyle}>
                3️⃣ מפעילים קמפיין שיווקי עם תקציב לבחירתכם וצופים בתוצאות
                וניתוחים.
              </p>
              <p style={paragraphStyle}>הכול בלחיצת כפתור, תוך דקות בודדות!</p>
            </>
          }
        />
      </div>
      <FooterComp />
    </div>
  );
};

const paragraphStyle = {
  lineHeight: "1.6",
  direction: "rtl" as const,
  textAlign: "justify" as const,
  fontSize: "22px",
};

const styles = {
  width: "100%",
  height: "100%",
  backgroundColor: "#F0F3FA",
  alignItems: "center" as const,
  margin: "0px",
  padding: "0px",
  display: "flex",
  flexDirection: "column" as const,
  gap: "22px",

  explanationsWrapper: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "80px", // או כל גובה רווח שאת רוצה בין הקטעים
    padding: "20px",
    alignItems: "center",
  },
};

export default LandingPage;
