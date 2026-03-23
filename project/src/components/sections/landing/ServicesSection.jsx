import React from "react";
import { Link } from "react-router-dom";
import { BoltIcon, BriefcaseIcon, Cog8ToothIcon, CommandLineIcon } from "@heroicons/react/24/outline";
import SectionContainer from "./SectionContainer";

const serviceIcons = [BriefcaseIcon, BoltIcon, CommandLineIcon, Cog8ToothIcon];

function ServicesSection({ services }) {
  return (
    <SectionContainer id="services" className="bg-[#F5F8FA] py-14 sm:py-20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Advisory Services</p>
          <h2 className="mt-3 font-heading text-3xl text-slate-900 sm:text-4xl">Strategic infrastructure for serious growth goals</h2>
        </div>
        <Link to="/services" className="text-sm font-semibold text-slate-800 underline-offset-4 hover:underline">
          Explore all services
        </Link>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {services.map((service, index) => {
          const Icon = serviceIcons[index] || BriefcaseIcon;
          return (
            <article
              key={service.title}
              className="group rounded-3xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-[0_22px_48px_-30px_rgba(2,6,23,0.5)]"
            >
              <div className="inline-flex rounded-xl bg-slate-900 p-2.5 text-emerald-300">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-2xl font-semibold text-slate-900">{service.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{service.description}</p>
            </article>
          );
        })}
      </div>
    </SectionContainer>
  );
}

export default ServicesSection;
