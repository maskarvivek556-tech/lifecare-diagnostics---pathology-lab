import { Mail, MapPin, Phone, Clock } from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { LAB_INFO } from '../data/labData';

export function Footer() {
  const { navigate } = useRouter();

  const quickLinks = [
    { label: 'Home', to: '/' },
    { label: 'About Us', to: '/about' },
    { label: 'Medical Tests', to: '/tests' },
    { label: 'Health Packages', to: '/packages' },
    { label: 'Book a Test', to: '/book' },
  ];

  const patientLinks = [
    { label: 'Home Sample Collection', to: '/home-collection' },
    { label: 'Patient Reports Portal', to: '/reports' },
    { label: 'Demo Report Generator', to: '/report-generator' },
    { label: '3D Interactive Pathology Lab', to: '/lab-3d' },
    { label: 'Laboratory Facilities', to: '/facilities' },
    { label: 'Photo Gallery', to: '/gallery' },
    { label: 'Contact Us', to: '/contact' },
  ];

  return (
    <footer className="no-print border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 text-left"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4.5 w-4.5"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 3v18" />
                  <path d="M3 12h18" />
                </svg>
              </span>
              <span className="font-display text-lg font-bold tracking-tight text-white">
                LifeCare Diagnostics
              </span>
            </button>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              {LAB_INFO.tagline} Comprehensive pathology testing, preventive health checkups,
              and doorstep sample collection backed by automated clinical workflows.
            </p>
            <p className="mt-4 text-xs text-slate-400">
              {LAB_INFO.accreditationDemo}
            </p>
          </div>

          {/* Diagnostics Links */}
          <div>
            <h3 className="text-sm font-semibold text-white">Diagnostic Services</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {quickLinks.map((item) => (
                <li key={item.to}>
                  <button
                    type="button"
                    onClick={() => navigate(item.to)}
                    className="text-slate-400 transition-colors hover:text-white"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Patient & Center Links */}
          <div>
            <h3 className="text-sm font-semibold text-white">Patient Resources</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {patientLinks.map((item) => (
                <li key={item.to}>
                  <button
                    type="button"
                    onClick={() => navigate(item.to)}
                    className="text-slate-400 transition-colors hover:text-white"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-semibold text-white">Central Laboratory Desk</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" />
                <span>
                  {LAB_INFO.addressLine1}, {LAB_INFO.addressLine2}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-teal-400" />
                <span>{LAB_INFO.phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-teal-400" />
                <span>{LAB_INFO.email}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" />
                <span>{LAB_INFO.workingHours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="mt-12 border-t border-slate-800 pt-8 text-xs leading-relaxed text-slate-400">
          <p>
            <strong className="font-semibold text-slate-200">
              Demonstration Notice:
            </strong>{' '}
            This website is a frontend UI demonstration for {LAB_INFO.name}. All test prices,
            patient records, reference ranges, booking confirmations, and PDF reports are
            fictional demo data stored locally in your browser and are not valid for clinical
            diagnosis or real medical use.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {LAB_INFO.name}. All rights reserved.
            </p>
            <p>Fictional healthcare web platform demonstration.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
