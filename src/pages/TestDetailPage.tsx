import { ArrowLeft, ArrowRight, Check, Info } from 'lucide-react';
import { SafeImage } from '../components/SafeImage';
import { TestCard } from '../components/TestCard';
import { useRouter } from '../context/RouterContext';
import { ACCENT_STYLES, MEDICAL_TESTS } from '../data/labData';

interface TestDetailPageProps {
  slug: string;
}

export function TestDetailPage({ slug }: TestDetailPageProps) {
  const { navigate } = useRouter();
  const test = MEDICAL_TESTS.find((t) => t.slug === slug);

  if (!test) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-slate-900">Medical Test Not Found</h1>
        <p className="mt-2 text-sm text-slate-600">
          The requested diagnostic test profile could not be located in our directory.
        </p>
        <button
          type="button"
          onClick={() => navigate('/tests')}
          className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Medical Tests
        </button>
      </section>
    );
  }

  const accent = ACCENT_STYLES[test.accent];
  const related = MEDICAL_TESTS.filter(
    (item) => item.id !== test.id && (item.category === test.category || item.popular)
  ).slice(0, 3);

  return (
    <div className="py-10 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <button
          type="button"
          onClick={() => navigate('/tests')}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 transition-colors hover:text-brand-navy"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to All Medical Tests
        </button>

        <div className="mt-6 grid gap-8 lg:grid-cols-12">
          {/* Main Clinical Overview */}
          <div className="space-y-8 lg:col-span-8">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="relative aspect-[21/9] w-full overflow-hidden bg-slate-100">
                <SafeImage
                  src={test.image}
                  alt={test.name}
                  className="h-full w-full object-cover"
                />
                <div className={`absolute inset-x-0 top-0 h-1.5 ${accent.topBar}`} />
              </div>

              <div className="p-6 sm:p-8">
                <p className={`text-xs font-semibold ${accent.text}`}>
                  {test.category} · {test.parametersCount}{' '}
                  {test.parametersCount === 1 ? 'Parameter' : 'Parameters'} · Report in{' '}
                  {test.turnaroundTime}
                </p>
                <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                  {test.name}
                </h1>
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  {test.detailedOverview}
                </p>

                {/* Key Specs Table */}
                <dl className="mt-6 grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-3">
                  <div>
                    <dt className="text-xs text-slate-500">Sample Type</dt>
                    <dd className="mt-1 text-sm font-semibold text-slate-900">
                      {test.sampleType}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">Report Turnaround</dt>
                    <dd className="mt-1 text-sm font-semibold text-slate-900">
                      Approx. {test.turnaroundTime}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">Home Collection</dt>
                    <dd className="mt-1 text-sm font-semibold text-teal-700">
                      {test.homeCollectionAvailable
                        ? 'Available (6 AM – 8 PM)'
                        : 'Lab Visit Only'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Parameters Included */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
              <h2 className="text-lg font-bold text-slate-900">
                Parameters Measured ({test.parametersCount})
              </h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {test.parametersIncluded.map((param) => (
                  <li
                    key={param}
                    className="flex items-start gap-2.5 text-sm text-slate-700"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                    <span>{param}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Preparation & Disclaimer */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-slate-900">
                Sample Preparation Instructions
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                {test.preparation}
              </p>
              <div className="mt-5 flex items-start gap-2.5 border-t border-slate-200 pt-4 text-xs leading-relaxed text-slate-600">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-navy" />
                <p>
                  Actual preparation instructions depend on the test methodology, patient
                  medications, and individual laboratory protocol. Consult your ordering
                  physician before pausing any prescription medication.
                </p>
              </div>
            </div>
          </div>

          {/* Sticky Action Summary */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
              <p className="text-xs font-medium text-slate-500">Demo Diagnostic Price</p>
              <p className="mt-1 font-mono text-3xl font-extrabold text-brand-navy tabular-nums">
                ₹{test.price.toLocaleString('en-IN')}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Includes sterile barcoded kit &amp; digital PDF report access
              </p>

              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={() => navigate(`/book?test=${test.id}`)}
                  className={`inline-flex min-h-[46px] w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg px-5 py-3 text-sm font-semibold text-white transition-colors ${accent.button}`}
                >
                  Book This Test
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/report-generator')}
                  className="inline-flex min-h-[44px] w-full items-center justify-center whitespace-nowrap rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Preview Sample Lab Report
                </button>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-5 text-xs leading-relaxed text-slate-600">
                <p className="font-semibold text-slate-800">Collection Options:</p>
                <p className="mt-1">
                  Available via doorstep home collection (free on orders ₹999+) or walk-in
                  visit at our central laboratory.
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Tests */}
        <div className="mt-16 border-t border-slate-200 pt-12">
          <h2 className="text-xl font-bold text-slate-900">
            Related Diagnostic Tests
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {related.map((item) => (
              <TestCard key={item.id} test={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
