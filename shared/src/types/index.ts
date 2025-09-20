// Core entity types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'reseller';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  price: number;
  costPrice: number;
  category: string;
  images: string[];
  isActive: boolean;
  inventory: InventoryItem;
  aiOptimization?: AIOptimization;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryItem {
  id: string;
  productId: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  reorderPoint: number;
  maxStock: number;
  autoRefillEnabled: boolean;
  supplier?: Supplier;
  lastRestocked: Date;
  predictedDemand?: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: Address;
  billingAddress: Address;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address: Address;
  products: string[]; // Product IDs
  isActive: boolean;
  rating: number;
  leadTime: number; // in days
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// AI and automation types
export interface AIOptimization {
  id: string;
  productId: string;
  optimizedTitle?: string;
  optimizedDescription?: string;
  suggestedPrice?: number;
  keywords: string[];
  performanceScore: number;
  lastOptimized: Date;
}

export interface InventoryPrediction {
  productId: string;
  predictedDemand: number;
  confidence: number;
  timeframe: string; // e.g., "7d", "30d"
  suggestedReorderQuantity: number;
  factors: PredictionFactor[];
}

export interface PredictionFactor {
  factor: string;
  impact: number; // -1 to 1
  description: string;
}

// Integration types
export interface ShopifyIntegration {
  id: string;
  shopDomain: string;
  accessToken: string;
  isActive: boolean;
  lastSync: Date;
  syncedProducts: number;
  syncedOrders: number;
}

export interface StripeIntegration {
  id: string;
  accountId: string;
  isActive: boolean;
  webhookEndpoint: string;
  supportedCurrencies: string[];
}

export interface HostingPlatformIntegration {
  id: string;
  platform: 'webflow' | 'framer' | 'hostinger' | 'railway';
  apiKey: string;
  projectId?: string;
  isActive: boolean;
  deploymentUrl?: string;
}

// Enum types
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  RETURNED = 'returned'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded'
}

export enum FulfillmentStatus {
  UNFULFILLED = 'unfulfilled',
  PARTIAL = 'partial',
  FULFILLED = 'fulfilled'
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Dashboard and analytics types
export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  lowStockAlerts: number;
  recentOrders: Order[];
  topProducts: Product[];
  inventoryAlerts: InventoryAlert[];
}

export interface InventoryAlert {
  id: string;
  productId: string;
  productName: string;
  alertType: 'low_stock' | 'out_of_stock' | 'overstock';
  currentStock: number;
  threshold: number;
  severity: 'low' | 'medium' | 'high';
  createdAt: Date;
}