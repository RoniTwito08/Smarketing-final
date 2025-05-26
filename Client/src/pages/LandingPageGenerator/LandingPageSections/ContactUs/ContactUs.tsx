import { useState, useRef } from "react";
import axios from "axios";
import contactStyles from "./contactUs.module.css";
import { config } from "../../../../config";
import { useAuth } from "../../../../context/AuthContext";

const ContactUs = () => {
  const { user } = useAuth();
  const userIdRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const userId = userIdRef.current?.value; 

    try {
      await axios.post(`${config.apiUrl}/leads/createLead`, {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        userId: userId, 
      });

      setFormData({ fullName: "", email: "", phone: "", message: "" });
    } catch (err: any) {
      console.error("❌ Error:", err);
      setError(err.response?.data?.message || "שגיאה בשליחת הפרטים");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={contactStyles.contactSection}>
      <h2 className={contactStyles.title}>📞 צור קשר</h2>
      <p className={contactStyles.description}>
        השאירו פרטים ונחזור אליכם בהקדם
      </p>
      <form className={contactStyles.contactForm} onSubmit={handleSubmit}>
        <input
          type="hidden"
          name="userId"
          ref={userIdRef} 
          value={user?._id || ""}
          readOnly
        />

        <input
          type="text"
          name="fullName"
          placeholder="שם מלא"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="אימייל"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="מספר טלפון"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="הודעה / שאלה (אופציונלי)"
          value={formData.message}
          onChange={handleChange}
        />
        <button
          type="submit"
          className={contactStyles.submitButton}
          disabled={loading}
        >
          {loading ? "שולח..." : "📩 שלח פרטים"}
        </button>
        {error && <p className={contactStyles.error}>{error}</p>}
      </form>
    </section>
  );
};

export default ContactUs;
