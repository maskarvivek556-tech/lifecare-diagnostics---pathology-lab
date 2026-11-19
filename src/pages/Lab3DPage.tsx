import { ArrowRight } from 'lucide-react';
import { Lab3DViewport } from '../components/Lab3DViewport';
import { useRouter } from '../context/RouterContext';

export function Lab3DPage() {
  const { navigate } = useRouter();

  return (
    <div className="bg-slate-950">
      {/* Full-Bleed 3D Pathology Studio */}
      <Lab3DViewport heightClass="h-[calc(100vh-64px)] min-h-[560px]" />

      {/* Compact Educational Specs Below the Fold */}
      <section className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-wide text-teal-700">
                Interactive 3D Diagnostic Equipment Tour
              </p>
              <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Explore How Your Samples Are Analyzed
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Inspect our 3D binocular pathology microscope, automated barcoded
                centrifuge rotor, and molecular biomarker display. Use the bottom dock to
                switch camera stations, slide the Explode inspection view, or toggle
                Optical Darkroom illumination.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <button
                type="button"
                onClick={() => navigate('/book')}
                className="inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap rounded-lg bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-900"
              >
                Book a Test
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/facilities')}
                className="inline-flex min-h-[44px] items-center whitespace-nowrap rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                View Lab Facilities
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
