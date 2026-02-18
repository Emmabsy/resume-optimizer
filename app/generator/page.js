'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ResumeInput from '@/components/ResumeInput';
import JobInput from '@/components/JobInput';
import OutputPanel from '@/components/OutputPanel';
import ScoreCard from '@/components/ScoreCard';
import ExportPDF from '@/components/ExportPDF';
import Logo from '@/components/Logo';
import { Sparkles, Loader2, Key, CreditCard } from 'lucide-react';

export default function GeneratorPage() {
  const [licenseKey, setLicenseKey] = useState('');
  const [keyValidated, setKeyValidated] = useState(false);
  const [credits, setCredits] = useState(null);
  const [resume, setResume] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('resuboost_license');
    if (saved) {
      setLicenseKey(saved);
      validateKey(saved);
    }
  }, []);

  const validateKey = async (key) => {
    setValidating(true);
    setError('');
    
    try {
      const response = await fetch('/api/validate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseKey: key }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setKeyValidated(true);
      setCredits(data.creditsRemaining);
      localStorage.setItem('resuboost_license', key.trim().toUpperCase());
    } catch (err) {
      setError(err.message);
      setKeyValidated(false);
      localStorage.removeItem('resuboost_license');
    } finally {
      setValidating(false);
    }
  };

  const handleValidate = () => {
    validateKey(licenseKey);
  };

  const handleOptimize = async () => {
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          resume, 
          jobDescription: jobDesc,
          licenseKey: licenseKey.trim().toUpperCase()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setResult(data);
      setCredits(data.creditsRemaining);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const canOptimize = resume.length >= 100 && jobDesc.length >= 50 && keyValidated && !loading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      
     {/* Header */}
<header className="bg-gray-900 border-b border-gray-800 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-50 shadow-lg">
  <Link href="/" className="hover:opacity-80 transition-opacity">
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white shadow-md text-sm">
        <span>R</span>
      </div>
      <span className="text-lg font-black text-white">
        ResuBoost
      </span>
    </div>
  </Link>
  <div className="flex items-center gap-3">
    {keyValidated && credits !== null && (
      <div className="flex items-center gap-2 px-2.5 py-1.5 bg-green-900/50 border border-green-700 rounded-lg backdrop-blur-sm">
        <CreditCard size={14} className="text-green-400" />
        <span className="text-xs font-semibold text-green-300">
          {credits} {credits === 1 ? 'credit' : 'credits'}
        </span>
      </div>
    )}
    {result && <ExportPDF content={result.optimizedResume} />}
  </div>
</header>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8">

        {/* License Key Validation */}
        {!keyValidated && (
          <div className="mb-8 p-6 bg-white rounded-xl border border-blue-200 shadow-md max-w-2xl mx-auto">
            <div className="flex items-start gap-3 mb-4">
              <Key className="text-blue-600 mt-0.5 flex-shrink-0" size={20} />
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-900 mb-1.5">
                  Enter Your License Key
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Check your email for your license key after purchase. Each key includes 100 resume optimizations.
                </p>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="text"
                    value={licenseKey}
                    onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    className="flex-1 px-3.5 py-2.5 border border-gray-300 rounded-lg
                               focus:border-blue-500 focus:outline-none text-sm font-mono
                               uppercase"
                    maxLength={19}
                  />
                  <button
                    onClick={handleValidate}
                    disabled={validating || licenseKey.length < 10}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 
                               disabled:bg-gray-300 text-white font-semibold text-sm
                               rounded-lg transition-colors whitespace-nowrap"
                  >
                    {validating ? 'Validating...' : 'Activate'}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Don&apos;t have a key? <a href="https://resume-optimizer-peo7qyhrh-emmabsys-projects.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">Purchase ResuBoost ($19)</a>
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm max-w-2xl mx-auto">
            ❌ {error}
          </div>
        )}

        {keyValidated && (
          <>
            {/* Input panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
              <div className="min-h-[380px]">
                <ResumeInput value={resume} onChange={setResume} charCount={resume.length} />
              </div>
              <div className="min-h-[380px]">
                <JobInput value={jobDesc} onChange={setJobDesc} />
              </div>
            </div>

            {/* Optimize button */}
            <div className="flex justify-center mb-8">
              <button
                onClick={handleOptimize}
                disabled={!canOptimize}
                className="flex items-center gap-2.5 px-8 py-3.5
                           bg-gradient-to-r from-blue-600 to-purple-600
                           hover:from-blue-700 hover:to-purple-700
                           disabled:from-gray-300 disabled:to-gray-300
                           text-white font-bold text-base rounded-xl
                           transition-all shadow-lg hover:shadow-xl
                           disabled:cursor-not-allowed"
              >
                {loading
                  ? <><Loader2 className="animate-spin" size={20} /> Optimizing...</>
                  : <><Sparkles size={20} /> Optimize Resume</>
                }
              </button>
            </div>

            {/* Results */}
            {result && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 min-h-[480px]">
                  <OutputPanel content={result.optimizedResume} />
                </div>
                <div>
                  <ScoreCard
                    matchScore={result.matchScore}
                    keywordsAdded={result.keywordsAdded}
                    keywordsFound={result.keywordsFound}
                    improvements={result.improvements}
                    suggestions={result.suggestions}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}