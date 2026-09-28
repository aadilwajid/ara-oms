// Existing imports
import { Product, Customer, Order, Invoice, Expense, Income, BusinessSettings, MediaItem, ActivityLog, ReturnRequest } from './types';

// ===== NEW TYPES FOR 50+ FEATURES =====

// Product Variants
export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  attributes: Record<string, string>; // Size: L, Color: Red
  price: number;
  costPrice: number;
  stock: number;
  sku: string;
  image?: string;
}

// Product Bundles
export interface ProductBundle {
  id: string;
  name: string;
  description: string;
  products: { productId: string; quantity: number }[];
  bundlePrice: number;
  discount: number;
  active: boolean;
  image?: string;
  createdAt: string;
}

// Multi-Warehouse
export interface Warehouse {
  id: string;
  name: string;
  address: string;
  city: string;
  manager: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
}

export interface WarehouseStock {
  warehouseId: string;
  productId: string;
  quantity: number;
  lastUpdated: string;
}

export interface StockTransfer {
  id: string;
  transferNumber: string;
  fromWarehouse: string;
  toWarehouse: string;
  items: { productId: string; quantity: number }[];
  status: 'draft' | 'in-transit' | 'received' | 'cancelled';
  notes: string;
  createdAt: string;
  receivedAt?: string;
}

// Supplier & Purchase Orders
export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  products: string[];
  paymentTerms: string;
  notes: string;
  rating: number;
  createdAt: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  items: { productId: string; productName: string; quantity: number; costPrice: number; total: number }[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'partial' | 'received' | 'cancelled';
  expectedDate: string;
  notes: string;
  createdAt: string;
  receivedAt?: string;
}

// Discount & Coupon System
export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed' | 'free-shipping';
  value: number;
  minOrderAmount: number;
  maxDiscount?: number;
  maxUses: number;
  usedCount: number;
  perCustomerLimit: number;
  startDate: string;
  endDate: string;
  active: boolean;
  applicableProducts: string[]; // empty = all products
  applicableCategories: string[];
  createdAt: string;
}

// Gift Cards
export interface GiftCard {
  id: string;
  code: string;
  amount: number;
  balance: number;
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  message: string;
  status: 'active' | 'redeemed' | 'expired';
  purchasedAt: string;
  expiresAt: string;
  redeemedAt?: string;
}

// Subscriptions
export interface Subscription {
  id: string;
  customerId: string;
  customerName: string;
  products: { productId: string; quantity: number }[];
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
  nextDelivery: string;
  status: 'active' | 'paused' | 'cancelled';
  discount: number;
  totalAmount: number;
  createdAt: string;
}

// Customer Loyalty
export interface LoyaltyProgram {
  pointsPerDollar: number;
  redemptionRate: number; // points per dollar redeemed
  tiers: LoyaltyTier[];
}

export interface LoyaltyTier {
  name: string;
  minPoints: number;
  discount: number;
  benefits: string[];
  color: string;
}

export interface CustomerLoyalty {
  customerId: string;
  points: number;
  tier: string;
  totalEarned: number;
  totalRedeemed: number;
  history: LoyaltyTransaction[];
}

export interface LoyaltyTransaction {
  id: string;
  type: 'earned' | 'redeemed' | 'expired' | 'bonus';
  points: number;
  description: string;
  orderId?: string;
  createdAt: string;
}

// Courier Integration
export interface Courier {
  id: string;
  name: string;
  type: 'tcs' | 'leopards' | 'callcourier' | 'trax' | 'postex' | 'custom';
  apiKey: string;
  accountNumber: string;
  isActive: boolean;
  settings: Record<string, string>;
}

export interface Shipment {
  id: string;
  orderId: string;
  courierId: string;
  courierName: string;
  trackingNumber: string;
  status: 'booked' | 'picked' | 'in-transit' | 'out-for-delivery' | 'delivered' | 'failed' | 'returned';
  weight: number;
  dimensions: { length: number; width: number; height: number };
  cost: number;
  codAmount?: number;
  labelUrl?: string;
  bookedAt: string;
  deliveredAt?: string;
}

// Shipping Zones
export interface ShippingZone {
  id: string;
  name: string;
  cities: string[];
  rates: { minWeight: number; maxWeight: number; cost: number }[];
  freeShippingThreshold: number;
  isActive: boolean;
}

// SMS & Email
export interface SmsTemplate {
  id: string;
  name: string;
  type: 'order-confirmation' | 'status-update' | 'delivery' | 'payment-reminder' | 'promotion';
  content: string;
  variables: string[];
  active: boolean;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'welcome' | 'order' | 'promotion' | 'newsletter' | 'abandoned-cart';
  active: boolean;
}

export interface SmsProvider {
  id: string;
  name: string;
  type: 'jazz' | 'telenor' | 'zong' | 'custom';
  apiKey: string;
  senderId: string;
  balance: number;
  isActive: boolean;
}

// Employee Management
export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'staff' | 'warehouse' | 'delivery';
  permissions: string[];
  salary: number;
  joinDate: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

// Quotations
export interface Quotation {
  id: string;
  quoteNumber: string;
  customerId: string;
  customerName: string;
  items: { productId: string; productName: string; quantity: number; price: number; total: number }[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  validUntil: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'converted';
  notes: string;
  createdAt: string;
}

// Warranty
export interface Warranty {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  customerId: string;
  customerName: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'claimed' | 'expired';
  claimNotes?: string;
}

// Reviews
export interface Review {
  id: string;
  productId: string;
  customerId: string;
  customerName: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  images?: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

// Wishlist
export interface Wishlist {
  id: string;
  customerId: string;
  products: string[];
  createdAt: string;
  updatedAt: string;
}

// Abandoned Cart
export interface AbandonedCart {
  id: string;
  customerId?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  items: { productId: string; productName: string; quantity: number; price: number }[];
  total: number;
  createdAt: string;
  lastActivity: string;
  reminderSent: boolean;
  recovered: boolean;
}

// API Keys
export interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  lastUsed?: string;
  createdAt: string;
  expiresAt?: string;
  active: boolean;
}

// Automated Workflows
export interface Workflow {
  id: string;
  name: string;
  trigger: 'order-created' | 'order-status-changed' | 'low-stock' | 'new-customer' | 'payment-received';
  triggerConditions: Record<string, any>;
  actions: WorkflowAction[];
  active: boolean;
  createdAt: string;
}

export interface WorkflowAction {
  type: 'send-sms' | 'send-email' | 'send-whatsapp' | 'update-status' | 'create-task' | 'apply-discount';
  config: Record<string, any>;
}

// Backup
export interface Backup {
  id: string;
  type: 'manual' | 'automatic';
  provider: 'local' | 'google-drive' | 'dropbox';
  size: number;
  status: 'completed' | 'failed' | 'in-progress';
  createdAt: string;
  url?: string;
}

// Multi-currency
export interface ExchangeRate {
  currency: string;
  rate: number;
  lastUpdated: string;
}

// ===== EXTENDED PRODUCT TYPE =====
export interface ExtendedProduct extends Product {
  variants?: ProductVariant[];
  reviews?: Review[];
  averageRating?: number;
  warrantyMonths?: number;
  isBundle?: boolean;
  bundleProducts?: string[];
}

// ===== EXTENDED PAGE TYPE =====
export type ExtendedPage = 'dashboard' | 'orders' | 'customers' | 'products' | 'inventory' | 'invoices' | 'expenses' | 'income' | 'media' | 'reports' | 'returns' | 'settings' | 'suppliers' | 'purchase-orders' | 'warehouses' | 'coupons' | 'loyalty' | 'shipments' | 'quotations' | 'workflows' | 'employees' | 'gift-cards' | 'subscriptions' | 'reviews' | 'abandoned-carts' | 'api-keys' | 'backups';
