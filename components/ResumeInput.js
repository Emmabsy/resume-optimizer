'use client';
import { useState } from 'react';
import { Upload, FileText } from 'lucide-react';

export default function ResumeInput({ value, onChange, charCount }) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to parse file');
      }

      onChange(data.text);
    } catch (error) {
      alert('Error uploading file: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Your Current Resume
        </label>
        <span className="text-xs text-gray-400">{charCount} chars</span>
      </div>

      {/* File Upload Button */}
      <div className="mb-3">
        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 
                        bg-blue-50 hover:bg-blue-100 border border-blue-200 
                        rounded-lg transition-colors text-sm font-medium text-blue-700">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
          />
          {uploading ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload size={16} />
              <span>Upload PDF/Word</span>
            </>
          )}
        </label>
        <span className="ml-2 text-xs text-gray-500">or paste below</span>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your full resume text here or upload a file above...

Include all sections:
- Contact info
- Summary/Objective
- Work Experience
- Skills
- Education"
        className="flex-1 w-full p-4 border-2 border-gray-200 rounded-xl
                   focus:border-blue-500 focus:outline-none resize-none
                   text-sm leading-relaxed font-mono bg-gray-50
                   placeholder:text-gray-400 placeholder:font-sans"
      />
    </div>
  );
}