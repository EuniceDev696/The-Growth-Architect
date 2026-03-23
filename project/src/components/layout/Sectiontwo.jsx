import React from "react";
import Hero from "../../assets/images/Hero.png"
import Works from "../../assets/images/Works.png"
import { Link } from "react-router-dom";

function Sectiontwo() {
  const features = [
    {
      title: "15+ Years Experience",
      description:
        "Former Fortune 500 strategy consultants with deep expertise across industries and business stages.",
    },
    {
      title: "500+ Companies Scaled Successfully",
      description:
        "Proven track record of helping businesses achieve sustainable growth and operational excellence.",
    },
    {
      title: "Former Fortune 500 Strategy Consultant",
      description:
        "Enterprise-level strategic expertise now accessible to growing businesses at every stage.",
    },
  ];

  const testimonials = [
    {
      quote:
        '"Sarah took our e-commerce brand from ₦2.1B to ₦8.4B in 18 months. More importantly, she helped me become the leader my company needed."',
      author: "Maria Rodriguez",
      role: "CEO, Luna Beauty Co.",
    },
    {
      quote:
        '"The strategic framework completely transformed our approach to growth. We went from reactive to proactive, and our revenue doubled in the first year."',
      author: "James Chen",
      role: "Founder, TechFlow Solutions",
    },
    {
      quote:
        '"The leadership coaching broke through barriers I didn’t even know existed. I am now operating at a completely different level as a CEO."',
      author: "Sophia Lee",
      role: "Founder, InnovateX",
    },
  ];

  const steps = [
    {
      step: 1,
      title: "Book Your Free Session",
      description:
        "Click the button and choose your preferred time slot. Takes just 30 seconds to schedule online.",
    },
    {
      step: 2,
      title: "Meet with Expert Consultant",
      description:
        "Join a focused 30-minute video call where we analyze your business and identify growth opportunities.",
    },
    {
      step: 3,
      title: "Get Your Custom Growth Plan",
      description:
        "Receive a personalized 90-day roadmap with actionable strategies to transform your business.",
    },
  ];

  return (
    <div className="font-sans">

      {/* Why Choose Section */}
      <section className="py-24 px-6 lg:px-20 bg-gradient-to-r from-indigo-50 via-teal-50 to-indigo-100 space-y-12">
        <h2 className="text-4xl lg:text-5xl font-serif font-bold text-center text-indigo-900">
          Why Choose The Growth Architects
        </h2>

        <img
          src={Hero}
          alt="Consultancy"
          className="rounded-3xl shadow-2xl mx-auto w-full lg:w-3/4 hover:scale-105 transition-transform duration-300"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
          {features.map((f, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-transform duration-300"
            >
              <h3 className="text-2xl font-bold text-amber-600 font-serif mb-4">
                {f.title}
              </h3>
              <p className="text-gray-700 text-lg">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Client Success Spotlight */}
      <section className="py-24 px-6 lg:px-20 bg-gradient-to-r from-teal-50 via-indigo-50 to-teal-50 space-y-12">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-4xl mx-auto text-center hover:shadow-3xl transition-shadow duration-300">
          <h2 className="text-3xl text-indigo-800 font-bold font-serif mb-6">Client Success Spotlight</h2>
          <p className="text-slate-700 italic text-lg mb-6">
            "The Growth Architect took our e-commerce brand from ₦2.1B to ₦8.4B in 18 months. But more importantly, she helped me become the leader my company needed. The strategic clarity and personal breakthroughs completely transformed how I operate."
          </p>
          <h3 className="font-bold font-serif text-xl text-indigo-800">Raphael Odunbakin</h3>
          <p className="text-slate-600">CEO, Ace Group.</p>
        </div>
      </section>

      {/* Trusted Testimonials */}
      <section className="py-24 px-6 lg:px-20 bg-gradient-to-r from-indigo-50 via-teal-50 to-indigo-100 space-y-12">
        <h2 className="text-4xl font-serif font-bold text-center text-indigo-900 mb-12">
          Trusted by Ambitious Leaders
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-3xl shadow-2xl hover:-translate-y-2 hover:shadow-3xl transition-transform duration-300 text-center"
            >
              <p className="text-gray-700 italic text-lg">"{t.quote}"</p>
              <h3 className="mt-6 font-bold text-amber-500 font-serif">{t.author}</h3>
              <p className="text-gray-600">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3-Step Process */}
      <section className="py-24 px-6 lg:px-20 bg-gradient-to-tr from-teal-50 via-indigo-50 to-teal-50 space-y-12">
        <h2 className="text-4xl font-serif font-bold text-center text-indigo-900 mb-12">
          How It Works - Simple 3-Step Process
        </h2>

        <img
          src={Works}
          alt="Consultancy Image"
          className="rounded-3xl shadow-2xl mx-auto w-full lg:w-3/4 hover:scale-105 transition-transform duration-300"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-3xl shadow-2xl hover:-translate-y-2 hover:shadow-3xl transition-transform duration-300 text-center"
            >
              <h1 className="text-4xl font-bold text-teal-500 mb-4">{s.step}</h1>
              <h3 className="font-serif text-xl font-bold text-amber-600 mb-4">{s.title}</h3>
              <p className="text-gray-700 text-lg">{s.description}</p>
            </div>
          ))}
        </div>

        <p className="text-center font-serif font-semibold mt-6">
          ✓ No Pressure, No Sales Pitch - Just Value
        </p>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-20 bg-gradient-to-r from-indigo-50 via-teal-50 to-indigo-100 space-y-12">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-serif font-bold text-indigo-900">
            Ready To Architect Your Next Level?
          </h2>
          <p className="text-gray-700 text-lg">
            You've built something successful, but you know there's more. Stop leaving growth to chance. Get the strategic clarity and leadership breakthrough you need to scale with confidence.
          </p>
          <Link to="/booking">
            <button className="px-8 py-4 bg-teal-500 text-white font-bold rounded-xl text-lg hover:scale-105 transition-transform duration-300 shadow-lg">
              Book Free Consultation Now
            </button>
          </Link>

          <div className="flex flex-col sm:flex-row justify-center gap-6 mt-6 font-serif text-gray-800">
            <span>45-minute strategic session</span>
            <span>Custom growth roadmap</span>
            <span>Zero pressure approach</span>
          </div>

          <div className="mt-6 bg-teal-500 text-white rounded-2xl py-6 max-w-sm mx-auto shadow-lg">
            <p>🕐 Next available slot:</p>
            <h3 className="font-bold text-xl">Tomorrow, 2:00 PM EST</h3>
          </div>

          <div className="mt-12">
            <p className="mb-4">Join our newsletter for weekly strategic insights:</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <input
                type="email"
                placeholder="Enter your Email"
                className="w-full sm:w-64 h-12 p-4 rounded-2xl shadow-lg border border-gray-300"
              />
              <button className="w-full sm:w-64 h-12 rounded-xl bg-teal-500 text-white font-bold hover:scale-105 transition-transform duration-300 shadow-lg">
                Subscribe
              </button>
            </div>
          </div>

          <p className="mt-6 text-gray-700 font-serif">100% money-back guarantee on all consulting engagements</p>
        </div>
      </section>
    </div>
  );
}

export default Sectiontwo;
