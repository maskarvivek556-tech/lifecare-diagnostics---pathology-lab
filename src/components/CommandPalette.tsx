import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Box,
  Calendar,
  FileText,
  FlaskConical,
  Home,
  Keyboard,
  Package,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { HEALTH_PACKAGES, MEDICAL_TESTS } from '../data/labData';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ShortcutItem {
  id: string;
  label: string;
  subtitle: string;
  to: string;
  shortcut?: string;
  group: 'Quick Navigation' | 'Medical Tests' | 'Health Packages';
}

const PAGE_SHORTCUTS: ShortcutItem[] = [
  {
    id: 'nav-home',
    label: 'Home Page',
    subtitle: 'Overview, popular tests & preventive packages',
    to: '/',
    shortcut: 'Alt + 1',
    group: 'Quick Navigation',
  },
  {
    id: 'nav-tests',
    label: 'Medical Tests Catalog',
    subtitle: 'Browse all 15 diagnostic categories & prices',
    to: '/tests',
    shortcut: 'Alt + 2',
    group: 'Quick Navigation',
  },
  {
    id: 'nav-packages',
    label: 'Health Checkup Packages',
    subtitle: 'Compare 8 full-body & organ wellness packages',
    to: '/packages',
    shortcut: 'Alt + 3',
    group: 'Quick Navigation',
  },
  {
    id: 'nav-book',
    label: 'Book a Test Online',
    subtitle: 'Schedule doorstep home collection or lab visit',
    to: '/book',
    shortcut: 'Alt + 4',
    group: 'Quick Navigation',
  },
  {
    id: 'nav-reports',
    label: 'Patient Reports Portal',
    subtitle: 'Search demo reports by Patient ID or mobile',
    to: '/reports',
    shortcut: 'Alt + 5',
    group: 'Quick Navigation',
  },
  {
    id: 'nav-generator',
    label: 'Demo Report Generator & PDF',
    subtitle: 'Preview, print & export watermarked PDF reports',
    to: '/report-generator',
    shortcut: 'Alt + 6',
    group: 'Quick Navigation',
  },
  {
    id: 'nav-3d',
    label: '3D Interactive Pathology Lab',
    subtitle: 'Orbit 3D microscope, centrifuge & DNA biomarker stage',
    to: '/lab-3d',
    shortcut: 'Alt + 7',
    group: 'Quick Navigation',
  },
  {
    id: 'nav-home-col',
    label: 'Home Sample Collection',
    subtitle: '6:00 AM – 8:00 PM cold-chain doorstep phlebotomy',
    to: '/home-collection',
    group: 'Quick Navigation',
  },
  {
    id: 'nav-facilities',
    label: 'Laboratory Facilities',
    subtitle: 'Explore automated analyzers, bays & cleanrooms',
    to: '/facilities',
    group: 'Quick Navigation',
  },
  {
    id: 'nav-gallery',
    label: 'Photo Gallery',
    subtitle: 'Filterable department photography & lightbox',
    to: '/gallery',
    group: 'Quick Navigation',
  },
  {
    id: 'nav-about',
    label: 'About LifeCare Diagnostics',
    subtitle: 'Mission, QA standards & MD pathologist team',
    to: '/about',
    group: 'Quick Navigation',
  },
  {
    id: 'nav-contact',
    label: 'Contact Us',
    subtitle: 'Address, working hours & enquiry form',
    to: '/contact',
    group: 'Quick Navigation',
  },
];

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const { navigate } = useRouter();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Keyboard Shortcuts Handler
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.tagName === 'SELECT';

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenChange(!open);
        return;
      }

      if (!isTyping && e.key === '/') {
        e.preventDefault();
        onOpenChange(true);
        return;
      }

      if (e.key === 'Escape' && open) {
        onOpenChange(false);
        return;
      }

      if (e.altKey && !isTyping) {
        const map: Record<string, string> = {
          '1': '/',
          '2': '/tests',
          '3': '/packages',
          '4': '/book',
          '5': '/reports',
          '6': '/report-generator',
          '7': '/lab-3d',
        };
        if (map[e.key]) {
          e.preventDefault();
          onOpenChange(false);
          navigate(map[e.key]);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onOpenChange, navigate]);

  useEffect(() => {
    if (open) {
      setQuery('');
      window.setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    const navMatches = PAGE_SHORTCUTS.filter(
      (item) =>
        !q ||
        item.label.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q)
    ).slice(0, q ? 5 : 7);

    const testMatches: ShortcutItem[] = MEDICAL_TESTS.filter(
      (t) =>
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    )
      .slice(0, q ? 5 : 4)
      .map((t) => ({
        id: `test-${t.id}`,
        label: t.name,
        subtitle: `${t.category} · ${t.sampleType} · ₹${t.price}`,
        to: `/tests/${t.slug}`,
        group: 'Medical Tests',
      }));

    const pkgMatches: ShortcutItem[] = HEALTH_PACKAGES.filter(
      (p) =>
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.shortSummary.toLowerCase().includes(q)
    )
      .slice(0, q ? 4 : 3)
      .map((p) => ({
        id: `pkg-${p.id}`,
        label: p.name,
        subtitle: `${p.testCount} tests · ₹${p.price.toLocaleString('en-IN')}`,
        to: `/book?package=${p.id}`,
        group: 'Health Packages',
      }));

    return [...navMatches, ...testMatches, ...pkgMatches];
  }, [query]);

  const handleSelect = (to: string) => {
    onOpenChange(false);
    navigate(to);
  };

  if (!open) return null;

  const grouped = (['Quick Navigation', 'Medical Tests', 'Health Packages'] as const).map(
    (groupName) => ({
      groupName,
      items: results.filter((r) => r.group === groupName),
    })
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Quick navigation and keyboard shortcuts"
      onClick={() => onOpenChange(false)}
      className="no-print fixed inset-0 z-50 flex items-start justify-center bg-slate-950/65 px-4 pt-16 sm:pt-24"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        {/* Search Input Header */}
        <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3.5">
          <Search className="h-5 w-5 shrink-0 text-teal-600" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to any page, medical test, package, or 3D Lab..."
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close shortcuts menu"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3">
          {results.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-500">
              No pages, tests, or packages matched &ldquo;{query}&rdquo;.
            </p>
          ) : (
            <div className="space-y-4">
              {grouped.map(
                ({ groupName, items }) =>
                  items.length > 0 && (
                    <div key={groupName}>
                      <p className="px-3 pb-1.5 text-xs font-semibold text-slate-500">
                        {groupName}
                      </p>
                      <ul className="space-y-1">
                        {items.map((item) => (
                          <li key={item.id}>
                            <button
                              type="button"
                              onClick={() => handleSelect(item.to)}
                              className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-sky-50/80"
                            >
                              <div className="flex min-w-0 items-center gap-3">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-brand-navy">
                                  {item.to === '/lab-3d' ? (
                                    <Box className="h-4 w-4 text-teal-700" />
                                  ) : item.to === '/book' ? (
                                    <Calendar className="h-4 w-4 text-sky-700" />
                                  ) : item.to === '/reports' ||
                                    item.to === '/report-generator' ? (
                                    <FileText className="h-4 w-4 text-indigo-700" />
                                  ) : item.group === 'Health Packages' ? (
                                    <Package className="h-4 w-4 text-emerald-700" />
                                  ) : item.group === 'Medical Tests' ? (
                                    <FlaskConical className="h-4 w-4 text-sky-700" />
                                  ) : (
                                    <Home className="h-4 w-4 text-slate-600" />
                                  )}
                                </span>
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-semibold text-slate-900">
                                    {item.label}
                                  </p>
                                  <p className="truncate text-xs text-slate-500">
                                    {item.subtitle}
                                  </p>
                                </div>
                              </div>

                              <div className="flex shrink-0 items-center gap-2">
                                {item.shortcut && (
                                  <kbd className="hidden rounded border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[11px] font-medium text-slate-600 sm:inline-block">
                                    {item.shortcut}
                                  </kbd>
                                )}
                                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
              )}
            </div>
          )}
        </div>

        {/* Footer Shortcut Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-4 py-2.5 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <Keyboard className="h-3.5 w-3.5 text-teal-700" />
            <span>
              Shortcuts: <strong className="font-mono text-slate-700">Ctrl+K</strong> or{' '}
              <strong className="font-mono text-slate-700">/</strong> to search ·{' '}
              <strong className="font-mono text-slate-700">Alt+1–7</strong> jump to pages
            </span>
          </div>
          <span className="inline-flex items-center gap-1 font-medium text-brand-navy">
            <Sparkles className="h-3 w-3 text-teal-600" />
            Alt+7 for 3D Lab
          </span>
        </div>
      </div>
    </div>
  );
}
