import { useState } from 'react';
import { AlertTriangle, ArrowRight, X } from 'lucide-react';
import { FAQAccordion } from '../components/FAQAccordion';
import { ReportPreview } from '../components/ReportPreview';
import { ReportSearch } from '../components/ReportSearch';
import { SectionHeading } from '../components/SectionHeading';
import { useRouter } from '../context/RouterContext';
import { useToast } from '../context/ToastContext';
import { DEMO_PATIENTS, FAQS } from '../data/labData';
import { DemoPatient, DemoReport } from '../types';
import { downloadDemoReportPdf } from '../utils/pdfReport';

export function PatientReportsPage() {
  const { navigate } = useRouter();
  const { showToast } = useToast();
  const [previewTarget, setPreviewTarget] = useState<{
    patient: DemoPatient;
    report: DemoReport;
  } | null>(null);

  const reportFaqs = FAQS.filter(
    (f) => f.category === 'Reports' || f.category === 'General'
  );

  const handleDownload = (patient: DemoPatient, report: DemoReport) => {
    downloadDemoReportPdf(patient, report);
    showToast(
      'Demo PDF Downloaded',
      `LifeCare_DEMO_Report_${report.reportId}.pdf saved.`,
      'success'
    );
  };

  return (
    <div>
      {/* Header */}
      <section className="no-print border-b border-slate-200 bg-slate-50/70 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-wide text-teal-700">
                Online Report Access · Fictional Demo Records
              </p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Patient Reports Portal
              </h1>
              <p className="mt-3 text-base text-slate-600">
                Look up fictional demonstration patient reports using Patient ID, Mobile
                Number, or Report ID. Inspect status (Completed, Processing, Pending) and
                download watermarked sample PDF reports.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/report-generator')}
              className="inline-flex min-h-[44px] items-center gap-2 self-start whitespace-nowrap rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-800 lg:self-auto"
            >
              Open Demo Report Generator
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Main Lookup Interface */}
      <section className="py-10 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Explicit Demo Disclaimer Banner */}
          <div className="no-print mb-8 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-950">
            <AlertTriangle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-700" />
            <p>
              <strong className="font-semibold">
                DEMO / NOT FOR CLINICAL USE:
              </strong>{' '}
              All records below belong to fictional demo patients for frontend evaluation.
              No real patient database or clinical laboratory server is connected.
            </p>
          </div>

          <div className="no-print">
            <ReportSearch
              onSelectPreview={(patient, report) =>
                setPreviewTarget({ patient, report })
              }
            />
          </div>

          {/* Inline Report Preview Drawer/Section when user clicks View Report */}
          {previewTarget && (
            <div className="mt-10 border-t border-slate-200 pt-10">
              <div className="no-print mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">
                  Selected Demo Report Preview
                </h2>
                <button
                  type="button"
                  onClick={() => setPreviewTarget(null)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <X className="h-4 w-4" />
                  Close Preview
                </button>
              </div>
              <ReportPreview
                patient={previewTarget.patient}
                report={previewTarget.report}
                onDownloadPdf={() =>
                  handleDownload(previewTarget.patient, previewTarget.report)
                }
                onPrint={() => window.print()}
              />
            </div>
          )}

          {/* Reference Guide of Demo Records */}
          <div className="no-print mt-12 rounded-xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-base font-bold text-slate-900">
              Sample Demo Credentials for Testing Search
            </h2>
            <p className="mt-1 text-xs text-slate-600">
              Use any of these fictional Patient IDs, mobile numbers, or Report IDs in the
              search inputs above.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2 pr-4 font-semibold">Patient Name</th>
                    <th className="py-2 pr-4 font-semibold">Patient ID</th>
                    <th className="py-2 pr-4 font-semibold">Mobile</th>
                    <th className="py-2 font-semibold">Sample Report IDs &amp; Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  {DEMO_PATIENTS.map((pt) => (
                    <tr key={pt.patientId}>
                      <td className="py-2.5 pr-4 font-medium text-slate-900">
                        {pt.name}
                      </td>
                      <td className="py-2.5 pr-4 font-mono">{pt.patientId}</td>
                      <td className="py-2.5 pr-4 font-mono">{pt.mobile}</td>
                      <td className="py-2.5 font-mono">
                        {pt.reports
                          .map((r) => `${r.reportId} (${r.reportStatus})`)
                          .join(' · ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Report FAQs */}
      <section className="no-print border-t border-slate-200 bg-slate-50/70 py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionHeading
            align="center"
            eyebrow="Report Support"
            title="Questions About Patient Reports"
          />
          <div className="mt-8">
            <FAQAccordion items={reportFaqs} />
          </div>
        </div>
      </section>
    </div>
  );
}
