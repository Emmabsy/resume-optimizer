'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Copy, Check } from 'lucide-react';
import Logo from '@/components/Logo';

function generateLicenseKey() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segments = [];
  
  for (let i = 0; i < 4; i++) {
    let segment = '';
    for (let j = 0; j < 4; j++) {
      segment += chars[Math.floor(Math.random() * chars.length)];
    }
    segments.push(segment);
  }
  
  return segments.join('-');
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [generatedKeys, setGeneratedKeys] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [credits, setCredits] = useState(100);
  const [email, setEmail] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);

  const handleLogin = () => {
    if (password === 'resuboost2026') {
      setAuthenticated(true);
    } else {
      alert('Wrong password');
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    
    try {
      const key = generateLicenseKey();
      
      const { data, error } = await supabase
        .from('license_keys')
        .insert([
          {
            license_key: key,
            credits_remaining: parseInt(credits),
            total_credits: parseInt(credits),
            email: email || null,
          }
        ])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      setGeneratedKeys([{ key, credits, email }, ...generatedKeys]);
      setEmail('');
      alert(`✅ License key created successfully!\n\nKey: ${key}\nCredits: ${credits}`);
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Failed to generate key:\n\n' + error.message + '\n\nCheck console for details.');
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (key) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md">
          <div className="mb-6">
            <Logo />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Access</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Enter admin password"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl
                     focus:border-blue-500 focus:outline-none mb-4"
          />
          <button
            onClick={handleLogin}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 
                     text-white font-semibold rounded-xl transition-colors"
          >
            Login
          </button>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Default password: <code className="bg-gray-100 px-2 py-1 rounded">resuboost2026</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        
        <div className="bg-white rounded-2xl p-8 mb-6">
          <div className="mb-6">
            <Logo />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">License Key Generator</h1>
          <p className="text-gray-600">Create test license keys for development and testing</p>
        </div>

        <div className="bg-white rounded-2xl p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Generate New Key</h2>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Number of Credits
              </label>
              <input
                type="number"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl
                         focus:border-blue-500 focus:outline-none"
                min="1"
                max="1000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@example.com"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl
                         focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600
                     hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 
                     disabled:to-gray-400 text-white font-bold text-lg rounded-xl 
                     transition-all shadow-lg"
          >
            {generating ? 'Generating...' : 'Generate License Key'}
          </button>
        </div>

        {generatedKeys.length > 0 && (
          <div className="bg-white rounded-2xl p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Generated Keys (This Session)</h2>
            
            <div className="space-y-3">
              {generatedKeys.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                  <div className="flex-1">
                    <div className="font-mono font-bold text-lg text-gray-900 mb-1">
                      {item.key}
                    </div>
                    <div className="text-sm text-gray-600">
                      {item.credits} credits
                      {item.email && ` • ${item.email}`}
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(item.key)}
                    className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 
                             border-2 border-gray-300 rounded-lg transition-colors"
                  >
                    {copiedKey === item.key ? (
                      <>
                        <Check size={16} className="text-green-600" />
                        <span className="text-sm font-medium text-green-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        <span className="text-sm font-medium">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}