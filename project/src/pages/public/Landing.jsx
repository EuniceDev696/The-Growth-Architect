import React from "react";
import HeroSection from "../../components/sections/landing/HeroSection";
import MetricsStrip from "../../components/sections/landing/MetricsStrip";
import PainPointsSection from "../../components/sections/landing/PainPointsSection";
import ServicesSection from "../../components/sections/landing/ServicesSection";
import CaseStudySection from "../../components/sections/landing/CaseStudySection";
import TestimonialsSection from "../../components/sections/landing/TestimonialsSection";
import ProcessSection from "../../components/sections/landing/ProcessSection";
import FinalCtaSection from "../../components/sections/landing/FinalCtaSection";
import LandingFooter from "../../components/sections/landing/LandingFooter";
import {
  featuredCaseStudy,
  finalCta,
  footerData,
  heroContent,
  metrics,
  painPoints,
  processSteps,
  services,
  testimonials,
} from "../../data/landingContent";

function Landing() {
  return (
    <div className="bg-white text-slate-900">
      <HeroSection content={heroContent} />
      <MetricsStrip metrics={metrics} />
      <PainPointsSection points={painPoints} />
      <ServicesSection services={services} />
      <CaseStudySection study={featuredCaseStudy} />
      <TestimonialsSection testimonials={testimonials} />
      <ProcessSection steps={processSteps} />
      <FinalCtaSection cta={finalCta} />
      <LandingFooter data={footerData} />
    </div>
  );
}

export default Landing;
