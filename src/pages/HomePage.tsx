import { ArrowRight, Box, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { CTASection } from '../components/CTASection';
import { FAQAccordion } from '../components/FAQAccordion';
import { HeroSection } from '../components/HeroSection';
import { PackageCard } from '../components/PackageCard';
import { QuickShortcutsBar } from '../components/QuickShortcutsBar';
import { SafeImage } from '../components/SafeImage';
import { SectionHeading } from '../components/SectionHeading';
import { TestCard } from '../components/TestCard';
import { TestimonialSlider } from '../components/TestimonialSlider';
import { useRouter } from '../context/RouterContext';
import {
  FAQS,
  HEALTH_PACKAGES,
  LAB_IMAGES,
  MEDICAL_TESTS,
  TEAM_MEMBERS,
  TESTIMONIALS,
} from '../data/labData';

const WHY_CHOOSE_ITEMS = [
  {
    index: '01',
    accent: 'text-sky-700',
    title: 'Automated Bidirectional Analyzers',
    detail:
      'Closed-tube barcoded chemistry and 5-part hematology platforms eliminate manual transcription errors and run multi-level daily calibration controls.',
  },
  {
    index: '02',
    accent: 'text-teal-700',
    title: 'MD Pathologist Clinical Verification',
    detail:
      'Every abnormal flag, peripheral smear, and endocrine panel undergoes secondary verification by senior MD Pathologists and Biochemists.',
  },
  {
    index: '03',
    accent: 'text-indigo-700',
    title: 'Validated 2–8°C Cold-Chain Logistics',
    detail:
      'Home-collected specimens travel inside temperature-monitored gel-pack carriers from doorstep to our central accessioning bay.',
  },
  {
    index: '04',
    accent: 'text-emerald-700',
    title: 'Clear, Same-Day Digital Reports',
    detail:
      'Structured reference ranges, methodology footnotes, and instant PDF access help both patients and physicians act without delay.',
  },
];

const LAB_SERVICES = [
  {
    title: 'Clinical Biochemistry',
    department: 'Automated Chemistry',
    accent: 'bg-sky-600',
    image: LAB_IMAGES.biochemistryAnalyzer,
    summary: 'Liver, kidney, lipid, HbA1c, electrolytes, and preventive metabolic profiles.',
  },
  {
    title: 'Hematology & Pathology',
    department: '5-Part Cell Analysis',
    accent: 'bg-teal-600',
    image: LAB_IMAGES.cardHematology,
    summary: 'Complete blood counts, ESR, coagulation baselines, and microscopic urinalysis.',
  },
  {
    title: 'Immunochemistry & Hormones',
    department: 'CLIA Endocrinology',
    accent: 'bg-indigo-600',
    image: LAB_IMAGES.cardThyroid,
    summary: 'Thyroid T3/T4/TSH, Vitamin D, Vitamin B12, Ferritin, and endocrine panels.',
  },
  {
    title: 'Microbiology & Serology',
    department: 'Class-II Biosafety',
    accent: 'bg-emerald-600',
    image: LAB_IMAGES.microbiologyCleanroom,
    summary: 'Sterile culture sensitivity, CRP, and acute febrile illness screening.',
  },
  {
    title: 'Cardiometabolic Risk',
    department: 'Preventive Cardiology',
    accent: 'bg-rose-600',
    image: LAB_IMAGES.cardCardiac,
    summary: 'hs-CRP, Apolipoprotein A1/B, Lipoprotein(a), and Homocysteine assays.',
  },
  {
    title: 'Micronutrients & Wellness',
    department: 'Preventive Screening',
    accent: 'bg-amber-600',
    image: LAB_IMAGES.cardVitamins,
    summary: 'Curated annual checkups tailored for young adults, women, and senior citizens.',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    accent: 'bg-sky-600',
    title: 'Select Test or Package',
    description:
      'Search from 15 clinical test categories or pick a preventive body checkup tailored to your doctor’s advice.',
  },
  {
    step: '02',
    accent: 'bg-teal-600',
    title: 'Doorstep or Lab Collection',
    description:
      'Schedule a certified phlebotomist to your home between 6:00 AM and 8:00 PM, or walk into our collection lounge.',
  },
  {
    step: '03',
    accent: 'bg-indigo-600',
    title: 'Barcoded Automated Processing',
    description:
      'Specimens are logged on arrival, centrifuged under temperature control, and analyzed with automated quality checks.',
  },
  {
    step: '04',
    accent: 'bg-emerald-600',
    title: 'Access Digital PDF Report',
    description:
      'Track report status online and download clearly formatted reports directly from the Patient Reports portal.',
  },
];

export function HomePage() {
  const { navigate } = useRouter();
  const popularTests = MEDICAL_TESTS.filter((t) => t.popular).slice(0, 6);
  const featuredPackages = HEALTH_PACKAGES.filter((p) => p.featured).slice(0, 4);

  return (
    <div>
      {/* 1. Hero Section + Inline Test Search */}
      <HeroSection />

      {/* 2. Interactive Quick Shortcuts Strip */}
      <QuickShortcutsBar />

      {/* 3. Popular Medical Tests (Image-Rich Cards) */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Diagnostic Directory"
            title="Popular Medical Tests"
            description="Frequently prescribed pathology and biochemistry tests with transparent preparation guidance and turnaround estimates."
            action={
              <button
                type="button"
                onClick={() => navigate('/tests')}
                className="inline-flex min-h-[42px] items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-brand-navy hover:text-teal-700"
              >
                View all 15 test categories
                <ArrowRight className="h-4 w-4" />
              </button>
            }
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {popularTests.map((test) => (
              <TestCard key={test.id} test={test} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Interactive 3D Pathology Laboratory Feature Banner */}
      <section className="border-y border-sky-900/15 bg-gradient-to-r from-[#072644] via-[#0c3b66] to-[#0d626e] py-14 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-teal-300">
                <Box className="h-4 w-4" />
                Interactive Three.js 3D Experience · Shortcut Alt+7
              </p>
              <h2 className="mt-2.5 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Step Inside Our Interactive 3D Pathology Laboratory
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-sky-100 sm:text-base">
                Orbit our 3D binocular pathology microscope, watch the 6-tube barcoded
                centrifuge rotor spin in real time, slide the exploded-view inspection
                mode, and inspect our molecular biomarker double helix in daylight or
                optical darkroom lighting.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/lab-3d')}
                  className="inline-flex min-h-[46px] items-center gap-2 whitespace-nowrap rounded-lg bg-teal-500 px-6 py-3 text-sm font-bold text-slate-950 transition-colors hover:bg-teal-400"
                >
                  Launch 3D Pathology Lab
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/report-generator')}
                  className="inline-flex min-h-[46px] items-center whitespace-nowrap rounded-lg border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
                >
                  Open Demo Report Studio
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <button
                type="button"
                onClick={() => navigate('/lab-3d')}
                className="group relative block w-full overflow-hidden rounded-2xl border border-white/20 bg-slate-900 text-left shadow-xl"
              >
                <SafeImage
                  src={LAB_IMAGES.microscopyPathology}
                  alt="Preview of LifeCare 3D pathology microscope and diagnostic instruments"
                  className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-teal-300">
                      360° Orbit · Exploded View · Darkroom Mode
                    </p>
                    <p className="text-sm font-bold text-white">
                      Click to enter 3D Interactive Bench
                    </p>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-500 text-slate-950 transition-transform group-hover:translate-x-0.5">
                    <ArrowRight className="h-4.5 w-4.5" />
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Preventive Health Checkup Packages */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-sky-50/50 to-slate-50/70 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Preventive Care"
            title="Health Checkup Packages"
            description="Thoughtfully structured multi-organ panels combining core blood, metabolic, thyroid, and vitamin biomarkers at bundled demo pricing."
            action={
              <button
                type="button"
                onClick={() => navigate('/packages')}
                className="inline-flex min-h-[42px] items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-brand-navy hover:text-teal-700"
              >
                Explore all 8 packages
                <ArrowRight className="h-4 w-4" />
              </button>
            }
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featuredPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Why Choose LifeCare Diagnostics */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-start gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="Clinical Standards"
                title="Why Choose LifeCare Diagnostics"
                description="Diagnostic accuracy begins before the sample reaches an analyzer. Our protocols focus on sterile collection, strict pre-analytical verification, and clinician-grade review."
              />
              <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
                <SafeImage
                  src={LAB_IMAGES.biochemistryAnalyzer}
                  alt="Automated clinical biochemistry analyzer inside LifeCare Diagnostics"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            </div>

            <div className="divide-y divide-slate-200 border-y border-slate-200 lg:col-span-7">
              {WHY_CHOOSE_ITEMS.map((item) => (
                <div key={item.index} className="py-6 first:pt-2">
                  <div className="flex items-baseline gap-4">
                    <span className={`font-mono text-base font-bold ${item.accent}`}>
                      {item.index}.
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Home Sample Collection Spotlight */}
      <section className="border-y border-slate-200 bg-gradient-to-br from-teal-50/55 via-white to-sky-50/55 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-stretch gap-10 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <div className="h-72 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm sm:h-96 lg:h-full">
                <SafeImage
                  src={LAB_IMAGES.homeCollection}
                  alt="Trained phlebotomist preparing sterile sample tubes for doorstep collection"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col justify-center lg:col-span-6">
              <p className="text-xs font-semibold tracking-wide text-teal-700">
                Doorstep Phlebotomy · 6:00 AM – 8:00 PM Daily
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Hygienic Home Sample Collection Without Morning Queues
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Skip early-morning traffic while fasting. Our certified phlebotomists arrive
                at your chosen hourly slot with single-use vacutainer kits, gloves, barcode
                labels, and validated temperature-controlled sample carriers.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4.5 w-4.5 shrink-0 text-teal-600" />
                  <span>
                    Zero home collection fee on test orders or packages ₹999 and above
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4.5 w-4.5 shrink-0 text-teal-600" />
                  <span>
                    Pediatric &amp; senior-friendly gentle venipuncture technique
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4.5 w-4.5 shrink-0 text-teal-600" />
                  <span>
                    Direct cold-chain transfer to our central clinical laboratory
                  </span>
                </li>
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/book')}
                  className="inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap rounded-lg bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-900"
                >
                  Schedule Home Visit
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/home-collection')}
                  className="inline-flex min-h-[44px] items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-teal-800 hover:text-brand-navy"
                >
                  Read safety protocols
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Our Laboratory Services (With Department Photography) & How It Works */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Specialized Departments"
            title="Our Laboratory Services"
            description="Six integrated clinical divisions collaborating under one roof to deliver reliable routine and specialty pathology."
            action={
              <button
                type="button"
                onClick={() => navigate('/facilities')}
                className="inline-flex min-h-[42px] items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-brand-navy hover:text-teal-700"
              >
                Tour our facilities
                <ArrowRight className="h-4 w-4" />
              </button>
            }
          />

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {LAB_SERVICES.map((srv, idx) => (
              <motion.div
                key={srv.title}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.18 }}
                className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                  <SafeImage
                    src={srv.image}
                    alt={`${srv.title} laboratory section`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className={`absolute inset-x-0 top-0 h-1 ${srv.accent}`} />
                </div>
                <div className="p-5">
                  <p className="font-mono text-xs font-semibold text-teal-700">
                    0{idx + 1} · {srv.department}
                  </p>
                  <h3 className="mt-1.5 text-lg font-bold text-slate-900">
                    {srv.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {srv.summary}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* How It Works */}
          <div className="mt-16 border-t border-slate-200 pt-16">
            <SectionHeading
              eyebrow="Patient Journey"
              title="How It Works"
              description="Four straightforward steps from selecting your panel to receiving a physician-ready report."
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {HOW_IT_WORKS.map((item) => (
                <div
                  key={item.step}
                  className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50/80 p-6"
                >
                  <div className={`absolute inset-x-0 top-0 h-1 ${item.accent}`} />
                  <p className="font-mono text-2xl font-bold text-brand-navy tabular-nums">
                    {item.step}
                  </p>
                  <h3 className="mt-3 text-base font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. Experienced Laboratory Professionals */}
      <section className="border-y border-slate-200 bg-slate-50/70 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Medical Leadership"
            title="Experienced Laboratory Professionals"
            description="Every diagnostic test is overseen by qualified MD Pathologists, Clinical Biochemists, Microbiologists, and certified laboratory technologists."
            action={
              <button
                type="button"
                onClick={() => navigate('/about')}
                className="inline-flex min-h-[42px] items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-brand-navy hover:text-teal-700"
              >
                About our team
                <ArrowRight className="h-4 w-4" />
              </button>
            }
          />

          <div className="mt-10 grid items-stretch gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="h-72 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm lg:h-full">
                <SafeImage
                  src={LAB_IMAGES.medicalTeam}
                  alt="LifeCare Diagnostics senior pathologists and clinical laboratory specialists"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
              {TEAM_MEMBERS.map((member) => (
                <div
                  key={member.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-sky-300"
                >
                  <p className="text-xs font-semibold text-teal-700">
                    {member.qualification} · {member.experience}
                  </p>
                  <h3 className="mt-1.5 text-base font-bold text-slate-900">
                    {member.name}
                  </h3>
                  <p className="text-xs font-medium text-slate-600">{member.role}</p>
                  <p className="mt-3 text-xs leading-relaxed text-slate-600">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 10. Patient Testimonials */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Patient Feedback"
            title="Trusted by Families & Referring Physicians"
            description="Real-world experiences reflecting timely doorstep sample collection, clear reporting, and attentive laboratory support."
          />
          <div className="mt-10">
            <TestimonialSlider items={TESTIMONIALS} />
          </div>
        </div>
      </section>

      {/* 11. Frequently Asked Questions */}
      <section className="border-t border-slate-200 bg-slate-50/70 py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionHeading
            align="center"
            eyebrow="Patient Guidance"
            title="Frequently Asked Questions"
            description="Answers to common questions on test preparation, doorstep phlebotomy, and digital report access."
          />
          <div className="mt-10">
            <FAQAccordion items={FAQS} />
          </div>
        </div>
      </section>

      {/* 12. Contact & Appointment CTA */}
      <CTASection />
    </div>
  );
}
