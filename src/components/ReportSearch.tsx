import { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileText,
  Hourglass,
  Search,
} from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useToast } from '../context/ToastContext';
import { DEMO_PATIENTS } from '../data/labData';
import { DemoPatient, DemoReport } from '../types';
import { downloadDemoReportPdf } from '../utils/pdfReport';

interface ReportSearchProps {
  onSelectPreview?: (patient: DemoPatient, report: DemoReport) => void;
}

export function ReportSearch({ onSelectPreview }: ReportSearchProps) {
  const { navigate } = useRouter();
  const { showToast } = useToast();

  const [patientId, setPatientId] = useState('');
  const [mobile, setMobile] = useState('');
  const [reportId, setReportId] = useState('');
  const [searched, setSearched] = useState(false);
  const [matchedPatient, setMatchedPatient] = useState<DemoPatient | null>(
    DEMO_PATIENTS[0]
  );

  const performLookup = (pId: string, mob: string, rId: string) => {
    const normPid = pId.trim().toLowerCase();
    const normMob = mob.replace(/\D/g, '');
    const normRid = rId.trim().toLowerCase();

    if (!normPid && !normMob && !normRid) {
      showToast(
        'Enter at least one search field',
        'Provide a Demo Patient ID, Mobile Number, or Report ID.',
        'error'
      );
      return;
    }

    const found = DEMO_PATIENTS.find((pt) => {
      const pidMatch = normPid ? pt.patientId.toLowerCase() === normPid : false;
      const mobMatch = normMob ? pt.mobile === normMob : false;
      const ridMatch = normRid
        ? pt.reports.some((r) => r.reportId.toLowerCase() === normRid)
        : false;
      return pidMatch || mobMatch || ridMatch;
    });

    setSearched(true);
    setMatchedPatient(found || null);

    if (found) {
      showToast(
        'Demo patient record loaded',
        `Displaying ${found.reports.length} sample report(s) for ${found.name}.`,
        'success'
      );
    } else {
      showToast(
        'No matching demo record found',
        'Try one of the predefined sample patient records listed below.',
        'info'
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLookup(patientId, mobile, reportId);
  };

  const handleQuickFill = (pt: DemoPatient) => {
    setPatientId(pt.patientId);
    setMobile(pt.mobile);
    setReportId(pt.reports[0]?.reportId || '');
    setMatchedPatient(pt);
    setSearched(true);
  };

  const handleDownload = (patient: DemoPatient, report: DemoReport) => {
    downloadDemoReportPdf(patient, report);
    showToast(
      'Demo PDF Downloaded',
      `LifeCare_DEMO_Report_${report.reportId}.pdf saved to your device.`,
      'success'
    );
  };

  const handleView = (patient: DemoPatient, report: DemoReport) => {
    if (onSelectPreview) {
      onSelectPreview(patient, report);
    } else {
      navigate(
        `/report-generator?patient=${encodeURIComponent(
          patient.patientId
        )}&report=${encodeURIComponent(report.reportId)}`
      );
    }
  };

  const renderStatus = (status: DemoReport['reportStatus']) => {
    if (status === 'Completed') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700">
          <CheckCircle2 className="h-4 w-4" />
          Completed
        </span>
      );
    }
    if (status === 'Processing') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700">
          <Clock className="h-4 w-4" />
          Processing
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700">
        <Hourglass className="h-4 w-4" />
        Pending
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Search Card */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Search Demo Patient Reports
            </h3>
            <p className="text-sm text-slate-600">
              Enter any one field below (Patient ID, Mobile Number, or Report ID) to inspect
              fictional demonstration records.
            </p>
          </div>
          <p className="font-mono text-xs font-semibold text-red-700">
            DEMO / NOT FOR CLINICAL USE
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div>
            <label
              htmlFor="rpt-patient-id"
              className="block text-xs font-semibold text-slate-700"
            >
              Patient ID
            </label>
            <input
              id="rpt-patient-id"
              type="text"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="e.g. LC-PT-1042"
              className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 font-mono text-sm text-slate-900 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div>
            <label
              htmlFor="rpt-mobile"
              className="block text-xs font-semibold text-slate-700"
            >
              Registered Mobile Number
            </label>
            <input
              id="rpt-mobile"
              type="tel"
              maxLength={10}
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
              placeholder="e.g. 9876543210"
              className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 font-mono text-sm text-slate-900 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div>
            <label
              htmlFor="rpt-report-id"
              className="block text-xs font-semibold text-slate-700"
            >
              Report ID
            </label>
            <input
              id="rpt-report-id"
              type="text"
              value={reportId}
              onChange={(e) => setReportId(e.target.value)}
              placeholder="e.g. LC-RPT-88412"
              className="mt-1.5 h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 font-mono text-sm text-slate-900 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-sky-100"
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
          {/* Quick-Select Demo Patient Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500">
              Try sample demo records:
            </span>
            {DEMO_PATIENTS.map((pt) => (
              <button
                key={pt.patientId}
                type="button"
                onClick={() => handleQuickFill(pt)}
                className={`rounded-md border px-2.5 py-1.5 font-mono text-xs transition-colors ${
                  matchedPatient?.patientId === pt.patientId
                    ? 'border-brand-navy bg-sky-50 font-semibold text-brand-navy'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                }`}
              >
                {pt.patientId}
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap rounded-lg bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-900"
          >
            <Search className="h-4 w-4" />
            Search Report
          </button>
        </div>
      </form>

      {/* Search Result Display */}
      {matchedPatient ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold text-teal-700">
                Fictional Patient Record · Demo Preview
              </p>
              <h3 className="mt-1 text-xl font-bold text-slate-900">
                {matchedPatient.name}
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Patient ID:{' '}
                <span className="font-mono font-semibold text-slate-900">
                  {matchedPatient.patientId}
                </span>{' '}
                · {matchedPatient.age} Years · {matchedPatient.gender} · Mobile:{' '}
                <span className="font-mono">+91 {matchedPatient.mobile}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/report-generator')}
              className="inline-flex min-h-[40px] items-center gap-2 self-start whitespace-nowrap rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 sm:self-center"
            >
              <FileText className="h-4 w-4" />
              Open Full Report Generator
            </button>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                  <th className="px-4 py-3">Report ID</th>
                  <th className="px-4 py-3">Test / Panel Name</th>
                  <th className="px-4 py-3">Collection Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {matchedPatient.reports.map((rep) => (
                  <tr key={rep.reportId} className="hover:bg-slate-50/70">
                    <td className="px-4 py-4 font-mono text-xs font-semibold text-brand-navy">
                      {rep.reportId}
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-900">{rep.testTitle}</p>
                      <p className="text-xs text-slate-500">
                        {rep.department} · {rep.sampleType}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-600">
                      {rep.sampleCollectionDate}
                    </td>
                    <td className="px-4 py-4">{renderStatus(rep.reportStatus)}</td>
                    <td className="px-4 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleView(matchedPatient, rep)}
                          className="inline-flex min-h-[36px] items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-100"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View Report
                        </button>
                        <button
                          type="button"
                          disabled={rep.reportStatus !== 'Completed'}
                          onClick={() => handleDownload(matchedPatient, rep)}
                          className="inline-flex min-h-[36px] items-center gap-1.5 whitespace-nowrap rounded-lg bg-brand-navy px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-sky-900 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Download Report
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        searched && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-base font-semibold text-slate-900">
              No fictional patient record matched your search criteria.
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Try Patient IDs <span className="font-mono font-semibold">LC-PT-1042</span>,{' '}
              <span className="font-mono font-semibold">LC-PT-2089</span>,{' '}
              <span className="font-mono font-semibold">LC-PT-3115</span>, or click one of
              the quick demo buttons above.
            </p>
          </div>
        )
      )}
    </div>
  );
}
