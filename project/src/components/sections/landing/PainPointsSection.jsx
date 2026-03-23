import React from "react";
import { Link } from "react-router-dom";
import {
  ChartBarSquareIcon,
  ExclamationTriangleIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import SectionContainer from "./SectionContainer";

const icons = [ChartBarSquareIcon, ExclamationTriangleIcon, WrenchScrewdriverIcon];

function PainPointsSection({ points }) {
  return (
    <SectionContainer id="pain-points" className="py-14 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Growth Constraints</p>
        <h2 className="mt-3 font-heading text-3xl text-slate-900 sm:text-4xl">
          High performers still hit avoidable growth bottlenecks
        </h2>
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {points.map((point, index) => {
          const Icon = icons[index] || ChartBarSquareIcon;
          return (
            <article
              key={point.title}
              className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_14px_34px_-28px_rgba(15,23,42,0.5)] transition hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(15,23,42,0.45)]"
            >
              <div className="inline-flex rounded-xl bg-emerald-100 p-2.5 text-emerald-700">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-xl font-semibold leading-snug text-slate-900">{point.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{point.description}</p>
            </article>
          );
        })}
      </div>
      <div className="mt-10 text-center">
        <Link
          to="/booking"
          className="inline-flex rounded-2xl bg-slate-900 px-7 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 sm:text-base"
        >
          Fix These Growth Bottlenecks
        </Link>
      </div>
    </SectionContainer>
  );
}

export default PainPointsSection;
