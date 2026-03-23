import React from "react";
import SectionContainer from "./SectionContainer";

function MetricsStrip({ metrics }) {
  return (
    <SectionContainer className="-mt-8 pb-14">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)] sm:p-8">
        <ul className="grid gap-6 text-center sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((item) => (
            <li key={item.label}>
              <p className="text-3xl font-bold text-slate-900 sm:text-4xl">{item.value}</p>
              <p className="mt-2 text-sm font-medium uppercase tracking-wider text-slate-600">{item.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </SectionContainer>
  );
}

export default MetricsStrip;
