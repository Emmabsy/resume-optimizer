'use client';

export default function JobInput({ value, onChange }) {
  return (
    <div className="flex flex-col h-full">
      <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
        Job Description
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the full job description here...

Copy everything from the job posting:
- Job title & company
- Responsibilities
- Required qualifications
- Preferred skills"
        className="flex-1 w-full p-4 border-2 border-gray-200 rounded-xl
                   focus:border-purple-500 focus:outline-none resize-none
                   text-sm leading-relaxed bg-gray-50
                   placeholder:text-gray-400"
      />
    </div>
  );
}