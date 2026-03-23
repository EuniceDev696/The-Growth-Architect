import { Link, Outlet, useLocation } from "react-router-dom";
import Navbar from "./Nav";
import RouteSeo from "./RouteSeo";
import CookieConsent from "./CookieConsent";

export default function AppLayout() {
  const { pathname } = useLocation();
  const showStickyCta = !["/booking", "/contact", "/bookingsuccess"].includes(pathname);

  return (
    <div className="min-h-screen flex flex-col">
      <RouteSeo />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {showStickyCta && (
        <div className="fixed bottom-4 right-4 z-40">
          <Link
            to="/booking"
            className="inline-flex items-center rounded-full bg-teal-600 text-white text-sm font-semibold px-5 py-3 shadow-lg hover:bg-teal-700 transition-colors"
          >
            Book a Session
          </Link>
        </div>
      )}
      <CookieConsent />
    </div>
  );
}
