import { ReportParameterRow } from '../types';

interface ReportTableProps {
  rows: ReportParameterRow[];
}

export function ReportTable({ rows }: ReportTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-100 text-xs font-semibold text-slate-700">
            <th scope="col" className="px-4 py-3">
              Test Name
            </th>
            <th scope="col" className="px-4 py-3 text-right">
              Result
            </th>
            <th scope="col" className="px-4 py-3">
              Unit
            </th>
            <th scope="col" className="px-4 py-3">
              Reference Range
            </th>
            <th scope="col" className="px-4 py-3">
              Indicator
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {rows.map((row) => (
            <tr key={row.testName} className="hover:bg-slate-50/70">
              <td className="px-4 py-3">
                <p className="font-semibold text-slate-900">{row.testName}</p>
                {row.method && (
                  <p className="text-xs text-slate-500">Method: {row.method}</p>
                )}
              </td>
              <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                {row.result}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-slate-600">
                {row.unit}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-slate-700 tabular-nums">
                {row.referenceRange}
              </td>
              <td className="px-4 py-3 text-xs font-semibold">
                <span
                  className={
                    row.flag === 'Borderline' || row.flag === 'Attention'
                      ? 'text-amber-700'
                      : 'text-teal-700'
                  }
                >
                  {row.flag || 'Normal'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
