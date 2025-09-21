import Link from 'next/link';
import { SparklesIcon, CreditCardIcon, UserIcon } from '@heroicons/react/24/solid';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Baddie Reseller AI
            </span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-pink-600 transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-pink-600 transition-colors">
              Pricing
            </Link>
            <Link href="/auth/login" className="text-gray-600 hover:text-pink-600 transition-colors">
              Login
            </Link>
            <Link href="/auth/register" className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all">
              Start Trial
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Baddie Reseller AI
            </h1>
            <p className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
              Manifested by HustleNHeal
            </p>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Automate your reselling empire with AI-powered product generation. 
              Create compelling listings, optimize descriptions, and scale your business effortlessly.
            </p>
            
            {/* Mascot Placeholder */}
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full flex items-center justify-center">
              <div className="text-6xl">💎</div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register" className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg">
                Start $1 Trial Today
              </Link>
              <Link href="#features" className="border-2 border-pink-300 text-pink-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-pink-50 transition-all">
                Learn More
              </Link>
            </div>
            
            <p className="text-sm text-gray-500 mt-4">
              ✨ Only $1 for your first week, then just $29/month
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white/50">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Why Baddie Resellers Choose Us
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-500 rounded-xl mx-auto mb-6 flex items-center justify-center">
                <SparklesIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">AI Product Generator</h3>
              <p className="text-gray-600 leading-relaxed">
                Generate compelling product listings with AI. Get optimized titles, descriptions, and pricing suggestions in seconds.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-xl mx-auto mb-6 flex items-center justify-center">
                <CreditCardIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Smart Pricing</h3>
              <p className="text-gray-600 leading-relaxed">
                AI-powered pricing recommendations based on market trends, competition analysis, and profit optimization.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-400 to-pink-500 rounded-xl mx-auto mb-6 flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Baddie Aesthetic</h3>
              <p className="text-gray-600 leading-relaxed">
                Specialized in trendy, aesthetic products that appeal to the modern baddie lifestyle and guarantee high engagement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-16 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h2>
          
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-pink-200">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Baddie Pro</h3>
                <div className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  $1
                </div>
                <p className="text-gray-600">for your first week</p>
                <p className="text-lg text-gray-700 mt-2">then $29/month</p>
              </div>
              
              <ul className="space-y-4 mb-8 text-left">
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Unlimited AI product generation</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Smart pricing recommendations</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>SEO-optimized descriptions</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Analytics dashboard</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>Priority support</span>
                </li>
              </ul>
              
              <Link href="/auth/register" className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg block text-center">
                Start Your $1 Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Baddie Reseller AI</span>
          </div>
          <p className="text-gray-400 mb-4">Manifested by HustleNHeal</p>
          <p className="text-gray-500">© 2024 Baddie Reseller AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
