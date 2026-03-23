import React from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/layout/Footer";

import StrategyImg from "../../assets/images/strategy.png";
import StartupImg from "../../assets/images/startup.png";
import CoachingImg from "../../assets/images/coaching.png";
import ProcessImg from "../../assets/images/process.png";

const services = [
  {
    id: "strategy",
    title: "Business Strategy Advisory",
    subtitle: "For founders and leadership teams at growth inflection points.",
    image: StrategyImg,
    price: "From N250,000",
    outcomes: [
      "Clear strategic priorities and decision focus",
      "Market positioning and competitive direction",
      "90-day execution roadmap with accountable milestones",
    ],
    forWho: "Best for businesses ready to scale with stronger strategic clarity.",
  },
  {
    id: "startup",
    title: "Startup Consulting",
    subtitle: "For early-stage teams building traction and investor readiness.",
    image: StartupImg,
    price: "From N180,000",
    outcomes: [
      "Business model and product-market fit refinement",
      "Go-to-market planning and traction systems",
      "Funding readiness and pitch narrative improvement",
    ],
    forWho: "Best for founders moving from idea to repeatable growth.",
  },
  {
    id: "coaching",
    title: "Executive Coaching",
    subtitle: "For decision-makers navigating complexity and scale.",
    image: CoachingImg,
    price: "From N120,000",
    outcomes: [
      "Higher-quality strategic decisions under pressure",
      "Leadership communication and team alignment",
      "Personal operating system for sustained performance",
    ],
    forWho: "Best for executives who want stronger leadership outcomes.",
  },
];

const valuePillars = [
  {
    title: "Stage-Specific Strategy",
    text: "Every engagement is matched to your business maturity, constraints, and current growth target.",
  },
  {
    title: "Execution Discipline",
    text: "Recommendations come with ownership, timelines, and operating rhythm for real implementation.",
  },
  {
    title: "Leadership Support",
    text: "Leaders receive direct support to make faster decisions and drive aligned teams.",
  },
];

const faqs = [
  {
    q: "How do we decide which service fits best?",
    a: "We start with a short discovery call, then recommend the most suitable service based on your stage and outcomes.",
  },
  {
    q: "Do you offer custom engagement packages?",
    a: "Yes. Scope, cadence, and duration can be tailored to your goals and team capacity.",
  },
  {
    q: "How quickly can we get started?",
    a: "Most clients start within 3 to 7 days after the initial consultation and scope confirmation.",
  },
  {
    q: "Can sessions be virtual?",
    a: "Yes. Engagements are virtual by default, with optional in-person sessions for selected projects.",
  },
];

function Services() {
  return (
    <div className="bg-white text-slate-900">
      <section className="relative overflow-hidden bg-gradient-to-r from-teal-700 via-cyan-700 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.14),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.12),_transparent_40%)]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <p className="text-teal-300 font-semibold uppercase tracking-wide text-sm">Services</p>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold max-w-3xl leading-tight">
            Strategic support built for measurable business growth
          </h1>
          <p className="mt-6 text-slate-300 max-w-2xl text-lg">
            We combine strategy, systems, and leadership coaching to help you scale with confidence.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              to="/booking"
              className="inline-flex justify-center px-7 py-3 rounded-xl bg-teal-500 text-white font-semibold hover:bg-teal-600 transition"
            >
              Book Consultation
            </Link>
            <Link
              to="/casestudies"
              className="inline-flex justify-center px-7 py-3 rounded-xl border border-slate-600 text-slate-100 hover:bg-slate-800 transition"
            >
              View Case Studies
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {valuePillars.map((pillar) => (
            <article key={pillar.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-bold text-slate-900">{pillar.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{pillar.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-14 sm:pb-20 space-y-10">
        {services.map((service, index) => (
          <article
            key={service.id}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm"
          >
            <div className={index % 2 === 1 ? "lg:order-2" : ""}>
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-[240px] sm:h-[320px] lg:h-[360px] object-cover rounded-2xl"
              />
            </div>

            <div className={index % 2 === 1 ? "lg:order-1" : ""}>
              <p className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-700">
                {service.price}
              </p>
              <h3 className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900">{service.title}</h3>
              <p className="mt-2 text-slate-600">{service.subtitle}</p>

              <div className="mt-5">
                <h4 className="font-semibold text-slate-900 mb-2">What you get</h4>
                <ul className="space-y-2 text-slate-700">
                  {service.outcomes.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-teal-600">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-5 text-sm text-slate-600">{service.forWho}</p>
              <Link
                to="/booking"
                className="inline-flex mt-6 px-6 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition"
              >
                Choose This Service
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="bg-slate-100 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <img
              src={ProcessImg}
              alt="How we work"
              className="w-full h-[260px] sm:h-[360px] object-cover rounded-2xl"
            />
            <div>
              <h2 className="text-3xl font-bold text-slate-900">How we work</h2>
              <div className="mt-6 space-y-4 text-slate-700">
                <p>
                  <strong>1. Discovery:</strong> We identify constraints and growth opportunities.
                </p>
                <p>
                  <strong>2. Design:</strong> We define priorities, systems, and leadership cadence.
                </p>
                <p>
                  <strong>3. Delivery:</strong> We support implementation and track measurable outcomes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <h2 className="text-3xl font-bold text-center text-slate-900">Frequently Asked Questions</h2>
        <div className="mt-8 space-y-4">
          {faqs.map((faq) => (
            <details key={faq.q} className="group rounded-2xl border border-slate-200 bg-white p-5">
              <summary className="list-none flex items-center justify-between cursor-default font-semibold text-slate-900">
                {faq.q}
                <span className="text-teal-600 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-slate-600">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-teal-600 to-indigo-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-16 text-center">
          <h2 className="text-3xl font-bold">Ready to move from ideas to outcomes?</h2>
          <p className="mt-4 text-slate-100">
            Book a consultation and get a practical path to your next growth milestone.
          </p>
          <Link
            to="/booking"
            className="inline-flex mt-7 px-8 py-3 rounded-xl bg-white text-indigo-700 font-semibold hover:bg-slate-100 transition"
          >
            Book Consultation
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Services;
