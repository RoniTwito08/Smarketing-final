// src/components/LandingPageSections/AboutUs/AboutUs.tsx
"use client";
import { useMemo, useRef, useState } from "react";
import { FaPalette, FaTrash } from "react-icons/fa";
import s from "./aboutUs.module.css";
import AboutUsPopup, { AboutUsOptions } from "./AboutUsPopup";
import V1 from "./Variants/V1";
import V2 from "./Variants/V2";
import V3 from "./Variants/V3";
import V4 from "./Variants/V4";

export interface AboutUsProps {
  content: string | string[];
  title?: string;
  mission?: string;
  image?: string;
  phone?: string;
  whatsappNumber?: string;
  bullets?: string[];
  stats?: { icon?: "clock"|"users"|"star"|"done"; label: string; value: string }[];
  tagline?: string;
  onDelete?: () => void;
}

const VARIANTS = [V1, V2, V3, V4];

export default function AboutUs(props: AboutUsProps) {
  const { content, title, mission, image, phone, whatsappNumber, bullets, stats, tagline, onDelete } = props;

  const [hovered, setHovered] = useState(false);
  const [openPop, setOpenPop] = useState(false);
  const editBtnRef = useRef<HTMLButtonElement>(null);

  const [opts, setOpts] = useState<AboutUsOptions>({
    template: 3,
    fontSize: "M",
    columns: "single",
    showStats: true,
  });

  const lines = useMemo<string[]>(() => {
    if (!content) return [];
    if (Array.isArray(content)) return content.map((l) => `${l}`.trim()).filter(Boolean);
    return (content as string).split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  }, [content]);

  const paragraph = useMemo(() => (Array.isArray(content) ? "" : (content || "").toString().trim()), [content]);

  const ActiveVariant = VARIANTS[Math.max(0, Math.min(VARIANTS.length - 1, opts.template))] as any;

  return (
    <section
      className={s.aboutUsSection}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      dir="rtl"
    >
      {hovered && (
        <div className={s.toolbar}>
          <button ref={editBtnRef} className={s.iconBtn} onClick={() => setOpenPop(true)} title="ערוך">
            <FaPalette size={14} />
          </button>
          {onDelete && (
            <button className={`${s.iconBtn} ${s.trashBtn}`} onClick={onDelete} title="מחק">
              <FaTrash size={13} />
            </button>
          )}
        </div>
      )}

      {title && <h2 className={s.heading}>{title}</h2>}
      {mission && <p className={s.mission}>{mission}</p>}

      <ActiveVariant
        lines={lines}
        paragraph={paragraph}
        heading={title}
        tagline={tagline}
        bullets={bullets}
        stats={stats}
        imageUrl={image}
        phone={phone}
        whatsappNumber={whatsappNumber}
      />

      <AboutUsPopup
        open={openPop}
        options={opts}
        onChange={setOpts}
        onClose={() => setOpenPop(false)}
        anchorRef={editBtnRef}
        dir="rtl"
      />
    </section>
  );
}
