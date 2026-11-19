import { useEffect, useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Home,
  Building2,
  Trash2,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { HEALTH_PACKAGES, MEDICAL_TESTS } from '../data/labData';
import { BookingRecord } from '../types';

const STORAGE_KEY = 'lifecare_demo_bookings_v1';

const TIME_SLOTS = [
  '06:00 AM – 07:00 AM',
  '07:00 AM – 08:00 AM',
  '08:00 AM – 09:00 AM',
  '09:00 AM – 10:30 AM',
  '10:30 AM – 12:00 PM',
  '02:00 PM – 04:00 PM',
  '04:00 PM – 06:00 PM',
  '06:00 PM – 08:00 PM',
];

interface BookingFormProps {
  defaultTestId?: string;
  defaultPackageId?: string;
  defaultMode?: 'Home Collection' | 'Lab Visit';
  compact?: boolean;
}

interface FormErrors {
  patientName?: string;
  mobile?: string;
  email?: string;
  age?: string;
  selection?: string;
  preferredDate?: string;
  preferredTime?: string;
  address?: string;
  pincode?: string;
}

export function BookingForm({
  defaultTestId = '',
  defaultPackageId = '',
  defaultMode = 'Home Collection',
  compact = false,
}: BookingFormProps) {
  const { showToast } = useToast();

  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [patientName, setPatientName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [selectedTestIds, setSelectedTestIds] = useState<string[]>(
    defaultTestId ? [defaultTestId] : []
  );
  const [selectedPackageId, setSelectedPackageId] = useState<string>(defaultPackageId);
  const [preferredDate, setPreferredDate] = useState(tomorrow);
  const [preferredTime, setPreferredTime] = useState(TIME_SLOTS[1]);
  const [collectionMode, setCollectionMode] = useState<'Home Collection' | 'Lab Visit'>(
    defaultMode
  );
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');

  const [errors, setErrors] = useState<FormErrors>({});
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);
  const [savedBookings, setSavedBookings] = useState<BookingRecord[]>([]);

  useEffect(() => {
    if (defaultTestId && !selectedTestIds.includes(defaultTestId)) {
      setSelectedTestIds([defaultTestId]);
    }
  }, [defaultTestId]);

  useEffect(() => {
    if (defaultPackageId) {
      setSelectedPackageId(defaultPackageId);
    }
  }, [defaultPackageId]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as BookingRecord[];
        if (Array.isArray(parsed)) {
          setSavedBookings(parsed);
        }
      }
    } catch {
      // Ignore storage read errors in restricted frames
    }
  }, []);

  const persistBookings = (next: BookingRecord[]) => {
    setSavedBookings(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage quota errors
    }
  };

  const toggleTest = (id: string) => {
    setSelectedTestIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    if (errors.selection) {
      setErrors((prev) => ({ ...prev, selection: undefined }));
    }
  };

  const selectedTests = MEDICAL_TESTS.filter((t) => selectedTestIds.includes(t.id));
  const selectedPkg = HEALTH_PACKAGES.find((p) => p.id === selectedPackageId);

  const testsSubtotal = selectedTests.reduce((sum, t) => sum + t.price, 0);
  const packageSubtotal = selectedPkg ? selectedPkg.price : 0;
  const subtotal = testsSubtotal + packageSubtotal;
  const homeCollectionFee =
    collectionMode === 'Home Collection' && subtotal > 0 && subtotal < 999 ? 150 : 0;
  const totalAmount = subtotal + homeCollectionFee;

  const requiresFasting =
    selectedTests.some((t) => t.fastingRequired) ||
    Boolean(selectedPkg && selectedPkg.preparation.toLowerCase().includes('fasting'));

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (patientName.trim().length < 2) {
      next.patientName = 'Please enter the patient full name.';
    }
    const cleanPhone = mobile.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      next.mobile = 'Enter a valid 10-digit mobile number.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = 'Enter a valid email address for demo confirmation.';
    }
    const numericAge = Number(age);
    if (!age || Number.isNaN(numericAge) || numericAge < 1 || numericAge > 120) {
      next.age = 'Enter a valid age between 1 and 120.';
    }
    if (selectedTestIds.length === 0 && !selectedPackageId) {
      next.selection = 'Select at least one medical test or a health checkup package.';
    }
    if (!preferredDate) {
      next.preferredDate = 'Choose a preferred appointment date.';
    }
    if (!preferredTime) {
      next.preferredTime = 'Choose a preferred time window.';
    }
    if (collectionMode === 'Home Collection') {
      if (address.trim().length < 10) {
        next.address = 'Please enter complete house/flat number, street, and landmark.';
      }
      if (!/^\d{6}$/.test(pincode.trim())) {
        next.pincode = 'Enter a valid 6-digit area pincode.';
      }
    }
    return next;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      showToast(
        'Please review highlighted fields',
        'Complete all required booking details before confirming.',
        'error'
      );
      return;
    }

    const refNumber = `LC-BK-${new Date().getFullYear()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const record: BookingRecord = {
      referenceNumber: refNumber,
      createdAt: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      patientName: patientName.trim(),
      mobile: mobile.replace(/\D/g, ''),
      email: email.trim(),
      age: age.trim(),
      gender,
      selectedTestIds: [...selectedTestIds],
      selectedPackageId,
      preferredDate,
      preferredTime,
      collectionMode,
      address: collectionMode === 'Home Collection' ? address.trim() : 'Central Lab Walk-In',
      pincode: collectionMode === 'Home Collection' ? pincode.trim() : '411004',
      totalAmount,
      status: 'Confirmed (Demo)',
    };

    const updated = [record, ...savedBookings].slice(0, 6);
    persistBookings(updated);
    setConfirmedBooking(record);

    showToast(
      `Demo Booking Confirmed (${refNumber})`,
      'Saved locally in your browser. No data was sent to an external server.',
      'success'
    );
  };

  const handleReset = () => {
    setConfirmedBooking(null);
    setPatientName('');
    setMobile('');
    setEmail('');
    setAge('');
    setAddress('');
    setPincode('');
    setSelectedTestIds([]);
    setSelectedPackageId('');
    setErrors({});
  };

  const handleDeleteSaved = (ref: string) => {
    const next = savedBookings.filter((b) => b.referenceNumber !== ref);
    persistBookings(next);
    showToast('Demo booking removed', `Reference ${ref} cleared from local storage.`, 'info');
  };

  if (confirmedBooking) {
    const bookedTests = MEDICAL_TESTS.filter((t) =>
      confirmedBooking.selectedTestIds.includes(t.id)
    );
    const bookedPackage = HEALTH_PACKAGES.find(
      (p) => p.id === confirmedBooking.selectedPackageId
    );

    return (
      <div className="rounded-xl border border-teal-200 bg-white p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-teal-600" />
          <div>
            <p className="text-xs font-semibold text-teal-700">
              Demo Booking Reference Generated
            </p>
            <h3 className="mt-1 text-2xl font-bold text-slate-900">
              Appointment Request Confirmed (Demo)
            </h3>
            <p className="mt-1.5 text-sm text-slate-600">
              Your frontend demonstration booking has been saved locally in this browser. No
              real medical appointment or server submission has occurred.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xs text-slate-500">Demo Booking Reference</p>
            <p className="mt-1 font-mono text-base font-bold text-brand-navy">
              {confirmedBooking.referenceNumber}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Patient</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {confirmedBooking.patientName} ({confirmedBooking.age} yrs,{' '}
              {confirmedBooking.gender})
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Collection Type</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {confirmedBooking.collectionMode}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Scheduled Slot</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {confirmedBooking.preferredDate} · {confirmedBooking.preferredTime}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Contact</p>
            <p className="mt-1 font-mono text-sm text-slate-800">
              +91 {confirmedBooking.mobile}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Estimated Demo Total</p>
            <p className="mt-1 font-mono text-base font-bold text-teal-700 tabular-nums">
              ₹{confirmedBooking.totalAmount.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        <div className="mt-5 border-t border-slate-200 pt-5 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Booked Tests &amp; Packages:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {bookedPackage && (
              <li>
                {bookedPackage.name} ({bookedPackage.testCount} tests) — ₹
                {bookedPackage.price.toLocaleString('en-IN')}
              </li>
            )}
            {bookedTests.map((t) => (
              <li key={t.id}>
                {t.name} — ₹{t.price.toLocaleString('en-IN')}
              </li>
            ))}
          </ul>
          {confirmedBooking.collectionMode === 'Home Collection' && (
            <p className="mt-3 text-xs text-slate-600">
              <strong className="text-slate-800">Collection Address:</strong>{' '}
              {confirmedBooking.address}, PIN {confirmedBooking.pincode}
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="min-h-[44px] rounded-lg bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-900"
          >
            Book Another Test
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* Main Form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 lg:col-span-8"
      >
        <div className="border-b border-slate-200 pb-5">
          <h3 className="text-xl font-bold text-slate-900">
            Patient &amp; Appointment Details
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Complete the form below to generate a local demonstration booking confirmation.
          </p>
        </div>

        {/* Collection Mode Segmented Toggle */}
        <div className="mt-6">
          <span className="block text-sm font-semibold text-slate-900">
            Sample Collection Preference
          </span>
          <div className="mt-2.5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setCollectionMode('Home Collection')}
              className={`flex min-h-[48px] items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
                collectionMode === 'Home Collection'
                  ? 'border-brand-navy bg-sky-50/70 text-brand-navy'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <Home className="h-5 w-5 shrink-0" />
              <div>
                <p className="text-sm font-semibold">Home Sample Collection</p>
                <p className="text-xs text-slate-500">
                  Free above ₹999 (₹150 otherwise)
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setCollectionMode('Lab Visit')}
              className={`flex min-h-[48px] items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
                collectionMode === 'Lab Visit'
                  ? 'border-brand-navy bg-sky-50/70 text-brand-navy'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <Building2 className="h-5 w-5 shrink-0" />
              <div>
                <p className="text-sm font-semibold">Walk-In Lab Visit</p>
                <p className="text-xs text-slate-500">
                  Zero collection fee · Priority check-in
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Patient Demographics */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="booking-name"
              className="block text-sm font-medium text-slate-800"
            >
              Patient Full Name <span className="text-red-600">*</span>
            </label>
            <input
              id="booking-name"
              type="text"
              value={patientName}
              onChange={(e) => {
                setPatientName(e.target.value);
                if (errors.patientName) setErrors((p) => ({ ...p, patientName: undefined }));
              }}
              placeholder="e.g. Rohan Deshmukh"
              className={`mt-1.5 h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-slate-900 focus:outline-none focus:ring-2 ${
                errors.patientName
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                  : 'border-slate-300 focus:border-brand-blue focus:ring-sky-100'
              }`}
            />
            {errors.patientName && (
              <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="h-3.5 w-3.5" /> {errors.patientName}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="booking-mobile"
              className="block text-sm font-medium text-slate-800"
            >
              Mobile Number <span className="text-red-600">*</span>
            </label>
            <input
              id="booking-mobile"
              type="tel"
              maxLength={10}
              value={mobile}
              onChange={(e) => {
                setMobile(e.target.value.replace(/\D/g, ''));
                if (errors.mobile) setErrors((p) => ({ ...p, mobile: undefined }));
              }}
              placeholder="10-digit mobile number"
              className={`mt-1.5 h-11 w-full rounded-lg border bg-white px-3.5 font-mono text-sm text-slate-900 focus:outline-none focus:ring-2 ${
                errors.mobile
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                  : 'border-slate-300 focus:border-brand-blue focus:ring-sky-100'
              }`}
            />
            {errors.mobile && (
              <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="h-3.5 w-3.5" /> {errors.mobile}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="booking-email"
              className="block text-sm font-medium text-slate-800"
            >
              Email Address <span className="text-red-600">*</span>
            </label>
            <input
              id="booking-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
              }}
              placeholder="patient@example.com"
              className={`mt-1.5 h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-slate-900 focus:outline-none focus:ring-2 ${
                errors.email
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                  : 'border-slate-300 focus:border-brand-blue focus:ring-sky-100'
              }`}
            />
            {errors.email && (
              <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="h-3.5 w-3.5" /> {errors.email}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="booking-age"
                className="block text-sm font-medium text-slate-800"
              >
                Age (Years) <span className="text-red-600">*</span>
              </label>
              <input
                id="booking-age"
                type="number"
                min={1}
                max={120}
                value={age}
                onChange={(e) => {
                  setAge(e.target.value);
                  if (errors.age) setErrors((p) => ({ ...p, age: undefined }));
                }}
                placeholder="e.g. 34"
                className={`mt-1.5 h-11 w-full rounded-lg border bg-white px-3.5 font-mono text-sm text-slate-900 focus:outline-none focus:ring-2 ${
                  errors.age
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                    : 'border-slate-300 focus:border-brand-blue focus:ring-sky-100'
                }`}
              />
              {errors.age && (
                <p className="mt-1 text-xs text-red-600">{errors.age}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="booking-gender"
                className="block text-sm font-medium text-slate-800"
              >
                Gender <span className="text-red-600">*</span>
              </label>
              <select
                id="booking-gender"
                value={gender}
                onChange={(e) =>
                  setGender(e.target.value as 'Male' | 'Female' | 'Other')
                }
                className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-sky-100"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Select Health Package & Individual Tests */}
        <div className="mt-6 border-t border-slate-200 pt-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="booking-package"
                className="block text-sm font-medium text-slate-800"
              >
                Select Health Checkup Package
              </label>
              <select
                id="booking-package"
                value={selectedPackageId}
                onChange={(e) => {
                  setSelectedPackageId(e.target.value);
                  if (errors.selection)
                    setErrors((p) => ({ ...p, selection: undefined }));
                }}
                className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-sky-100"
              >
                <option value="">-- No package selected --</option>
                {HEALTH_PACKAGES.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} ({pkg.testCount} tests — ₹
                    {pkg.price.toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="booking-single-test"
                className="block text-sm font-medium text-slate-800"
              >
                Quick Add Individual Test
              </label>
              <select
                id="booking-single-test"
                value=""
                onChange={(e) => {
                  if (e.target.value) toggleTest(e.target.value);
                }}
                className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-sky-100"
              >
                <option value="">-- Add a medical test --</option>
                {MEDICAL_TESTS.map((test) => (
                  <option key={test.id} value={test.id}>
                    {test.name} — ₹{test.price}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Interactive Test Selector Checkboxes */}
          {!compact && (
            <div className="mt-4">
              <p className="text-xs font-medium text-slate-500">
                Or pick commonly requested tests directly:
              </p>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                {MEDICAL_TESTS.slice(0, 9).map((test) => {
                  const checked = selectedTestIds.includes(test.id);
                  return (
                    <label
                      key={test.id}
                      className={`flex cursor-pointer items-center justify-between gap-2 rounded-lg border px-3 py-2 text-xs transition-colors ${
                        checked
                          ? 'border-brand-navy bg-sky-50 text-brand-navy font-semibold'
                          : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleTest(test.id)}
                          className="h-3.5 w-3.5 rounded border-slate-300 text-brand-navy focus:ring-brand-blue"
                        />
                        <span className="truncate">{test.shortName}</span>
                      </span>
                      <span className="shrink-0 font-mono tabular-nums">
                        ₹{test.price}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {errors.selection && (
            <p className="mt-2 flex items-center gap-1 text-xs text-red-600">
              <AlertCircle className="h-3.5 w-3.5" /> {errors.selection}
            </p>
          )}
        </div>

        {/* Schedule Date & Time */}
        <div className="mt-6 grid gap-5 border-t border-slate-200 pt-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="booking-date"
              className="block text-sm font-medium text-slate-800"
            >
              Preferred Date <span className="text-red-600">*</span>
            </label>
            <input
              id="booking-date"
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div>
            <label
              htmlFor="booking-time"
              className="block text-sm font-medium text-slate-800"
            >
              Preferred Time Slot <span className="text-red-600">*</span>
            </label>
            <select
              id="booking-time"
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-sky-100"
            >
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Conditional Home Collection Address */}
        {collectionMode === 'Home Collection' && (
          <div className="mt-6 grid gap-5 border-t border-slate-200 pt-6 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label
                htmlFor="booking-address"
                className="block text-sm font-medium text-slate-800"
              >
                Home Collection Address <span className="text-red-600">*</span>
              </label>
              <textarea
                id="booking-address"
                rows={2}
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (errors.address) setErrors((p) => ({ ...p, address: undefined }));
                }}
                placeholder="Flat/House No., Building, Street, Locality & Landmark"
                className={`mt-1.5 w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 ${
                  errors.address
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                    : 'border-slate-300 focus:border-brand-blue focus:ring-sky-100'
                }`}
              />
              {errors.address && (
                <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                  <AlertCircle className="h-3.5 w-3.5" /> {errors.address}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="booking-pincode"
                className="block text-sm font-medium text-slate-800"
              >
                Area Pincode <span className="text-red-600">*</span>
              </label>
              <input
                id="booking-pincode"
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => {
                  setPincode(e.target.value.replace(/\D/g, ''));
                  if (errors.pincode) setErrors((p) => ({ ...p, pincode: undefined }));
                }}
                placeholder="e.g. 411004"
                className={`mt-1.5 h-11 w-full rounded-lg border bg-white px-3.5 font-mono text-sm text-slate-900 focus:outline-none focus:ring-2 ${
                  errors.pincode
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                    : 'border-slate-300 focus:border-brand-blue focus:ring-sky-100'
                }`}
              />
              {errors.pincode && (
                <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                  <AlertCircle className="h-3.5 w-3.5" /> {errors.pincode}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            Frontend Demo Only · Data is stored locally in your browser via localStorage.
          </p>
          <button
            type="submit"
            className="inline-flex min-h-[46px] items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-brand-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-900"
          >
            <Calendar className="h-4 w-4" />
            Confirm Demo Booking
          </button>
        </div>
      </form>

      {/* Live Booking Summary Sidebar */}
      <aside className="space-y-6 lg:col-span-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
          <h3 className="text-lg font-bold text-slate-900">Booking Summary</h3>
          <p className="mt-1 text-xs text-slate-500">
            {collectionMode} · {preferredDate || 'Select date'}
          </p>

          <div className="mt-5 space-y-3 border-y border-slate-200 py-4 text-sm">
            {selectedPkg && (
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{selectedPkg.name}</p>
                  <p className="text-xs text-slate-500">
                    {selectedPkg.testCount} tests included
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">
                    ₹{selectedPkg.price.toLocaleString('en-IN')}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedPackageId('')}
                    aria-label={`Remove ${selectedPkg.name}`}
                    className="text-xs text-slate-400 hover:text-red-600"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {selectedTests.map((t) => (
              <div key={t.id} className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-800">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.sampleType}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-medium text-slate-900 tabular-nums">
                    ₹{t.price.toLocaleString('en-IN')}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleTest(t.id)}
                    aria-label={`Remove ${t.name}`}
                    className="text-xs text-slate-400 hover:text-red-600"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}

            {!selectedPkg && selectedTests.length === 0 && (
              <p className="text-xs text-slate-500">
                Select one or more tests or a health package to see your itemized estimate.
              </p>
            )}
          </div>

          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <dt>Tests &amp; Packages Subtotal</dt>
              <dd className="font-mono tabular-nums">
                ₹{subtotal.toLocaleString('en-IN')}
              </dd>
            </div>
            <div className="flex justify-between text-slate-600">
              <dt>Home Collection Fee</dt>
              <dd className="font-mono tabular-nums">
                {collectionMode === 'Lab Visit'
                  ? '₹0 (Walk-In)'
                  : homeCollectionFee === 0 && subtotal > 0
                  ? 'Free'
                  : `₹${homeCollectionFee}`}
              </dd>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-900">
              <dt>Total Payable (Demo)</dt>
              <dd className="font-mono text-brand-navy tabular-nums">
                ₹{totalAmount.toLocaleString('en-IN')}
              </dd>
            </div>
          </dl>

          {requiresFasting && (
            <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3.5 text-xs leading-relaxed text-amber-900">
              <strong className="font-semibold">Preparation Note:</strong> One or more
              selected tests require 8–12 hours of overnight fasting. Plain water is
              permitted. Actual instructions depend on physician guidance.
            </div>
          )}
        </div>

        {/* LocalStorage Saved Bookings History */}
        {savedBookings.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h4 className="text-sm font-bold text-slate-900">
              Recent Demo Bookings ({savedBookings.length})
            </h4>
            <p className="mt-0.5 text-xs text-slate-500">
              Saved locally in your browser
            </p>
            <ul className="mt-4 divide-y divide-slate-100">
              {savedBookings.map((b) => (
                <li key={b.referenceNumber} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-mono text-xs font-semibold text-brand-navy">
                        {b.referenceNumber}
                      </p>
                      <p className="truncate text-sm font-medium text-slate-800">
                        {b.patientName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {b.preferredDate} · {b.collectionMode} · ₹
                        {b.totalAmount.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteSaved(b.referenceNumber)}
                      aria-label={`Delete booking ${b.referenceNumber}`}
                      className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    </div>
  );
}
