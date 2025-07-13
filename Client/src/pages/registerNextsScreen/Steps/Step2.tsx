import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import styles from "./step2.module.css";

const Step2: React.FC = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const ageRanges = [
    "0-3",
    "3-6",
    "6-12",
    "12-18",
    "18-24",
    "24-30",
    "30-40",
    "40-50",
    "50-60",
    "60-70",
    "70+",
  ];

  const genders = ["זכר", "נקבה", "שני המינים"];

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>קהל יעד</h1>

      <div className={styles.row}>
        <div className={styles.col}>
          <label htmlFor="ageGroup" className={styles.label}>
            גיל
          </label>
          <Controller
            name="ageGroup"
            control={control}
            rules={{ required: "יש לבחור גיל" }}
            render={({ field }) => (
              <select {...field} id="ageGroup" className={styles.select}>
                <option value="">בחר גיל</option>
                {ageRanges.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.ageGroup && (
            <p className={styles.error}>{errors.ageGroup?.message as string}</p>
          )}
        </div>

        <div className={styles.col}>
          <label htmlFor="gender" className={styles.label}>
            מין
          </label>
          <Controller
            name="gender"
            control={control}
            rules={{ required: "יש לבחור מין" }}
            render={({ field }) => (
              <select {...field} id="gender" className={styles.select}>
                <option value="">בחר מין</option>
                {genders.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.gender && (
            <p className={styles.error}>{errors.gender?.message as string}</p>
          )}
        </div>
      </div>

      {/* פלח שוק */}
      <div className={styles.formGroup}>
        <label htmlFor="specificMarketSegment" className={styles.label}>
          האם יש פלח שוק ספציפי שאתה מעוניין למקד אליו את הקמפיינים?
        </label>
        <Controller
          name="specificMarketSegment"
          control={control}
          rules={{ required: "שדה חובה" }}
          render={({ field }) => (
            <textarea {...field} id="specificMarketSegment" className={styles.textarea} />
          )}
        />
        {errors.specificMarketSegment && (
          <p className={styles.error}>
            {errors.specificMarketSegment?.message as string}
          </p>
        )}
      </div>

      {/* לקוחות טיפוסיים */}
      <div className={styles.formGroup}>
        <label htmlFor="typicalCustomers" className={styles.label}>
          אילו לקוחות בדרך כלל משתמשים בשירות הזה?
        </label>
        <Controller
          name="typicalCustomers"
          control={control}
          rules={{ required: "שדה חובה" }}
          render={({ field }) => (
            <textarea {...field} id="typicalCustomers" className={styles.textarea} />
          )}
        />
        {errors.typicalCustomers && (
          <p className={styles.error}>{errors.typicalCustomers?.message as string}</p>
        )}
      </div>
    </div>
  );
};

export default Step2;
