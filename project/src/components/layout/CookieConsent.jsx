import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const KEY = "cookie_consent_choice";

export default function CookieConsent() {
  const [visible, setVisible] = useState(() => !sessionStorage.getItem(KEY));

  useEffect(() => {
    setVisible(!sessionStorage.getItem(KEY));
  }, []);

  if (!visible) return null;

  const setChoice = (choice) => {
    sessionStorage.setItem(KEY, choice);
    setVisible(false);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <div className="max-w-4xl mx-auto rounded-2xl bg-white border border-slate-200 shadow-lg p-4 sm:p-5">
        <p className="text-sm text-slate-700">
          We use cookies to improve your experience and analyze traffic. By continuing, you agree to our{" "}
          <Link to="/cookie-policy" className="text-teal-600 hover:underline">
            Cookie Policy
          </Link>.
        </p>
        <div className="mt-3 flex gap-3">
          <button
            onClick={() => setChoice("accepted")}
            className="px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700"
          >
            Accept
          </button>
          <button
            onClick={() => setChoice("declined")}
            className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
