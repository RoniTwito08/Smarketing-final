import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { businessInfoService } from "../../services/besinessInfo.service";
import { FormValues } from "../../types/businessInfo";
import { toast } from "react-toastify";
import { config } from "../../config";
import { Controller, useForm, useWatch } from "react-hook-form";
import "./BusinessSetting.css";
// import { useWatch } from "react-hook-form";
import { ToastContainer } from "react-toastify";

export const BusinessSetting = () => {
  const { user, accessToken } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    // getValues,
    // formState: { errors },
  } = useForm<FormValues>();

  const selectedBusinessField = useWatch({
    control,
    name: "businessField",
  });

  // const socialPlatforms = [
  //   "Facebook",
  //   "Instagram",
  //   "TikTok",
  //   "Twitter",
  //   "Other",
  // ];

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

  const onSubmit = async (data: Partial<FormValues>) => {
    if (!accessToken) return;
    if (!user || !user._id) return;
    try {
      if (data._id) {
        await businessInfoService.updateBusinessInfo(
          data._id,
          data,
          accessToken
        );
        toast.success("פרטי העסק עודכנו בהצלחה");
      } else {
        // טופס ריק
        const created = await businessInfoService.createBusinessInfo(
          data as FormValues,
          user._id,
          accessToken
        );
        setValue("_id", created._id); // כדי שהטופס יידע שיש כבר _id להבא
        toast.success("פרטי העסק נשמרו בהצלחה");
      }
    } catch (err) {
      console.error("Error saving business info", err);
      toast.error("שגיאה בשמירת פרטי העסק");
    }
  };

  useEffect(() => {
    const fetchBusinessInfo = async () => {
      if (!user?._id || !accessToken) return;
      try {
        const response = await businessInfoService.getBusinessInfo(
          user._id,
          accessToken
        );
        const data = response.data;
        Object.entries(data).forEach(([key, value]) => {
          setValue(
            key as keyof FormValues,
            value as FormValues[keyof FormValues]
          );
        });

        if (data.logo) setLogoPreview(`${config.apiUrl}/${data.logo}`);
        if (data.businessImages?.length) {
          setImagePreviews(
            data.businessImages.map((img: string) => `${config.apiUrl}/${img}`)
          );
        }
        setIsLoading(false);
      } catch (err: any) {
        if (err.status === 404) {
          setIsLoading(false);
        } else {
          console.error("Error fetching business info", err);
          toast.error("שגיאה בשליפת מידע עסקי");
        }
      }
    };
    fetchBusinessInfo();
  }, [user, accessToken, setValue]);

  const businessType = useWatch({
    control,
    name: "businessType",
  });

  if (isLoading) return <Typography>טוען פרטי עסק...</Typography>;

  const platforms = [
    "facebook",
    "instagram",
    "tiktok",
    "linkedin",
    "other",
  ] as const;
  type SocialPlatform = (typeof platforms)[number];

  return (
    <form className="profileContainer" onSubmit={handleSubmit(onSubmit)}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="userInfo">
        <div className="userDetails">
          <div className="businessFieldRow">
            <label htmlFor="businessName">שם העסק:</label>
            <Controller
              name="businessName"
              control={control}
              defaultValue=""
              rules={{
                required: "יש להזין שם לעסק",
                minLength: { value: 2, message: "לפחות 2 תווים" },
              }}
              render={({ field }) => <input {...field} />}
            />
          </div>

          <div className="businessFieldRow">
            <label htmlFor="businessType">סוג עסק:</label>
            <Controller
              name="businessType"
              control={control}
              defaultValue=""
              rules={{ required: "יש לבחור סוג עסק" }}
              render={({ field }) => (
                <select {...field}>
                  <option value="">בחר סוג עסק</option>
                  <option value="פיזי">עסק פיזי</option>
                  <option value="דיגיטלי">עסק דיגיטלי</option>
                </select>
              )}
            />
          </div>

          {businessType === "פיזי" && (
            <div className="businessFieldRow">
              <label htmlFor="businessAddress">כתובת:</label>
              <Controller
                name="businessAddress"
                control={control}
                defaultValue=""
                rules={{ required: "יש להזין כתובת" }}
                render={({ field }) => <input {...field} />}
              />
            </div>
          )}

          <div className="businessFieldRow">
            <label htmlFor="businessField">תחום פעילות:</label>
            <Controller
              name="businessField"
              control={control}
              defaultValue=""
              rules={{ required: "יש להזין תחום פעילות" }}
              render={({ field }) => (
                <select {...field}>
                  <option value="">בחר תחום</option>
                  {professions.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>

          {selectedBusinessField === "אחר" && (
            <div className="businessFieldRow">
              <label htmlFor="customBusinessField">
                נא פרט את תחום הפעילות:
              </label>
              <Controller
                name="customBusinessField"
                control={control}
                defaultValue=""
                rules={{ required: "נא לפרט את התחום אם בחרת 'אחר'" }}
                render={({ field }) => <input {...field} />}
              />
            </div>
          )}

          <div className="businessFieldRow">
            <label htmlFor="businessFieldDetails">פרטים נוספים:</label>
            <Controller
              name="businessFieldDetails"
              control={control}
              defaultValue=""
              render={({ field }) => <input {...field} />}
            />
          </div>

          <div className="businessFieldRow">
            <label htmlFor="serviceAreas">איזור שירות:</label>
            <Controller
              name="serviceAreas"
              control={control}
              defaultValue=""
              rules={{ required: "יש להזין איזור שירות" }}
              render={({ field }) => <textarea {...field} />}
            />
          </div>

          <div className="businessFieldRow">
            <label htmlFor="serviceDescription">מה השירות שאתה מספק?</label>
            <Controller
              name="serviceDescription"
              control={control}
              defaultValue=""
              rules={{ required: "יש להזין תיאור שירות" }}
              render={({ field }) => <textarea {...field} />}
            />
          </div>

          <div className="businessFieldRow">
            <label htmlFor="uniqueService">שירות חדש או ייחודי:</label>
            <Controller
              name="uniqueService"
              control={control}
              defaultValue=""
              rules={{ required: "יש להזין תיאור שירות" }}
              render={({ field }) => <textarea {...field} />}
            />
          </div>

          <div className="businessFieldRow">
            <label htmlFor="specialPackages">חבילות שירות מיוחדות:</label>
            <Controller
              name="specialPackages"
              control={control}
              defaultValue=""
              rules={{ required: "יש להזין תיאור חבילות שירות" }}
              render={({ field }) => <textarea {...field} />}
            />
          </div>

          <div className="businessFieldRow">
            <label htmlFor="incentives">תמריצים ללקוחות חדשים:</label>
            <Controller
              name="incentives"
              control={control}
              defaultValue=""
              rules={{ required: "יש להזין תמריצים ללקוחות חדשים" }}
              render={({ field }) => <textarea {...field} />}
            />
          </div>

          <div className="businessFieldRow">
            <label htmlFor="designPreferences">העדפות עיצוב:</label>
            <Controller
              name="designPreferences"
              control={control}
              defaultValue=""
              render={({ field }) => <input {...field} />}
            />
          </div>

          <div className="businessFieldRow fullWidth">
            <label style={{ width: "100%", fontWeight: "600" }}>
              רשתות חברתיות:
            </label>
          </div>

          {platforms.map((platform) => (
            <div className="businessFieldRow" key={platform}>
              <label htmlFor={`socialLinks.${platform}`}>
                {platform.charAt(0).toUpperCase() + platform.slice(1)}:
              </label>
              <Controller
                name={
                  `socialLinks.${platform}` as `socialLinks.${SocialPlatform}`
                }
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input {...field} placeholder={`קישור ל-${platform}`} />
                )}
              />
            </div>
          ))}

          <div className="businessFieldRow">
            <label htmlFor="logoFile">לוגו:</label>
            <div style={{ flex: 1 }}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () =>
                      setLogoPreview(reader.result as string);
                    reader.readAsDataURL(file);
                    setValue("logoFile", file);
                  }
                }}
              />
              {logoPreview && (
                <div className="imagePreviewContainer">
                  <img
                    src={logoPreview}
                    alt="Preview"
                    className="imagePreview"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="businessFieldRow">
            <label htmlFor="businessImageFiles">תמונות נוספות של העסק:</label>
            <div style={{ flex: 1 }}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    const previews: string[] = [];
                    Array.from(files).forEach((file) => {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        previews.push(reader.result as string);
                        if (previews.length === files.length) {
                          setImagePreviews(previews);
                        }
                      };
                      reader.readAsDataURL(file);
                    });
                    setValue("businessImageFiles", files);
                  }
                }}
              />
              {imagePreviews.length > 0 && (
                <div className="imagePreviewContainer">
                  {imagePreviews.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`business-img-${i}`}
                      className="imagePreview"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="businessFieldRow">
            <label htmlFor="objective">מטרה לקמפיין:</label>
            <Controller
              name="objective"
              control={control}
              defaultValue={undefined}
              render={({ field }) => (
                <select {...field}>
                  <option value="">בחר מטרה</option>
                  <option value="brandAwareness">
                    הגדלת המודעות למותג שלך
                  </option>
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
          </div>

          <div className="buttonContainer">
            <button type="submit" className="saveButton">
              שמור שינויים
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
