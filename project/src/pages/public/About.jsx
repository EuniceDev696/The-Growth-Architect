import React from "react";
import { Link } from "react-router-dom";
import Nav from "../../components/layout/Nav";
import Footer from "../../components/layout/Footer";
import { COACHES } from "../../data/coaches";

import Collaboration from "../../assets/images/collaboration.png";
import Founder from "../../assets/images/FounderImg.png";
import team1 from "../../assets/images/team1.png";
import team2 from "../../assets/images/team2.png";
import team3 from "../../assets/images/team3.png";

const About = () => {
  const coachImages = [team1, team2, team3];

  return (
    <section className="bg-white text-slate-800">

      {/* HERO */}
      <div className="bg-gradient-to-r from-teal-500 to-indigo-500 text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About The Growth Architect
          </h1>
          <p className="text-lg max-w-3xl mx-auto opacity-90">
            We're passionate about empowering businesses to reach their full
            potential through strategic consulting, personalized coaching, and
            actionable insights that drive real results.
          </p>
        </div>
      </div>

      {/* MISSION / VISION */}
      <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold text-teal-500 mb-3">Our Mission</h2>
          <p className="leading-relaxed text-slate-600">
            To partner with ambitious entrepreneurs and growing companies,
            providing them with the strategic guidance, practical tools, and
            personalized coaching they need to overcome challenges and achieve
            sustainable growth.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-indigo-500 mb-3">
            Our Vision
          </h2>
          <p className="leading-relaxed text-slate-600">
            To be the trusted catalyst that transforms businesses into thriving,
            purpose-driven organizations that create lasting value for their
            stakeholders and communities.
          </p>
        </div>
      </div>

      {/* GUIDING PRINCIPLES */}
      <div className="bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Guiding Principles
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {["Results-Driven", "Client-Centric", "Innovation-Focused"].map(
              (item, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
                >
                  <h3 className="text-xl font-semibold mb-2">{item}</h3>
                  <p className="text-slate-600">
                    We focus on practical outcomes, deep client understanding,
                    and forward-thinking strategies that create measurable
                    impact.
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* OUR STORY */}
      <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4 text-indigo-500">Our Story</h2>
          <p className="mb-4 leading-relaxed">
            The Growth Architect was born from a simple observation: many
            brilliant businesses struggle not because they lack vision or
            talent, but because they need strategic clarity and practical
            frameworks to navigate growth.
          </p>
          <p className="leading-relaxed text-slate-600">
            Founded by experienced consultants with backgrounds across startups
            and global organizations, our work bridges the gap between
            high-level strategy and real-world execution.
          </p>
        </div>

        <img
          src={Collaboration}
          alt="Consulting team collaboration"
          className="rounded-xl shadow-lg"
        />
      </div>
      {/* LEADERSHIP & TEAM */}
      <div className="bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-center mb-4 text-indigo-600">
            Leadership & Team
          </h2>
          <p className="text-center max-w-2xl mx-auto text-slate-600 mb-12">
            Meet the experts behind The Growth Architect — experienced
            consultants and coaches committed to helping businesses grow with
            clarity and confidence.
          </p>

          {/* Founder */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <img src={Founder} alt="Founder" className="rounded-xl shadow-lg" />

            <div>
              <h2 className="text-xl font-bold mb-2">Sarah Martins</h2>
              <h3 className="text-2xl font-bold mb-2">
                Founder & Lead Consultant
              </h3>
              <p className="text-teal-500 font-semibold mb-4">
                Strategy & Executive Growth
              </p>
              <p className="leading-relaxed text-slate-600">
                With over 15 years of experience working across Fortune 500
                organizations and high-growth startups, our founder brings deep
                strategic insight, practical execution frameworks, and a passion
                for helping leaders navigate complex growth challenges.
              </p>
            </div>
          </div>

          {/* Team Members */}
          <div className="grid md:grid-cols-3 gap-8">
            {COACHES.map((coach, index) => (
              <div
                key={coach.id}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-center"
              >
                <img
                  src={coachImages[index % coachImages.length]}
                  alt={coach.name}
                  className="rounded-full w-48 h-48 object-cover mx-auto mb-4"
                />
                <h4 className="font-semibold text-lg">{coach.name}</h4>
                <p className="text-sm text-teal-600 font-medium mt-1">{coach.title}</p>
                <p className="text-slate-500 text-sm">
                  {coach.focus}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* EXPERIENCE & CREDENTIALS */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-teal-500">
          Experience & Credentials
        </h2>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="border rounded-xl p-8 hover:shadow-lg transition">
            <h3 className="text-4xl font-bold text-indigo-600 mb-2">15+</h3>
            <p className="font-semibold mb-2">Years Experience</p>
            <p className="text-slate-600 text-sm">
              Combined experience across Fortune 500 companies, high-growth
              startups, and mid-market businesses.
            </p>
          </div>

          <div className="border rounded-xl p-8 hover:shadow-lg transition">
            <h3 className="text-4xl font-bold text-indigo-600 mb-2">
              Multi-Industry
            </h3>
            <p className="font-semibold mb-2">Cross-Sector Expertise</p>
            <p className="text-slate-600 text-sm">
              Technology, healthcare, financial services, manufacturing, and
              professional services.
            </p>
          </div>

          <div className="border rounded-xl p-8 hover:shadow-lg transition">
            <h3 className="text-4xl font-bold text-indigo-600 mb-2">
              Certified
            </h3>
            <p className="font-semibold mb-2">Trusted Professionals</p>
            <p className="text-slate-600 text-sm">
              MBA credentials, certified executive coaches, and strategic
              planning certifications from leading institutions.
            </p>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="bg-teal-500 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-4xl font-bold">200+</h3>
            <p className="opacity-90">Companies Helped</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold">15+</h3>
            <p className="opacity-90">Years Experience</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold">40%</h3>
            <p className="opacity-90">Avg Revenue Growth</p>
          </div>
        </div>
      </div>

      {/* WHO WE WORK WITH */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-indigo-600">
          Who We Work With
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Startups & Founders",
              text: "Early-stage companies seeking validation, clarity, and scalable foundations.",
            },
            {
              title: "Established Businesses",
              text: "Organizations ready to optimize operations and break through growth plateaus.",
            },
            {
              title: "Executive Teams",
              text: "Leadership teams strengthening strategic thinking and decision-making.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="border p-6 rounded-xl hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
              <p className="text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* HOW WE WORK */}
      <div className="bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">How We Work</h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              "Deep Discovery",
              "Strategic Design",
              "Guided Implementation",
              "Continuous Optimization",
            ].map((step, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow text-center"
              >
                <h3 className="font-semibold text-lg mb-2">{step}</h3>
                <p className="text-slate-600 text-sm">
                  A structured approach focused on clarity, execution, and
                  long-term impact.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CORE VALUES */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-teal-500">
          Our Core Values
        </h2>

        <div className="grid md:grid-cols-4 gap-6">
          {["Integrity", "Partnership", "Excellence", "Innovation"].map(
            (value, index) => (
              <div
                key={index}
                className="border rounded-xl p-6 text-center hover:shadow-lg transition"
              >
                <h3 className="font-semibold text-lg">{value}</h3>
              </div>
            )
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-indigo-600 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Build Sustainable Growth?
          </h2>
          <p className="mb-6 opacity-90">
            Let’s design a strategy that aligns vision with execution.
          </p>
          <Link to="/booking">
            <button className="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-slate-100 transition">
              Book Consultation
            </button>
          </Link>
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default About;
