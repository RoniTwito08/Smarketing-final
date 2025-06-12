import React from "react";

const MainSentence: React.FC = () => {
  return (
    <div style={styles.MainDiv} className="MainSentence">
      <h1 style={styles.MainH1}>
        שיווק דיגיטלי מתקדם לעסקים <br />
        עם כוחה של הבינה המלאכותית
      </h1>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  MainDiv: {
    marginTop: "0px",
    padding: "0 16px", 
    width: "100%",
    boxSizing: "border-box",
  },
  MainH1: {
    color: "#021024",
    fontFamily: "Assistant",
    fontSize: "clamp(24px, 6vw, 60px)", 
    fontWeight: "bold",
    textAlign: "right" as const,
    lineHeight: "1.6",
    margin: 0,
    padding: 0,
  },
};

export default MainSentence;
