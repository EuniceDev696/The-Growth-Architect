import React from "react";
import { Link } from "react-router-dom";
import SectionContainer from "./SectionContainer";

function FinalCtaSection({ cta }) {
  return (
    <SectionContainer className="bg-[#081321] py-16 text-center text-slate-100 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">Next Step</p>
        <h2 className="mt-3 font-heading text-3xl text-white sm:text-5xl">{cta.heading}</h2>
        <p className="mt-5 text-sm leading-relaxed text-slate-300 sm:text-lg">{cta.subheading}</p>
        <p className="mt-6 inline-flex rounded-full border border-amber-300/35 bg-amber-300/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-amber-200 sm:text-sm">
          {cta.scarcity}
        </p>
        <div className="mt-9">
          <Link
            to={cta.primaryCta.to}
            className="inline-flex rounded-2xl bg-emerald-400 px-8 py-4 text-sm font-semibold text-[#052226] transition hover:-translate-y-0.5 hover:bg-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200 sm:text-base"
          >
            {cta.primaryCta.label}
          </Link>
        </div>
      </div>
    </SectionContainer>
  );
}

export default FinalCtaSection;
