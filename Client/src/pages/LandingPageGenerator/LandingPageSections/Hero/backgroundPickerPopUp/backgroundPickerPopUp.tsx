"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./backgroundPickerPopUp.module.css";

type PexelsPhoto = {
  id: number;
  alt?: string;
  photographer?: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    landscape: string;
    medium: string;
    small: string;
    tiny: string;
  };
};

interface BackgroundPickerPopUpProps {
  open: boolean;
  onClose: () => void;
  onPick: (url: string) => void;
  anchorRef: React.RefObject<HTMLElement>;
  initialQuery?: string;
  dir?: "rtl" | "ltr";
  onClick?: () => void;
}

export default function BackgroundPickerPopUp({
  open,
  onClose,
  onPick,
  anchorRef,
  initialQuery = "sharks",
  dir = "rtl",
}: BackgroundPickerPopUpProps) {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0, caretX: 24 });
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<PexelsPhoto[]>([]);

  // Position near anchor
  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const anchor = anchorRef.current;
      const bubble = bubbleRef.current;
      if (!anchor || !bubble) return;
      const ar = anchor.getBoundingClientRect();
      const bw = bubble.offsetWidth || 720;
      const bh = bubble.offsetHeight || 640;
      const gap = 8;
      let left = ar.left + ar.width / 2 - bw / 2;
      let top = ar.bottom + gap;
      left = Math.max(8, Math.min(left, window.innerWidth - bw - 8));
      top = Math.max(8, Math.min(top, window.innerHeight - bh - 8));
      const caretX = Math.max(14, Math.min(bw - 14, ar.left + ar.width / 2 - left));
      setPos({ top, left, caretX });
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(document.documentElement);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, anchorRef]);

  // Close on ESC / click outside
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const onClick = (e: MouseEvent) => {
      if (bubbleRef.current && !bubbleRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open, onClose]);

  // Fetch images
  const fetchImages = async (q: string) => {
  setLoading(true);
  setError(null);
  try {
    const API_BASE = import.meta.env.VITE_API_URL || "";
    const r = await fetch(`${API_BASE}/api/pexels?q=${encodeURIComponent(q)}&per_page=120&page=1`);
    const ct = r.headers.get("content-type") || "";
    if (!r.ok) {
      const errText = await r.text().catch(() => "");
      throw new Error(`API ${r.status}: ${errText.slice(0, 120)}`);
    }
    if (!ct.includes("application/json")) {
      const errText = await r.text().catch(() => "");
      throw new Error(`Bad content-type: ${ct} / body: ${errText.slice(0, 120)}`);
    }
    const data = await r.json();
    const list: PexelsPhoto[] = Array.isArray(data?.photos) ? data.photos : [];
    setPhotos(list);
  } catch (e: any) {
    setPhotos([]);
    setError(e?.message || "Failed loading images");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    if (!open) return;
    fetchImages(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className={styles.portalRoot} aria-hidden={!open}>
      <div
        ref={bubbleRef}
        className={styles.bubble}
        role="dialog"
        aria-modal="false"
        aria-label="בחירת תמונת רקע"
        style={{ top: pos.top, left: pos.left, ["--caret-x" as any]: `${pos.caretX}px` }}
        dir={dir}
      >
        <div className={styles.bubbleCaret} aria-hidden="true" />

        <div className={styles.header}>
          <input
            className={styles.input}
            type="search"
            placeholder="חפש רקעים (abstract, gradient, nature...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchImages(query)}
          />
        </div>

        <div className={styles.suggestions}>
          {["abstract gradient", "nature landscape", "minimal pastel", "city lights", "texture"].map((sug) => (
            <button key={sug} className={styles.suggestion} onClick={() => { setQuery(sug); fetchImages(sug); }}>
              {sug}
            </button>
          ))}
        </div>

        {loading ? (
          <div className={styles.loading}>טוען תמונות…</div>
        ) : error ? (
          <div className={styles.error}>שגיאה: {error}</div>
        ) : (
          <div className={styles.grid}>
            {/* 4×15 = 60 */}
            {photos.slice(0, 60).map((p) => {
              const url = p.src.landscape || p.src.large || p.src.large2x || p.src.original;
              return (
                <button
                  key={p.id}
                  className={styles.cell}
                  type="button"
                  title={p.alt || p.photographer || "בחר תמונה"}
                  onClick={() => onPick(url)}
                >
                  <img loading="lazy" src={url} alt={p.alt || "background"} />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
