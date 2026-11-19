import { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Phone,
  Send,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { LAB_INFO } from '../data/labData';

interface ContactErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export function ContactPage() {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Test & Package Inquiry');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: ContactErrors = {};
    if (name.trim().length < 2) next.name = 'Please enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = 'Please enter a valid email address.';
    }
    if (phone.replace(/\D/g, '').length !== 10) {
      next.phone = 'Please enter a valid 10-digit mobile number.';
    }
    if (message.trim().length < 10) {
      next.message = 'Please share a brief message (at least 10 characters).';
    }

    setErrors(next);
    if (Object.keys(next).length > 0) {
      showToast('Check enquiry form fields', 'Please fill in the required fields.', 'error');
      return;
    }

    setSubmitted(true);
    showToast(
      'Demo Enquiry Recorded',
      'Thank you! This frontend demo form does not transmit to an external server.',
      'success'
    );
  };

  return (
    <div>
      {/* Page Header */}
      <section className="border-b border-slate-200 bg-slate-50/70 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-xs font-semibold tracking-wide text-teal-700">
            Patient Support &amp; Central Laboratory Desk
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Contact LifeCare Diagnostics
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-600">
            Reach out for test preparation questions, corporate preventive checkup
            enquiries, or doorstep home collection availability.
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-12">
            {/* Contact Information & Visual Map Placeholder */}
            <div className="space-y-6 lg:col-span-5">
              <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
                <h2 className="text-xl font-bold text-slate-900">
                  Central Laboratory Details
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Fictional demonstration address &amp; contact desk
                </p>

                <dl className="mt-6 space-y-5 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
                    <div>
                      <dt className="font-semibold text-slate-900">Laboratory Address</dt>
                      <dd className="mt-0.5 text-slate-600">
                        {LAB_INFO.addressLine1}
                        <br />
                        {LAB_INFO.addressLine2}
                      </dd>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
                    <div>
                      <dt className="font-semibold text-slate-900">Phone &amp; Helpline</dt>
                      <dd className="mt-0.5 font-mono text-slate-600">
                        {LAB_INFO.phone}
                        <br />
                        {LAB_INFO.helpline}
                      </dd>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
                    <div>
                      <dt className="font-semibold text-slate-900">Email Addresses</dt>
                      <dd className="mt-0.5 text-slate-600">
                        General: {LAB_INFO.email}
                        <br />
                        Reports: {LAB_INFO.reportDeskEmail}
                      </dd>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
                    <div>
                      <dt className="font-semibold text-slate-900">Working Hours</dt>
                      <dd className="mt-0.5 text-slate-600">
                        Walk-In Lab: {LAB_INFO.workingHours}
                        <br />
                        Home Collection: {LAB_INFO.homeCollectionHours}
                      </dd>
                    </div>
                  </div>
                </dl>

                {/* Social Links */}
                <div className="mt-6 border-t border-slate-100 pt-5">
                  <p className="text-xs font-semibold text-slate-700">
                    Connect With Us (Demo Links)
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold text-brand-navy">
                    <a
                      href="#/contact"
                      onClick={(e) => {
                        e.preventDefault();
                        showToast('Demo Social Link', 'Facebook page preview (demo).', 'info');
                      }}
                      className="rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50"
                    >
                      Facebook
                    </a>
                    <a
                      href="#/contact"
                      onClick={(e) => {
                        e.preventDefault();
                        showToast('Demo Social Link', 'Instagram profile preview (demo).', 'info');
                      }}
                      className="rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50"
                    >
                      Instagram
                    </a>
                    <a
                      href="#/contact"
                      onClick={(e) => {
                        e.preventDefault();
                        showToast('Demo Social Link', 'LinkedIn clinical page preview (demo).', 'info');
                      }}
                      className="rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50"
                    >
                      LinkedIn
                    </a>
                    <a
                      href="#/contact"
                      onClick={(e) => {
                        e.preventDefault();
                        showToast('Demo Social Link', 'YouTube health channel preview (demo).', 'info');
                      }}
                      className="rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50"
                    >
                      YouTube
                    </a>
                  </div>
                </div>
              </div>

              {/* Clean Architectural Map-Style Visual Placeholder (No Real Map API) */}
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 bg-slate-50 px-5 py-3">
                  <p className="text-xs font-semibold text-slate-800">
                    Location Schematic (Visual Placeholder · No Live Map API)
                  </p>
                </div>
                <div className="relative bg-slate-100 p-4">
                  <svg
                    viewBox="0 0 420 220"
                    className="h-52 w-full rounded-lg bg-slate-50"
                    role="img"
                    aria-label="Schematic location map of fictional LifeCare Diagnostics center at Health Square, Sector 18"
                  >
                    {/* Subtle street grid */}
                    <rect width="420" height="220" fill="#F8FAFC" />
                    <path d="M0 60 H420" stroke="#E2E8F0" strokeWidth="10" />
                    <path d="M0 155 H420" stroke="#E2E8F0" strokeWidth="8" />
                    <path d="M95 0 V220" stroke="#E2E8F0" strokeWidth="10" />
                    <path d="M275 0 V220" stroke="#CBD5E1" strokeWidth="14" />
                    {/* Park block */}
                    <rect
                      x="118"
                      y="78"
                      width="130"
                      height="62"
                      rx="8"
                      fill="#ECFDF5"
                      stroke="#A7F3D0"
                    />
                    <text
                      x="183"
                      y="112"
                      textAnchor="middle"
                      fontSize="10"
                      fill="#047857"
                      fontFamily="sans-serif"
                    >
                      Civic Health Park
                    </text>
                    {/* Road Labels */}
                    <text x="16" y="53" fontSize="9" fill="#64748B" fontFamily="sans-serif">
                      Sector 18 Main Road
                    </text>
                    <text
                      x="286"
                      y="30"
                      fontSize="9"
                      fill="#475569"
                      fontFamily="sans-serif"
                    >
                      Medical Arcade Ave
                    </text>
                    {/* Center Pin */}
                    <circle cx="275" cy="110" r="18" fill="#0C3B66" fillOpacity="0.14" />
                    <circle cx="275" cy="110" r="7" fill="#0C3B66" />
                    <circle cx="275" cy="110" r="3" fill="#FFFFFF" />
                    {/* Callout Card */}
                    <rect
                      x="292"
                      y="86"
                      width="116"
                      height="48"
                      rx="6"
                      fill="#FFFFFF"
                      stroke="#CBD5E1"
                    />
                    <text
                      x="300"
                      y="104"
                      fontSize="9.5"
                      fontWeight="700"
                      fill="#0F172A"
                      fontFamily="sans-serif"
                    >
                      LifeCare Diagnostics
                    </text>
                    <text
                      x="300"
                      y="118"
                      fontSize="8.5"
                      fill="#475569"
                      fontFamily="sans-serif"
                    >
                      Plot 42, Health Square
                    </text>
                    <text
                      x="300"
                      y="129"
                      fontSize="8"
                      fill="#0D9488"
                      fontFamily="sans-serif"
                    >
                      Parking &amp; Wheelchair Access
                    </text>
                  </svg>
                </div>
              </div>
            </div>

            {/* Contact Enquiry Form */}
            <div className="lg:col-span-7">
              <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
                <h2 className="text-xl font-bold text-slate-900">
                  Send an Enquiry (Frontend Demo)
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Have a question about test preparation, home collection areas, or report
                  timings? Fill out the form below.
                </p>

                {submitted ? (
                  <div className="mt-6 rounded-xl border border-teal-200 bg-teal-50/60 p-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-teal-700" />
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          Enquiry Received (Demo Confirmation)
                        </h3>
                        <p className="mt-1.5 text-sm text-slate-700">
                          Thank you, <strong>{name}</strong>. Your message regarding{' '}
                          <strong>{subject}</strong> has been validated in this frontend
                          demo. No external email or server request was sent.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setSubmitted(false);
                            setName('');
                            setEmail('');
                            setPhone('');
                            setMessage('');
                          }}
                          className="mt-5 min-h-[42px] rounded-lg bg-brand-navy px-4 py-2 text-xs font-semibold text-white hover:bg-sky-900"
                        >
                          Submit Another Enquiry
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="block text-sm font-medium text-slate-800"
                        >
                          Full Name <span className="text-red-600">*</span>
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
                          }}
                          placeholder="Your full name"
                          className={`mt-1.5 h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-slate-900 focus:outline-none focus:ring-2 ${
                            errors.name
                              ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                              : 'border-slate-300 focus:border-brand-blue focus:ring-sky-100'
                          }`}
                        />
                        {errors.name && (
                          <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                            <AlertCircle className="h-3.5 w-3.5" /> {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="contact-phone"
                          className="block text-sm font-medium text-slate-800"
                        >
                          Mobile Number <span className="text-red-600">*</span>
                        </label>
                        <input
                          id="contact-phone"
                          type="tel"
                          maxLength={10}
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value.replace(/\D/g, ''));
                            if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }));
                          }}
                          placeholder="10-digit mobile number"
                          className={`mt-1.5 h-11 w-full rounded-lg border bg-white px-3.5 font-mono text-sm text-slate-900 focus:outline-none focus:ring-2 ${
                            errors.phone
                              ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                              : 'border-slate-300 focus:border-brand-blue focus:ring-sky-100'
                          }`}
                        />
                        {errors.phone && (
                          <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                            <AlertCircle className="h-3.5 w-3.5" /> {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="contact-email"
                          className="block text-sm font-medium text-slate-800"
                        >
                          Email Address <span className="text-red-600">*</span>
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                          }}
                          placeholder="you@example.com"
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

                      <div>
                        <label
                          htmlFor="contact-subject"
                          className="block text-sm font-medium text-slate-800"
                        >
                          Enquiry Topic
                        </label>
                        <select
                          id="contact-subject"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-sky-100"
                        >
                          <option value="Test & Package Inquiry">
                            Test &amp; Package Inquiry
                          </option>
                          <option value="Home Sample Collection">
                            Home Sample Collection
                          </option>
                          <option value="Patient Report Assistance">
                            Patient Report Assistance
                          </option>
                          <option value="Corporate Wellness Screening">
                            Corporate Wellness Screening
                          </option>
                          <option value="Physician Reference Partnership">
                            Physician Reference Partnership
                          </option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block text-sm font-medium text-slate-800"
                      >
                        Message <span className="text-red-600">*</span>
                      </label>
                      <textarea
                        id="contact-message"
                        rows={5}
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value);
                          if (errors.message)
                            setErrors((p) => ({ ...p, message: undefined }));
                        }}
                        placeholder="Share test names, preferred collection locality, or questions..."
                        className={`mt-1.5 w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 ${
                          errors.message
                            ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                            : 'border-slate-300 focus:border-brand-blue focus:ring-sky-100'
                        }`}
                      />
                      {errors.message && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                          <AlertCircle className="h-3.5 w-3.5" /> {errors.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs text-slate-500">
                        Frontend demonstration form · No backend server submission.
                      </p>
                      <button
                        type="submit"
                        className="inline-flex min-h-[46px] items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-brand-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-900"
                      >
                        <Send className="h-4 w-4" />
                        Send Enquiry
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
