import { useState } from 'react';
import { FlaskConical } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export function SafeImage({
  src,
  alt,
  className = '',
  fallbackLabel,
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-sky-50 to-teal-50 p-6 text-center text-slate-600 ${className}`}
      >
        <FlaskConical className="mb-2 h-8 w-8 text-sky-700" />
        <p className="text-sm font-medium text-slate-700">{fallbackLabel || alt}</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
