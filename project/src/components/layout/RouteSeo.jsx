import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const DEFAULT_TITLE = "The Growth Architect | Strategy Consulting and Executive Coaching";
const DEFAULT_DESCRIPTION =
  "Strategic consulting and executive coaching for founders and growth-stage businesses.";
const SITE_URL = (import.meta.env.VITE_SITE_URL || "http://localhost:5173").replace(/\/+$/, "");

const SEO_BY_PATH = {
  "/": {
    title: "The Growth Architect | Build Sustainable Business Growth",
    description:
      "Design clear strategy, improve execution, and scale with confidence through focused consulting and coaching.",
  },
  "/home": {
    title: "Home | The Growth Architect",
    description:
      "Work with experienced strategy coaches to improve leadership decisions, systems, and growth outcomes.",
  },
  "/services": {
    title: "Services | The Growth Architect",
    description:
      "Explore strategy consulting, startup advisory, and executive coaching services for growth-focused leaders.",
  },
  "/about": {
    title: "About | The Growth Architect",
    description:
      "Meet the team and learn the operating principles behind The Growth Architect advisory model.",
  },
  "/contact": {
    title: "Contact | The Growth Architect",
    description: "Get in touch to discuss your growth goals, leadership priorities, and project scope.",
  },
  "/booking": {
    title: "Book a Session | The Growth Architect",
    description:
      "Book a strategy session with our coaching team and receive clear next steps for your business growth plan.",
  },
  "/bookingsuccess": {
    title: "Booking Confirmed | The Growth Architect",
    description: "Your session is confirmed. Review your booking details and prepare for your meeting.",
  },
  "/casestudies": {
    title: "Case Studies | The Growth Architect",
    description:
      "See measurable outcomes from strategy and coaching engagements across SaaS, services, and executive teams.",
  },
  "/privacy-policy": {
    title: "Privacy Policy | The Growth Architect",
    description: "How The Growth Architect collects, uses, and protects your personal information.",
  },
  "/terms-of-service": {
    title: "Terms of Service | The Growth Architect",
    description: "Terms and conditions governing use of The Growth Architect website and services.",
  },
  "/cookie-policy": {
    title: "Cookie Policy | The Growth Architect",
    description: "Details about cookies and tracking technologies used on The Growth Architect website.",
  },
};

const upsertMeta = (selector, createTag, setValues) => {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = createTag();
    document.head.appendChild(el);
  }
  setValues(el);
};

export default function RouteSeo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = SEO_BY_PATH[pathname] || {};
    const title = seo.title || DEFAULT_TITLE;
    const description = seo.description || DEFAULT_DESCRIPTION;
    const canonical = `${SITE_URL}${pathname}`;

    document.title = title;

    upsertMeta(
      'meta[name="description"]',
      () => {
        const meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        return meta;
      },
      (meta) => meta.setAttribute("content", description)
    );

    upsertMeta(
      'meta[property="og:title"]',
      () => {
        const meta = document.createElement("meta");
        meta.setAttribute("property", "og:title");
        return meta;
      },
      (meta) => meta.setAttribute("content", title)
    );

    upsertMeta(
      'meta[property="og:description"]',
      () => {
        const meta = document.createElement("meta");
        meta.setAttribute("property", "og:description");
        return meta;
      },
      (meta) => meta.setAttribute("content", description)
    );

    upsertMeta(
      'meta[property="og:type"]',
      () => {
        const meta = document.createElement("meta");
        meta.setAttribute("property", "og:type");
        return meta;
      },
      (meta) => meta.setAttribute("content", "website")
    );

    upsertMeta(
      'meta[property="og:url"]',
      () => {
        const meta = document.createElement("meta");
        meta.setAttribute("property", "og:url");
        return meta;
      },
      (meta) => meta.setAttribute("content", canonical)
    );

    upsertMeta(
      'meta[name="twitter:card"]',
      () => {
        const meta = document.createElement("meta");
        meta.setAttribute("name", "twitter:card");
        return meta;
      },
      (meta) => meta.setAttribute("content", "summary_large_image")
    );

    upsertMeta(
      'link[rel="canonical"]',
      () => {
        const link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        return link;
      },
      (link) => link.setAttribute("href", canonical)
    );

    const schemaId = "site-schema-org";
    const existingSchema = document.getElementById(schemaId);
    if (existingSchema) existingSchema.remove();
    const script = document.createElement("script");
    script.id = schemaId;
    script.type = "application/ld+json";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: "The Growth Architect",
      url: SITE_URL,
      serviceType: "Business Consulting and Executive Coaching",
      areaServed: "Nigeria",
      email: "support@thegrowtharchitect.com",
    });
    document.head.appendChild(script);
  }, [pathname]);

  return null;
}
