import { useEffect, useMemo, useState } from 'react';
import { Info, Search, SlidersHorizontal } from 'lucide-react';
import { CTASection } from '../components/CTASection';
import { TestCard } from '../components/TestCard';
import { useRouter } from '../context/RouterContext';
import { MEDICAL_TESTS } from '../data/labData';
import { MedicalTest } from '../types';

const TEST_CATEGORIES: Array<'All' | MedicalTest['category']> = [
  'All',
  'Hematology',
  'Diabetes',
  'Thyroid',
  'Liver & Kidney',
  'Heart & Lipid',
  'Vitamins & Iron',
  'Hormones & Allergy',
  'Infection & Routine',
];

type SortOption = 'popular' | 'price-asc' | 'price-desc' | 'tat-asc' | 'name-asc';

export function MedicalTestsPage() {
  const { query } = useRouter();
  const [search, setSearch] = useState(query.q || '');
  const [category, setCategory] = useState<'All' | MedicalTest['category']>('All');
  const [fastingFilter, setFastingFilter] = useState<'all' | 'fasting' | 'non-fasting'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('popular');

  useEffect(() => {
    if (query.q !== undefined) {
      setSearch(query.q);
    }
  }, [query.q]);

  const filteredTests = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = MEDICAL_TESTS.filter((test) => {
      const matchesCategory = category === 'All' || test.category === category;
      const matchesFasting =
        fastingFilter === 'all' ||
        (fastingFilter === 'fasting' && test.fastingRequired) ||
        (fastingFilter === 'non-fasting' && !test.fastingRequired);
      const matchesQuery =
        !q ||
        test.name.toLowerCase().includes(q) ||
        test.category.toLowerCase().includes(q) ||
        test.description.toLowerCase().includes(q) ||
        test.parametersIncluded.some((p) => p.toLowerCase().includes(q));
      return matchesCategory && matchesFasting && matchesQuery;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'tat-asc') return a.turnaroundHours - b.turnaroundHours;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      return Number(Boolean(b.popular)) - Number(Boolean(a.popular));
    });
  }, [search, category, fastingFilter, sortBy]);

  return (
    <div>
      {/* Header Banner */}
      <section className="border-b border-slate-200 bg-slate-50/70 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-xs font-semibold tracking-wide text-teal-700">
            Diagnostic Test Directory · 15 Core Clinical Categories
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Medical Tests &amp; Pathology Profiles
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-600">
            Browse routine blood counts, diabetes screening, thyroid hormones, organ function
            profiles, vitamins, and specialized cardiac panels with demo INR pricing.
          </p>
        </div>
      </section>

      {/* Filter & Search Toolbar */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="grid gap-4 lg:grid-cols-12">
              <div className="relative lg:col-span-5">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search test name, parameter (e.g. Ferritin, TSH, HbA1c)..."
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-900 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 lg:col-span-7 lg:justify-end">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-slate-400" />
                  <label htmlFor="fasting-select" className="text-xs font-medium text-slate-600">
                    Preparation:
                  </label>
                  <select
                    id="fasting-select"
                    value={fastingFilter}
                    onChange={(e) =>
                      setFastingFilter(e.target.value as 'all' | 'fasting' | 'non-fasting')
                    }
                    className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs font-medium text-slate-800 focus:border-brand-blue focus:outline-none"
                  >
                    <option value="all">All Tests</option>
                    <option value="fasting">Fasting Required</option>
                    <option value="non-fasting">No Fasting Required</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label htmlFor="sort-select" className="text-xs font-medium text-slate-600">
                    Sort by:
                  </label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs font-medium text-slate-800 focus:border-brand-blue focus:outline-none"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="tat-asc">Fastest Report Time</option>
                    <option value="name-asc">Alphabetical (A–Z)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
              {TEST_CATEGORIES.map((cat) => {
                const active = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`min-h-[38px] whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                      active
                        ? 'bg-brand-navy text-white'
                        : 'border border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Count & Medical Preparation Disclaimer */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              Showing{' '}
              <strong className="font-mono font-semibold text-slate-900 tabular-nums">
                {filteredTests.length}
              </strong>{' '}
              of {MEDICAL_TESTS.length} medical tests
            </p>
            {(search || category !== 'All' || fastingFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setCategory('All');
                  setFastingFilter('all');
                }}
                className="self-start text-xs font-semibold text-brand-navy hover:text-teal-700 sm:self-auto"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Test Cards Grid */}
          {filteredTests.length === 0 ? (
            <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-10 text-center">
              <p className="text-base font-semibold text-slate-900">
                No medical tests matched your current filters.
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Try broadening your search terms or switching back to All Categories.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTests.map((test) => (
                <TestCard key={test.id} test={test} />
              ))}
            </div>
          )}

          {/* Mandatory Clinical Preparation Disclaimer */}
          <div className="mt-10 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-5 text-xs leading-relaxed text-slate-600">
            <Info className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brand-navy" />
            <p>
              <strong className="font-semibold text-slate-900">
                Preparation &amp; Pricing Disclaimer:
              </strong>{' '}
              Sample descriptions, fasting notes, turnaround estimates, and INR prices shown
              on this website are for frontend demonstration purposes. Actual test
              preparation instructions depend on the specific assay, clinical indication,
              and laboratory guidelines—always follow the instructions provided by your
              physician or diagnostic center.
            </p>
          </div>
        </div>
      </section>

      <CTASection
        title="Need Multiple Tests Together?"
        description="Save up to 30% on demo package tariffs by choosing a curated full-body or organ-specific health checkup package."
        primaryLabel="Explore Health Packages"
        primaryTo="/packages"
        secondaryLabel="Book Individual Tests"
        secondaryTo="/book"
      />
    </div>
  );
}
