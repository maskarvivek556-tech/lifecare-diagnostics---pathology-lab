import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from '../context/RouterContext';
import { ACCENT_STYLES } from '../data/labData';
import { MedicalTest } from '../types';
import { SafeImage } from './SafeImage';

interface TestCardProps {
  test: MedicalTest;
}

export function TestCard({ test }: TestCardProps) {
  const { navigate } = useRouter();
  const accent = ACCENT_STYLES[test.accent];

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className={`group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs transition-all duration-200 hover:shadow-md ${accent.borderHover}`}
    >
      {/* Crisp Category-Matched Clinical Photograph */}
      <button
        type="button"
        onClick={() => navigate(`/tests/${test.slug}`)}
        className="relative block aspect-[16/10] w-full overflow-hidden bg-slate-100 text-left"
      >
        <SafeImage
          src={test.image}
          alt={`${test.name} clinical laboratory testing`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950/65 to-transparent" />
        <div className={`absolute inset-x-0 top-0 h-1 ${accent.topBar}`} />
        <p className="absolute bottom-2.5 left-4 text-xs font-semibold text-white">
          {test.category} · {test.parametersCount}{' '}
          {test.parametersCount === 1 ? 'Parameter' : 'Parameters'}
        </p>
      </button>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
            <span className={`font-semibold ${accent.text}`}>
              Report in {test.turnaroundTime}
            </span>
            <span>
              {test.fastingRequired ? 'Fasting required' : 'No fasting needed'}
            </span>
          </div>

          <h3 className="mt-2 text-lg font-bold tracking-tight text-slate-900">
            <button
              type="button"
              onClick={() => navigate(`/tests/${test.slug}`)}
              className="text-left transition-colors hover:text-brand-navy"
            >
              {test.name}
            </button>
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {test.description}
          </p>

          <dl className="mt-4 space-y-1.5 border-t border-slate-100 pt-3.5 text-xs">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Sample Type</dt>
              <dd className="text-right font-medium text-slate-800">
                {test.sampleType}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Home Collection</dt>
              <dd className="text-right font-semibold text-teal-700">
                Available Daily
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div>
            <p className="text-[11px] text-slate-500">Demo Price</p>
            <p className="font-mono text-xl font-bold text-slate-900 tabular-nums">
              ₹{test.price.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate(`/tests/${test.slug}`)}
              className="inline-flex min-h-[40px] items-center whitespace-nowrap rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
            >
              View Details
            </button>
            <button
              type="button"
              onClick={() => navigate(`/book?test=${test.id}`)}
              className={`inline-flex min-h-[40px] items-center gap-1 whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-semibold text-white transition-colors ${accent.button}`}
            >
              Book Test
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
