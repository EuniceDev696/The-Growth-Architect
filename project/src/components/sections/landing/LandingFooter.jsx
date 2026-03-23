import React from "react";
import { Link } from "react-router-dom";
import { ACTIVE_LOGO } from "../../../branding/logoSet";
import SectionContainer from "./SectionContainer";

function LandingFooter({ data }) {
  const year = new Date().getFullYear();

  return (
    <SectionContainer className="border-t border-slate-800 bg-[#050B16] py-10 text-slate-400">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <img src={ACTIVE_LOGO} alt="The Growth Architect" className="h-11 w-auto" />
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-500">
              Strategic advisory for founders and executive teams scaling high-value service businesses.
            </p>
          </div>
          <div className="grid gap-7 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">Navigation</p>
              <ul className="mt-3 space-y-2 text-sm">
                {data.nav.map((item) => (
                  <li key={item.label}>
                    <Link to={item.to} className="transition hover:text-emerald-300">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">Connect</p>
              <a href={`mailto:${data.email}`} className="mt-3 block text-sm transition hover:text-emerald-300">
                {data.email}
              </a>
              <ul className="mt-3 flex items-center gap-4 text-sm">
                {data.socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="transition hover:text-emerald-300"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <p className="border-t border-slate-800 pt-6 text-xs text-slate-500">
          © {year} The Growth Architect. All rights reserved.
        </p>
      </div>
    </SectionContainer>
  );
}

export default LandingFooter;
