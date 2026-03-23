import React, { useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../lib/api";

// Assets
import OfficeImg from "../../assets/images/office-collaboration.png";
import CoachingImg from "../../assets/images/CoachingImg.png";
import StrategyImg from "../../assets/images/advisory-session.png";
import FounderImg from "../../assets/images/FounderImg.png";
import ActionImg from "../../assets/images/ActionImg.png";
import { trackEvent } from "../../utils/analytics";
// Components
import Footer from "../../components/layout/Footer";

function Home() {
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState("idle");
  const [subscribeMessage, setSubscribeMessage] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const email = subscriberEmail.trim().toLowerCase();
    if (!email) return;

    setSubscribeStatus("submitting");
    setSubscribeMessage("");

    try {
      const response = await apiRequest("/subscribers/public", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      if (response?.alreadySubscribed) {
        setSubscribeMessage("You are already subscribed.");
        trackEvent("newsletter_already_subscribed", { emailDomain: email.split("@")[1] || "" });
      } else {
        setSubscribeMessage(
          response?.emailSent
            ? "Subscribed successfully. Please check your inbox."
            : `Subscribed successfully.${response?.emailInfo ? ` Email notice: ${response.emailInfo}` : ""}`
        );
        trackEvent("newsletter_subscribe_success", { emailDomain: email.split("@")[1] || "" });
      }
      setSubscriberEmail("");
      setSubscribeStatus("success");
    } catch (error) {
      setSubscribeStatus("error");
      setSubscribeMessage(error.message || "Unable to subscribe right now.");
      trackEvent("newsletter_subscribe_failed", { reason: error.message || "unknown" });
    }
  };

  return (
    <div className="bg-[#FCFCFC] text-indigo-900 selection:bg-teal-100">

      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-16 sm:pb-24">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-8">
            <div className="inline-block px-4 py-1.5 bg-teal-50 border border-teal-100 rounded-full text-teal-800 text-sm font-medium tracking-wide">
              Strategic Growth Architecture & Executive Coaching
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-indigo-900">
              Growth isn’t accidental. <br />
              <span className="text-teal-500 italic font-serif">
                It’s architected.
              </span>
            </h1>
            <p className="text-slate-600 text-xl leading-relaxed max-w-lg">
              The Growth Architect partners with business leaders to design
              clear strategy, disciplined execution, and sustainable growth
              systems.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/booking"
                className="px-8 py-4 bg-indigo-900 text-white rounded-full font-medium hover:bg-teal-800 transition-all shadow-lg shadow-indigo-200"
              >
                Start a Conversation
              </Link>
              <Link
                to="/services"
                className="px-8 py-4 border border-indigo-200 rounded-full font-medium hover:bg-indigo-50 transition-all"
              >
                View Services
              </Link>
            </div>
          </div>
          <div className="lg:col-span-6">
            <img
              src={OfficeImg}
              alt="Strategic collaboration"
              className="rounded-2xl shadow-2xl object-cover h-[280px] sm:h-[420px] lg:h-[500px] w-full"
            />
          </div>
        </div>
      </section>
      {/* 2. POINT OF VIEW */}
      <section className="py-10 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <div className="max-w-2xl mx-auto mb-20 text-center">
            <h2 className="text-4xl font-bold text-indigo-900 mb-4">
              Our Point of View
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              How we think about growth, structure, and execution and why it
              works.
            </p>
          </div>

          {/* Cards */}
          <div className="flex flex-col lg:flex-row gap-8">
            {[
              {
                title: "Clarity Precedes Growth",
                text: "Most businesses struggle because priorities are unclear. We help leaders define what truly matters before pursuing scale.",
              },
              {
                title: "Structure Enables Decisions",
                text: "Sustainable growth requires more than ideas. It needs clear decision frameworks, operating rhythms, and accountability.",
              },
              {
                title: "Strategy Is Proven Through Execution",
                text: "Strategy only matters when it becomes action. We focus on turning intent into measurable results.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group flex-1 bg-white border border-slate-200 rounded-2xl p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Index */}
                <span className="text-2xl font-mono text-teal-500 block mb-6">
                  0{idx + 1}
                </span>

                {/* Title */}
                <h3 className="text-2xl font-medium text-slate-900 mb-4 group-hover:text-teal-500 transition-colors">
                  {item.title}
                </h3>

                {/* Body */}
                <p className="text-slate-600 text-lg leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ABOUT US */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-sm font-bold tracking-[0.2em] text-teal-600 uppercase">
              The Architect
            </h2>
            <h3 className="text-4xl font-bold text-indigo-900 leading-tight">
              Bridging the gap between vision and operational reality.
            </h3>
            <p className="text-slate-600 text-lg leading-relaxed">
              With over 15 years of experience scaling growth-stage companies,
              we provide the external perspective and internal discipline
              required to reach the next level.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center text-teal-500 font-semibold group pt-4"
            >
              <span className="border-b-2 border-indigo-200 group-hover:border-teal-500 transition-all pb-1">
                Our Story & Philosophy
              </span>
              <span className="ml-2 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <div className="bg-indigo-100 h-64 rounded-2xl overflow-hidden shadow-sm flex items-center justify-center italic text-indigo-400">
                  <img
                    src={FounderImg}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="bg-teal-500 h-40 rounded-2xl p-6 text-white flex flex-col justify-end">
                  <p className="text-3xl font-bold">15+</p>
                  <p className="text-sm opacity-80 uppercase tracking-wider">
                    Years Experience
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-indigo-900 h-40 rounded-2xl p-6 text-white flex flex-col justify-end">
                  <p className="text-3xl font-bold">50+</p>
                  <p className="text-sm opacity-80 uppercase tracking-wider">
                    Partnerships
                  </p>
                </div>
                <div className="bg-indigo-200 h-64 rounded-2xl overflow-hidden shadow-sm flex items-center justify-center italic text-indigo-400">
                  <img src={ActionImg} className="object-cover w-full h-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHAT WE WORK ON */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-t border-indigo-100">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <h2 className="text-4xl font-bold">What We Work On</h2>
          <Link
            to="/services"
            className="text-teal-500 font-semibold border-b-2 border-teal-100 hover:border-teal-700 transition-all pb-1"
          >
            Explore All Areas →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Text first on small screens, image second */}
          <div className="order-2 md:order-1 space-y-12">
            <div>
              <h3 className="text-2xl font-bold mb-3">
                Strategic Architecture
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Defining direction, priorities, and execution paths for
                growth-stage businesses.
              </p>
            </div>
            <div className="h-px bg-indigo-100 w-full"></div>
            <div>
              <h3 className="text-2xl font-bold mb-3">Leadership Coaching</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Supporting leaders through decision-making, growth, and
                transition.
              </p>
            </div>
          </div>
          <div className="order-1 md:order-2 relative group overflow-hidden rounded-2xl">
            <img
              src={StrategyImg}
              alt="Strategic planning"
              className="rounded-2xl transition-transform duration-700 group-hover:scale-105 w-full h-[400px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* 5. LEADERSHIP COACHING*/}
      <section className="bg-teal-50/30 py-16 sm:py-24 lg:py-28 border-y border-teal-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-5 order-1 lg:order-2 space-y-8">
              <h2 className="text-4xl font-bold leading-tight">
                Leadership Decisions <br />
                Shape Outcomes
              </h2>
              <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
                <p>
                  As businesses grow, leadership decisions become more complex.
                  Our coaching engagements provide a{" "}
                  <span className="text-slate-900 font-semibold">
                    structured space
                  </span>{" "}
                  for leaders to think clearly.
                </p>
                <p className="border-l-4 border-teal-500 pl-6 italic font-light">
                  "This is not motivational coaching, it is strategic,
                  reflective, and grounded in real business context."
                </p>
              </div>
              <Link
                to="/services"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-indigo-900 rounded-full font-bold hover:bg-indigo-900 hover:text-white transition-all"
              >
                Learn About Coaching
              </Link>
            </div>
            <div className="w-full">
              <img
                src={CoachingImg}
                alt="Leadership session"
                className="rounded-2xl shadow-xl transition-all duration-700 w-full h-[280px] sm:h-[420px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 max-w-2xl">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Real Client Results
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Practical strategy. Measurable outcomes.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <span className="inline-block rounded-full bg-teal-100 px-3 py-1 text-sm font-medium text-teal-600">
                Strategy Consulting
              </span>

              <h3 className="mt-4 text-xl font-semibold text-gray-900">
                2× Revenue Growth in 6 Months
              </h3>

              <p className="mt-3 text-gray-600">
                Helped a service-based founder refine positioning, pricing, and
                go-to-market strategy.
              </p>

              <ul className="mt-5 space-y-2 text-sm text-gray-700">
                <li>
                  <strong>Problem:</strong> Stagnant growth
                </li>
                <li>
                  <strong>Solution:</strong> Clarity + execution roadmap
                </li>
                <li>
                  <strong>Result:</strong> +110% revenue
                </li>
              </ul>

              <Link
                to="/casestudies"
                className="mt-6 inline-flex items-center font-semibold text-indigo-600 transition hover:text-indigo-500"
              >
                Read full case study →
              </Link>
            </div>

            <div className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-600">
                Leadership Coaching
              </span>

              <h3 className="mt-4 text-xl font-semibold text-gray-900">
                Reduced Burnout, Increased Focus
              </h3>

              <p className="mt-3 text-gray-600">
                Worked with an executive team to improve decision-making and
                team alignment.
              </p>

              <ul className="mt-5 space-y-2 text-sm text-gray-700">
                <li>
                  <strong>Problem:</strong> Overwhelm & misalignment
                </li>
                <li>
                  <strong>Solution:</strong> Coaching + systems
                </li>
                <li>
                  <strong>Result:</strong> Faster execution
                </li>
              </ul>

              <Link
                to="/casestudies"
                className="mt-6 inline-flex items-center font-semibold text-indigo-600 transition hover:text-indigo-500"
              >
                Read full case study →
              </Link>
            </div>
            <div className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <span className="inline-block rounded-full bg-teal-100 px-3 py-1 text-sm font-medium text-teal-600">
                Growth Advisory
              </span>

              <h3 className="mt-4 text-xl font-semibold text-gray-900">
                From Chaos to Scalable Systems
              </h3>

              <p className="mt-3 text-gray-600">
                Built repeatable systems that freed the founder from day-to-day
                operations.
              </p>

              <ul className="mt-5 space-y-2 text-sm text-gray-700">
                <li>
                  <strong>Problem:</strong> Founder bottleneck
                </li>
                <li>
                  <strong>Solution:</strong> Process design
                </li>
                <li>
                  <strong>Result:</strong> Time + leverage
                </li>
              </ul>

              <Link
                to="/casestudies"
                className="mt-6 inline-flex items-center font-semibold text-indigo-600 transition hover:text-indigo-500"
              >
                Read full case study →
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 max-w-2xl">
            <h2 className="text-3xl font-bold text-indigo-500 sm:text-4xl">
              What Clients Say
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Real feedback from leaders and founders we have worked with.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <p className="text-gray-700">
                “This completely changed how I think about my business. The
                clarity alone was worth it.”
              </p>

              <div className="mt-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 font-bold text-teal-600">
                  A
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Alex Okoh</p>
                  <p className="text-sm text-gray-500">Founder, SaaS Company</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <p className="text-gray-700">
                “Clear strategy, direct feedback, and zero fluff. We executed
                faster than ever.”
              </p>

              <div className="mt-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600">
                  O
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Omolara Davies</p>
                  <p className="text-sm text-gray-500">COO, Growth Agency</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <p className="text-gray-700">
                “The best investment we made this year. Focus, alignment, and
                results.”
              </p>

              <div className="mt-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 font-bold text-teal-600">
                  E
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Emmanuel Arinze</p>
                  <p className="text-sm text-gray-500">
                    Managing Director, Elite Companies
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CONTACT / FINAL CALL TO ACTION (The Conversion Layer) */}
      <section className="bg-gradient-to-r from-emerald-500 to-indigo-600  text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl font-bold mb-8">
                Ready to architect <br />
                your next phase?
              </h2>
              <p className="text-white text-xl mb-8 leading-relaxed">
                We take on a limited number of partners to ensure deep strategic
                impact. Whether you have a specific project or just need
                clarity, let's talk.
              </p>
              <div className="space-y-2">
                <p className="text-teal-400 font-mono text-sm uppercase tracking-widest">
                  Inquiries
                </p>
                <a
                  href="mailto:hello@growtharchitect.com"
                  className="text-2xl hover:text-teal-400 transition-colors border-b border-indigo-700 pb-1"
                >
                  hello@growtharchitect.com
                </a>
              </div>
            </div>

            <div className="bg-white text-indigo-900 p-10 rounded-3xl shadow-2xl relative">
              <div className="absolute -top-6 -right-6 bg-teal-500 text-white px-6 py-2 rounded-full font-bold shadow-lg transform rotate-3">
                Limited Openings
              </div>
              <h3 className="text-2xl font-bold mb-6">Start the Process</h3>
              <div className="space-y-6">
                <Link
                  to="/booking"
                  className="block w-full text-center bg-indigo-900 text-white py-4 rounded-xl font-bold hover:bg-teal-700 transition-all"
                >
                  Book a Strategy Session
                </Link>
                <div className="relative flex items-center">
                  <div className="flex-grow border-t border-indigo-200"></div>
                  <span className="flex-shrink mx-4 text-indigo-400 text-sm">
                    or
                  </span>
                  <div className="flex-grow border-t border-indigo-200"></div>
                </div>
                <Link
                  to="/contact"
                  className="block w-full text-center border-2 border-indigo-900 py-4 rounded-xl font-bold hover:bg-indigo-900 hover:text-white transition-all"
                >
                  Send a Message
                </Link>
              </div>
            </div>
          </div>
        </div>
        <section className="relative overflow-hidden py-20">
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-black/10 blur-3xl"></div>

          <div className="relative mx-auto max-w-2xl px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Get Weekly Growth Insights
            </h2>

            <p className="mt-4 text-lg text-indigo-100">
              Practical strategy, clarity, and frameworks — straight to your
              inbox.
            </p>

            <form className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-3" onSubmit={handleSubscribe}>
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={subscriberEmail}
                onChange={(e) => setSubscriberEmail(e.target.value)}
                className="flex-1 rounded-xl border border-white/20 bg-white/90 px-5 py-3 text-gray-900 placeholder-gray-500 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />

              <button
                type="submit"
                disabled={subscribeStatus === "submitting"}
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-teal-500 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:bg-teal-400 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-white"
              >
                <span className="absolute inset-0 translate-y-full bg-white/20 transition-transform duration-300 group-hover:translate-y-0"></span>
                <span className="relative">{subscribeStatus === "submitting" ? "Subscribing..." : "Subscribe"}</span>
              </button>
            </form>
            {subscribeMessage && (
              <p className="mt-3 text-sm text-white/90">{subscribeMessage}</p>
            )}

            <p className="mt-4 text-sm text-indigo-100">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </section>
      </section>

      <Footer />
    </div>
  );
}

export default Home;

