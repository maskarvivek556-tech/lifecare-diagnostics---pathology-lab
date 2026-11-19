import { CTASection } from '../components/CTASection';
import { GalleryGrid } from '../components/GalleryGrid';
import { GALLERY_ITEMS } from '../data/labData';

export function GalleryPage() {
  return (
    <div>
      <section className="border-b border-slate-200 bg-slate-50/70 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-xs font-semibold tracking-wide text-teal-700">
            Inside LifeCare Diagnostics
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Laboratory &amp; Facilities Photo Gallery
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-600">
            Filter photographs across our core laboratory, diagnostic instruments, blood
            collection bays, clinical specialists, and testing workflows. Click any image to
            open the high-resolution lightbox view.
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <GalleryGrid items={GALLERY_ITEMS} />
        </div>
      </section>

      <CTASection />
    </div>
  );
}
