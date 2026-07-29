import type { RefObject } from 'react';
import { jsPDF } from 'jspdf';
import type Konva from 'konva';
import { Button } from '@/components/ui/Button';

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

  return (
    <div className="flex gap-2">
      <Button variant="secondary" onClick={handleExportPng}>
        Export PNG
      </Button>
      <Button variant="secondary" onClick={handleExportPdf}>
        Export PDF
      </Button>
    </div>
  );
}