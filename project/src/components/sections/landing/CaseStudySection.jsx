import React from "react";
import { Link } from "react-router-dom";
import SectionContainer from "./SectionContainer";

function CaseStudySection({ study }) {
  return (
    <SectionContainer id="case-study" className="py-14 sm:py-20">
      <div className="rounded-[2rem] border border-[#194046] bg-[#082128] p-7 text-slate-100 shadow-[0_24px_60px_-38px_rgba(2,8,23,0.9)] sm:p-10">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">Featured Case Study</p>
            <h2 className="mt-3 font-heading text-3xl text-white sm:text-4xl">{study.client}</h2>
            <Link
              to={study.cta.to}
              className="mt-8 inline-flex rounded-2xl bg-emerald-400 px-6 py-3 text-sm font-semibold text-[#062128] transition hover:bg-emerald-300 sm:text-base"
            >
              {study.cta.label}
            </Link>
          </div>
          <div className="space-y-6 lg:col-span-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-2xl border border-slate-600/70 bg-slate-900/30 p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-300">Before</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-100 sm:text-base">{study.before}</p>
              </article>
              <article className="rounded-2xl border border-emerald-300/25 bg-emerald-400/10 p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-emerald-200">After</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-100 sm:text-base">{study.after}</p>
              </article>
            </div>
            <ul className="space-y-3">
              {study.highlights.map((highlight) => (
                <li key={highlight} className="rounded-xl border border-slate-700/60 bg-slate-900/30 px-4 py-3 text-sm text-slate-200 sm:text-base">
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}

export default CaseStudySection;
