import React from "react";
import { useFormContext, Controller } from "react-hook-form";

const Step5: React.FC = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>מטרות עסקיות ודף הנחיתה</h1>

      {/* בחירת מטרה */}
      <div style={styles.question}>
        <label style={styles.label} htmlFor="objective">
          בחירת מטרה (Objective):
        </label>
        <Controller
          name="objective"
          control={control}
          defaultValue=""
          rules={{ required: "יש לבחור מטרה עסקית" }}
          render={({ field }) => (
            <select {...field} id="objective" style={styles.select}>
              <option value="" disabled>
                בחר מטרה
              </option>
              <option value="brandAwareness">הגדלת המודעות למותג שלך</option>
              <option value="reach">הגעה למספר גדול של אנשים</option>
              <option value="siteVisit">
                ביקור באתר / אפליקציה / חנות פיזית
              </option>
              <option value="engagement">
                מעורבות - לייקים, תגובות או שיתופים
              </option>
              <option value="videoViews">צפיות בווידאו</option>
              <option value="sales">הגדלת המכירות</option>
            </select>
          )}
        />
        {errors.objective && (
          <p style={{ color: "red" }}>
            {typeof errors.objective?.message === "string"
              ? errors.objective.message
              : ""}
          </p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    direction: "rtl",
    fontFamily: "Assistant, sans-serif",
    maxWidth: "800px",
    margin: "0 auto",
    padding: "10px",
    backgroundColor: "transparent",
    display: "inline-block",
    maxHeight: "400px",
    overflowY: "auto",
  },
  header: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
    textAlign: "center",
  },
  question: {
    marginBottom: "20px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "bold",
    display: "block",
    marginBottom: "5px",
  } as const,
  select: {
    width: "100%",
    padding: "8px 24px 8px 8px",
    fontSize: "12px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box",
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='%23333' d='M0 0L2 2L4 0z'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 8px center",
  },
} as const;

export default Step5;
