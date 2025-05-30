import { useState, useRef } from "react";
import axios from "axios";
import contactStyles from "./contactUs.module.css";
import { config } from "../../../../config";
import { useAuth } from "../../../../context/AuthContext";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

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
  const [templateIndex, setTemplateIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  // const isFirstTemplate = templateIndex === 0;
  // const isSecondTemplate = templateIndex === 1;
  // const isThirdTemplate = templateIndex === 2;

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
        userId,
      });
      setFormData({ fullName: "", email: "", phone: "", message: "" });
    } catch (err: any) {
      setError(err.response?.data?.message || "שגיאה בשליחת הפרטים");
    } finally {
      setLoading(false);
    }
  };

  const renderForm = (style: string) => (
    <form className={`${contactStyles.contactForm} ${contactStyles[style]}`} onSubmit={handleSubmit}>
      <input type="hidden" name="userId" ref={userIdRef} value={user?._id || ""} readOnly />
      <input name="fullName" placeholder="שם מלא" value={formData.fullName} onChange={handleChange} required />
      <input name="email" placeholder="אימייל" value={formData.email} onChange={handleChange} required />
      <input name="phone" placeholder="טלפון" value={formData.phone} onChange={handleChange} required />
      <textarea name="message" placeholder="הודעה / שאלה (אופציונלי)" value={formData.message} onChange={handleChange} />
      <button type="submit" className={contactStyles.submitButton} disabled={loading}>
        {loading ? "שולח..." : "📨 שלח פרטים"}
      </button>
      {error && <p className={contactStyles.error}>{error}</p>}
    </form>
  );

  const templates = [
  /* Template 1 – Soft Card */
  <div className={contactStyles.template1} key="t1">
    <h2 className={contactStyles.title}>📞 צור קשר</h2>
    <p className={contactStyles.description}>נשמח לשוחח איתך ולשמוע עוד!</p>
    {renderForm("formRounded")}
  </div>,

  /* Template 2 – Split עם פס צבעוני נטוי */
  <div className={contactStyles.template2} key="t2">
      <div className={contactStyles.leftText}>
        <h2 className={contactStyles.title}>💬 דברו איתנו</h2>
        <p className={contactStyles.description}>
          נחזור אליכם במהירות האפשרית עם תשובה מותאמת.
        </p>
      </div>
      <div className={contactStyles.rightForm}>
        {renderForm("formOutlined")}
      </div>
  </div>,

  /* Template 3 – Glass Card */
  <div className={contactStyles.template3} key="t3">
    <div className={contactStyles.card}>
      <h2 className={contactStyles.title}>📬 השאירו פרטים</h2>
      <p className={contactStyles.description}>אנחנו כאן עבורכם בכל שאלה!</p>
      {renderForm("formFilled")}
    </div>
  </div>,
];


  return (
    <section className={contactStyles.contactSection}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}>
      
      {isHovered && (
        <div className={contactStyles.arrowButtons}>
          <button onClick={() => setTemplateIndex((templateIndex - 1 + templates.length) % templates.length)}>
            <FaArrowRight />
          </button>
          <button onClick={() => setTemplateIndex((templateIndex + 1) % templates.length)}>
            <FaArrowLeft />
          </button>
        </div>
      )}

      {templates[templateIndex]}
    </section>
  );
};

export default ContactUs;
