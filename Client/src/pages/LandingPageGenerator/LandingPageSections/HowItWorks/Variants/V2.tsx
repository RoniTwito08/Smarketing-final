// src/components/LandingPageSections/HowItWorks/Variants/V2.tsx
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

export default function V2({
  steps,
  options,
}: {
  steps: StepItem[];
  options: { columns: "auto"|"single"|"double"|"triple"; showNumbers: boolean; density:"compact"|"normal"|"spacious" };
}) {
  return (
    <div className={`${s.v2Wrap} ${s.grid} ${densityCls(options.density)} ${columnsCls(options.columns)}`}>
      {steps.map((st, i) => {
        const Icon = st.icon ? iconMap[st.icon] : null;
        return (
          <div key={i} className={`${s.card} ${s.v2Card}`}>
            <div className={s.v2Head}>
              {options.showNumbers && <div className={s.num}>{st.step}</div>}
              {Icon && <div className={s.icon}><Icon/></div>}
              <h3 className={s.title} style={{ margin: 0 }}>{st.title}</h3>
            </div>
            <p className={s.text}>{st.text}</p>
          </div>
        );
      })}
    </div>
  );
}

function columnsCls(cols: "auto"|"single"|"double"|"triple"){
  switch(cols){
    case "single": return s["columns-1"];
    case "double": return s["columns-2"];
    case "triple": return s["columns-3"];
    default:       return (s as any)["columns-auto"];

  }
}
function densityCls(d: "compact"|"normal"|"spacious"){
  return d === "compact" ? s.compact : d === "spacious" ? s.spacious : s.normal;
}
