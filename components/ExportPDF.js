'use client';
import { useState } from 'react';
import { Download } from 'lucide-react';

export default function ExportPDF({ content }) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);

    const html2pdf = (await import('html2pdf.js')).default;
    const element = document.getElementById('optimized-resume');

    const options = {
      margin: [0.75, 0.75, 0.75, 0.75],
      filename: 'optimized-resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    await html2pdf().set(options).from(element).save();
    setLoading(false);
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-2 px-5 py-2.5
                 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300
                 text-white font-semibold text-sm rounded-xl
                 transition-colors shadow-sm"
    >
      <Download size={16} />
      {loading ? 'Exporting...' : 'Export PDF'}
    </button>
  );
}