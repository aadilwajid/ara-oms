export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  costPrice: number;
  stock: number;
  lowStockThreshold: number;
  description: string;
  image?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export type OrderChannel = 'website' | 'daraz' | 'shopify' | 'whatsapp' | 'instagram' | 'facebook' | 'phone' | 'walk-in';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
export type PaymentStatus = 'unpaid' | 'partial' | 'paid' | 'refunded';

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  tax: number;
  total: number;
  channel: OrderChannel;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  shippingAddress: string;
  trackingNumber?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  customerId: string;
  customerName: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  vendor: string;
  paymentMethod: string;
  receipt?: string;
  createdAt: string;
}

export interface Income {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  source: string;
  paymentMethod: string;
  createdAt: string;
}

export interface BusinessSettings {
  storeName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  currency: string;
  taxRate: number;
  defaultShippingCost: number;
  ntn: string;
  stripe: string;
  invoicePrefix: string;
  orderPrefix: string;
  lowStockAlert: number;
}

export type Page = 'dashboard' | 'orders' | 'customers' | 'products' | 'inventory' | 'invoices' | 'expenses' | 'income' | 'settings';
