
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import "./components/LeavesFlowSection/LeavesFlowSection"
import LeavesFlowSection from "./components/LeavesFlowSection/LeavesFlowSection";
import TrackProgressSection from "./components/TrackProgress/TrackProgress";
import Footer from "./components/Footer/Footer";
import FAQSection from "./components/Questions&Answers/QA";
import Review from "./components/Reviewers/Review";

export default function LP() {
  return (
    <>
      <Header />
      <Hero />
      <LeavesFlowSection />
      <TrackProgressSection
        section="About Us"
        mainImgSrc="/src/assets/explainPicture.png"
        accentImgSrc="/src/assets/explainPicture.png"
        onCtaClick={() => console.log("CTA clicked")}
        title="אנחנו מחברים חוכמה לשיווק בעולם הדיגיטלי"
        description="עם פלטפורמה חדשנית וידידותית, אנחנו מאפשרים לעסקים ליצור דפי נחיתה מותאמים אישית, לנהל קמפיינים בלחיצת כפתור ולצפות בתוצאות בזמן אמת. קל, חכם, ומדויק – כך ההצלחה שלך הופכת למציאות. גלול למטה וגלו איך להפוך כל רעיון להזדמנות מנצחת!"
        imagePosition="right"
      />
      <TrackProgressSection
        section="?Why Us"
        mainImgSrc="/src/assets/explainPicture.png"
        accentImgSrc="/src/assets/explainPicture.png"
        onCtaClick={() => console.log("CTA clicked")}
        title="בנו דפי נחיתה והפעילו קמפיינים"
        imagePosition="left"
      >
        <ul className="bulletList">
          <li className="bulletItem">
            <b>⚡ מהירות ויעילות:</b>&nbsp;בנו דפי נחיתה והפעילו קמפיינים שיווקיים תוך דקות בודדות
          </li>
          <li className="bulletItem">
            <b>✨ פשטות בשימוש:</b>&nbsp;ממשק אינטואיטיבי שמקל עליכם לנהל שיווק דיגיטלי בקלות ובמהירות
          </li>
          <li className="bulletItem">
            <b>📊 תוצאות בזמן אמת:</b>&nbsp;עקבו אחרי נתוני הקמפיינים שלכם בזמן אמת
          </li>
          <li className="bulletItem">
            <b>🎯 מותאם לצרכים שלכם:</b>&nbsp;פתרון שמתאים לכל תחום עסקי, עם גמישות מלאה לעסק שלך
          </li>
          <li className="bulletItem">
            <b>🧩 הכל במקום אחד:</b>&nbsp;שילוב מושלם של יצירת דף נחיתה איכותי ושיווק חכם של הקמפיין
          </li>
        </ul>
        <br></br>
      </TrackProgressSection>
      <Review />
      <TrackProgressSection
        section="?Why Us"
        mainImgSrc="/src/assets/explainPicture.png"
        accentImgSrc="/src/assets/explainPicture.png"
        onCtaClick={() => console.log("CTA clicked")}
        title= "תהליך פשוט בשלושה שלבים בלבד:"
        imagePosition="right"
      >
        <>
              <p>תהליך פשוט בשלושה שלבים בלבד:</p>
              <p>
                1️⃣ נרשמים לאתר וממלאים פרטים על העסק.
              </p>
              <p>
                2️⃣ יוצרים דף נחיתה מעוצב ומותאם אישית.
              </p>
              <p>
                3️⃣ מפעילים קמפיין שיווקי עם תקציב לבחירתכם וצופים בתוצאות
                וניתוחים.
              </p>
              <p >הכול בלחיצת כפתור, תוך דקות בודדות!</p>
            </>
        <br></br>
      </TrackProgressSection>
      <FAQSection />
      <Footer />
    </>
  );
}
