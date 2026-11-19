import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { LAB_INFO } from '../data/labData';
import { DemoPatient, DemoReport } from '../types';

export function downloadDemoReportPdf(patient: DemoPatient, report: DemoReport): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Top laboratory accent bar
  doc.setFillColor(12, 59, 102); // #0c3b66
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(LAB_INFO.name, 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`${LAB_INFO.addressLine1}, ${LAB_INFO.addressLine2}`, 14, 18);
  doc.text(`Phone: ${LAB_INFO.phone}  |  Email: ${LAB_INFO.reportDeskEmail}`, 14, 23);

  // Prominent DEMO notice bar directly below header
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(239, 68, 68);
  doc.rect(14, 32, pageWidth - 28, 9, 'FD');
  doc.setTextColor(185, 28, 28);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text(
    'DEMO REPORT - NOT VALID FOR MEDICAL USE OR CLINICAL DIAGNOSIS',
    pageWidth / 2,
    37.8,
    { align: 'center' }
  );

  // Patient & Report metadata grid
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.rect(14, 45, pageWidth - 28, 34, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8.5);

  const leftColX = 18;
  const rightColX = 110;
  let y = 51;

  const drawField = (x: number, yPos: number, label: string, value: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text(`${label}:`, x, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(value, x + 31, yPos);
  };

  drawField(leftColX, y, 'Patient Name', patient.name);
  drawField(rightColX, y, 'Report ID', report.reportId);
  y += 6;
  drawField(leftColX, y, 'Patient ID', patient.patientId);
  drawField(rightColX, y, 'Collected On', report.sampleCollectionDate);
  y += 6;
  drawField(leftColX, y, 'Age / Gender', `${patient.age} Years / ${patient.gender}`);
  drawField(rightColX, y, 'Reported On', report.reportDate);
  y += 6;
  drawField(leftColX, y, 'Referring Doctor', report.referringDoctor);
  drawField(rightColX, y, 'Sample Type', report.sampleType);
  y += 6;
  drawField(leftColX, y, 'Sample Status', report.sampleStatus);
  drawField(rightColX, y, 'Report Status', `${report.reportStatus} (Demo)`);

  // Report Section Heading
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(12, 59, 102);
  doc.text(report.testTitle, 14, 88);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Department: ${report.department}`, 14, 93);

  // Results Table via autoTable
  autoTable(doc, {
    startY: 97,
    head: [['Test Name', 'Result', 'Unit', 'Reference Range', 'Status']],
    body: report.results.map((row) => [
      row.testName,
      row.result,
      row.unit,
      row.referenceRange,
      row.flag || 'Normal',
    ]),
    theme: 'grid',
    headStyles: {
      fillColor: [12, 59, 102],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
      cellPadding: 3,
    },
    bodyStyles: {
      fontSize: 8.8,
      textColor: [15, 23, 42],
      cellPadding: 2.8,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 58, fontStyle: 'bold' },
      1: { cellWidth: 24, halign: 'right' },
      2: { cellWidth: 24 },
      3: { cellWidth: 52 },
      4: { cellWidth: 24 },
    },
    margin: { left: 14, right: 14 },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const finalY = ((doc as any).lastAutoTable?.finalY as number | undefined) ?? 175;
  let notesY = finalY + 10;

  // Clinical observations
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Test Observations & Pre-Analytical Notes (Demo):', 14, notesY);
  notesY += 5.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  report.observations.forEach((obs) => {
    const wrapped = doc.splitTextToSize(`• ${obs}`, pageWidth - 28);
    doc.text(wrapped, 14, notesY);
    notesY += wrapped.length * 4.5 + 1.5;
  });

  // Signatory block
  const sigY = Math.min(Math.max(notesY + 12, 226), pageHeight - 44);
  doc.setDrawColor(203, 213, 225);
  doc.line(14, sigY - 4, pageWidth - 14, sigY - 4);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(12, 59, 102);
  doc.text('Digitally Verified (Demo Placeholder)', pageWidth - 14, sigY + 3, {
    align: 'right',
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(report.signatoryName, pageWidth - 14, sigY + 9, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(report.signatoryTitle, pageWidth - 14, sigY + 13.5, { align: 'right' });
  doc.text(`Reg. No: ${report.signatoryRegNo}`, pageWidth - 14, sigY + 18, {
    align: 'right',
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('End of Demo Report', 14, sigY + 9);
  doc.setFont('helvetica', 'normal');
  doc.text(LAB_INFO.accreditationDemo, 14, sigY + 14);

  // Diagonal Watermark across the page
  doc.saveGraphicsState();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gState = new (doc as any).GState({ opacity: 0.14 });
  doc.setGState(gState);
  doc.setTextColor(185, 28, 28);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.text('DEMO REPORT - NOT VALID FOR MEDICAL USE', pageWidth / 2, pageHeight / 2, {
    align: 'center',
    angle: 42,
  });
  doc.restoreGraphicsState();

  // Footer disclaimer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  const disclaimer =
    'DISCLAIMER: All patient information, laboratory results, reference ranges, and signatory details in this PDF are entirely fictional demonstration data. Never use this document for clinical evaluation, medical diagnosis, or treatment.';
  const wrappedDisc = doc.splitTextToSize(disclaimer, pageWidth - 28);
  doc.text(wrappedDisc, 14, pageHeight - 16);

  doc.save(`LifeCare_DEMO_Report_${report.reportId}.pdf`);
}
