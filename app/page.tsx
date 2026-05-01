import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { ServicesEditorial } from "@/components/sections/ServicesEditorial";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { TestimonialsEditorial } from "@/components/sections/TestimonialsEditorial";
import { PhotoGallery } from "@/components/sections/PhotoGallery";
import { SmileBeforeAfterSlider } from "@/components/sections/SmileBeforeAfterSlider";
import { FAQv2 } from "@/components/sections/FAQv2";
import { CTABanner } from "@/components/sections/CTABanner";
import { siteConfig } from "@/lib/config";

/**
 * Dental — section order per brief 2026-05-01:
 *
 *  1. Hero (R3F-keep, Tooth)            — flagship 3D scene preserved
 *  2. TrustStrip (logo-bar)             — moved UP: dental visitor's first
 *                                         anxiety is "is this place legit
 *                                         and do they take my insurance?"
 *  3. Services (editorial-numbered)
 *  4. Process (step-cards "your first visit")
 *  5. Testimonials (card-quote)
 *  6. Gallery
 *  7. SmileBeforeAfterSlider — niche flourish (drag-to-reveal)
 *  8. FAQ (accordion-clinical)
 *  9. CTABanner (split-photo)
 *
 * Why this beats default: Trust before Services (insurance/credentials calm
 * anxiety first); Gallery + slider AFTER testimonials so the photos read as
 * proof of human stories, not stock decoration.
 */
export default function HomePage() {
  return (
    <>
      {/* 1. Hero — R3F Tooth, theme wraps the scene (no replacement) */}
      <Hero />

      {/* 2. Trust Strip — credentials/insurance moved up the page */}
      <TrustStrip />

      {/* 3. Services — editorial 3-col */}
      <ServicesEditorial />

      {/* 4. Process Timeline — "your first visit" step cards */}
      <ProcessTimeline />

      {/* 5. Testimonials — 3-card editorial, mixed parent + adult */}
      <TestimonialsEditorial />

      {/* 6. Gallery — operatory + smile photography */}
      {(siteConfig.modules?.photo_gallery !== false) && <PhotoGallery />}

      {/* 7. Niche flourish — drag-to-reveal smile transformation */}
      <SmileBeforeAfterSlider />

      {/* 8. FAQ — accordion-clinical, calm copy, no exclamations */}
      {(siteConfig.modules?.faq !== false) && <FAQv2 />}

      {/* 9. CTA Banner — split-photo: operatory + booking form */}
      <CTABanner />
    </>
  );
}
