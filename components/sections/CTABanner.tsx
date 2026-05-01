import Image from "next/image";
import { Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { siteConfig } from "@/lib/config";

/**
 * Dental CTA Banner — split-photo variant per brief.
 * Left: clinical-warm operatory photo. Right: short booking form on
 * mint-bone surface. Mint heading, soft sage body, warm-coral primary CTA.
 * NO dark-band aesthetic, NO loud-marketing copy.
 */
export function CTABanner() {
  const tel = siteConfig.owner.contact_phone;
  const photo =
    siteConfig.case_study?.photo_url ??
    siteConfig.photos?.gallery?.[2] ??
    "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1920&auto=format&fit=crop&q=80";

  return (
    <section
      id="quote"
      className="relative overflow-hidden"
      style={{ background: "var(--bg, #F6FBFA)" }}
    >
      <div className="grid md:grid-cols-2">
        {/* LEFT — clinical-warm operatory photo */}
        <div className="relative min-h-[360px] md:min-h-[640px]">
          <Image
            src={photo}
            alt="Operatory at Fifth Avenue Dental"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            loading="lazy"
          />
          {/* Mint wash to soften the photo edge — not a heavy overlay */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(110deg, rgba(43,174,157,0.08) 0%, rgba(15,42,46,0.0) 55%)",
            }}
          />
          {/* Quiet caption — practice info corner */}
          <div className="absolute bottom-6 left-6 right-6 md:left-10 md:bottom-10">
            <div
              className="inline-flex items-center gap-3 rounded-full px-4 py-2"
              style={{
                background: "rgba(255,255,255,0.92)",
                color: "#0F2A2E",
                fontFamily: "var(--font-mono, ui-monospace)",
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: "#FF8A6B" }}
                aria-hidden
              />
              <span className="text-[11px] font-medium uppercase tracking-[0.18em]">
                Mon–Fri · By Appointment
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT — booking column on mint-bone surface */}
        <div
          className="px-6 py-16 md:px-12 md:py-24 lg:px-16"
          style={{ background: "var(--surface, #FFFFFF)" }}
        >
          <p
            className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em]"
            style={{
              color: "#2BAE9D",
              fontFamily: "var(--font-mono, ui-monospace)",
            }}
          >
            Book a consultation
          </p>
          <h2
            className="text-3xl font-semibold leading-tight md:text-4xl"
            style={{
              fontFamily: "var(--font-display, var(--font-heading))",
              color: "#0F2A2E",
              letterSpacing: "-0.01em",
            }}
          >
            Tell us what you would like to change about your smile.
          </h2>
          <p
            className="mt-4 max-w-md text-[15px] leading-relaxed"
            style={{
              color: "#5C7177",
              fontFamily: "var(--font-body-v2, var(--font-body))",
            }}
          >
            We reply within one business day with a written response — never a
            generic auto-reply. New patients welcome.
          </p>

          {tel && (
            <a
              href={`tel:${tel}`}
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium hover:opacity-80"
              style={{ color: "#0F2A2E" }}
            >
              <Phone className="h-4 w-4" style={{ color: "#2BAE9D" }} />
              <span style={{ fontFamily: "var(--font-body-v2, var(--font-body))" }}>
                Or call {tel}
              </span>
            </a>
          )}

          <div className="mt-8 rounded-xl p-5 md:p-6"
            style={{ background: "#E4F1EE" }}
          >
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
