'use client';

export default function ResumeInput({ value, onChange, charCount }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Your Current Resume
        </label>
        <span className="text-xs text-gray-400">{charCount} chars</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your full resume text here...

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