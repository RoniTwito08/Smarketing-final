import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import styles from "./Step3.module.css";

const Step3: React.FC = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>מוצרים ושירותים</h1>

      <div className={styles.row}>
        <div className={styles.col}>
          <label htmlFor="serviceDescription" className={styles.label}>
            מה השירות שאתה מספק?
          </label>
          <Controller
            name="serviceDescription"
            control={control}
            rules={{ required: "שדה חובה" }}
            render={({ field }) => (
              <textarea {...field} id="serviceDescription" className={styles.textarea} />
            )}
          />
          {errors.serviceDescription && (
            <p className={styles.error}>{errors.serviceDescription?.message as string}</p>
          )}
        </div>

        <div className={styles.col}>
          <label htmlFor="uniqueService" className={styles.label}>
            האם יש שירות חדש או ייחודי שאתה משיק כרגע?
          </label>
          <Controller
            name="uniqueService"
            control={control}
            rules={{ required: "שדה חובה" }}
            render={({ field }) => (
              <textarea {...field} id="uniqueService" className={styles.textarea} />
            )}
          />
          {errors.uniqueService && (
            <p className={styles.error}>{errors.uniqueService?.message as string}</p>
          )}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="specialPackages" className={styles.label}>
          האם יש חבילות שירות מיוחדות שאתה מציע?
        </label>
        <Controller
          name="specialPackages"
          control={control}
          rules={{ required: "שדה חובה" }}
          render={({ field }) => (
            <textarea {...field} id="specialPackages" className={styles.textarea} />
          )}
        />
        {errors.specialPackages && (
          <p className={styles.error}>{errors.specialPackages?.message as string}</p>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="incentives" className={styles.label}>
          האם יש תמריצים מיוחדים ללקוחות חדשים? (למשל: חודש ראשון חינם, מתנה ברכישה
          ראשונה)
        </label>
        <Controller
          name="incentives"
          control={control}
          rules={{ required: "שדה חובה" }}
          render={({ field }) => (
            <textarea {...field} id="incentives" className={styles.textarea} />
          )}
        />
        {errors.incentives && (
          <p className={styles.error}>{errors.incentives?.message as string}</p>
        )}
      </div>
    </div>
  );
};

export default Step3;
