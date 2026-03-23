import React from "react";
import SectionContainer from "./SectionContainer";

function ProcessSection({ steps }) {
  return (
    <SectionContainer id="process" className="py-14 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Process</p>
        <h2 className="mt-3 font-heading text-3xl text-slate-900 sm:text-4xl">How It Works</h2>
      </div>
      <div className="relative mt-12">
        <div className="absolute left-6 right-6 top-8 hidden h-px bg-slate-300 md:block" aria-hidden="true" />
        <ol className="grid gap-5 md:grid-cols-3">
          {steps.map((item, index) => (
            <li
              key={item.title}
              className="animate-fade-up rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_14px_30px_-24px_rgba(15,23,42,0.45)]"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <p className="inline-flex rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-700">
                {item.step}
              </p>
              <h3 className="mt-4 text-2xl font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{item.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </SectionContainer>
  );
}

export default ProcessSection;
