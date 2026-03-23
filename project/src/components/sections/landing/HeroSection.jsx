import React from "react";
import { Link } from "react-router-dom";
import { StarIcon } from "@heroicons/react/24/solid";
import SectionContainer from "./SectionContainer";

function HeroSection({ content }) {
  return (
    <SectionContainer
      id="hero"
      className="relative overflow-hidden bg-gradient-to-b from-[#07111F] via-[#0A1A2C] to-[#111827] pb-20 pt-16 text-slate-100 sm:pt-24 lg:pb-24"
    >
      <div className="pointer-events-none absolute -top-48 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="relative grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="animate-fade-up lg:col-span-8">
          <p className="mb-5 inline-flex rounded-full border border-emerald-300/25 bg-emerald-300/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200 sm:text-sm">
            {content.badge}
          </p>
          <h1 className="max-w-4xl font-heading text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
            {content.heading}
          </h1>
          <p
            className="mt-6 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg animate-fade-up"
            style={{ animationDelay: "120ms" }}
          >
            {content.subheading}
          </p>
          <div
            className="mt-10 flex flex-wrap gap-4 animate-fade-up"
            style={{ animationDelay: "200ms" }}
          >
            <Link
              to={content.primaryCta.to}
              className="rounded-2xl bg-emerald-500 px-7 py-3.5 text-sm font-semibold text-[#04151C] shadow-lg shadow-emerald-900/30 transition hover:-translate-y-0.5 hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 sm:text-base"
            >
              {content.primaryCta.label}
            </Link>
            <Link
              to={content.secondaryCta.to}
              className="rounded-2xl border border-slate-500 bg-slate-900/30 px-7 py-3.5 text-sm font-semibold text-slate-100 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-800/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-200 sm:text-base"
            >
              {content.secondaryCta.label}
            </Link>
          </div>
          <div
            className="mt-8 animate-fade-up"
            style={{ animationDelay: "260ms" }}
            aria-label="Trust indicators"
          >
            <p className="text-sm text-slate-300">{content.trustLine}</p>
            <ul className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-200">
              {content.trustMetrics.map((metric) => (
                <li key={metric} className="inline-flex items-center gap-2">
                  <StarIcon className="h-4 w-4 text-emerald-300" aria-hidden="true" />
                  <span>{metric}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}

export default HeroSection;
