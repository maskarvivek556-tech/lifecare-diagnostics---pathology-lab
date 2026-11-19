import { Download, Printer, AlertTriangle } from 'lucide-react';
import { LAB_INFO } from '../data/labData';
import { DemoPatient, DemoReport } from '../types';
import { ReportTable } from './ReportTable';

interface ReportPreviewProps {
  patient: DemoPatient;
  report: DemoReport;
  onDownloadPdf: () => void;
  onPrint: () => void;
}

export function ReportPreview({
  patient,
  report,
  onDownloadPdf,
  onPrint,
}: ReportPreviewProps) {
  return (
    <div className="space-y-4">
      {/* Action Bar above Report */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3.5">
        <div className="text-xs text-slate-600">
          <span className="font-semibold text-slate-900">Active Report Preview:</span>{' '}
          <span className="font-mono">{report.reportId}</span> · {patient.name}
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onPrint}
            className="inline-flex min-h-[40px] items-center gap-2 whitespace-nowrap rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-100"
          >
            <Printer className="h-4 w-4" />
            Print Report
          </button>
          <button
            type="button"
            onClick={onDownloadPdf}
            className="inline-flex min-h-[40px] items-center gap-2 whitespace-nowrap rounded-lg bg-brand-navy px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-sky-900"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Printable Laboratory Report Document */}
      <div className="print-only-report relative overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm">
        {/* Visible Diagonal Watermark explicitly required by prompt */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-hidden select-none"
        >
          <p className="-rotate-30 whitespace-nowrap text-center font-display text-2xl font-extrabold tracking-widest text-red-600/12 sm:text-4xl">
            DEMO REPORT – NOT VALID FOR MEDICAL USE.
          </p>
        </div>

        {/* Report Header Banner */}
        <div className="relative z-20 border-b-2 border-brand-navy bg-brand-navy px-6 py-5 text-white sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="font-display text-xl font-bold tracking-tight text-white">
                {LAB_INFO.name}
              </h3>
              <p className="mt-1 text-xs text-sky-100">
                {LAB_INFO.addressLine1}, {LAB_INFO.addressLine2}
              </p>
              <p className="mt-0.5 text-xs text-sky-200">
                Phone: {LAB_INFO.phone} · Email: {LAB_INFO.reportDeskEmail}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="font-mono text-xs font-semibold text-teal-300">
                LABORATORY TEST REPORT (DEMO)
              </p>
              <p className="mt-1 font-mono text-sm font-bold text-white">
                ID: {report.reportId}
              </p>
              <p className="mt-0.5 text-xs text-sky-200">
                {LAB_INFO.accreditationDemo}
              </p>
            </div>
          </div>
        </div>

        {/* Mandatory Prominent Demo Warning Strip */}
        <div className="relative z-20 flex items-center justify-center gap-2 border-b border-red-200 bg-red-50 px-4 py-2 text-center text-xs font-bold tracking-wide text-red-800">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>DEMO REPORT – NOT VALID FOR MEDICAL USE. FICTIONAL DATA ONLY.</span>
        </div>

        {/* Document Body */}
        <div className="relative z-20 p-6 sm:p-8">
          {/* Patient & Sample Details Grid */}
          <div className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50/80 p-4 text-xs sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-slate-500">Patient Name</p>
              <p className="mt-0.5 font-semibold text-slate-900">{patient.name}</p>
            </div>
            <div>
              <p className="text-slate-500">Patient ID</p>
              <p className="mt-0.5 font-mono font-semibold text-slate-900">
                {patient.patientId}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Age / Gender</p>
              <p className="mt-0.5 font-semibold text-slate-900">
                {patient.age} Years / {patient.gender}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Report ID</p>
              <p className="mt-0.5 font-mono font-semibold text-brand-navy">
                {report.reportId}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Sample Collection Date</p>
              <p className="mt-0.5 font-medium text-slate-900">
                {report.sampleCollectionDate}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Report Date</p>
              <p className="mt-0.5 font-medium text-slate-900">{report.reportDate}</p>
            </div>
            <div>
              <p className="text-slate-500">Referring Doctor</p>
              <p className="mt-0.5 font-medium text-slate-900">
                {report.referringDoctor}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Sample Type</p>
              <p className="mt-0.5 font-medium text-slate-900">{report.sampleType}</p>
            </div>
          </div>

          {/* Sample & Report Status Row */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4 text-xs text-slate-600">
            <div>
              <span className="font-semibold text-slate-800">Department:</span>{' '}
              {report.department}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>
                <strong className="text-slate-800">Sample Status:</strong>{' '}
                {report.sampleStatus}
              </span>
              <span>
                <strong className="text-slate-800">Report Status:</strong>{' '}
                <span className="font-semibold text-teal-700">
                  {report.reportStatus} (Demo)
                </span>
              </span>
            </div>
          </div>

          {/* Panel Heading */}
          <div className="mt-6 mb-4">
            <h4 className="text-lg font-bold text-slate-900">{report.testTitle}</h4>
          </div>

          {/* Results Table */}
          <ReportTable rows={report.results} />

          {/* Test Observations */}
          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50/60 p-4">
            <h5 className="text-xs font-bold text-slate-900">
              Test Observations &amp; Clinical Notes (Fictional Demo)
            </h5>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs leading-relaxed text-slate-600">
              {report.observations.map((obs) => (
                <li key={obs}>{obs}</li>
              ))}
            </ul>
          </div>

          {/* Authorized Signatory & Vector Digital Signature Placeholder */}
          <div className="mt-8 flex flex-col justify-between gap-6 border-t border-slate-200 pt-6 sm:flex-row sm:items-end">
            <div className="max-w-md text-[11px] leading-relaxed text-slate-500">
              <p className="font-semibold text-slate-700">Laboratory Disclaimer</p>
              <p className="mt-1">
                All patient details, laboratory values, demo reference ranges, and
                signatures presented in this report are entirely fictional demonstration
                content generated in the browser. Never interpret or rely on these values
                for clinical care or diagnosis.
              </p>
            </div>

            <div className="shrink-0 text-left sm:text-right">
              {/* Stylized Vector Digital Signature Placeholder */}
              <div className="mb-1 inline-block">
                <svg
                  width="150"
                  height="38"
                  viewBox="0 0 150 38"
                  fill="none"
                  aria-label="Digital signature placeholder"
                  className="text-brand-navy"
                >
                  <path
                    d="M8 29C18 12 28 8 33 22C37 31 44 10 53 16C61 21 66 26 75 18C84 10 92 27 104 20C115 13 128 17 142 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 33H126"
                    stroke="currentColor"
                    strokeOpacity="0.3"
                    strokeWidth="1"
                  />
                </svg>
              </div>
              <p className="text-xs font-bold text-slate-900">{report.signatoryName}</p>
              <p className="text-[11px] text-slate-600">{report.signatoryTitle}</p>
              <p className="font-mono text-[11px] text-slate-500">
                Reg. No: {report.signatoryRegNo} · Authorized Signatory (Demo)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
