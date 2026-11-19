import { CTASection } from '../components/CTASection';
import { FacilityCard } from '../components/FacilityCard';
import { SectionHeading } from '../components/SectionHeading';
import { FACILITIES } from '../data/labData';

const INFRASTRUCTURE_SPECS = [
  {
    label: 'Laboratory Architecture',
    value: 'Segregated pre-analytical, analytical, and sterile biosafety zones',
  },
  {
    label: 'Sample Identification',
    value: '100% chairside barcoding integrated with bidirectional analyzer interfacing',
  },
  {
    label: 'Cold-Chain Control',
    value: 'Continuous 2–8°C reagent storage and validated home-collection transport carriers',
  },
  {
    label: 'Infection Prevention',
    value: 'HEPA-filtered microbiology cabinets and single-use sealed phlebotomy consumables',
  },
];

export function FacilitiesPage() {
  return (
    <div>
      {/* Header */}
      <section className="border-b border-slate-200 bg-slate-50/70 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-xs font-semibold tracking-wide text-teal-700">
            Clinical Infrastructure &amp; Departments
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Laboratory Facilities &amp; Diagnostic Equipment
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-600">
            Explore our automated biochemistry floor, private blood collection bays,
            microbiology cleanroom, clinical pathology workstations, and sunlit patient
            waiting lounge.
          </p>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {FACILITIES.map((facility) => (
              <FacilityCard key={facility.id} facility={facility} />
            ))}
          </div>

          {/* Infrastructure Summary Strip */}
          <div className="mt-16 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-10">
            <SectionHeading
              eyebrow="Operational Standards"
              title="Built for Analytical Repeatability and Patient Comfort"
              description="Every section of our laboratory follows documented standard operating procedures across specimen intake, calibration, and patient reception."
            />
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {INFRASTRUCTURE_SPECS.map((spec) => (
                <div
                  key={spec.label}
                  className="rounded-xl border border-slate-200 bg-white p-5"
                >
                  <p className="text-xs font-semibold text-teal-700">{spec.label}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Prefer Visiting Our Central Diagnostic Lounge?"
        description="Walk in for fasting morning panels or schedule a priority slot online to minimize waiting time."
        primaryLabel="Book Walk-In Slot"
        primaryTo="/book?mode=lab"
        secondaryLabel="View Photo Gallery"
        secondaryTo="/gallery"
      />
    </div>
  );
}
