import { Check } from 'lucide-react';
import { FacilityItem } from '../types';
import { SafeImage } from './SafeImage';

interface FacilityCardProps {
  facility: FacilityItem;
}

export function FacilityCard({ facility }: FacilityCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <SafeImage
          src={facility.image}
          alt={facility.imageAlt}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold text-teal-700">{facility.department}</p>
        <h3 className="mt-1.5 text-lg font-bold text-slate-900">{facility.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {facility.details}
        </p>
        <ul className="mt-4 space-y-1.5 border-t border-slate-100 pt-4 text-xs text-slate-700">
          {facility.highlights.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-600" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
