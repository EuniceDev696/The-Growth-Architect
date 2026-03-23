import Footer from "../../components/layout/Footer";

export default function CookiePolicy() {
  return (
    <section className="bg-white text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 sm:py-20 space-y-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-indigo-900">Cookie Policy</h1>
        <p className="text-slate-600">Effective date: February 18, 2026</p>

        <div className="space-y-5 text-slate-700 leading-relaxed">
          <p>
            This website uses cookies and similar technologies to improve your experience,
            analyze traffic, and support website functionality.
          </p>
          <p>
            We use essential cookies for core features such as login/session handling and
            preference storage. We may also use analytics cookies to understand how visitors use our pages.
          </p>
          <p>
            You can manage cookies in your browser settings. Disabling cookies may affect certain website features.
          </p>
          <p>
            For privacy questions, contact
            <a className="text-teal-600 hover:underline ml-1" href="mailto:support@thegrowtharchitect.com">support@thegrowtharchitect.com</a>.
          </p>
        </div>
      </div>
      <Footer />
    </section>
  );
}
