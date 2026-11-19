import {
  Box,
  Calendar,
  FileDown,
  FlaskConical,
  Home,
  Package,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from '../context/RouterContext';

const SHORTCUT_TILES = [
  {
    title: 'Book a Test',
    subtitle: 'Instant slot · Alt+4',
    to: '/book',
    icon: Calendar,
    surface: 'bg-sky-50 text-sky-800 border-sky-200/80 hover:border-sky-400',
    iconBg: 'bg-sky-600 text-white',
  },
  {
    title: '15 Medical Tests',
    subtitle: 'Prices & prep · Alt+2',
    to: '/tests',
    icon: FlaskConical,
    surface: 'bg-teal-50 text-teal-900 border-teal-200/80 hover:border-teal-400',
    iconBg: 'bg-teal-600 text-white',
  },
  {
    title: 'Health Packages',
    subtitle: 'Save up to 31% · Alt+3',
    to: '/packages',
    icon: Package,
    surface: 'bg-emerald-50 text-emerald-900 border-emerald-200/80 hover:border-emerald-400',
    iconBg: 'bg-emerald-600 text-white',
  },
  {
    title: 'Home Collection',
    subtitle: '6 AM – 8 PM daily',
    to: '/home-collection',
    icon: Home,
    surface: 'bg-amber-50 text-amber-950 border-amber-200/80 hover:border-amber-400',
    iconBg: 'bg-amber-600 text-white',
  },
  {
    title: 'Download Report',
    subtitle: 'PDF & Search · Alt+5',
    to: '/reports',
    icon: FileDown,
    surface: 'bg-indigo-50 text-indigo-950 border-indigo-200/80 hover:border-indigo-400',
    iconBg: 'bg-indigo-600 text-white',
  },
  {
    title: '3D Pathology Lab',
    subtitle: 'Interactive tour · Alt+7',
    to: '/lab-3d',
    icon: Box,
    surface: 'bg-brand-navy text-white border-sky-900 hover:bg-sky-900',
    iconBg: 'bg-teal-500 text-white',
  },
];

export function QuickShortcutsBar() {
  const { navigate } = useRouter();

  return (
    <section
      aria-label="Quick patient shortcuts"
      className="border-b border-slate-200 bg-white py-6"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {SHORTCUT_TILES.map((item, idx) => {
            const Icon = item.icon;
            const isDark = item.to === '/lab-3d';
            return (
              <motion.button
                key={item.to}
                type="button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.04 }}
                onClick={() => navigate(item.to)}
                className={`group flex min-h-[68px] items-center gap-3 rounded-xl border p-3.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${item.surface}`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105 ${item.iconBg}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{item.title}</p>
                  <p
                    className={`truncate text-[11px] font-medium ${
                      isDark ? 'text-sky-200' : 'opacity-75'
                    }`}
                  >
                    {item.subtitle}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
