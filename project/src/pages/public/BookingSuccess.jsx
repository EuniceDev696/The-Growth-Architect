import React from "react";
import { Link, useLocation } from "react-router-dom";

// IMAGES
import StrategyTeam from "../../assets/images/strategy-team.png";
import SuccessStory from "../../assets/images/success-story.png";
import ChecklistImg from "../../assets/images/checklist.png";
import QuestionsImg from "../../assets/images/questions.png";
import OverviewImg from "../../assets/images/overview.png";
import Footer from "../../components/layout/Footer";

export default function BookingSuccess() {
  const { state } = useLocation();
  const booking = state || {};

  const {
    service = "Strategy Consultation",
    duration = "60 minutes",
    consultant = "Stella Martins",
    date = null,
    timeSlot = "2:00 PM PST",
    email = "john.doe@company.com",
    fullName = "Guest User",
  } = booking;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">

      {/* HEADER */}
      <section className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-teal-500">
          Your Session is Confirmed!
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Thank you for booking with The Growth Architect. We're excited to help you
          unlock your business potential and achieve your growth goals.
        </p>
      </section>

      {/* APPOINTMENT DETAILS */}
      <section className="border rounded-xl p-6 space-y-6">
        <h2 className="font-semibold text-lg text-teal-500">Appointment Details</h2>
        <div className="grid md:grid-cols-2 gap-6 text-sm">

          <div>
            <p className="text-gray-500">Service</p>
            <p className="font-medium">{service}</p>
          </div>

          <div>
            <p className="text-gray-500">Duration</p>
            <p className="font-medium">{duration}</p>
          </div>

          <div>
            <p className="text-gray-500">Consultant</p>
            <p className="font-medium">{consultant}</p>
          </div>

          <div>
            <p className="text-gray-500">Date & Time</p>
            <p className="font-medium">
              {date ? new Date(date).toDateString() : "December 15, 2024"} • {timeSlot}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Booked By</p>
            <p className="font-medium">{fullName}</p>
          </div>

        </div>

        <p className="text-sm text-gray-500 pt-4">
          A calendar invite will be included in your confirmation email. We will also send reminder emails 24 hours and 1 hour before your meeting.
        </p>
      </section>

      {/* CONFIRMATION EMAIL */}
      <section className="border rounded-xl p-6 space-y-3">
        <h3 className="font-semibold text-teal-500">Confirmation Email Sent</h3>
        <p className="text-sm text-gray-600">
          We've sent a confirmation email with all the details and meeting link to:
        </p>
        <p className="font-medium">{email}</p>
      </section>

      {/* WHAT HAPPENS NEXT */}
      <section className="space-y-6">
        <h3 className="font-semibold text-lg text-teal-500">What Happens Next</h3>
        <div className="grid md:grid-cols-4 gap-4 text-sm">
          {[
            "Check Your Email",
            "Prepare Your Questions",
            "Review Preparation Guide",
            "Join Your Session",
          ].map((step, index) => (
            <div key={step} className="border rounded-lg p-4">
              <div className="font-bold text-teal-500 mb-2">{index + 1}</div>
              <p className="font-medium">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PREPARATION RESOURCES */}
      <section className="space-y-6">
        <h3 className="font-semibold text-lg text-teal-500">Prepare for Your Session</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[{img:ChecklistImg,label:"Consultation Checklist"},{img:QuestionsImg,label:"Questions to Consider"},{img:OverviewImg,label:"Company Overview"}].map((item)=>(
            <div key={item.label} className="border rounded-lg overflow-hidden">
              <img src={item.img} alt={item.label} className="h-40 w-full object-cover" />
              <div className="p-4">
                <p className="font-medium">{item.label}</p>
                <button className="text-teal-500 text-sm mt-2">View</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BIG IMAGES */}
      <section className="space-y-6">
        <h3 className="font-semibold text-lg text-center text-teal-500">While You're Here</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border rounded-xl overflow-hidden">
            <img src={StrategyTeam} alt="Strategy Team" className="h-56 w-full object-cover" />
            <div className="p-5 space-y-2">
              <h4 className="font-semibold">Explore Other Services</h4>
              <p className="text-sm text-gray-600">Discover our full range of consulting and coaching services.</p>
              <Link to="/services" className="text-emerald-500 font-medium">View Services →</Link>
            </div>
          </div>
          <div className="border rounded-xl overflow-hidden">
            <img src={SuccessStory} alt="Success Story" className="h-56 w-full object-cover" />
            <div className="p-5 space-y-2">
              <h4 className="font-semibold">Read Success Stories</h4>
              <p className="text-sm text-gray-600">See how we’ve helped businesses achieve their goals.</p>
              <Link to="/casestudies" className="text-teal-500 font-medium">Case Studies →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <div className="text-center pt-8">
        <Link to="/home" className="text-teal-500 font-medium">Return to Homepage</Link>
      </div>

      <Footer/>
    </div>
  );
}
