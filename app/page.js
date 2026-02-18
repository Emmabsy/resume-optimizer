import Link from 'next/link';
import { Sparkles, Zap, Shield, TrendingUp, Check, ArrowRight } from 'lucide-react';
import Logo from '@/components/Logo';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo />
          <Link
            href="/generator"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Open App
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        
        <div className="relative max-w-5xl mx-auto px-6 pt-16 pb-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 
                        bg-white/10 backdrop-blur-sm border border-white/20 
                        rounded-full text-xs font-medium text-white">
            <Sparkles size={14} />
            <span>AI-Powered Resume Optimization</span>
          </div>
          
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-5">
            Stop Getting Rejected<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
              By ATS Systems
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-8 leading-relaxed">
            AI rewrites your resume to match any job description in 30 seconds. 
            Get past the robots. Land the interview.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://YOUR-GUMROAD-LINK.gumroad.com/l/resuboost"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 
                       bg-white hover:bg-gray-50 text-blue-700 
                       text-lg font-bold rounded-xl transition-all 
                       shadow-2xl hover:shadow-3xl hover:scale-105"
            >
              <Zap size={20} />
              Buy Now — $19
            </a>
            <Link
              href="/generator"
              className="inline-flex items-center gap-2 px-8 py-4 
                       bg-white/10 hover:bg-white/20 text-white border-2 border-white/30
                       text-lg font-bold rounded-xl transition-all backdrop-blur-sm"
            >
              Try with License Key
              <ArrowRight size={20} />
            </Link>
          </div>
          
          <p className="mt-5 text-sm text-blue-200">
            100 optimizations • One-time payment • No subscription
          </p>
        </div>
      </div>

      {/* Social Proof */}
      <div className="bg-gray-50 py-12 border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 bg-white rounded-xl shadow-sm text-center">
              <div className="text-4xl font-black text-blue-600 mb-1">78%</div>
              <div className="text-sm text-gray-600">Average ATS match</div>
            </div>
            <div className="p-5 bg-white rounded-xl shadow-sm text-center">
              <div className="text-4xl font-black text-purple-600 mb-1">30s</div>
              <div className="text-sm text-gray-600">Time to optimize</div>
            </div>
            <div className="p-5 bg-white rounded-xl shadow-sm text-center">
              <div className="text-4xl font-black text-green-600 mb-1">100</div>
              <div className="text-sm text-gray-600">Optimizations included</div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Four simple steps to a better resume
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { num: '1', title: 'Purchase', desc: 'Get instant access with 100 credits', icon: '💳' },
              { num: '2', title: 'Paste', desc: 'Add your resume and job description', icon: '📋' },
              { num: '3', title: 'Optimize', desc: 'AI rewrites to match keywords', icon: '✨' },
              { num: '4', title: 'Apply', desc: 'Export PDF and get interviews', icon: '🎯' },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-14 h-14 mx-auto mb-3 bg-gradient-to-br from-blue-100 to-purple-100 
                              rounded-xl flex items-center justify-center text-2xl">
                  {step.icon}
                </div>
                <div className="text-xs font-bold text-blue-600 mb-1.5">STEP {step.num}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-1.5">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
              Everything You Need
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <TrendingUp size={20} />, title: 'ATS Match Score', desc: 'See exactly how well your resume matches' },
              { icon: <Check size={20} />, title: 'Keyword Analysis', desc: 'Know which keywords were added' },
              { icon: <Sparkles size={20} />, title: 'Smart Rewriting', desc: 'AI preserves your experience' },
              { icon: <Shield size={20} />, title: 'Privacy First', desc: 'Your data is never stored' },
              { icon: <Zap size={20} />, title: 'Instant Results', desc: 'Get results in under 30 seconds' },
              { icon: <Check size={20} />, title: 'PDF Export', desc: 'Download professional PDFs' },
            ].map((feature, i) => (
              <div key={i} className="p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 mb-3 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                  {feature.icon}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1.5">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-10 text-center text-white shadow-2xl">
            <div className="inline-block px-3 py-1.5 mb-5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold">
              🔥 LIMITED TIME OFFER
            </div>
            <div className="text-5xl font-black mb-3">$19</div>
            <div className="text-lg mb-6 text-blue-100">One-time payment • 100 optimizations</div>
            
            <ul className="text-left max-w-md mx-auto mb-8 space-y-2.5 text-sm">
              {[
                'Instant access to ResuBoost',
                '100 resume optimizations',
                'Unlimited job descriptions',
                'ATS match scoring',
                'PDF export',
                'No subscription, no hidden fees',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <Check className="text-green-300 flex-shrink-0" size={18} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            
            
            <a
              href="https://resume-optimizer-peo7qyhrh-emmabsys-projects.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-10 py-4 bg-white hover:bg-gray-50 
                       text-blue-700 text-lg font-bold rounded-xl 
                       transition-all shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Get ResuBoost Now →
            </a>
            
            <p className="mt-5 text-xs text-blue-200">
              Need more credits? Buy 50 more for $10 anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-3">
            <Logo size="default" />
          </div>
          <p className="mb-3 text-white text-sm">Beat ATS systems. Land more interviews.</p>
          <p className="text-xs">© 2026 ResuBoost. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}