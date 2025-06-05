import React from "react";
import { useFormContext, Controller } from "react-hook-form";

const Step1: React.FC = () => {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext(); // חיבור לקונטקסט של הטופס הראשי

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
    "אחר", // כדי להפעיל שדה טקסט
  ];

  const businessType = watch("businessType");

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>מידע כללי</h1>

      {/* שורה 1: שם העסק */}
      <div style={styles.formGroup}>
        <label style={styles.label} htmlFor="businessName">
          מה שם העסק שלך?
        </label>
        <Controller
          control={control}
          name="businessName"
          defaultValue=""
          rules={{ required: "שדה חובה" }}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              id="businessName"
              style={styles.input}
            />
          )}
        />
        {errors.businessName && (
          <p style={{ color: "red" }}>
            {typeof errors.businessName?.message === "string"
              ? errors.businessName.message
              : ""}
          </p>
        )}
      </div>

      {/* שורה 2: סוג העסק + כתובת העסק */}
      <div style={styles.row}>
        <div style={{ flex: 1 }}>
          <label style={styles.label} htmlFor="businessType">
            מה סוג העסק שלך?
          </label>
          <Controller
            name="businessType"
            control={control}
            defaultValue=""
            rules={{ required: "יש לבחור סוג עסק" }}
            render={({ field }) => (
              <select {...field} id="businessType" style={styles.select}>
                <option value="">בחר סוג עסק</option>
                <option value="פיזי">עסק פיזי</option>
                <option value="דיגיטלי">עסק דיגיטלי</option>
              </select>
            )}
          />
          {errors.businessType && (
            <p style={{ color: "red" }}>
              {typeof errors.businessType?.message === "string"
                ? errors.businessType.message
                : ""}
            </p>
          )}
        </div>

        {businessType === "פיזי" && (
          <div style={{ flex: 1 }}>
            <label style={styles.label} htmlFor="businessAddress">
              כתובת העסק
            </label>
            <Controller
              name="businessAddress"
              control={control}
              defaultValue=""
              rules={{ required: "יש למלא כתובת" }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  id="businessAddress"
                  style={styles.input}
                />
              )}
            />
            {errors.businessAddress && (
              <p style={{ color: "red" }}>
                {typeof errors.businessAddress?.message === "string"
                  ? errors.businessAddress.message
                  : ""}
              </p>
            )}
          </div>
        )}
      </div>

      {/* שורה 3: תחום הפעילות (בחירה + "אחר" בטקסט) */}
      <div style={styles.row}>
        <div style={{ flex: 1 }}>
          <label style={styles.label} htmlFor="businessField">
            מה תחום הפעילות של העסק שלך?
          </label>
          <Controller
            name="businessField"
            control={control}
            defaultValue=""
            rules={{ required: "יש לבחור תחום פעילות" }}
            render={({ field }) => (
              <select {...field} id="businessField" style={styles.select}>
                <option value="">בחר תחום</option>
                {professions.map((profession) => (
                  <option key={profession} value={profession}>
                    {profession}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.businessField && (
            <p style={{ color: "red" }}>
              {typeof errors.businessField?.message === "string"
                ? errors.businessField.message
                : ""}
            </p>
          )}
        </div>

        {/* תיבת טקסט מופיעה רק אם נבחר "אחר" */}
        {watch("businessField") === "אחר" && (
          <div style={{ flex: 1, marginRight: "1rem" }}>
            <label style={styles.label} htmlFor="customBusinessField">
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
                  placeholder="הקלד את התחום שלך"
                  style={styles.input}
                />
              )}
            />
            {errors.customBusinessField && (
              <p style={{ color: "red" }}>
                {typeof errors.customBusinessField?.message === "string"
                  ? errors.customBusinessField.message
                  : ""}
              </p>
            )}
          </div>
        )}
      </div>

      {/* שורה נפרדת: פרטים נוספים */}
      <div style={styles.row}>
        <div style={{ flex: 1 }}>
          <label style={styles.label} htmlFor="businessFieldDetails">
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
                style={styles.input}
              />
            )}
          />
        </div>
      </div>

      {/* שורה 3: תחום הפעילות + פרטים נוספים
      <div style={styles.row}>
        <div style={{ flex: 1 }}>
          <label style={styles.label} htmlFor="businessField">
            מה תחום הפעילות של העסק שלך?
          </label>
          <Controller
            name="businessField"
            control={control}
            defaultValue=""
            rules={{ required: "יש לבחור תחום פעילות" }}
            render={({ field }) => (
              <select {...field} id="businessField" style={styles.select}>
                <option value="">בחר תחום</option>
                {professions.map((profession) => (
                  <option key={profession} value={profession}>
                    {profession}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.businessField && (
            <p style={{ color: "red" }}>
              {typeof errors.businessField?.message === "string"
                ? errors.businessField.message
                : ""}
            </p>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <label style={styles.label} htmlFor="businessFieldDetails">
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
                style={styles.input}
              />
            )}
          />
        </div>
      </div> */}

      {/* שורה 4: מספר טלפון */}
      <div style={styles.row}>
        <div style={{ flex: 1 }}>
          <label style={styles.label} htmlFor="phonePrefix">
            קידומת
          </label>
          <Controller
            name="phonePrefix"
            control={control}
            defaultValue=""
            rules={{ required: "בחרי קידומת" }}
            render={({ field }) => (
              <select {...field} id="phonePrefix" style={styles.select}>
                <option value="">בחרי</option>
                {[
                  "050",
                  "051",
                  "052",
                  "053",
                  "054",
                  "055",
                  "058",
                  "072",
                  "073",
                  "074",
                  "075",
                  "076",
                  "077",
                  "078",
                ].map((prefix) => (
                  <option key={prefix} value={prefix}>
                    {prefix}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.phonePrefix && (
            <p style={{ color: "red" }}>
              {typeof errors.phonePrefix?.message === "string"
                ? errors.phonePrefix.message
                : ""}
            </p>
          )}
        </div>

        <div style={{ flex: 2 }}>
          <label style={styles.label} htmlFor="phoneNumber">
            מספר טלפון (7 ספרות)
          </label>
          <Controller
            name="phoneNumberBody"
            control={control}
            defaultValue=""
            rules={{
              required: "מלאי את מספר הטלפון",
              pattern: {
                value: /^[0-9]{7}$/,
                message: "יש להזין בדיוק 7 ספרות",
              },
            }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                id="phoneNumber"
                placeholder="1234567"
                maxLength={7}
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(
                    /\D/g,
                    ""
                  );
                  field.onChange(e); // כדי לעדכן את React Hook Form
                }}
                style={styles.input}
              />
            )}
          />

          {errors.phoneNumber && (
            <p style={{ color: "red" }}>
              {typeof errors.phoneNumber?.message === "string"
                ? errors.phoneNumber.message
                : ""}
            </p>
          )}
        </div>
      </div>

      {/* שורה 5: אזורים */}
      <div style={styles.formGroup}>
        <label style={styles.label} htmlFor="serviceAreas">
          באילו אזורים או מדינות אתה מציע את השירותים שלך?
        </label>
        <Controller
          name="serviceAreas"
          control={control}
          defaultValue=""
          rules={{ required: "יש למלא את שדה השירותים" }}
          render={({ field }) => (
            <textarea {...field} id="serviceAreas" style={styles.textarea} />
          )}
        />
        {errors.serviceAreas && (
          <p style={{ color: "red" }}>
            {typeof errors.serviceAreas?.message === "string"
              ? errors.serviceAreas.message
              : ""}
          </p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Assistant, sans-serif",
    maxWidth: "800px",
    margin: "0 auto",
    padding: "10px",
    backgroundColor: "transparent",
    display: "inline-block",
    maxHeight: "400px", // גובה מקסימלי
    overflowY: "auto", // גלילה אם התוכן חורג
  },
  header: {
    fontSize: "20px", // פונט קטן יותר
    fontWeight: "bold",
    marginBottom: "10px",
    textAlign: "center",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "10px", // מרווח קטן יותר
  },
  row: {
    display: "flex",
    gap: "10px", // מרווח קטן יותר בין עמודות
    marginBottom: "10px", // מרווח קטן יותר בין השורות
  },
  label: {
    fontSize: "14px", // פונט קטן יותר
    color: "#333",
    marginBottom: "5px", // מרווח קטן בין תווית לשדה
  },
  input: {
    flex: 1,
    padding: "8px", // ריפוד קטן יותר
    fontSize: "12px", // פונט קטן יותר
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box",
  },
  select: {
    flex: 1,
    padding: "8px 24px 8px 8px", // ריפוד ימני נוסף כדי למנוע חפיפה עם החץ
    fontSize: "12px", // פונט קטן יותר
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box",
    appearance: "none", // להסיר את עיצוב הדפדפן של החץ (לא חובה)
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='%23333' d='M0 0L2 2L4 0z'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 8px center",
  },
  textarea: {
    width: "100%",
    padding: "8px", // ריפוד קטן יותר
    fontSize: "12px", // פונט קטן יותר
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box",
  },
} as const;

export default Step1;
