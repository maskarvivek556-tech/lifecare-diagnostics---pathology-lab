import { Check, Clock, ShieldCheck } from 'lucide-react';
import { BookingForm } from '../components/BookingForm';
import { FAQAccordion } from '../components/FAQAccordion';
import { SafeImage } from '../components/SafeImage';
import { SectionHeading } from '../components/SectionHeading';
import { FAQS, LAB_IMAGES } from '../data/labData';

const COLLECTION_STEPS = [
  {
    step: '01',
    title: 'Book Your Hourly Window',
    description:
      'Choose your tests or health package and pick a 60-minute doorstep arrival window between 6:00 AM and 8:00 PM.',
  },
  {
    step: '02',
    title: 'Certified Phlebotomist Visit',
    description:
      'A trained, uniformed specialist arrives with ID credentials, nitrile gloves, hand sanitizer, and sealed single-use vacutainers.',
  },
  {
    step: '03',
    title: 'Chairside Barcoding & Cold Box',
    description:
      'Tubes are barcoded in front of you and placed directly inside a 2–8°C temperature-regulated transport carrier.',
  },
  {
    step: '04',
    title: 'Same-Day Digital Report',
    description:
      'Specimens enter our automated accessioning bay upon arrival, and verified PDF reports are posted to the Patient Reports portal.',
  },
];

const HYGIENE_PROTOCOLS = [
  'Sealed sterile single-use vacutainer needles opened in your presence',
  'Alcohol-based hand hygiene and fresh powder-free nitrile gloves for every draw',
  'Tamper-evident bio-safe specimen pouches with patient barcode stickers',
  'Validated 2–8°C gel-pack cooler boxes protecting glucose and enzyme stability',
  'Puncture-proof sharps containers carried away for compliant biomedical disposal',
  'Female phlebotomist request supported for women and pediatric home visits',
];

const TIMING_WINDOWS = [
  { window: 'Early Fasting Slots', hours: '06:00 AM – 09:00 AM', note: 'Ideal for FBS, Lipid Profile, and Full Body Checkups' },
  { window: 'Mid-Morning Slots', hours: '09:00 AM – 12:00 PM', note: 'Suitable for Thyroid, HbA1c, Vitamins, and Post-Meal PPBS' },
  { window: 'Afternoon & Evening', hours: '02:00 PM – 08:00 PM', note: 'Non-fasting tests (CBC, CRP, Fever Panel, Urine Routine)' },
];

export function HomeCollectionPage() {
  const homeFaqs = FAQS.filter(
    (f) => f.category === 'Home Collection' || f.category === 'General'
  );

  return (
    <div>
      {/* Hero Split */}
      <section className="border-b border-slate-200 bg-slate-50/70 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-stretch gap-10 lg:grid-cols-12">
            <div className="flex flex-col justify-center lg:col-span-6">
              <p className="text-xs font-semibold tracking-wide text-teal-700">
                Doorstep Phlebotomy · 7 Days a Week
              </p>
              <h1 className="mt-2.5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Safe, Hygienic Home Sample Collection at Your Doorstep
              </h1>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Designed for fasting blood panels, senior citizens, busy professionals, and
                families. Experience hospital-grade phlebotomy in the comfort of your home
                with validated cold-chain sample transport.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-200 pt-6">
                <div>
                  <p className="font-mono text-xl font-bold text-brand-navy">
                    6 AM – 8 PM
                  </p>
                  <p className="text-xs text-slate-600">Daily doorstep collection hours</p>
                </div>
                <div>
                  <p className="font-mono text-xl font-bold text-teal-700">₹0 Fee</p>
                  <p className="text-xs text-slate-600">On demo orders ₹999 &amp; above</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="h-72 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 sm:h-88 lg:h-full">
                <SafeImage
                  src={LAB_IMAGES.homeCollection}
                  alt="Certified LifeCare phlebotomist preparing sterile blood sample tubes at patient home"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Home Collection Works */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Step-by-Step Process"
            title="How Home Sample Collection Works"
            description="Every doorstep visit follows standardized clinical phlebotomy and cold-chain custody rules."
          />

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {COLLECTION_STEPS.map((item) => (
              <div
                key={item.step}
                className="rounded-xl border border-slate-200 bg-white p-6"
              >
                <p className="font-mono text-2xl font-bold text-brand-navy tabular-nums">
                  {item.step}
                </p>
                <h3 className="mt-3 text-base font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trained Specialists, Hygiene & Timings */}
      <section className="border-y border-slate-200 bg-slate-50/70 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-12">
            {/* Hygiene & Safety */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 lg:col-span-7">
              <div className="flex items-center gap-2.5 text-teal-700">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-xs font-semibold">
                  Trained Phlebotomists &amp; Infection Control
                </span>
              </div>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                Hygiene, Safety &amp; Cold-Chain Procedures
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Every LifeCare collection specialist completes clinical phlebotomy
                certification, difficult-vein training for senior citizens, and daily kit
                audits prior to dispatch.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-slate-700">
                {HYGIENE_PROTOCOLS.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Collection Timings & Benefits */}
            <div className="space-y-6 lg:col-span-5">
              <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
                <div className="flex items-center gap-2 text-brand-navy">
                  <Clock className="h-5 w-5" />
                  <h3 className="text-lg font-bold text-slate-900">
                    Available Collection Timings
                  </h3>
                </div>
                <div className="mt-5 divide-y divide-slate-100">
                  {TIMING_WINDOWS.map((slot) => (
                    <div key={slot.window} className="py-3.5 first:pt-0 last:pb-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900">
                          {slot.window}
                        </p>
                        <span className="font-mono text-xs font-semibold text-teal-700">
                          {slot.hours}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600">{slot.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                <SafeImage
                  src={LAB_IMAGES.bloodCollectionRoom}
                  alt="Walk-in phlebotomy room at LifeCare Diagnostics"
                  className="aspect-[16/9] w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Home Collection Booking Form */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Instant Scheduling"
            title="Book Home Sample Collection"
            description="Reserve your doorstep collection slot below. All bookings are stored locally in your browser as a frontend demonstration."
          />
          <div className="mt-8">
            <BookingForm defaultMode="Home Collection" compact />
          </div>
        </div>
      </section>

      {/* Home Collection FAQ */}
      <section className="border-t border-slate-200 bg-slate-50/70 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionHeading
            align="center"
            eyebrow="Common Questions"
            title="Home Sample Collection FAQs"
          />
          <div className="mt-8">
            <FAQAccordion items={homeFaqs} />
          </div>
        </div>
      </section>
    </div>
  );
}
