"use client";
import React, { useState } from "react";
import s from "../HowItWorks.module.css";
import {
  FaSearch, FaCalendarAlt, FaPhoneAlt, FaWpforms, FaTools, FaTruck,
  FaCreditCard, FaCheck, FaUser, FaShieldAlt, FaBolt, FaStar
} from "react-icons/fa";
import type { StepItem } from "../HowItWorks";

const iconMap = {
  search: FaSearch, calendar: FaCalendarAlt, phone: FaPhoneAlt, form: FaWpforms,
  tools: FaTools, truck: FaTruck, credit: FaCreditCard, check: FaCheck,
  user: FaUser, shield: FaShieldAlt, bolt: FaBolt, spark: FaStar,
} as const;

export default function V2({
  steps,
  options,
}: {
  steps: StepItem[];
  options: { columns:"auto"|"single"|"double"|"triple"; showNumbers:boolean; density:"compact"|"normal"|"spacious" };
}) {
  const [localSteps, setLocalSteps] = useState(steps);

  const onTitleInput = (i:number) => (e:React.FormEvent<HTMLHeadingElement>) => {
    const v = (e.currentTarget as HTMLHeadingElement).innerText;
    setLocalSteps(prev=>{const next=[...prev]; next[i]={...next[i], title:v}; return next;});
  };
  const onTextInput = (i:number) => (e:React.FormEvent<HTMLParagraphElement>) => {
    const v = (e.currentTarget as HTMLParagraphElement).innerText;
    setLocalSteps(prev=>{const next=[...prev]; next[i]={...next[i], text:v}; return next;});
  };

  return (
    <div className={`${s.v2Wrap} ${s.grid} ${densityCls(options.density)} ${columnsCls(options.columns)}`}>
      {localSteps.map((st,i)=>{
        const Icon = st.icon ? iconMap[st.icon] : null;
        return (
          <div key={i} className={`${s.card} ${s.v2Card}`}>
            <div className={s.v2Head}>
              {options.showNumbers && <div className={s.num}>{st.step}</div>}
              {Icon && <div className={s.icon}><Icon/></div>}
              <h3
                className={s.title}
                contentEditable
                suppressContentEditableWarning
                onInput={onTitleInput(i)}
              >{st.title}</h3>
            </div>
            <p
              className={s.text}
              contentEditable
              suppressContentEditableWarning
              onInput={onTextInput(i)}
            >{st.text}</p>
          </div>
        );
      })}
    </div>
  );
}

function columnsCls(cols:"auto"|"single"|"double"|"triple"){ switch(cols){ case "single":return s["columns-1"]; case "double":return s["columns-2"]; case "triple":return s["columns-3"]; default:return (s as any)["columns-auto"]; } }
function densityCls(d:"compact"|"normal"|"spacious"){ return d==="compact"?s.compact : d==="spacious"?s.spacious : s.normal; }
