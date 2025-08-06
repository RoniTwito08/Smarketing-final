import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import styles from "./Step1.module.css";

const Step1: React.FC = () => {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const professions = [
    "מעצב גרפי",
    "מתכנת",
    "אדריכל",
    "יועץ שיווק",
    "מאמן אישי",
    "רואה חשבון",
    "עורך דין",
    "מטפל הוליסטי",
    "מורה פרטי",
    "צלם",
    "קוסמטיקאית",
    "בונה אתרים",
    "מפעיל סדנאות",
    "מטפל רגשי",
    "נטורופת",
    "מנחה הורים",
    "יועץ עסקי",
    "ספר / מעצב שיער",
    "מנהל מדיה חברתית",
    "מעצבת פנים",
    "יועצת תזונה",
    "אחר",
  ];

  const businessType = watch("businessType");
  const businessField = watch("businessField");

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>מידע כללי</h1>

      {/* שם העסק */}
      <div className={styles.formGroup}>
        <label htmlFor="businessName" className={styles.label}>
          מה שם העסק שלך?
        </label>
        <Controller
          control={control}
          name="businessName"
          defaultValue=""
          rules={{ required: "שדה חובה" }}
          render={({ field }) => (
            <input {...field} type="text" id="businessName" className={styles.input} />
          )}
        />
        {errors.businessName && (
          <p className={styles.error}>{errors.businessName?.message as string}</p>
        )}
      </div>

      {/* סוג העסק + כתובת */}
      <div className={styles.row}>
        <div className={styles.col}>
          <label htmlFor="businessType" className={styles.label}>
            מה סוג העסק שלך?
          </label>
          <Controller
            name="businessType"
            control={control}
            defaultValue=""
            rules={{ required: "יש לבחור סוג עסק" }}
            render={({ field }) => (
              <select {...field} id="businessType" className={styles.select}>
                <option value="">בחר סוג עסק</option>
                <option value="פיזי">עסק פיזי</option>
                <option value="דיגיטלי">עסק דיגיטלי</option>
              </select>
            )}
          />
          {errors.businessType && (
            <p className={styles.error}>{errors.businessType?.message as string}</p>
          )}
        </div>

        {businessType === "פיזי" && (
          <div className={styles.col}>
            <label htmlFor="businessAddress" className={styles.label}>
              כתובת העסק
            </label>
            <Controller
              name="businessAddress"
              control={control}
              defaultValue=""
              rules={{ required: "יש למלא כתובת" }}
              render={({ field }) => (
                <input {...field} type="text" id="businessAddress" className={styles.input} />
              )}
            />
            {errors.businessAddress && (
              <p className={styles.error}>{errors.businessAddress?.message as string}</p>
            )}
          </div>
        )}
      </div>

      {/* תחום הפעילות + “אחר” */}
      <div className={styles.row}>
        <div className={styles.col}>
          <label htmlFor="businessField" className={styles.label}>
            מה תחום הפעילות של העסק שלך?
          </label>
          <Controller
            name="businessField"
            control={control}
            defaultValue=""
            rules={{ required: "יש לבחור תחום פעילות" }}
            render={({ field }) => (
              <select {...field} id="businessField" className={styles.select}>
                <option value="">בחר תחום</option>
                {professions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.businessField && (
            <p className={styles.error}>{errors.businessField?.message as string}</p>
          )}
        </div>

        {businessField === "אחר" && (
          <div className={styles.col}>
            <label htmlFor="customBusinessField" className={styles.label}>
              נא לציין את התחום
            </label>
            <Controller
              name="customBusinessField"
              control={control}
              defaultValue=""
              rules={{ required: "יש להזין תחום" }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  id="customBusinessField"
                  placeholder="הקלד/י תחום"
                  className={styles.input}
                />
              )}
            />
            {errors.customBusinessField && (
              <p className={styles.error}>{errors.customBusinessField?.message as string}</p>
            )}
          </div>
        )}
      </div>

      {/* פרטים נוספים */}
      <div className={styles.formGroup}>
        <label htmlFor="businessFieldDetails" className={styles.label}>
          פרטים נוספים
        </label>
        <Controller
          name="businessFieldDetails"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <input
              {...field}
              type="text"
              id="businessFieldDetails"
              placeholder="לא חובה"
              className={styles.input}
            />
          )}
        />
      </div>

      {/* טלפון */}
      <div className={styles.row}>
        <div className={styles.colSmall}>
          <label htmlFor="phonePrefix" className={styles.label}>
            קידומת
          </label>
          <Controller
            name="phonePrefix"
            control={control}
            defaultValue=""
            rules={{ required: "בחר קידומת" }}
            render={({ field }) => (
              <select {...field} id="phonePrefix" className={styles.select}>
                <option value="">בחר</option>
                {["050","051","052","053","054","055","058","072","073","074","075","076","077","078"].map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.phonePrefix && (
            <p className={styles.error}>{errors.phonePrefix?.message as string}</p>
          )}
        </div>

        <div className={styles.col}>
          <label htmlFor="phoneNumberBody" className={styles.label}>
            מספר טלפון (7 ספרות)
          </label>
          <Controller
            name="phoneNumberBody"
            control={control}
            defaultValue=""
            rules={{
              required: "יש להזין מספר טלפון",
              pattern: { value: /^[0-9]{7}$/, message: "7 ספרות בלבד" },
            }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                id="phoneNumberBody"
                maxLength={7}
                placeholder="1234567"
                className={styles.input}
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
                  field.onChange(e);
                }}
              />
            )}
          />
          {errors.phoneNumberBody && (
            <p className={styles.error}>{errors.phoneNumberBody?.message as string}</p>
          )}
        </div>
      </div>

      {/* אזורי שירות */}
      <div className={styles.formGroup}>
        <label htmlFor="serviceAreas" className={styles.label}>
          באילו אזורים או מדינות אתה מציע את השירותים שלך?
        </label>
        <Controller
          name="serviceAreas"
          control={control}
          defaultValue=""
          rules={{ required: "יש למלא את שדה השירותים" }}
          render={({ field }) => (
            <textarea {...field} id="serviceAreas" className={styles.textarea} />
          )}
        />
        {errors.serviceAreas && (
          <p className={styles.error}>{errors.serviceAreas?.message as string}</p>
        )}
      </div>
    </div>
  );
};

export default Step1;
