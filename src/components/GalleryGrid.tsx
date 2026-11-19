import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { GalleryItem } from '../types';
import { SafeImage } from './SafeImage';

interface GalleryGridProps {
  items: GalleryItem[];
}

const CATEGORIES: Array<'All' | GalleryItem['category']> = [
  'All',
  'Laboratory',
  'Equipment',
  'Blood Collection',
  'Professionals',
  'Facilities',
  'Testing Process',
];

export function GalleryGrid({ items }: GalleryGridProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<'All' | GalleryItem['category']>('All');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const filtered =
    selectedCategory === 'All'
      ? items
      : items.filter((item) => item.category === selectedCategory);

  useEffect(() => {
    if (activeIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveIndex(null);
      if (e.key === 'ArrowRight') {
        setActiveIndex((prev) =>
          prev === null ? null : (prev + 1) % filtered.length
        );
      }
      if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) =>
          prev === null ? null : (prev - 1 + filtered.length) % filtered.length
        );
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, filtered.length]);

  const activeItem = activeIndex !== null ? filtered[activeIndex] : null;

  return (
    <div>
      {/* Interactive Category Filter Bar */}
      <div
        role="tablist"
        aria-label="Gallery categories"
        className="flex flex-wrap items-center gap-2"
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              role="tab"
              aria-selected={isSelected}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
                setActiveIndex(null);
              }}
              className={`min-h-[40px] whitespace-nowrap rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
                isSelected
                  ? 'bg-brand-navy text-white'
                  : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Responsive Photography Grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveIndex(idx)}
            className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white text-left transition-colors hover:border-sky-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
          >
            <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
              <SafeImage
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <p className="text-xs font-medium text-teal-700">
                {item.category} · {item.department}
              </p>
              <h3 className="mt-1 text-base font-bold text-slate-900">
                {item.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                {item.caption}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Accessible Lightbox Modal */}
      {activeItem && activeIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-xs"
          onClick={() => setActiveIndex(null)}
        >
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5">
              <div>
                <p className="text-xs font-semibold text-teal-700">
                  {activeItem.category} · {activeItem.department}
                </p>
                <h4 className="text-base font-bold text-slate-900">
                  {activeItem.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setActiveIndex(null)}
                aria-label="Close image preview"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative bg-slate-900">
              <SafeImage
                src={activeItem.image}
                alt={activeItem.title}
                className="mx-auto max-h-[68vh] w-full object-contain"
              />

              {filtered.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous image"
                    onClick={() =>
                      setActiveIndex(
                        (activeIndex - 1 + filtered.length) % filtered.length
                      )
                    }
                    className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow hover:bg-white"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next image"
                    onClick={() =>
                      setActiveIndex((activeIndex + 1) % filtered.length)
                    }
                    className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow hover:bg-white"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 px-5 py-4 text-sm text-slate-600">
              <p>{activeItem.caption}</p>
              <span className="shrink-0 font-mono text-xs text-slate-500 tabular-nums">
                {activeIndex + 1} / {filtered.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
