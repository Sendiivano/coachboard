import type { RefObject } from 'react';
import { useState } from 'react';
import { jsPDF } from 'jspdf';
import type Konva from 'konva';
// Button not needed — using native select dropdown for export actions

interface ExportControlsProps {
  stageRef: RefObject<Konva.Stage | null>;
  teamName: string;
}

const EXPORT_PIXEL_RATIO = 2;

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

export function ExportControls({ stageRef, teamName }: ExportControlsProps) {
  function handleExportPng() {
    const stage = stageRef.current;
    if (!stage) return;
    const dataUrl = stage.toDataURL({ pixelRatio: EXPORT_PIXEL_RATIO });
    downloadDataUrl(dataUrl, `${teamName}-formation.png`);
  }

  function handleExportPdf() {
    const stage = stageRef.current;
    if (!stage) return;
    const dataUrl = stage.toDataURL({ pixelRatio: EXPORT_PIXEL_RATIO });

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [stage.width(), stage.height()],
    });
    pdf.addImage(dataUrl, 'PNG', 0, 0, stage.width(), stage.height());
    pdf.save(`${teamName}-formation.pdf`);
  }

  const [value, setValue] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const v = e.target.value;
    setValue(v);
    if (v === 'png') handleExportPng();
    if (v === 'pdf') handleExportPdf();
    // reset to placeholder shortly after selection
    setTimeout(() => setValue(''), 120);
  }

  return (
    <div className="flex gap-2">
      <select
        value={value}
        onChange={handleChange}
        aria-label="Export formation"
        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-slate-50 focus:outline-none cursor-pointer"
      >
        <option value="" disabled>
          Export
        </option>
        <option value="png">Export PNG</option>
        <option value="pdf">Export PDF</option>
      </select>
    </div>
  );
}