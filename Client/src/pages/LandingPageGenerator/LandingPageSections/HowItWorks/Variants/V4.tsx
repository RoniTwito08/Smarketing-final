
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

export default function V1({
  steps,
  options,
}: {
  steps: StepItem[];
  options: { columns: string; showNumbers: boolean; showConnectors: boolean; density:"compact"|"normal"|"spacious" };
}) {
  const [localSteps, setLocalSteps] = useState(steps);

  const onTitleInput = (i:number) => (e:React.FormEvent<HTMLHeadingElement>) => {
    const v = (e.currentTarget as HTMLHeadingElement).innerText;
    setLocalSteps(prev => { const next=[...prev]; next[i]={...next[i], title:v}; return next; });
  };
  const onTextInput = (i:number) => (e:React.FormEvent<HTMLParagraphElement>) => {
    const v = (e.currentTarget as HTMLParagraphElement).innerText;
    setLocalSteps(prev => { const next=[...prev]; next[i]={...next[i], text:v}; return next; });
  };

  return (
    <div className={`${s.v1Wrap} ${s.grid} ${densityCls(options.density)} ${columnsCls("single")}`}>
      {localSteps.map((st,i) => {
        const Num = options.showNumbers ? <div className={`${s.num} ${s.v1Badge}`}>{st.step}</div> : null;
        const Icon = st.icon ? iconMap[st.icon] : null;
        return (
          <div key={i} className={`${s.card} ${s.v1Item}`}>
            <div className={s.row}>
              {Num}
              {Icon && <div className={s.icon}><Icon/></div>}
              <div>
                <h3
                  className={s.title}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={onTitleInput(i)}
                >{st.title}</h3>
                <p
                  className={s.text}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={onTextInput(i)}
                >{st.text}</p>
              </div>
            </div>
            {options.showConnectors && i < steps.length-1 && <div className={s.connector}/>}
          </div>
        );
      })}
    </div>
  );
}

function columnsCls(cols:string){ switch(cols){ case "single":return s["columns-1"]; case "double":return s["columns-2"]; case "triple":return s["columns-3"]; default:return s["columns-1"]; } }
function densityCls(d:"compact"|"normal"|"spacious"){ return d==="compact"?s.compact : d==="spacious"?s.spacious : s.normal; }
