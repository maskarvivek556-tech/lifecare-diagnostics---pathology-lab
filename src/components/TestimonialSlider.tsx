import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TestimonialItem } from '../types';

interface TestimonialSliderProps {
  items: TestimonialItem[];
}

export function TestimonialSlider({ items }: TestimonialSliderProps) {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);
  const next = () => setIndex((i) => (i + 1) % items.length);

  const active = items[index];
  const secondary = items[(index + 1) % items.length];

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2">
        {[active, secondary].map((item) => (
          <figure
            key={item.id}
            className="flex h-full flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 sm:p-8"
          >
            <div>
              <p className="text-xs font-semibold text-teal-700">
                {item.serviceUsed} · {item.date}
              </p>
              <blockquote className="mt-4 text-base leading-relaxed text-slate-700">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
            </div>

            <figcaption className="mt-6 border-t border-slate-100 pt-4">
              <p className="text-sm font-bold text-slate-900">{item.name}</p>
              <p className="text-xs text-slate-500">{item.location}</p>
              <p className="mt-2 text-xs font-medium text-brand-navy">
                Outcome: {item.outcome}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              aria-label={`View testimonial ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-8 bg-brand-navy' : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous testimonials"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 transition-colors hover:bg-slate-50"
          >
            <ChevronLeft className="h-4.5 w-4.5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next testimonials"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 transition-colors hover:bg-slate-50"
          >
            <ChevronRight className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
