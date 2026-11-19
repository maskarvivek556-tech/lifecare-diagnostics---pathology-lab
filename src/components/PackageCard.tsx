import { useState } from 'react';
import { ArrowRight, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from '../context/RouterContext';
import { ACCENT_STYLES } from '../data/labData';
import { HealthPackage } from '../types';
import { SafeImage } from './SafeImage';

interface PackageCardProps {
  pkg: HealthPackage;
}

export function PackageCard({ pkg }: PackageCardProps) {
  const { navigate } = useRouter();
  const [expanded, setExpanded] = useState(false);

  const accent = ACCENT_STYLES[pkg.accent];
  const visibleTests = expanded ? pkg.includedTests : pkg.includedTests.slice(0, 4);
  const remainingCount = pkg.includedTests.length - 4;
  const savings = pkg.originalPrice - pkg.price;

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className={`group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs transition-all duration-200 hover:shadow-md ${accent.borderHover}`}
    >
      {/* Package Photography Banner with Measured Contrast Scrim */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <SafeImage
          src={pkg.image}
          alt={`${pkg.name} preventive diagnostic checkup`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/25 to-transparent" />
        <div className={`absolute inset-x-0 top-0 h-1 ${accent.topBar}`} />
        <div className="absolute inset-x-4 bottom-3 flex items-end justify-between gap-2 text-white">
          <div>
            <p className="text-[11px] font-semibold text-teal-200">
              {pkg.category} · {pkg.testCount} Tests
            </p>
            <h3 className="text-lg font-bold leading-snug tracking-tight text-white">
              {pkg.name}
            </h3>
          </div>
          <span className="shrink-0 font-mono text-xs font-semibold text-emerald-300 tabular-nums">
            Save ₹{savings.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <p className="text-sm leading-relaxed text-slate-600">
            {pkg.shortSummary}
          </p>

          {/* Price Row */}
          <div
            className={`mt-4 flex items-baseline justify-between gap-3 rounded-lg px-3.5 py-3 ${accent.softBg}`}
          >
            <div className="flex items-baseline gap-2.5">
              <span className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
                ₹{pkg.price.toLocaleString('en-IN')}
              </span>
              <span className="font-mono text-xs text-slate-400 line-through tabular-nums">
                ₹{pkg.originalPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <span className={`text-xs font-semibold ${accent.text}`}>
              {pkg.turnaroundTime}
            </span>
          </div>

          {/* Included Test List */}
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-900">
              Key Profiles Included
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
              {visibleTests.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            {remainingCount > 0 && (
              <button
                type="button"
                onClick={() => setExpanded((prev) => !prev)}
                className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-brand-navy hover:text-teal-700"
              >
                {expanded ? (
                  <>
                    Show fewer profiles <ChevronUp className="h-3.5 w-3.5" />
                  </>
                ) : (
                  <>
                    View +{remainingCount} more profiles{' '}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            )}
          </div>

          <div className="mt-4 border-t border-slate-100 pt-3.5 text-xs leading-relaxed text-slate-600">
            <p>
              <strong className="font-semibold text-slate-800">Preparation:</strong>{' '}
              {pkg.preparation}
            </p>
          </div>
        </div>

        <div className="mt-5 pt-2">
          <button
            type="button"
            onClick={() => navigate(`/book?package=${pkg.id}`)}
            className={`inline-flex min-h-[44px] w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors ${accent.button}`}
          >
            Book Now
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
