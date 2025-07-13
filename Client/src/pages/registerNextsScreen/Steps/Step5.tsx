import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import styles from "./Step5.module.css";

const Step5: React.FC = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>מטרות עסקיות ודף הנחיתה</h1>

      {/* מטרה עסקית */}
      <div className={styles.question}>
        <label htmlFor="objective" className={styles.label}>
          בחירת מטרה (Objective):
        </label>

        <Controller
          name="objective"
          control={control}
          defaultValue=""
          rules={{ required: "יש לבחור מטרה עסקית" }}
          render={({ field }) => (
            <select {...field} id="objective" className={styles.select}>
              <option value="" disabled>
                בחר מטרה
              </option>
              <option value="brandAwareness">הגדלת המודעות למותג שלך</option>
              <option value="reach">הגעה למספר גדול של אנשים</option>
              <option value="siteVisit">ביקור באתר / אפליקציה / חנות פיזית</option>
              <option value="engagement">מעורבות – לייקים, תגובות או שיתופים</option>
              <option value="videoViews">צפיות בווידאו</option>
              <option value="sales">הגדלת המכירות</option>
            </select>
          )}
        />
        {errors.objective && (
          <p className={styles.error}>{errors.objective?.message as string}</p>
        )}
      </div>
    </div>
  );
};

export default Step5;
