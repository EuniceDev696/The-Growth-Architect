import React, { useState } from "react";
import Footer from "../../components/layout/Footer";
import { apiRequest } from "../../lib/api";
import { trackEvent } from "../../utils/analytics";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("idle"); // idle | submitting | success | error

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      alert("Please fill out all fields.");
      return;
    }

    setStatus("submitting");

    const newMessage = {
      id: Date.now(),
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
      status: "New",
      createdAt: new Date().toISOString(),
      dateDisplay: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
      sender: "visitor",           // ← identifies public form submissions
      clientEmail: form.email.trim(), // for grouping in admin
    };

    try {
      await apiRequest("/contact", {
        method: "POST",
        body: JSON.stringify(newMessage),
      });
      trackEvent("contact_message_sent", { emailDomain: form.email.trim().split("@")[1] || "" });
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
      alert("Your message has been sent successfully! We'll get back to you soon.");
    } catch (error) {
      setStatus("error");
      trackEvent("contact_message_failed", { reason: error.message || "unknown" });
      alert(error.message || "Unable to send your message right now. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Get in Touch
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Have questions about our services, want to collaborate, or just want to say hello?
              We'd love to hear from you. Fill out the form or reach us directly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Info */}
            <div className="space-y-10">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Email Us</h3>
                <p className="text-gray-700 text-lg">
                  <a href="mailto:hello@thegrowtharchitect.com" className="hover:text-teal-600 transition">
                    hello@thegrowtharchitect.com
                  </a>
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Call Us</h3>
                <p className="text-gray-700 text-lg">+234 123 456 7890</p>
                <p className="text-sm text-gray-500 mt-1">Monday – Friday, 9:00am – 5:00pm</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Location</h3>
                <p className="text-gray-700 leading-relaxed">
                  Victoria Island<br />
                  Lagos, Nigeria
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
              {status === "success" ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Message Sent!</h3>
                  <p className="text-gray-600 mb-6">
                    Thank you for reaching out. We'll get back to you soon.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="px-8 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Message
                    </label>
                    <textarea
                      name="message"
                      rows="5"
                      value={form.message}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className={`w-full py-4 text-white font-medium rounded-xl transition shadow-md ${
                      status === "submitting"
                        ? "bg-teal-400 cursor-not-allowed"
                        : "bg-teal-600 hover:bg-teal-700"
                    }`}
                  >
                    {status === "submitting" ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
