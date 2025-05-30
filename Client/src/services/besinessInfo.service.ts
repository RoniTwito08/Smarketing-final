import { config } from "../config";
import { FormValues } from "../types/businessInfo";

export const businessInfoService = {
  async createBusinessInfo(data: FormValues, userId: string, token: string) {
    const formData = new FormData();

    // שדות טקסט רגילים
    for (const key in data) {
      if (key === "logoFiles") continue;

      const value = data[key as keyof FormValues];
      if (value === undefined || value === null) continue;

      if (Array.isArray(value)) {
        value.forEach((item) => {
          formData.append(key, item.toString());
        });
      } else if (typeof value === "object") {
        if (key === "socialLinks") {
          formData.append("socialLinks", JSON.stringify(value));
        } else {
          // כל אובייקט אחר – לדלג (לא לנסות להכניס אותו)
          console.warn(`לא הוזן ערך עבור ${key} מסוג object`);
        }
      } else {
        formData.append(key, value.toString());
      }
    }

    console.log("formData entries:", Array.from(formData.entries()));

    // קבצים
    if (data.logoFile) {
      formData.append("logo", data.logoFile);
    }

    if (data.businessImageFiles && data.businessImageFiles.length > 0) {
      Array.from(data.businessImageFiles).forEach((file) => {
        formData.append("businessImages", file);
      });
    }

    // for (let pair of formData.entries()) {
    //   console.log(`${pair[0]}:`, pair[1]);
    // }

    const response = await fetch(`${config.apiUrl}/business-info/${userId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "שגיאה בשליחת הטופס לשרת");
    }

    return response.json(); // נחזיר את התגובה מהשרת
  },

  async getBusinessInfo(userId: string, token: string) {
    const response = await fetch(`${config.apiUrl}/business-info/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw {
        message: errorData.message || "שגיאה בקבלת המידע",
        status: response.status,
      };
    }

    return await response.json();
  },

  async updateBusinessInfo(
    userId: string,
    data: Partial<FormValues>,
    token: string
  ) {
    const formData = new FormData();

    // אם המשתמש העלה לוגו חדש
    if (data.logoFile instanceof File) {
      formData.append("logoFile", data.logoFile);
    } else if (data.logo) {
      formData.append("logo", data.logo); // שמור את הנתיב הקיים
    }

    // אם המשתמש העלה תמונות חדשות
    if (data.businessImageFiles instanceof FileList) {
      Array.from(data.businessImageFiles).forEach((file) =>
        formData.append("businessImageFiles", file)
      );
    } else if (data.businessImages?.length) {
      data.businessImages.forEach((imgPath) =>
        formData.append("businessImages", imgPath)
      );
    }

    // כל שאר השדות
    const exclude = [
      "logoFile",
      "logo",
      "businessImageFiles",
      "businessImages",
    ];
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && !exclude.includes(key)) {
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key, item));
        } else if (key === "socialLinks" && typeof value === "object") {
          formData.append("socialLinks", JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    const response = await fetch(`${config.apiUrl}/business-info/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "שגיאה בעדכון המידע");
    }

    return await response.json();
  },
};
