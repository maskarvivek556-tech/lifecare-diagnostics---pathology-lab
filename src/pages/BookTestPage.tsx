import { BookingForm } from '../components/BookingForm';
import { useRouter } from '../context/RouterContext';

export function BookTestPage() {
  const { query } = useRouter();

  return (
    <div>
      <section className="border-b border-slate-200 bg-slate-50/70 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-xs font-semibold tracking-wide text-teal-700">
            Online Appointment &amp; Doorstep Phlebotomy (Frontend Demo)
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Book a Medical Test or Health Package
          </h1>
          <p className="mt-2.5 max-w-2xl text-base text-slate-600">
            Choose individual pathology tests or a preventive checkup package, select your
            preferred collection window, and receive an instant demo booking reference.
          </p>
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <BookingForm
            defaultTestId={query.test || ''}
            defaultPackageId={query.package || ''}
            defaultMode={query.mode === 'lab' ? 'Lab Visit' : 'Home Collection'}
          />
        </div>
      </section>
    </div>
  );
}
