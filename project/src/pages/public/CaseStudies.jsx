import React from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/layout/Footer";
import Saas from "../../assets/images/Saas.png";
import Operations from "../../assets/images/operations.png";
import Leadership from "../../assets/images/leadership.png";

const studies = [
  {
    id: "saas-scale",
    title: "Scaling a SaaS Startup",
    industry: "Technology (SaaS)",
    size: "25 to 50 employees",
    engagement: "Strategy Consulting + Coaching",
    image: Saas,
    before: ["Inconsistent monthly revenue", "Weak positioning", "Unclear leadership priorities"],
    after: ["3x revenue growth in 12 months", "Focused market positioning", "Aligned growth execution"],
    impact: "Revenue up 3x in 12 months",
    quote:
      "We moved from scattered initiatives to one focused strategy. Execution quality changed immediately.",
    author: "Founder and CEO, SaaS Company",
  },
  {
    id: "ops-turnaround",
    title: "Operational Turnaround",
    industry: "Professional Services",
    size: "120 to 180 employees",
    engagement: "Operational Strategy + Leadership Coaching",
    image: Operations,
    before: ["Workflow bottlenecks", "Slow decisions", "Low accountability"],
    after: ["40 percent efficiency improvement", "Faster decision cycles", "Clear ownership across teams"],
    impact: "40 percent efficiency gain in two quarters",
    quote:
      "The work brought structure to our operations and confidence to leadership decisions.",
    author: "COO, Professional Services Firm",
  },
  {
    id: "executive-transform",
    title: "Executive Leadership Transformation",
    industry: "Technology and Financial Services",
    size: "Executive leadership team",
    engagement: "Executive Coaching + Leadership Development",
    image: Leadership,
    before: ["Misaligned leadership decisions", "Reactive management style", "Low strategic confidence"],
    after: ["Aligned executive direction", "Better cross-functional decisions", "Higher leadership confidence"],
    impact: "Faster strategic decisions and improved team trust",
    quote: "Our leadership team now makes decisions with clarity and shared direction.",
    author: "Managing Director",
  },
];

const highlights = [
  { value: "3x", label: "Revenue Growth" },
  { value: "40%", label: "Efficiency Increase" },
  { value: "200+", label: "Businesses Served" },
  { value: "95%", label: "Client Satisfaction" },
];

function CaseStudies() {
  return (
    <section className="bg-white text-slate-900">
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-700 via-cyan-700 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.14),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.12),_transparent_40%)]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <p className="text-teal-300 font-semibold uppercase tracking-wide text-sm">Case Studies</p>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold max-w-3xl leading-tight">
            Real transformations backed by measurable outcomes
          </h1>
          <p className="mt-6 text-slate-300 max-w-2xl text-lg">
            Explore how strategy, systems, and coaching translated into concrete business progress.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {highlights.map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-200 p-4 text-center bg-slate-50">
              <p className="text-2xl font-bold text-indigo-700">{item.value}</p>
              <p className="text-sm text-slate-600">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-14 sm:pb-20 space-y-10">
        {studies.map((study, index) => (
          <article key={study.id} className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <img
                  src={study.image}
                  alt={study.title}
                  className="w-full h-[240px] sm:h-[320px] lg:h-[360px] object-cover rounded-2xl"
                />
              </div>
              <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                <p className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-700">
                  {study.impact}
                </p>
                <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900">{study.title}</h2>
                <div className="mt-4 text-sm text-slate-600 space-y-1">
                  <p>
                    <strong>Industry:</strong> {study.industry}
                  </p>
                  <p>
                    <strong>Company Size:</strong> {study.size}
                  </p>
                  <p>
                    <strong>Engagement:</strong> {study.engagement}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-2xl bg-rose-50 border border-rose-100 p-5">
                <h3 className="font-semibold text-rose-700">Before</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  {study.before.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-rose-500">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-5">
                <h3 className="font-semibold text-emerald-700">After</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  {study.after.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-emerald-600">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <blockquote className="mt-6 rounded-2xl border-l-4 border-indigo-500 bg-slate-50 p-5">
              <p className="italic text-slate-700">"{study.quote}"</p>
              <footer className="mt-2 text-sm font-semibold text-slate-800">- {study.author}</footer>
            </blockquote>
          </article>
        ))}
      </div>

      <div className="bg-gradient-to-r from-teal-600 to-indigo-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-16 text-center">
          <h2 className="text-3xl font-bold">Ready for your own growth story?</h2>
          <p className="mt-4 text-slate-100">
            Let us design the strategy and operating rhythm your business needs next.
          </p>
          <Link
            to="/booking"
            className="inline-flex mt-7 px-8 py-3 rounded-xl bg-white text-indigo-700 font-semibold hover:bg-slate-100 transition"
          >
            Book Consultation
          </Link>
        </div>
      </div>

      <Footer />
    </section>
  );
}

export default CaseStudies;
