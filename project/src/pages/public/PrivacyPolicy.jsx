import Footer from "../../components/layout/Footer";

export default function PrivacyPolicy() {
  return (
    <section className="bg-white text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 sm:py-20 space-y-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-indigo-900">Privacy Policy</h1>
        <p className="text-slate-600">Effective date: February 18, 2026</p>

        <div className="space-y-5 text-slate-700 leading-relaxed">
          <p>
            The Growth Architect collects personal information you provide through forms, bookings,
            and account registration to deliver our services and communicate with you.
          </p>
          <p>
            We may collect your name, email address, meeting preferences, and communication history.
            We use this information to schedule sessions, send confirmations, provide support, and improve service quality.
          </p>
          <p>
            We do not sell your personal data. We may share data with trusted service providers
            used for hosting, analytics, and email delivery.
          </p>
          <p>
            You may request access, correction, or deletion of your data by contacting
            <a className="text-teal-600 hover:underline ml-1" href="mailto:support@thegrowtharchitect.com">support@thegrowtharchitect.com</a>.
          </p>
          <p>
            We use reasonable safeguards to protect your information, but no internet transmission is fully secure.
          </p>
        </div>
      </div>
      <Footer />
    </section>
  );
}
