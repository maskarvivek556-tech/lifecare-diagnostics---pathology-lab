import { ArrowRight, Phone } from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { LAB_INFO } from '../data/labData';

interface CTASectionProps {
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryTo?: string;
  secondaryLabel?: string;
  secondaryTo?: string;
}

export function CTASection({
  title = 'Schedule Your Diagnostic Test or Doorstep Collection Today',
  description = 'Choose from 15 clinical test categories or curated preventive health packages. Book online in under two minutes with zero clinic wait time.',
  primaryLabel = 'Book a Test Online',
  primaryTo = '/book',
  secondaryLabel = 'Try Demo Report Generator',
  secondaryTo = '/report-generator',
}: CTASectionProps) {
  const { navigate } = useRouter();

  return (
    <section className="no-print bg-gradient-to-r from-[#072644] via-[#0c3b66] to-[#0d626e] py-14 text-white sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-sky-100">
              {description}
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-sm text-sky-200">
              <Phone className="h-4 w-4 text-teal-300" />
              Patient Care Desk: {LAB_INFO.phone} · {LAB_INFO.homeCollectionHours}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3.5 shrink-0">
            <button
              type="button"
              onClick={() => navigate(primaryTo)}
              className="inline-flex min-h-[46px] items-center gap-2 whitespace-nowrap rounded-lg bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-500"
            >
              {primaryLabel}
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate(secondaryTo)}
              className="inline-flex min-h-[46px] items-center whitespace-nowrap rounded-lg border border-sky-300/40 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
            >
              {secondaryLabel}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
