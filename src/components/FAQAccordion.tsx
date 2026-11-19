import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQItem } from '../types';

interface FAQAccordionProps {
  items: FAQItem[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex min-h-[56px] w-full items-center justify-between gap-4 px-6 py-4 text-left transition-colors hover:bg-slate-50/70"
            >
              <span className="text-sm font-semibold text-slate-900 sm:text-base">
                {item.question}
              </span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-slate-500 transition-transform duration-150 ${
                  isOpen ? 'rotate-180 text-brand-navy' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-6 pb-5 text-sm leading-relaxed text-slate-600">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
