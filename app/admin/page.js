'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Copy, Check, Plus } from 'lucide-react';

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
  const [manualKey, setManualKey] = useState('');
  const [generatedKeys, setGeneratedKeys] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [addingManual, setAddingManual] = useState(false);
  const [credits, setCredits] = useState(100);
  const [email, setEmail] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);

  const handleLogin = () => {
    if (password === 'resumsnap2026') {
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

      setGeneratedKeys([{ key, credits, email, source: 'Generated' }, ...generatedKeys]);
      setEmail('');
      alert(`✅ License key created successfully!\n\nKey: ${key}\nCredits: ${credits}`);
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Failed to generate key:\n\n' + error.message + '\n\nCheck console for details.');
    } finally {
      setGenerating(false);
    }
  };

  const handleAddManualKey = async () => {
    if (!manualKey || manualKey.length < 10) {
      alert('Please enter a valid license key');
      return;
    }

    setAddingManual(true);

    try {
      const keyToAdd = manualKey.trim().toUpperCase();

      // Check if key already exists
      const { data: existing } = await supabase
        .from('license_keys')
        .select('license_key')
        .eq('license_key', keyToAdd)
        .single();

      if (existing) {
        alert('⚠️ This key already exists in the database!');
        setAddingManual(false);
        return;
      }

      // Add the key
      const { data, error } = await supabase
        .from('license_keys')
        .insert([
          {
            license_key: keyToAdd,
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

      setGeneratedKeys([{ key: keyToAdd, credits, email, source: 'Gumroad' }, ...generatedKeys]);
      setManualKey('');
      setEmail('');
      alert(`✅ Gumroad license key added successfully!\n\nKey: ${keyToAdd}\nCredits: ${credits}`);
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Failed to add key:\n\n' + error.message);
    } finally {
      setAddingManual(false);
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
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg 
                            flex items-center justify-center font-bold text-white shadow-md">
                <span>R</span>
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ResuSnap
              </span>
            </div>
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
            Default password: <code className="bg-gray-100 px-2 py-1 rounded">resumsnap2026</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-2xl p-8 mb-6">
          <div className="mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg 
                            flex items-center justify-center font-bold text-white shadow-md">
                <span>R</span>
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ResuSnap
              </span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">License Key Manager</h1>
          <p className="text-gray-600">Add Gumroad keys or generate test keys</p>
        </div>

        {/* Add Gumroad Key (Primary) */}
        <div className="bg-white rounded-2xl p-8 mb-6 border-2 border-blue-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Plus size={18} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Add Gumroad License Key</h2>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            After someone purchases on Gumroad, paste their license key here to activate it in your database.
          </p>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                License Key from Gumroad
              </label>
           <input
  type="text"
  value={manualKey}
  onChange={(e) => setManualKey(e.target.value.toUpperCase())}
  placeholder="XXXX-XXXX-XXXX-XXXX"
  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl
           focus:border-blue-500 focus:outline-none font-mono uppercase"
  maxLength={50}  // CHANGED FROM 19 to 50
/>
            </div>

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
              <p className="text-xs text-gray-500 mt-1">Standard: 100 credits for $19 purchase</p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Customer Email (Optional)
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
            onClick={handleAddManualKey}
            disabled={addingManual || !manualKey}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600
                     hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 
                     disabled:to-gray-400 text-white font-bold text-lg rounded-xl 
                     transition-all shadow-lg"
          >
            {addingManual ? 'Adding Key...' : 'Add Gumroad Key to Database'}
          </button>
        </div>

        {/* Generate Test Key (Secondary) */}
        <div className="bg-white rounded-2xl p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Generate Test Key (Development Only)</h2>
          <p className="text-sm text-gray-600 mb-6">
            Generate random keys for testing. Don&apos;t use these for real customers.
          </p>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full px-6 py-4 bg-gray-700 hover:bg-gray-800
                     disabled:bg-gray-400 text-white font-bold text-lg rounded-xl 
                     transition-all shadow-lg"
          >
            {generating ? 'Generating...' : 'Generate Random Test Key'}
          </button>
        </div>

        {/* Recent Keys */}
        {generatedKeys.length > 0 && (
          <div className="bg-white rounded-2xl p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Keys (This Session)</h2>
            
            <div className="space-y-3">
              {generatedKeys.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="font-mono font-bold text-lg text-gray-900">
                        {item.key}
                      </div>
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                        item.source === 'Gumroad' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {item.source}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {item.credits} credits
                      {item.email && ` • ${item.email}`}
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(item.key)}
                    className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 
                             border-2 border-gray-300 rounded-lg transition-colors flex-shrink-0 ml-3"
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