import React from "react";
import { Link } from "react-router-dom";
import { ACTIVE_LOGO } from "../../branding/logoSet";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 bg-slate-50 text-slate-700 font-body border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-slate-200">
          <div>
            <img src={ACTIVE_LOGO} alt="The Growth Architect Logo" className="h-14 w-auto mb-4" />
            <p className="text-sm text-slate-600 leading-relaxed">
              Strategic consulting and transformational coaching for ambitious leaders ready to scale.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl text-slate-900 mb-4">Services</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/services" className="hover:text-teal-600 transition-colors">Business Strategy</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-teal-600 transition-colors">Executive Coaching</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-teal-600 transition-colors">Startup Consulting</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-teal-600 transition-colors">Strategic Planning</Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-heading text-xl text-slate-900 mb-4">Company</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-teal-600 transition-colors">About</Link>
              </li>
              <li>
                <Link to="/casestudies" className="hover:text-teal-600 transition-colors">Results & Case Studies</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-teal-600 transition-colors">Insights & Resources</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-teal-600 transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-heading text-xl text-slate-900 mb-4">Contact</h2>
            <div className="space-y-1 text-sm text-slate-600">
              <p>hello@thegrowtharchitect.com</p>
              <p>+234-123-456-7890</p>
              <p>Victoria Island, Lagos</p>
              <p>Nigeria</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8 text-xs sm:text-sm text-slate-500 text-center md:text-left">
          <p>&copy; {year} The Growth Architect. All rights reserved.</p>
          <div className="flex flex-wrap justify-center md:justify-end gap-5">
            <Link to="/privacy-policy" className="hover:text-teal-600 transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-teal-600 transition-colors">Terms of Service</Link>
            <Link to="/cookie-policy" className="hover:text-teal-600 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
