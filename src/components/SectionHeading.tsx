import React from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  action?: React.ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  action,
}: SectionHeadingProps) {
  return (
    <div
      className={`flex flex-col gap-4 ${
        align === 'center'
          ? 'mx-auto max-w-2xl items-center text-center'
          : 'md:flex-row md:items-end md:justify-between'
      }`}
    >
      <div className={align === 'center' ? 'max-w-2xl' : 'max-w-2xl'}>
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold tracking-wide text-teal-700">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
