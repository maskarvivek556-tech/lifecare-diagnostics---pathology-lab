import { useState } from 'react';
import { ArrowRight, Box, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from '../context/RouterContext';
import { LAB_IMAGES, MEDICAL_TESTS } from '../data/labData';
import { SafeImage } from './SafeImage';

export function HeroSection() {
  const { navigate } = useRouter();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const suggestions = query.trim()
    ? MEDICAL_TESTS.filter(
        (t) =>
          t.name.toLowerCase().includes(query.trim().toLowerCase()) ||
          t.category.toLowerCase().includes(query.trim().toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/tests?q=${encodeURIComponent(q)}` : '/tests');
  };

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-[#072644] via-[#0c3b66] to-[#0b5868] text-white">
      {/* Subtle architectural radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-teal-400/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-1/4 h-80 w-80 rounded-full bg-sky-400/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        {/* Balanced 2-Column Hero Split */}
        <div className="grid items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center lg:col-span-6"
          >
            <p className="text-sm font-semibold text-teal-300">
              LifeCare Diagnostics &amp; Pathology Lab · ISO 15189 Aligned Workflow
            </p>
            <h1 className="mt-3 text-[clamp(2.25rem,4vw,3.5rem)] font-extrabold leading-[1.08] tracking-tight text-white">
              Your Health Deserves Accurate Diagnostics.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-sky-100 sm:text-lg">
              Trusted pathology testing, preventive full-body health checkups, and hygienic
              doorstep sample collection—supervised by senior MD Pathologists with clear,
              same-day digital reporting.
            </p>

            {/* Primary Search Medical Tests Bar */}
            <form onSubmit={handleSubmit} className="relative mt-7 max-w-xl">
              <label htmlFor="hero-test-search" className="sr-only">
                Search medical tests
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="hero-test-search"
                    type="text"
                    value={query}
                    onFocus={() => setFocused(true)}
                    onBlur={() => window.setTimeout(() => setFocused(false), 180)}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search CBC, Thyroid, Lipid Profile, HbA1c..."
                    className="h-12 w-full rounded-lg border border-white/20 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-300/40"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-teal-500 px-5 text-sm font-semibold text-slate-950 transition-colors hover:bg-teal-400"
                >
                  Search Tests
                </button>
              </div>

              {focused && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-20 mt-1.5 overflow-hidden rounded-lg border border-slate-200 bg-white text-slate-900 shadow-xl">
                  {suggestions.map((test) => (
                    <button
                      key={test.id}
                      type="button"
                      onMouseDown={() => navigate(`/tests/${test.slug}`)}
                      className="flex w-full items-center justify-between border-b border-slate-100 px-4 py-2.5 text-left last:border-b-0 hover:bg-sky-50"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-900">{test.name}</p>
                        <p className="text-xs text-slate-500">
                          {test.sampleType} · Report in {test.turnaroundTime}
                        </p>
                      </div>
                      <span className="font-mono text-xs font-semibold text-brand-navy tabular-nums">
                        ₹{test.price}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </form>

            {/* Clear Primary CTA + Interactive 3D Lab Tour */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => navigate('/book')}
                className="inline-flex min-h-[46px] items-center gap-2 whitespace-nowrap rounded-lg bg-white px-6 py-3 text-sm font-bold text-brand-navy shadow-sm transition-colors hover:bg-sky-50"
              >
                Book Home Collection
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/lab-3d')}
                className="inline-flex min-h-[46px] items-center gap-2 whitespace-nowrap rounded-lg border border-teal-300/50 bg-teal-500/15 px-5 py-3 text-sm font-semibold text-teal-100 transition-colors hover:bg-teal-500/25"
              >
                <Box className="h-4 w-4 text-teal-300" />
                Explore 3D Pathology Lab
              </button>
            </div>
          </motion.div>

          {/* Right Column: Full-height Clinical Photography */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <div className="relative h-72 overflow-hidden rounded-2xl border border-white/15 bg-slate-900 shadow-2xl sm:h-96 lg:h-full lg:min-h-[420px]">
              <SafeImage
                src={LAB_IMAGES.heroLab}
                alt="LifeCare Diagnostics modern automated clinical pathology laboratory"
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-transparent p-5">
                <p className="text-xs font-semibold text-teal-300">
                  Central Automated Core Laboratory
                </p>
                <p className="mt-0.5 text-sm font-medium text-white">
                  Bidirectional chemistry analyzers · Daily multi-level quality control
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Full-Width Quantified Proof Strip Below the Hero Split */}
        <div className="mt-10 grid grid-cols-2 gap-6 border-t border-white/15 pt-8 sm:grid-cols-4">
          <div>
            <p className="font-mono text-2xl font-bold text-teal-300 tabular-nums sm:text-3xl">
              15+
            </p>
            <p className="mt-1 text-sm text-sky-100">
              Clinical Pathology &amp; Biochemistry Categories
            </p>
          </div>
          <div>
            <p className="font-mono text-2xl font-bold text-teal-300 tabular-nums sm:text-3xl">
              4–12 hrs
            </p>
            <p className="mt-1 text-sm text-sky-100">
              Typical Turnaround for Routine Panels
            </p>
          </div>
          <div>
            <p className="font-mono text-2xl font-bold text-teal-300 tabular-nums sm:text-3xl">
              6 AM – 8 PM
            </p>
            <p className="mt-1 text-sm text-sky-100">
              Daily Cold-Chain Home Sample Collection
            </p>
          </div>
          <div>
            <p className="font-mono text-2xl font-bold text-teal-300 tabular-nums sm:text-3xl">
              100%
            </p>
            <p className="mt-1 text-sm text-sky-100">
              Barcoded Vials &amp; MD Pathologist Review
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
