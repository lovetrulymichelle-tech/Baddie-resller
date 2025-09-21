'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  SparklesIcon, 
  PlusIcon, 
  CreditCardIcon, 
  ChartBarIcon, 
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/solid';
import { authApi, productApi, paymentApi, type User, type Product } from '@/lib/api';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<{
    total_products: number;
    average_price: number;
    categories: Record<string, number>;
    subscription_status: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      router.push('/auth/login');
      return;
    }

    // Check for successful payment callback
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      const handlePaymentSuccess = async (token: string, sessionId: string) => {
        try {
          const response = await paymentApi.verifySession(token, sessionId);
          if (response.success) {
            // Refresh user data
            loadUserData(token);
          }
        } catch (error) {
          console.error('Payment verification failed:', error);
        }
      };
      handlePaymentSuccess(token, sessionId);
    }

    loadUserData(token);
  }, [router, searchParams]);

  const loadUserData = async (token: string) => {
    try {
      const [userResponse, productsResponse, statsResponse] = await Promise.all([
        authApi.getCurrentUser(token),
        productApi.getProducts(token),
        productApi.getStats(token)
      ]);

      if (userResponse.success && userResponse.user) {
        setUser(userResponse.user);
      }

      if (productsResponse.success && productsResponse.products) {
        setProducts(productsResponse.products);
      }

      if (statsResponse.success) {
        setStats({
          total_products: statsResponse.total_products || 0,
          average_price: statsResponse.average_price || 0,
          categories: statsResponse.categories || {},
          subscription_status: statsResponse.subscription_status || 'inactive'
        });
      }

      // Show upgrade prompt if not subscribed
      if (userResponse.user && !userResponse.user.is_subscribed) {
        setShowUpgradePrompt(true);
      }

    } catch (error) {
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartTrial = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      const response = await paymentApi.createTrialSession(token);
      if (response.success && response.checkout_url) {
        window.location.href = response.checkout_url;
      }
    } catch (error) {
      setError('Failed to start trial');
    }
  };

  const handleGenerateProduct = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    if (!user?.is_subscribed) {
      setShowUpgradePrompt(true);
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await productApi.generate(token, {
        category: 'Fashion',
        target_audience: 'baddie resellers',
        style_preferences: 'trendy, aesthetic, high-margin'
      });

      if (response.success && response.product) {
        setProducts([response.product, ...products]);
      } else {
        setError(response.error || 'Failed to generate product');
      }
    } catch (error) {
      setError('Failed to generate product');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <SparklesIcon className="w-8 h-8 text-white animate-spin" />
          </div>
          <p className="text-gray-600">Loading your empire...</p>
        </div>
      </div>
    );
  }

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
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 hidden md:block">Welcome back, {user?.email}</span>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Cog6ToothIcon className="w-5 h-5" />
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Upgrade Prompt */}
      {showUpgradePrompt && !user?.is_subscribed && (
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ExclamationTriangleIcon className="w-6 h-6" />
              <span className="font-semibold">
                Start your $1 trial to generate unlimited products with AI!
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleStartTrial}
                className="bg-white text-pink-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Start $1 Trial
              </button>
              <button
                onClick={() => setShowUpgradePrompt(false)}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.total_products || 0}</p>
              </div>
              <ChartBarIcon className="w-8 h-8 text-pink-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Avg Price</p>
                <p className="text-3xl font-bold text-gray-900">${stats?.average_price?.toFixed(2) || '0.00'}</p>
              </div>
              <CreditCardIcon className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Subscription</p>
                <p className="text-lg font-bold text-gray-900 capitalize">
                  {user?.subscription_status || 'Inactive'}
                </p>
              </div>
              <div className={`w-3 h-3 rounded-full ${
                user?.is_subscribed ? 'bg-green-500' : 'bg-red-500'
              }`} />
            </div>
          </div>
        </div>

        {/* Generate Product Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Product Generator</h2>
            <p className="text-gray-600 mb-6">
              Generate compelling product listings optimized for the baddie aesthetic
            </p>
            <button
              onClick={handleGenerateProduct}
              disabled={isGenerating}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
            >
              {isGenerating ? (
                <>
                  <SparklesIcon className="w-5 h-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <PlusIcon className="w-5 h-5" />
                  <span>Generate New Product</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="mb-4">
                <span className="inline-block bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {product.category}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                {product.title}
              </h3>
              
              <p className="text-gray-600 mb-4 line-clamp-3">
                {product.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(product.created_at).toLocaleDateString()}
                </span>
              </div>
              
              {product.keywords && product.keywords.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1">
                  {product.keywords.slice(0, 3).map((keyword, index) => (
                    <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SparklesIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-600">
              Generate your first AI-powered product to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}