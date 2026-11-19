import { useEffect, useState } from 'react';
import { AlertTriangle, FileCheck2, RefreshCw } from 'lucide-react';
import { ReportPreview } from '../components/ReportPreview';
import { useRouter } from '../context/RouterContext';
import { useToast } from '../context/ToastContext';
import { DEMO_PATIENTS, DEMO_REPORT_TEMPLATES } from '../data/labData';
import { DemoPatient, DemoReport } from '../types';
import { downloadDemoReportPdf } from '../utils/pdfReport';

const TEMPLATE_OPTIONS = [
  {
    key: 'master-health',
    label: 'Master Health Screening (CBC, Fasting Glucose & Cholesterol)',
  },
  {
    key: 'thyroid-vitamin',
    label: 'Thyroid Profile & Vitamins (T3, T4, TSH, Vitamin D, B12)',
  },
  {
    key: 'liver-kidney',
    label: 'Comprehensive Liver & Kidney Function Profile (LFT + KFT)',
  },
  {
    key: 'diabetes-care',
    label: 'Diabetes Care Profile (FBS, PPBS, HbA1c, eAG)',
  },
];

function buildGeneratedReport(
  patient: DemoPatient,
  templateKey: string,
  referringDoctor: string,
  collectionDate: string
): DemoReport {
  const tpl =
    DEMO_REPORT_TEMPLATES[templateKey] || DEMO_REPORT_TEMPLATES['master-health'];
  const codeSuffix = String(Math.floor(10000 + Math.random() * 89999));

  return {
    reportId: `LC-DEMO-${codeSuffix}`,
    patientId: patient.patientId,
    testTitle: tpl.title,
    department: tpl.department,
    sampleType: tpl.sampleType,
    sampleCollectionDate: collectionDate,
    reportDate: new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    referringDoctor: referringDoctor.trim() || 'Dr. Rohan Deshpande (MD Medicine - Demo)',
    sampleStatus: 'Accepted · Barcoded Specimen Verified',
    reportStatus: 'Completed',
    results: tpl.results,
    observations: tpl.observations,
    signatoryName: 'Dr. Ananya Deshmukh, MD (Pathology)',
    signatoryTitle: 'Chief Pathologist & Lab Director (Demo Signatory)',
    signatoryRegNo: 'MMC-DEMO-44910',
  };
}

export function ReportGenerationPage() {
  const { query } = useRouter();
  const { showToast } = useToast();

  const [selectedPatientId, setSelectedPatientId] = useState(
    DEMO_PATIENTS[0].patientId
  );
  const [selectedTemplateKey, setSelectedTemplateKey] = useState('master-health');
  const [referringDoctor, setReferringDoctor] = useState(
    'Dr. Rohan Deshpande (MD Medicine - Demo)'
  );
  const [collectionDate, setCollectionDate] = useState('19 Nov 2026, 07:30 AM');

  const [activePatient, setActivePatient] = useState<DemoPatient>(DEMO_PATIENTS[0]);
  const [activeReport, setActiveReport] = useState<DemoReport>(
    DEMO_PATIENTS[0].reports[0]
  );

  // Sync if user navigated from Patient Reports Portal with query params
  useEffect(() => {
    if (query.patient) {
      const pt = DEMO_PATIENTS.find((p) => p.patientId === query.patient);
      if (pt) {
        setSelectedPatientId(pt.patientId);
        setActivePatient(pt);
        const rep =
          pt.reports.find((r) => r.reportId === query.report) || pt.reports[0];
        if (rep) {
          setActiveReport(rep);
          setReferringDoctor(rep.referringDoctor);
          setCollectionDate(rep.sampleCollectionDate);
        }
      }
    }
  }, [query.patient, query.report]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const patient =
      DEMO_PATIENTS.find((p) => p.patientId === selectedPatientId) ||
      DEMO_PATIENTS[0];
    const generated = buildGeneratedReport(
      patient,
      selectedTemplateKey,
      referringDoctor,
      collectionDate
    );
    setActivePatient(patient);
    setActiveReport(generated);

    showToast(
      `Demo Report Generated (${generated.reportId})`,
      `${patient.name} · ${generated.testTitle}`,
      'success'
    );
  };

  const handleDownloadPdf = () => {
    downloadDemoReportPdf(activePatient, activeReport);
    showToast(
      'Watermarked Demo PDF Ready',
      `Saved LifeCare_DEMO_Report_${activeReport.reportId}.pdf`,
      'success'
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Header */}
      <section className="no-print border-b border-slate-200 bg-slate-50/70 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-xs font-semibold tracking-wide text-teal-700">
            Interactive Laboratory Report Studio · Client-Side PDF &amp; Print
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Demo Medical Report Generator
          </h1>
          <p className="mt-2.5 max-w-2xl text-base text-slate-600">
            Select a fictional patient and diagnostic test panel to preview a formatted
            pathology report, print directly, or export a watermarked PDF in your browser.
          </p>
        </div>
      </section>

      <section className="py-10 lg:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Mandatory Non-Clinical Notice */}
          <div className="no-print mb-8 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs leading-relaxed text-red-900">
            <AlertTriangle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-red-700" />
            <p>
              <strong className="font-semibold">
                STRICTLY FICTIONAL DEMO DATA:
              </strong>{' '}
              Every patient record, test result, reference range, and digital signature
              displayed below is simulated for frontend presentation only. Generated PDFs
              and printouts carry a permanent{' '}
              <span className="font-semibold">
                &ldquo;DEMO REPORT – NOT VALID FOR MEDICAL USE.&rdquo;
              </span>{' '}
              watermark.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-12">
            {/* Left Configuration Panel */}
            <aside className="no-print lg:col-span-4">
              <form
                onSubmit={handleGenerate}
                className="sticky top-24 space-y-5 rounded-xl border border-slate-200 bg-white p-6"
              >
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-bold text-slate-900">
                    Configure Demo Report
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Pick a demo patient and laboratory panel, then click Generate Demo
                    Report.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="gen-patient"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    1. Select Demo Patient
                  </label>
                  <select
                    id="gen-patient"
                    value={selectedPatientId}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-sky-100"
                  >
                    {DEMO_PATIENTS.map((pt) => (
                      <option key={pt.patientId} value={pt.patientId}>
                        {pt.name} ({pt.patientId} · {pt.age}y/{pt.gender})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="gen-panel"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    2. Select Demo Test Panel
                  </label>
                  <select
                    id="gen-panel"
                    value={selectedTemplateKey}
                    onChange={(e) => setSelectedTemplateKey(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-sky-100"
                  >
                    {TEMPLATE_OPTIONS.map((opt) => (
                      <option key={opt.key} value={opt.key}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="gen-doctor"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    3. Referring Doctor (Fictional)
                  </label>
                  <input
                    id="gen-doctor"
                    type="text"
                    value={referringDoctor}
                    onChange={(e) => setReferringDoctor(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-sky-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="gen-date"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    4. Sample Collection Timestamp
                  </label>
                  <input
                    id="gen-date"
                    type="text"
                    value={collectionDate}
                    onChange={(e) => setCollectionDate(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 font-mono text-sm text-slate-900 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-sky-100"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-brand-navy px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-900"
                >
                  <RefreshCw className="h-4 w-4" />
                  Generate Demo Report
                </button>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-600">
                  <p className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <FileCheck2 className="h-4 w-4 text-teal-600" />
                    Included in PDF &amp; Print Output
                  </p>
                  <p className="mt-1 leading-relaxed">
                    Laboratory masthead, patient demographics, tabular results with demo
                    reference ranges, observations, authorized signatory placeholder, and
                    diagonal DEMO watermark.
                  </p>
                </div>
              </form>
            </aside>

            {/* Right Live Printable Report Preview */}
            <div className="lg:col-span-8">
              <ReportPreview
                patient={activePatient}
                report={activeReport}
                onDownloadPdf={handleDownloadPdf}
                onPrint={handlePrint}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
