'use client';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function OutputPanel({ content }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-green-700 uppercase tracking-wide">
          ✨ Optimized Resume
        </label>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
                     bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          {copied ? <Check size={12} className="text-green-600"/> : <Copy size={12}/>}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div
        id="optimized-resume"
        className="flex-1 w-full p-4 border-2 border-green-200 rounded-xl
                   bg-green-50 text-sm leading-relaxed font-mono
                   overflow-y-auto whitespace-pre-wrap text-gray-800"
      >
        {content}
      </div>
    </div>
  );
}