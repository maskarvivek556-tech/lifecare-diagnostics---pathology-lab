import { useState } from 'react';
import { Info } from 'lucide-react';
import { CTASection } from '../components/CTASection';
import { PackageCard } from '../components/PackageCard';
import { HEALTH_PACKAGES } from '../data/labData';
import { HealthPackage } from '../types';

const PACKAGE_CATEGORIES: Array<'All' | HealthPackage['category']> = [
  'All',
  'Preventive',
  'Organ Care',
  'Life Stage',
];

export function HealthPackagesPage() {
  const [selectedCategory, setSelectedCategory] =
    useState<'All' | HealthPackage['category']>('All');

  const filtered =
    selectedCategory === 'All'
      ? HEALTH_PACKAGES
      : HEALTH_PACKAGES.filter((p) => p.category === selectedCategory);

  return (
    <div>
      {/* Page Header */}
      <section className="border-b border-slate-200 bg-slate-50/70 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-xs font-semibold tracking-wide text-teal-700">
            Preventive Wellness &amp; Organ Screening · 8 Curated Packages
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Health Checkup Packages
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-600">
            Comprehensive preventive health checkups bundling blood counts, liver, kidney,
            lipid, thyroid, diabetes, and vitamin biomarkers at transparent demo pricing.
          </p>

          {/* Filter Tabs */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {PACKAGE_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`min-h-[40px] whitespace-nowrap rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-brand-navy text-white'
                      : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {cat === 'All' ? 'All Packages (8)' : cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>

          {/* Quick Package Comparison Table */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Quick Package Comparison
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Compare test counts, turnaround times, and demo INR pricing side by side.
            </p>
            <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700">
                    <th className="px-5 py-3.5">Package Name</th>
                    <th className="px-5 py-3.5">Category</th>
                    <th className="px-5 py-3.5 text-right">Tests</th>
                    <th className="px-5 py-3.5">Turnaround</th>
                    <th className="px-5 py-3.5 text-right">Demo Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {HEALTH_PACKAGES.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-3.5 font-semibold text-slate-900">
                        {pkg.name}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{pkg.category}</td>
                      <td className="px-5 py-3.5 text-right font-mono tabular-nums text-slate-800">
                        {pkg.testCount}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{pkg.turnaroundTime}</td>
                      <td className="px-5 py-3.5 text-right font-mono font-bold text-brand-navy tabular-nums">
                        ₹{pkg.price.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-5 text-xs leading-relaxed text-slate-600">
            <Info className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brand-navy" />
            <p>
              All health package prices and included parameter counts represent realistic
              frontend demonstration data. Most multi-organ preventive packages require 10–12
              hours of overnight fasting (plain water allowed).
            </p>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
