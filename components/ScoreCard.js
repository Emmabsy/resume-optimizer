'use client';

export default function ScoreCard({ matchScore, keywordsAdded, keywordsFound, improvements, suggestions }) {
  const scoreColor = matchScore >= 75 ? 'text-green-600'
                  : matchScore >= 50 ? 'text-yellow-600'
                  : 'text-red-600';
  const barColor = matchScore >= 75 ? 'bg-green-500'
                 : matchScore >= 50 ? 'bg-yellow-500'
                 : 'bg-red-500';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
      
      {/* Match Score */}
      <div>
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-sm font-semibold text-gray-600">ATS Match Score</span>
          <span className={`text-3xl font-black ${scoreColor}`}>{matchScore}%</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-700 ${barColor}`}
               style={{ width: `${matchScore}%` }} />
        </div>
      </div>

      {/* Keywords Added */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Keywords Added ✨
        </p>
        <div className="flex flex-wrap gap-2">
          {keywordsAdded.map((kw) => (
            <span key={kw} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md border border-green-200">
              + {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Improvements */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          What Changed
        </p>
        <ul className="space-y-2">
          {improvements.map((item, i) => (
            <li key={i} className="flex gap-2 text-xs text-gray-600">
              <span className="text-green-500 mt-0.5">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Suggestions */}
      {suggestions?.length > 0 && (
        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-blue-700 mb-2">💡 Pro Tips</p>
          {suggestions.map((s, i) => (
            <p key={i} className="text-xs text-blue-600 mb-1">• {s}</p>
          ))}
        </div>
      )}
    </div>
  );
}