import { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  Menu,
  Phone,
  Search,
  X,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { LAB_INFO } from '../data/labData';

interface DropdownGroup {
  label: string;
  items: { label: string; to: string; description: string }[];
}

const NAV_DROPDOWNS: DropdownGroup[] = [
  {
    label: 'Diagnostics',
    items: [
      {
        label: 'Medical Tests',
        to: '/tests',
        description: 'Browse 15 clinical test categories with preparation details',
      },
      {
        label: 'Health Packages',
        to: '/packages',
        description: 'Preventive body checkups and organ wellness panels',
      },
      {
        label: 'Home Collection',
        to: '/home-collection',
        description: 'Doorstep sample collection daily from 6:00 AM – 8:00 PM',
      },
    ],
  },
  {
    label: 'Reports',
    items: [
      {
        label: 'Patient Reports',
        to: '/reports',
        description: 'Look up fictional demo patient reports by ID or mobile',
      },
      {
        label: 'Report Generator',
        to: '/report-generator',
        description: 'Preview, print, and download watermarked demo PDF reports',
      },
    ],
  },
  {
    label: 'Laboratory',
    items: [
      {
        label: '3D Interactive Lab',
        to: '/lab-3d',
        description: 'Orbit 3D microscope, centrifuge rotor & DNA biomarker stage',
      },
      {
        label: 'About Us',
        to: '/about',
        description: 'Our mission, quality assurance workflow, and MD pathologists',
      },
      {
        label: 'Facilities',
        to: '/facilities',
        description: 'Automated analyzers, phlebotomy bays, and microbiology rooms',
      },
      {
        label: 'Gallery',
        to: '/gallery',
        description: 'Visual tour of our departments, equipment, and clinical team',
      },
    ],
  },
];

const MOBILE_ALL_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Medical Tests', to: '/tests' },
  { label: 'Health Packages', to: '/packages' },
  { label: 'Home Collection', to: '/home-collection' },
  { label: 'Patient Reports', to: '/reports' },
  { label: 'Report Generator', to: '/report-generator' },
  { label: '3D Interactive Lab', to: '/lab-3d' },
  { label: 'About Us', to: '/about' },
  { label: 'Facilities', to: '/facilities' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Contact Us', to: '/contact' },
];

interface NavbarProps {
  onOpenCommandPalette: () => void;
}

export function Navbar({ onOpenCommandPalette }: NavbarProps) {
  const { path, navigate } = useRouter();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  const handleLinkClick = (to: string) => {
    setOpenDropdown(null);
    setMobileOpen(false);
    navigate(to);
  };

  const isGroupActive = (group: DropdownGroup) =>
    group.items.some((item) => path === item.to || path.startsWith(`${item.to}/`));

  return (
    <div ref={navRef} className="no-print sticky top-0 z-40 w-full bg-white">
      {/* Top Announcement Bar — desktop & tablet only */}
      <div className="hidden border-b border-sky-900/20 bg-gradient-to-r from-[#072644] via-[#0c3b66] to-[#0d626e] text-white md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-xs">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-sky-100">
              <Clock className="h-3.5 w-3.5 text-teal-300" />
              Home Sample Collection: {LAB_INFO.homeCollectionHours}
            </span>
            <span aria-hidden="true" className="text-sky-300/40">
              |
            </span>
            <span className="text-sky-100">
              Press <strong className="font-mono text-teal-200">Ctrl+K</strong> for instant shortcuts &amp; 3D Lab tour
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${LAB_INFO.phone.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-1.5 font-medium text-white transition-colors hover:text-teal-300"
            >
              <Phone className="h-3.5 w-3.5 text-teal-300" />
              {LAB_INFO.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main 3-Zone Navigation Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => handleLinkClick('/')}
            className="flex shrink-0 items-center gap-2.5 whitespace-nowrap text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-navy to-teal-600 text-white shadow-xs">
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
                <circle cx="12" cy="12" r="9" strokeOpacity="0.35" />
              </svg>
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
              LifeCare Diagnostics
            </span>
          </button>

          {/* Zone 2: Concise Single-Line Nav Links with Dropdowns */}
          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-6 lg:flex"
          >
            <button
              type="button"
              onClick={() => handleLinkClick('/')}
              className={`whitespace-nowrap shrink-0 py-1 text-sm font-medium transition-colors ${
                path === '/'
                  ? 'text-brand-navy underline decoration-teal-600 decoration-2 underline-offset-8'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Home
            </button>

            {NAV_DROPDOWNS.map((group) => {
              const active = isGroupActive(group);
              const isOpen = openDropdown === group.label;
              return (
                <div key={group.label} className="relative">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() =>
                      setOpenDropdown(isOpen ? null : group.label)
                    }
                    className={`inline-flex items-center gap-1 whitespace-nowrap shrink-0 py-1 text-sm font-medium transition-colors ${
                      active || isOpen
                        ? 'text-brand-navy underline decoration-teal-600 decoration-2 underline-offset-8'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {group.label}
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 transition-transform duration-150 ${
                        isOpen ? 'rotate-180 text-brand-navy' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="absolute left-0 top-full mt-3 w-76 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                      {group.items.map((item) => {
                        const itemActive =
                          path === item.to || path.startsWith(`${item.to}/`);
                        return (
                          <button
                            key={item.to}
                            type="button"
                            onClick={() => handleLinkClick(item.to)}
                            className={`flex w-full flex-col rounded-lg px-3 py-2.5 text-left transition-colors ${
                              itemActive
                                ? 'bg-sky-50 text-brand-navy'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <span className="text-sm font-semibold text-slate-900">
                              {item.label}
                            </span>
                            <span className="mt-0.5 text-xs leading-snug text-slate-500">
                              {item.description}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            <button
              type="button"
              onClick={() => handleLinkClick('/contact')}
              className={`whitespace-nowrap shrink-0 py-1 text-sm font-medium transition-colors ${
                path === '/contact'
                  ? 'text-brand-navy underline decoration-teal-600 decoration-2 underline-offset-8'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Zone 3: Quick Shortcuts Search Trigger + Primary Book a Test CTA */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenCommandPalette}
              aria-label="Open quick search and keyboard shortcuts"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-600 transition-colors hover:border-sky-300 hover:bg-sky-50/60 hover:text-slate-900"
            >
              <Search className="h-4 w-4 text-teal-700" />
              <span className="hidden sm:inline whitespace-nowrap">Quick Jump</span>
              <kbd className="hidden rounded border border-slate-300 bg-white px-1.5 py-0.5 font-mono text-[10px] text-slate-500 md:inline">
                Ctrl K
              </kbd>
            </button>

            <button
              type="button"
              onClick={() => handleLinkClick('/book')}
              className="hidden whitespace-nowrap shrink-0 rounded-lg bg-gradient-to-r from-brand-navy to-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-opacity hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue sm:inline-flex items-center gap-1.5"
            >
              Book a Test
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 lg:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Navigation */}
        {mobileOpen && (
          <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-slate-200 bg-white px-4 pb-6 pt-3 lg:hidden">
            <nav
              aria-label="Mobile navigation"
              className="flex flex-col divide-y divide-slate-100"
            >
              {MOBILE_ALL_LINKS.map((link) => {
                const active =
                  link.to === '/'
                    ? path === '/'
                    : path === link.to || path.startsWith(`${link.to}/`);
                return (
                  <button
                    key={link.to}
                    type="button"
                    onClick={() => handleLinkClick(link.to)}
                    className={`flex min-h-[44px] w-full items-center justify-between py-2.5 text-left text-base font-medium ${
                      active ? 'text-brand-navy font-semibold' : 'text-slate-700'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </button>
                );
              })}
            </nav>

            <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={() => handleLinkClick('/book')}
                className="flex min-h-[44px] w-full items-center justify-center rounded-lg bg-brand-navy px-4 py-3 text-sm font-semibold text-white"
              >
                Book a Test Online
              </button>
              <p className="text-center text-xs text-slate-500">
                Home Collection: {LAB_INFO.homeCollectionHours} · {LAB_INFO.phone}
              </p>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
