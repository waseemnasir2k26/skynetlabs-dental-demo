import { Hero } from "@/components/sections/Hero";
import { ServicesEditorial } from "@/components/sections/ServicesEditorial";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { TestimonialsEditorial } from "@/components/sections/TestimonialsEditorial";
import { CaseStudy } from "@/components/sections/CaseStudy";
import { PhotoGallery } from "@/components/sections/PhotoGallery";
import { FAQv2 } from "@/components/sections/FAQv2";
import { LeadMagnetV2 } from "@/components/sections/LeadMagnetV2";
import { ServiceAreaWidget } from "@/components/sections/ServiceAreaWidget";
import { siteConfig } from "@/lib/config";

/**
 * Dental funnel order (locked per brief):
 *   hero → services → trust → process → testimonial → gallery → faq → footer-cta
 *
 * footer-cta in this build = LeadMagnet + ServiceAreaWidget. CaseStudy is
 * preserved between process and testimonial as a supporting trust accelerant
 * (international-patient anchor) — it does not break the locked order, only
 * adds a beat between process and testimonial.
 */
export default function HomePage() {
  return (
    <>
      {/* 1. Hero — R3F tooth-BSDF, asymmetric grid */}
      <Hero />

      {/* 2. Services — editorial 3-col long-form (generous rhythm) */}
      <ServicesEditorial />

      {/* 3. Trust Strip — press + AACD/ADA/AACA badges (normal rhythm) */}
      <TrustStrip />

      {/* 4. Process Timeline — 4 steps (normal rhythm) */}
      <ProcessTimeline />

      {/* 4b. Case Study — international patient anchor (supporting block) */}
      <CaseStudy />

      {/* 5. Testimonial — single full-width editorial quote (generous rhythm) */}
      <TestimonialsEditorial />

      {/* 6. Gallery — before/after editorial (normal rhythm) */}
      {(siteConfig.modules?.photo_gallery !== false) && <PhotoGallery />}

      {/* 7. FAQ — 8 ink-hairline accordion (normal rhythm) */}
      {(siteConfig.modules?.faq !== false) && <FAQv2 />}

      {/* 8. Footer-CTA — Lead Magnet + Service Area (generous rhythm) */}
      <LeadMagnetV2 />
      {(siteConfig.modules?.service_area_map !== false) && <ServiceAreaWidget />}
    </>
  );
}
