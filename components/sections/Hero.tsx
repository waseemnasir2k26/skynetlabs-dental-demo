"use client";
import * as React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/config";
import { renderItalic } from "@/lib/markdown-italic";

// ── Lazy R3F variants ─────────────────────────────────────────────────────────
const ToothMesh = dynamic(() => import("@/components/HeroR3F/Tooth"), { ssr: false });
const FilmCanister = dynamic(() => import("@/components/HeroR3F/FilmCanister"), { ssr: false });
const MarbleColumn = dynamic(() => import("@/components/HeroR3F/MarbleColumn"), { ssr: false });
const Floorplan = dynamic(() => import("@/components/HeroR3F/Floorplan"), { ssr: false });
const Mansion = dynamic(() => import("@/components/HeroR3F/Mansion"), { ssr: false });

// ── Legacy fallbacks (kept for backward compat) ───────────────────────────────
const HeroR3FLegacy = dynamic(() => import("./HeroR3F").then((m) => m.HeroR3F), { ssr: false });
const HeroMP4 = dynamic(() => import("./HeroMP4").then((m) => m.HeroMP4), { ssr: false });

export function Hero() {
  const { hero, hero_3d, theme, owner, copy } = siteConfig;
  const tel = `tel:${owner.contact_phone ?? ""}`;

  // Reduce-motion detection
  const [reducedMotion, setReducedMotion] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // v2 hero has h1/sub directly; v1 hero has headline/sub
  const h1Text = copy?.h1 ?? hero?.h1 ?? hero?.headline ?? siteConfig.brand.tagline;
  const subText = copy?.sub ?? hero?.sub ?? siteConfig.brand.tagline;
  const primaryCtaLabel = copy?.primary_cta ?? hero?.cta_primary?.label ?? "Get a free quote →";
  const stickyText = copy?.sticky_mobile_bar;

  // v2: hero.kind determines scene; v1: hero_3d.r3f_scene
  const heroKind = hero?.kind; // "r3f" | "photo" | "cinemagraph" | undefined
  const posterSrc = hero_3d?.poster_src ?? hero?.src ?? "/hero/poster.jpg";
  // Map v2 hero.kind + hero_3d fields → scene string used by renderBg
  let scene = hero_3d?.r3f_scene;
  if (!scene && heroKind === "r3f") {
    // map hero_3d.r3f_scene from the config's hero_3d block (dental has "r3f-tooth")
    scene = hero_3d?.r3f_scene ?? "r3f-tooth";
  } else if (!scene && heroKind === "cinemagraph") {
    scene = "cinemagraph";
  } else if (!scene && heroKind === "photo") {
    scene = "photo";
  }

  // ── Background layer ────────────────────────────────────────────────────────
  function renderBg() {
    if (reducedMotion) {
      return (
        <Image
          src={posterSrc}
          alt=""
          fill
          priority
          fetchPriority="high"
          className="absolute inset-0 -z-10 object-cover"
        />
      );
    }

    switch (scene) {
      case "r3f-tooth":
        return (
          <React.Suspense fallback={<StaticPoster src={posterSrc} />}>
            <ToothMesh posterSrc={posterSrc} />
          </React.Suspense>
        );
      case "r3f-film-canister":
        return (
          <React.Suspense fallback={<StaticPoster src={posterSrc} />}>
            <FilmCanister posterSrc={posterSrc} />
          </React.Suspense>
        );
      case "r3f-marble-column":
        return (
          <React.Suspense fallback={<StaticPoster src={posterSrc} />}>
            <MarbleColumn posterSrc={posterSrc} />
          </React.Suspense>
        );
      case "r3f-floorplan":
        return (
          <React.Suspense fallback={<StaticPoster src={posterSrc} />}>
            <Floorplan posterSrc={posterSrc} />
          </React.Suspense>
        );
      case "r3f-mansion":
        return (
          <React.Suspense fallback={<StaticPoster src={posterSrc} />}>
            <Mansion posterSrc={posterSrc} />
          </React.Suspense>
        );
      case "cinemagraph":
        return (
          <HeroCinemagraph
            mp4Src={hero_3d?.mp4_src ?? hero?.src ?? ""}
            posterSrc={posterSrc}
          />
        );
      case "photo":
        return (
          <Image
            src={posterSrc}
            alt=""
            fill
            priority
            fetchPriority="high"
            className="absolute inset-0 -z-10 object-cover"
          />
        );
      default:
        // legacy v1 paths
        if (hero_3d?.variant === "r3f-flagship") {
          return <HeroR3FLegacy primaryColor={theme?.primary ?? "#7A2E2A"} accentColor={theme?.accent ?? "#C8A35B"} />;
        }
        if (hero_3d?.mp4_src) {
          return <HeroMP4 src={hero_3d.mp4_src} poster={posterSrc} />;
        }
        return (
          <Image
            src={posterSrc}
            alt=""
            fill
            priority
            fetchPriority="high"
            className="absolute inset-0 -z-10 object-cover"
          />
        );
    }
  }

  return (
    <section id="hero" className="relative isolate flex min-h-[88vh] items-center overflow-hidden">
      {/* Sentinel at bottom of hero for StickyTelBar IntersectionObserver */}
      <div id="hero-sentinel" className="absolute bottom-0 left-0 h-1 w-full" aria-hidden />
      {renderBg()}

      <div className="container relative z-10 grid gap-10 py-20 md:grid-cols-12 md:py-28">
        <motion.div
          className="md:col-span-8 lg:col-span-7"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Translucent surface card — floats hero copy off the R3F tooth.
              Per dental brief: "add a translucent surface card behind copy so it floats off the 3D." */}
          <div className="dental-hero-card p-7 md:p-9">
            {/* Eyebrow — calm clinic credential, not headline-shouty */}
            <p
              className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em]"
              style={{
                color: "#2BAE9D",
                fontFamily: "var(--font-mono, ui-monospace)",
              }}
            >
              Fifth Avenue · By Appointment
            </p>

            {/* H1 — Quicksand display, mint-on-bone — kid-and-parent safe per brief */}
            <h1
              className="text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl lg:text-[3.5rem]"
              style={{
                fontFamily: "var(--font-display, var(--font-heading))",
                color: "var(--ink, #0F2A2E)",
                fontWeight: 600,
              }}
            >
              {renderItalic(h1Text)}
            </h1>

            {/* Sub — Inter, soft sage-grey, generous max-width */}
            <p
              className="mt-5 max-w-xl text-[15px] leading-relaxed md:text-base"
              style={{
                fontFamily: "var(--font-body-v2, var(--font-body))",
                color: "#5C7177",
              }}
            >
              {subText}
            </p>

            {/* CTAs — primary = warm coral pill (used sparingly per brief).
                Secondary = mint-outline call button. NO hard sell tone. */}
            <div className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <a
                href={hero?.cta_primary?.href ?? "#contact"}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all hover:translate-y-[-1px] hover:shadow-md"
                style={{
                  background: "#FF8A6B",
                  color: "#FFFFFF",
                  fontFamily: "var(--font-body-v2, var(--font-body))",
                }}
              >
                {primaryCtaLabel}
                <span aria-hidden>→</span>
              </a>
              {owner.contact_phone && (
                <a
                  href={tel}
                  className="rounded-full border px-5 py-3 text-sm font-medium transition-colors hover:bg-white/60"
                  style={{
                    borderColor: "#2BAE9D",
                    color: "#0F2A2E",
                    background: "transparent",
                    fontFamily: "var(--font-body-v2, var(--font-body))",
                  }}
                >
                  {stickyText ?? (hero?.cta_secondary?.label ?? `Call ${owner.contact_phone}`)}
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Internal helpers ──────────────────────────────────────────────────────────

function StaticPoster({ src }: { src: string }) {
  return (
    <Image
      src={src}
      alt=""
      fill
      priority
      fetchPriority="high"
      className="absolute inset-0 -z-10 object-cover"
    />
  );
}

function HeroCinemagraph({ mp4Src, posterSrc }: { mp4Src: string; posterSrc: string }) {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        poster={posterSrc}
        className="h-full w-full object-cover"
      >
        <source src={mp4Src} type="video/mp4" />
      </video>
    </div>
  );
}
