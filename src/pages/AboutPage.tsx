import { Check } from 'lucide-react';
import { CTASection } from '../components/CTASection';
import { SafeImage } from '../components/SafeImage';
import { SectionHeading } from '../components/SectionHeading';
import { LAB_IMAGES, LAB_INFO, TEAM_MEMBERS } from '../data/labData';

const QA_STEPS = [
  {
    step: '01. Pre-Analytical Verification',
    detail:
      'Patient identity confirmation, barcoded vacutainer labeling at chairside, and temperature-logged transport from home or collection rooms.',
  },
  {
    step: '02. Automated Daily Calibration',
    detail:
      'Every clinical chemistry, hematology, and immunoassay platform runs multi-level Internal Quality Control (IQC) controls before patient samples are processed.',
  },
  {
    step: '03. Pathologist Technical & Clinical Review',
    detail:
      'Automated delta checks flag unusual shifts for direct microscopic or biochemical review by our MD Pathologists prior to report release.',
  },
  {
    step: '04. Archival & Post-Analytical Clarity',
    detail:
      'Reports display transparent assay methodology, biological reference intervals, and clinician-friendly summaries for seamless care continuity.',
  },
];

export function AboutPage() {
  return (
    <div>
      {/* Page Header */}
      <section className="border-b border-slate-200 bg-slate-50/70 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-stretch gap-10 lg:grid-cols-12">
            <div className="flex flex-col justify-center lg:col-span-6">
              <p className="text-xs font-semibold tracking-wide text-teal-700">
                About LifeCare Diagnostics &amp; Pathology Lab
              </p>
              <h1 className="mt-2.5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Precision Pathology Built Around Patient Trust
              </h1>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                {LAB_INFO.tagline} LifeCare Diagnostics &amp; Pathology Lab combines
                automated clinical instrumentation with seasoned MD Pathologist supervision
                so patients and physicians receive dependable answers when they matter most.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                From single routine screenings like CBC and HbA1c to comprehensive 86-parameter
                preventive body checkups, every specimen follows standardized quality controls
                from collection through final verification.
              </p>
            </div>
            <div className="lg:col-span-6">
              <div className="h-72 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 sm:h-88 lg:h-full">
                <SafeImage
                  src={LAB_IMAGES.heroLab}
                  alt="LifeCare Diagnostics modern pathology laboratory interior"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-8">
              <p className="text-xs font-semibold text-teal-700">Our Mission</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                Make Reliable Diagnostics Accessible and Stress-Free
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Deliver medically rigorous pathology testing with transparent pricing, gentle
                doorstep sample collection, and timely digital reporting—empowering families
                and clinicians with accurate health insights without administrative friction.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-8">
              <p className="text-xs font-semibold text-teal-700">Our Vision</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                Set the Regional Benchmark in Preventive Pathology
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Shift healthcare conversations from late-stage intervention to early, evidence-based
                detection by pairing modern clinical automation with human medical empathy and
                strict pre-analytical standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Diagnostic Approach & Facilities Snapshot */}
      <section className="border-y border-slate-200 bg-slate-50/70 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-stretch gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="h-72 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 lg:h-full">
                <SafeImage
                  src={LAB_IMAGES.microscopyPathology}
                  alt="Senior clinical pathologist examining slide under microscope"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col justify-center lg:col-span-7">
              <SectionHeading
                eyebrow="Diagnostic Approach"
                title="Where Automated Throughput Meets Pathologist Judgement"
                description="High-volume clinical analyzers deliver repeatable precision, while human MD Pathologists ensure every edge case is interpreted in proper biological context."
              />

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <h3 className="text-base font-bold text-slate-900">
                    Integrated Core Departments
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    Dedicated Biochemistry, Hematology, Clinical Pathology, Immunochemistry,
                    and Class-II Microbiology units operate in segregated bio-safe zones.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <h3 className="text-base font-bold text-slate-900">
                    Commitment to Patient Safety
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    100% single-use sealed needles, immediate bio-medical sharps disposal,
                    and strict surface sanitization between every walk-in or home draw.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Assurance Process */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Quality Governance"
            title="Four-Stage Quality Assurance Process"
            description="Every sample passes through documented checkpoints designed around international clinical laboratory standards."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {QA_STEPS.map((item) => (
              <div
                key={item.step}
                className="rounded-xl border border-slate-200 bg-white p-6"
              >
                <h3 className="text-base font-bold text-brand-navy">{item.step}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Laboratory Professionals & Patient Safety */}
      <section className="border-t border-slate-200 bg-slate-50/70 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Medical Specialists"
            title="Our Laboratory Professionals"
            description="Meet the clinical directors and technologists upholding quality across every department."
          />

          <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            <SafeImage
              src={LAB_IMAGES.medicalTeam}
              alt="LifeCare Diagnostics clinical pathology doctors and technologists"
              className="aspect-[16/7] w-full object-cover"
            />
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM_MEMBERS.map((member) => (
              <article
                key={member.id}
                className="rounded-xl border border-slate-200 bg-white p-6"
              >
                <p className="text-xs font-semibold text-teal-700">
                  {member.qualification}
                </p>
                <h3 className="mt-1.5 text-lg font-bold text-slate-900">
                  {member.name}
                </h3>
                <p className="text-xs font-medium text-slate-500">
                  {member.role} · {member.experience}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-slate-600">
                  {member.bio}
                </p>
              </article>
            ))}
          </div>

          {/* Patient Safety Commitment */}
          <div className="mt-12 rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
            <h3 className="text-xl font-bold text-slate-900">
              Our Commitment to Patient Safety &amp; Privacy
            </h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                'Single-use sealed sterile vacutainers opened in front of every patient',
                'Barcoded chain-of-custody preventing specimen misidentification',
                'Color-coded biomedical waste segregation and certified disposal',
                'Gentle pediatric and geriatric venipuncture training for all phlebotomists',
                'Confidential patient report indexing with verified access codes',
                'Transparent sample rejection & free re-collection guarantee if integrity is compromised',
              ].map((point) => (
                <div key={point} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
