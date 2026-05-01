"use client";
import * as React from "react";
import Image from "next/image";
import { siteConfig } from "@/lib/config";

/**
 * Dental flourish — SmileBeforeAfterSlider.
 *
 * Per brief: drag handle reveals a real smile transformation. 480x480 photo
 * pair, drag-to-reveal interaction, no marketing text on the photo itself.
 * Lives between Testimonials and FAQ.
 *
 * Photos pulled from siteConfig.photos.gallery — uses the first two as
 * before/after pair. Falls back gracefully if absent.
 *
 * Anti-pattern guard: NO autoplay, NO timer, NO "Drag me!" sticker animation.
 * The visitor controls the reveal at their own pace — respects dental anxiety.
 */
export function SmileBeforeAfterSlider() {
  const photos = siteConfig.photos?.gallery ?? [];
  const before = photos[0];
  const after = photos[1];

  // 0..100 — percentage from left where the after-image is revealed.
  const [pos, setPos] = React.useState(50);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const draggingRef = React.useRef(false);

  const updateFromClientX = React.useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    const next = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPos(next);
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    updateFromClientX(e.clientX);
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  // Keyboard support — Left/Right arrows on the handle for accessibility.
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      setPos((p) => Math.max(0, p - 4));
    } else if (e.key === "ArrowRight") {
      setPos((p) => Math.min(100, p + 4));
    } else if (e.key === "Home") {
      setPos(0);
    } else if (e.key === "End") {
      setPos(100);
    }
  };

  if (!before || !after) {
    return null;
  }

  return (
    <section className="py-24 md:py-32" style={{ background: "var(--bg, #F6FBFA)" }}>
      <div className="container">
        <div className="mx-auto max-w-3xl">
          {/* Eyebrow + heading — calm, no exclamation marks per brief */}
          <p
            className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em]"
            style={{ color: "#2BAE9D", fontFamily: "var(--font-mono, ui-monospace)" }}
          >
            Before · After
          </p>
          <h2
            className="mb-4 text-3xl font-semibold leading-tight md:text-4xl"
            style={{
              fontFamily: "var(--font-display, var(--font-heading))",
              color: "var(--ink, #0F2A2E)",
              letterSpacing: "-0.01em",
            }}
          >
            A real patient. Drag to compare.
          </h2>
          <p
            className="mb-10 max-w-xl text-[15px] leading-relaxed"
            style={{ color: "#5C7177", fontFamily: "var(--font-body-v2, var(--font-body))" }}
          >
            Photographed in our operatory under the same daylight, six months apart. No
            filters, no retouching — only what we can do at the chair.
          </p>

          {/* Slider track */}
          <div
            ref={trackRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="relative mx-auto aspect-square w-full max-w-[480px] overflow-hidden rounded-2xl select-none"
            style={{
              background: "#E4F1EE",
              border: "1px solid rgba(43, 174, 157, 0.18)",
              touchAction: "none",
              cursor: "ew-resize",
            }}
            aria-label="Drag to compare before and after smile transformation"
          >
            {/* AFTER (full layer) */}
            <Image
              src={after}
              alt="Smile after treatment"
              fill
              sizes="(max-width: 768px) 100vw, 480px"
              className="object-cover"
              priority={false}
            />

            {/* BEFORE (clipped to pos%) */}
            <div
              className="absolute inset-0"
              style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
              aria-hidden
            >
              <Image
                src={before}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 480px"
                className="object-cover"
              />
            </div>

            {/* Corner labels — text NOT on the photo body, per brief.
                Small chips in top corners only. */}
            <span
              className="pointer-events-none absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest"
              style={{
                background: "rgba(255,255,255,0.85)",
                color: "#0F2A2E",
                fontFamily: "var(--font-mono, ui-monospace)",
              }}
            >
              Before
            </span>
            <span
              className="pointer-events-none absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest"
              style={{
                background: "#0F2A2E",
                color: "#F6FBFA",
                fontFamily: "var(--font-mono, ui-monospace)",
              }}
            >
              After
            </span>

            {/* Vertical seam */}
            <div
              className="pointer-events-none absolute inset-y-0"
              style={{
                left: `${pos}%`,
                width: 2,
                background: "rgba(255,255,255,0.95)",
                boxShadow: "0 0 0 1px rgba(15,42,46,0.15)",
                transform: "translateX(-1px)",
              }}
              aria-hidden
            />

            {/* Handle */}
            <div
              role="slider"
              tabIndex={0}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(pos)}
              aria-label="Reveal slider"
              onKeyDown={onKeyDown}
              className="absolute top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus:outline-none focus:ring-4"
              style={{
                left: `${pos}%`,
                background: "#FFFFFF",
                border: "1.5px solid #2BAE9D",
                boxShadow: "0 6px 18px -4px rgba(15,42,46,0.18)",
                cursor: "ew-resize",
                ['--tw-ring-color' as string]: "rgba(43,174,157,0.35)",
              }}
            >
              <span
                aria-hidden
                style={{
                  color: "#2BAE9D",
                  fontFamily: "var(--font-mono, ui-monospace)",
                  fontSize: "14px",
                  letterSpacing: "-1px",
                }}
              >
                ◀ ▶
              </span>
            </div>
          </div>

          {/* Subcaption — disclosure, calm tone */}
          <p
            className="mt-6 text-center text-xs"
            style={{ color: "#5C7177", fontFamily: "var(--font-body-v2, var(--font-body))" }}
          >
            Demo image pair. In a live deployment, this is replaced with consented patient photography.
          </p>
        </div>
      </div>
    </section>
  );
}
