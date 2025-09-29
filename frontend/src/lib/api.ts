const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface User {
  id: number;
  email: string;
  created_at: string;
  subscription_status: string;
  trial_used: boolean;
  is_subscribed: boolean;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  keywords: string[];
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  access_token?: string;
  user?: User;
  product?: Product;
  products?: Product[];
  total?: number;
  pages?: number;
  total_products?: number;
  categories?: Record<string, number>;
  average_price?: number;
  subscription_status?: string;
  checkout_url?: string;
  session_id?: string;
  data?: T;
  error?: string;
  message?: string;
}

// Auth API functions
export const authApi = {
  register: async (email: string, password?: string): Promise<ApiResponse<User>> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    return await response.json();
  },

  login: async (email: string, password: string): Promise<ApiResponse<User>> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    return await response.json();
  },

  sendMagicLink: async (email: string): Promise<ApiResponse<Record<string, unknown>>> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/magic-link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    
    return await response.json();
  },

  magicLogin: async (token: string): Promise<ApiResponse<User>> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/magic-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    
    return await response.json();
  },

  getCurrentUser: async (token: string): Promise<ApiResponse<User>> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    
    return await response.json();
  },
};

// Product API functions
export const productApi = {
  generate: async (token: string, data: { category: string; target_audience?: string; style_preferences?: string }): Promise<ApiResponse<Product>> => {
    const response = await fetch(`${API_BASE_URL}/api/products/generate`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    
    return await response.json();
  },

  getProducts: async (token: string, page = 1, category?: string): Promise<ApiResponse<Product[]>> => {
    const params = new URLSearchParams({ page: page.toString() });
    if (category) params.append('category', category);
    
    const response = await fetch(`${API_BASE_URL}/api/products?${params}`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    
    return await response.json();
  },

  getStats: async (token: string): Promise<ApiResponse<Record<string, unknown>>> => {
    const response = await fetch(`${API_BASE_URL}/api/products/stats`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    
    return await response.json();
  },

  updateProduct: async (token: string, productId: number, data: Partial<Product>): Promise<ApiResponse<Product>> => {
    const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    
    return await response.json();
  },

  deleteProduct: async (token: string, productId: number): Promise<ApiResponse<Record<string, never>>> => {
    const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    
    return await response.json();
  },
};

// Payment API functions
export const paymentApi = {
  createTrialSession: async (token: string): Promise<ApiResponse<Record<string, unknown>>> => {
    const response = await fetch(`${API_BASE_URL}/api/payments/create-trial-session`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    
    return await response.json();
  },

  createSubscriptionSession: async (token: string): Promise<ApiResponse<Record<string, unknown>>> => {
    const response = await fetch(`${API_BASE_URL}/api/payments/create-subscription-session`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    
    return await response.json();
  },

  verifySession: async (token: string, sessionId: string): Promise<ApiResponse<User>> => {
    const response = await fetch(`${API_BASE_URL}/api/payments/verify-session`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ session_id: sessionId }),
    });
    
    return await response.json();
  },

  getSubscriptionStatus: async (token: string): Promise<ApiResponse<Record<string, unknown>>> => {
    const response = await fetch(`${API_BASE_URL}/api/payments/subscription-status`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    
    return await response.json();
  },

  cancelSubscription: async (token: string): Promise<ApiResponse<Record<string, unknown>>> => {
    const response = await fetch(`${API_BASE_URL}/api/payments/cancel-subscription`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    
    return await response.json();
  },
};