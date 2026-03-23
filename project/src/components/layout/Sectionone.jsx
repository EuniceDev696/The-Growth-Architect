import React from "react";
import Hero2 from "../../assets/images/Hero2.png"
import Hero from "../../assets/images/Hero.png";
import Consult from "../../assets/images/Consult.png";
import { Link } from "react-router-dom";

function Sectionone() {
  const services = [
    {
      title: "Strategic Clarity",
      description:
        "Cut through the noise with data-driven frameworks that reveal your highest-impact growth opportunities.",
      highlight: "Clear roadmap to 8-figure revenue",
    },
    {
      title: "Leadership Development",
      description:
        "Transform your mindset and capabilities to lead with confidence at every stage of growth.",
      highlight: "Breakthrough limiting beliefs & patterns",
    },
    {
      title: "Systematic Growth",
      description:
        "Build scalable systems that generate consistent results without requiring your constant involvement.",
      highlight: "Sustainable, compound growth",
    },
  ];

  const challenges = [
    {
      title: "Stagnant Growth",
      description:
        "You're working harder than ever but revenue has plateaued. Breakthrough growth feels impossible without a clear strategy.",
    },
    {
      title: "Unclear Direction",
      description:
        "You have big goals but lack a clear roadmap. Decisions feel reactive rather than proactive.",
    },
    {
      title: "Operational Inefficiencies",
      description:
        "Your team is stretched thin and repetitive tasks slow down productivity.",
    },
  ];

  const freeSession = [
    {
      title: "Business Assessment",
      description:
        "We'll analyze your current challenges, opportunities, and growth blockers to identify exactly what's holding your business back.",
    },
    {
      title: "Custom Roadmap",
      description:
        "Get a tailored 90-day action plan with specific milestones, priorities, and strategies designed for your goals.",
    },
    {
      title: "Expert Insights",
      description:
        "Learn proven strategies from 15+ years of experience helping businesses scale from startup to Fortune 500 level.",
    },
    {
      title: "Clear Next Steps",
      description:
        "Walk away with actionable priorities and a clear understanding of what to implement first for maximum impact.",
    },
  ];

  return (
    <div className="font-sans">

      {/* Hero Section */}
      <section className="relative flex flex-col lg:flex-row items-center gap-16 lg:gap-32 px-6 lg:px-20 py-32 bg-gradient-to-r from-teal-100 via-indigo-100 to-teal-50">
        {/* Left Text */}
        <div className="flex-1 space-y-6">
          <h1 className="text-5xl lg:text-6xl font-serif font-extrabold leading-tight text-indigo-900">
            Architect Your <span className="text-teal-500">Next Level Of Growth</span>
          </h1>
          <p className="text-lg lg:text-xl text-gray-800 leading-relaxed">
            Strategic consulting and transformational coaching for ambitious leaders ready to scale.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Trusted by 500+ entrepreneurs to break through plateaus and architect sustainable growth.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link to="/booking">
              <button className="px-6 py-3 rounded-xl bg-teal-500 text-white font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-lg">
                Book Free Consultation
              </button>
            </Link>
            <Link to="/services">
              <button className="px-6 py-3 rounded-xl border-2 border-teal-500 text-teal-500 font-bold text-lg hover:bg-teal-50 transition-all duration-300 shadow-lg">
                Explore Services
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-col sm:flex-row gap-6 mt-10 text-center">
            <div className="hover:scale-105 transition-transform duration-300">
              <h2 className="text-3xl font-bold text-teal-500">500+</h2>
              <p>Leaders Transformed</p>
            </div>
            <div className="border-l border-r border-gray-300 px-5 hover:scale-105 transition-transform duration-300">
              <h2 className="text-3xl font-bold text-teal-500">98%</h2>
              <p>Success Rate</p>
            </div>
            <div className="hover:scale-105 transition-transform duration-300">
              <h2 className="text-3xl font-bold text-teal-500">15+</h2>
              <p>Years Experience</p>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="flex-1 relative">
          <img src={Hero2} alt="CEO" className="w-full h-screen object-cover rounded-3xl shadow-2xl" />
        </div>
      </section>

      {/* Services Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-12 px-6 lg:px-20 py-24 bg-gradient-to-tr from-teal-50 via-indigo-50 to-teal-100">
        {services.map((s, idx) => (
          <div key={idx} className="relative bg-white p-8 rounded-3xl shadow-2xl hover:scale-105 hover:shadow-3xl transition-transform duration-300">
            <h3 className="font-serif text-2xl lg:text-3xl font-bold text-indigo-900">{s.title}</h3>
            <p className="mt-4 text-gray-700">{s.description}</p>
            <p className="mt-6 font-bold text-teal-500">{s.highlight}</p>
          </div>
        ))}
      </section>

      {/* Challenges Section */}
      <section className="px-6 lg:px-20 py-24 bg-gradient-to-br from-indigo-50 via-teal-50 to-indigo-100 space-y-12">
        <h2 className="text-4xl font-bold font-serif text-center text-indigo-900 mb-10">
          Are You Facing These Challenges?
        </h2>
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2">
            <img src={Consult} alt="Consult" className="rounded-3xl shadow-2xl w-full h-auto hover:scale-105 transition-transform duration-300"/>
          </div>
          <div className="lg:w-1/2 space-y-6">
            {challenges.map((c, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-transform duration-300">
                <h3 className="font-serif text-2xl lg:text-3xl font-bold text-teal-500 mb-2">{c.title}</h3>
                <p className="text-gray-700">{c.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-10 bg-teal-500 text-white py-4 rounded-2xl font-bold hover:scale-105 transition-transform duration-300 max-w-xl mx-auto">
          You Don't Have To Figure This Out Alone
        </div>
      </section>

      {/* Free Strategy Session */}
      <section className="px-6 lg:px-20 py-24 bg-gradient-to-tr from-teal-50 via-indigo-50 to-teal-100 space-y-12">
        <h2 className="text-4xl font-bold font-serif text-center text-indigo-900 mb-10">
          What You Get in Your Free Strategy Session
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {freeSession.map((f, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl shadow-2xl hover:-translate-y-2 hover:shadow-3xl transition-transform duration-300">
              <h3 className="font-serif text-2xl lg:text-3xl font-bold text-teal-500 mb-4">{f.title}</h3>
              <p className="text-gray-700">{f.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center bg-teal-500 text-white py-4 rounded-2xl font-bold hover:scale-105 transition-transform duration-300 max-w-xl mx-auto">
          ⚡ Limited Availability - Only 5 Spots Per Week
        </div>
      </section>
    </div>
  );
}

export default Sectionone;
