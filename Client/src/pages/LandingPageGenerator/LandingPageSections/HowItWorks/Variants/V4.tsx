// src/components/LandingPageSections/HowItWorks/Variants/V4.tsx
"use client";
import s from "../howItWorks.module.css";
import {
  FaSearch, FaCalendarAlt, FaPhoneAlt, FaWpforms, FaTools, FaTruck,
  FaCreditCard, FaCheck, FaUser, FaShieldAlt, FaBolt, FaStar
} from "react-icons/fa";
import type { StepItem } from "../HowItWorks";

const iconMap = {
  search: FaSearch,
  calendar: FaCalendarAlt,
  phone: FaPhoneAlt,
  form: FaWpforms,
  tools: FaTools,
  truck: FaTruck,
  credit: FaCreditCard,
  check: FaCheck,
  user: FaUser,
  shield: FaShieldAlt,
  bolt: FaBolt,
  spark: FaStar,
} as const;

export default function V4({
  steps,
  options,
}: {
  steps: StepItem[];
  options: { columns:"auto"|"double"|"triple"; showNumbers:boolean; density:"compact"|"normal"|"spacious" };
}) {
  const progress = Math.min(100, Math.max(0, (steps.length ? (100 * 1.0 * (steps.length)) / (steps.length) : 0)));
  return (
    <div className={`${s.v4Wrap} ${densityCls(options.density)}`}>
      <div className={s.v4Track} aria-hidden>
        <div className={s.v4Progress} style={{ ["--progress" as any]: `${progress}%` }} />
      </div>

      <div className={`${s.v4Row} ${columnsCls(options.columns)}`}>
        {steps.map((st, i) => {
          const Icon = st.icon ? iconMap[st.icon] : null;
          return (
            <div key={i} className={`${s.card} ${s.v4Card}`}>
              {options.showNumbers && <div className={`${s.num} ${s.v4Num}`}>{st.step}</div>}
              {Icon && <div className={`${s.icon} ${s.v4Icon}`}><Icon/></div>}
              <h3 className={s.title}>{st.title}</h3>
              <p className={s.text}>{st.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function columnsCls(cols:"auto"|"double"|"triple"){
  switch(cols){
    case "double": return (s as any)["columns-2"];
    case "triple": return (s as any)["columns-3"];
    default:       return (s as any)["columns-auto"];
  }
}
function densityCls(d: "compact"|"normal"|"spacious"){
  return d === "compact" ? s.compact : d === "spacious" ? s.spacious : s.normal;
}
