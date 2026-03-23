import Footer from "../../components/layout/Footer";

export default function TermsOfService() {
  return (
    <section className="bg-white text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 sm:py-20 space-y-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-indigo-900">Terms of Service</h1>
        <p className="text-slate-600">Effective date: February 18, 2026</p>

        <div className="space-y-5 text-slate-700 leading-relaxed">
          <p>
            By using The Growth Architect website and services, you agree to these terms.
          </p>
          <p>
            Our consulting and coaching services are provided for business guidance purposes.
            You remain responsible for your own business decisions and implementation.
          </p>
          <p>
            Session bookings may be rescheduled based on availability. No-show or late cancellation
            policies may apply where stated in service agreements.
          </p>
          <p>
            All website content, branding, and materials are the intellectual property of The Growth Architect,
            unless otherwise stated.
          </p>
          <p>
            We may update these terms from time to time. Continued use of the website indicates acceptance
            of the latest version.
          </p>
        </div>
      </div>
      <Footer />
    </section>
  );
}
