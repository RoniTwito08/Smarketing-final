// src/components/LandingPageSections/ContactUs/ContactUs.tsx
"use client";
import { useMemo, useRef, useState } from "react";
import axios from "axios";
import { FaPalette, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import s from "./contactUs.module.css";
import { config } from "../../../../config";
import { useAuth } from "../../../../context/AuthContext";
import ContactPopup, { ContactOptions } from "./ContactUsPopup";
import t from "../Services/Services.module.css";


import V1 from "./Variants/V1";
import V2 from "./Variants/V2";
import V3 from "./Variants/V3";

export interface ContactUsProps {
  title?: string;
  subtitle?: string;
  onDelete?: () => void;
}

const VARIANTS = [V1, V2, V3] as const;

export default function ContactUs({
  title = "📞 צור קשר",
  subtitle = "נשמח לשוחח איתך ולשמוע עוד!",
}: ContactUsProps) {
  const { user } = useAuth();
  const userIdRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
    consent: true,
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const [hovered, setHovered] = useState(false);
  const [openPop, setOpenPop] = useState(false);

  const [opts, setOpts] = useState<ContactOptions>({
    template: 0,                 // 0..2
    accent: "blue",              // blue | emerald | violet | orange
    radius: "xl",                // md | lg | xl | full
    tone: "soft",                // solid | soft | glass
    buttonIcon: "right",         // left | right | none
    showConsent: true,
    showAltContacts: true,
    formStyle: "rounded",        // rounded | outlined | filled
  });

  const ActiveVariant = VARIANTS[Math.max(0, Math.min(VARIANTS.length - 1, opts.template))] as any;

  const accentClass = useMemo(() => {
    switch (opts.accent) {
      case "emerald": return s.accentEmerald;
      case "violet":  return s.accentViolet;
      case "orange":  return s.accentOrange;
      default:        return s.accentBlue;
    }
  }, [opts.accent]);

  const toneClass = useMemo(() => {
    switch (opts.tone) {
      case "solid": return s.toneSolid;
      case "glass": return s.toneGlass;
      default:      return s.toneSoft;
    }
  }, [opts.tone]);

  const radiusClass = useMemo(() => {
    switch (opts.radius) {
      case "md":   return s.rMd;
      case "lg":   return s.rLg;
      case "full": return s.rFull;
      default:     return s.rXl;
    }
  }, [opts.radius]);

  const formStyleClass = useMemo(() => {
    switch (opts.formStyle) {
      case "outlined": return s.formOutlined;
      case "filled":   return s.formFilled;
      default:         return s.formRounded;
    }
  }, [opts.formStyle]);

  function onChangeField(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type, checked } = e.target as any;
    setFormData((p) => ({ ...p, [name]: type === "checkbox" ? !!checked : value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    setOk(null);

    if (!formData.fullName || !formData.email || !formData.phone) {
      setErr("נא למלא שם, אימייל וטלפון.");
      setLoading(false);
      return;
    }
    if (opts.showConsent && !formData.consent) {
      setErr("יש לאשר את תנאי הפרטיות.");
      setLoading(false);
      return;
    }

    const userId = userIdRef.current?.value || user?._id || "";

    try {
      await axios.post(`${config.apiUrl}/leads/createLead`, {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        userId,
      });
      setOk("הפרטים נשלחו בהצלחה! נחזור אליך בהקדם.");
      setFormData({ fullName: "", email: "", phone: "", message: "", consent: true });
    } catch (e: any) {
      setErr(e?.response?.data?.message || "שגיאה בשליחת הפרטים");
    } finally {
      setLoading(false);
    }
  }

  // הפונקציה שמייצרת את הטופס (מועברת לוריאנטים)
  const renderForm = () => (
    <form className={`${s.form} ${formStyleClass}`} onSubmit={onSubmit} dir="rtl" noValidate>
      <input type="hidden" name="userId" ref={userIdRef} value={user?._id || ""} readOnly />

      <div className={s.row}>
        <input
          className={s.input}
          name="fullName"
          placeholder="שם מלא"
          value={formData.fullName}
          onChange={onChangeField}
          autoComplete="name"
          required
        />
      </div>

      <div className={s.row}>
        <input
          className={s.input}
          type="email"
          name="email"
          placeholder="אימייל"
          value={formData.email}
            onChange={onChangeField}
          autoComplete="email"
          required
        />
      </div>

      <div className={s.row}>
        <input
          className={s.input}
          type="tel"
          name="phone"
          placeholder="טלפון"
          value={formData.phone}
          onChange={onChangeField}
          autoComplete="tel"
          required
        />
      </div>

      <div className={s.row}>
        <textarea
          className={`${s.input} ${s.textarea}`}
          name="message"
          placeholder="הודעה / שאלה (אופציונלי)"
          value={formData.message}
          onChange={onChangeField}
          rows={4}
        />
      </div>

      {opts.showConsent && (
        <label className={s.consent}>
          <input
            type="checkbox"
            name="consent"
            checked={!!formData.consent}
            onChange={onChangeField}
          />
          <span>אני מאשר/ת קבלת פניה ושמירת הפרטים בהתאם למדיניות הפרטיות</span>
        </label>
      )}

      <button type="submit" className={`${s.submit} ${accentClass}`} disabled={loading}>
        {opts.buttonIcon === "left" && <FaArrowRight size={14} />}
        {loading ? "שולח…" : "שלח פרטים"}
        {opts.buttonIcon === "right" && <FaArrowLeft size={14} />}
      </button>

      {err && <p className={s.msgError}>{err}</p>}
      {ok && <p className={s.msgOk}>{ok}</p>}

      {opts.showAltContacts && (
        <div className={s.alt}>
          <a className={s.altLink} href={`https://wa.me/${(formData.phone || "").replace(/\D/g, "") || ""}`} target="_blank" rel="noreferrer">וואטסאפ</a>
          <span className={s.dot} />
          <a className={s.altLink} href={`tel:${formData.phone || ""}`}>שיחה טלפונית</a>
          <span className={s.dot} />
          <a className={s.altLink} href={`mailto:${formData.email || ""}`}>אימייל</a>
        </div>
      )}
    </form>
  );
  
  const editBtnRef = useRef<HTMLButtonElement>(null); // ⬅️ חדש

  const Variant = ActiveVariant as React.ComponentType<{
    title: string;
    subtitle: string;
    renderForm: () => JSX.Element;
    classes: { accent: string; tone: string; radius: string };
  }>;

  return (
    <section
      className={`${s.contactSection} ${accentClass}`}
      dir="rtl"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && (
        <div className={t.toolbar}>
          {/* <button
            className={s.iconBtn}
            title="קודם"
            onClick={() => setOpts(p => ({ ...p, template: (p.template - 1 + VARIANTS.length) % VARIANTS.length }))}
            type="button"
          >
            <FaArrowRight size={14} />
          </button>
          <button
            className={s.iconBtn}
            title="הבא"
            onClick={() => setOpts(p => ({ ...p, template: (p.template + 1) % VARIANTS.length }))}
            type="button"
          >
            <FaArrowLeft size={14} />
          </button> */}

          <button
            ref={editBtnRef}
            className={t.iconBtn}
            onClick={() => setOpenPop(true)}
            title="התאמה"
            aria-haspopup="dialog"
            aria-expanded={openPop}
          >
            <FaPalette size={14} />
          </button>
        </div>
      )}

      <Variant
        title={title}
        subtitle={subtitle}
        renderForm={renderForm}
        classes={{ accent: accentClass, tone: toneClass, radius: radiusClass }}
      />

      <ContactPopup
        open={openPop}
        options={opts}
        onChange={setOpts}
        onClose={() => setOpenPop(false)}
        anchorRef={editBtnRef}            // ⬅️ מעבירים את העוגן לפופ־אפ
      />
    </section>
  );
}
