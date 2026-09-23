import { Product, Customer, Order, Invoice, Expense, Income, BusinessSettings } from './types';

const STORAGE_KEYS = {
  products: 'oms_products',
  customers: 'oms_customers',
  orders: 'oms_orders',
  invoices: 'oms_invoices',
  expenses: 'oms_expenses',
  income: 'oms_income',
  settings: 'oms_settings',
};

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export const defaultSettings: BusinessSettings = {
  storeName: 'My Store',
  ownerName: '',
  email: '',
  phone: '',
  address: '',
  city: 'Karachi',
  country: 'Pakistan',
  currency: 'PKR',
  taxRate: 0,
  defaultShippingCost: 200,
  ntn: '',
  stripe: '',
  invoicePrefix: 'INV',
  orderPrefix: 'ORD',
  lowStockAlert: 10,
};

export const defaultProducts: Product[] = [
  {
    id: '1', name: 'Premium Cotton Kurta', sku: 'KRT-001', category: 'Clothing',
    price: 2500, costPrice: 1200, stock: 45, lowStockThreshold: 10,
    description: 'High quality cotton kurta', createdAt: '2024-01-15'
  },
  {
    id: '2', name: 'Leather Wallet', sku: 'WLT-002', category: 'Accessories',
    price: 1800, costPrice: 700, stock: 30, lowStockThreshold: 5,
    description: 'Genuine leather wallet', createdAt: '2024-01-20'
  },
  {
    id: '3', name: 'Wireless Earbuds', sku: 'EAR-003', category: 'Electronics',
    price: 4500, costPrice: 2200, stock: 8, lowStockThreshold: 10,
    description: 'Bluetooth 5.0 wireless earbuds', createdAt: '2024-02-01'
  },
  {
    id: '4', name: 'Organic Face Cream', sku: 'CRM-004', category: 'Beauty',
    price: 1200, costPrice: 450, stock: 60, lowStockThreshold: 15,
    description: 'Natural organic face cream', createdAt: '2024-02-10'
  },
  {
    id: '5', name: 'Smart Watch Band', sku: 'BND-005', category: 'Accessories',
    price: 800, costPrice: 300, stock: 100, lowStockThreshold: 20,
    description: 'Compatible smart watch band', createdAt: '2024-02-15'
  },
];

export const defaultCustomers: Customer[] = [
  {
    id: '1', name: 'Ahmed Khan', email: 'ahmed@email.com', phone: '0300-1234567',
    address: 'House 45, Block B, DHA Phase 5', city: 'Lahore',
    totalOrders: 5, totalSpent: 15000, createdAt: '2024-01-10'
  },
  {
    id: '2', name: 'Fatima Ali', email: 'fatima@email.com', phone: '0321-9876543',
    address: 'Flat 12, Pearl Tower, Clifton', city: 'Karachi',
    totalOrders: 3, totalSpent: 8500, createdAt: '2024-01-25'
  },
  {
    id: '3', name: 'Muhammad Usman', email: 'usman@email.com', phone: '0333-5551234',
    address: 'Street 7, Sector F-11/3', city: 'Islamabad',
    totalOrders: 8, totalSpent: 32000, createdAt: '2024-02-05'
  },
];

export const defaultOrders: Order[] = [
  {
    id: '1', orderNumber: 'ORD-001', customerId: '1', customerName: 'Ahmed Khan',
    items: [{ productId: '1', productName: 'Premium Cotton Kurta', quantity: 2, price: 2500, total: 5000 }],
    subtotal: 5000, shippingCost: 200, discount: 0, tax: 0, total: 5200,
    channel: 'whatsapp', status: 'delivered', paymentStatus: 'paid', paymentMethod: 'Cash on Delivery',
    shippingAddress: 'House 45, Block B, DHA Phase 5, Lahore', notes: '', createdAt: '2024-02-20', updatedAt: '2024-02-25'
  },
  {
    id: '2', orderNumber: 'ORD-002', customerId: '2', customerName: 'Fatima Ali',
    items: [{ productId: '4', productName: 'Organic Face Cream', quantity: 3, price: 1200, total: 3600 }],
    subtotal: 3600, shippingCost: 250, discount: 200, tax: 0, total: 3650,
    channel: 'instagram', status: 'shipped', paymentStatus: 'paid', paymentMethod: 'JazzCash',
    shippingAddress: 'Flat 12, Pearl Tower, Clifton, Karachi', trackingNumber: 'TRK123456', notes: 'Gift wrap please', createdAt: '2024-03-01', updatedAt: '2024-03-05'
  },
  {
    id: '3', orderNumber: 'ORD-003', customerId: '3', customerName: 'Muhammad Usman',
    items: [
      { productId: '3', productName: 'Wireless Earbuds', quantity: 1, price: 4500, total: 4500 },
      { productId: '5', productName: 'Smart Watch Band', quantity: 2, price: 800, total: 1600 }
    ],
    subtotal: 6100, shippingCost: 0, discount: 500, tax: 0, total: 5600,
    channel: 'daraz', status: 'processing', paymentStatus: 'unpaid', paymentMethod: 'Cash on Delivery',
    shippingAddress: 'Street 7, Sector F-11/3, Islamabad', notes: '', createdAt: '2024-03-10', updatedAt: '2024-03-10'
  },
];

export const defaultExpenses: Expense[] = [
  { id: '1', category: 'Shipping', description: 'TCS Courier - Monthly', amount: 15000, date: '2024-03-01', vendor: 'TCS Express', paymentMethod: 'Bank Transfer', createdAt: '2024-03-01' },
  { id: '2', category: 'Packaging', description: 'Packaging materials', amount: 5000, date: '2024-03-05', vendor: 'Packaging Hub', paymentMethod: 'Cash', createdAt: '2024-03-05' },
  { id: '3', category: 'Marketing', description: 'Facebook Ads', amount: 10000, date: '2024-03-08', vendor: 'Meta', paymentMethod: 'Card', createdAt: '2024-03-08' },
  { id: '4', category: 'Utilities', description: 'Electricity bill', amount: 8000, date: '2024-03-10', vendor: 'K-Electric', paymentMethod: 'Bank Transfer', createdAt: '2024-03-10' },
];

export const defaultIncome: Income[] = [
  { id: '1', category: 'Sales', description: 'Online orders', amount: 45000, date: '2024-03-01', source: 'Website', paymentMethod: 'Bank Transfer', createdAt: '2024-03-01' },
  { id: '2', category: 'Sales', description: 'Daraz orders', amount: 28000, date: '2024-03-05', source: 'Daraz', paymentMethod: 'Bank Transfer', createdAt: '2024-03-05' },
  { id: '3', category: 'Other', description: 'Refund from supplier', amount: 3000, date: '2024-03-10', source: 'Supplier', paymentMethod: 'Cash', createdAt: '2024-03-10' },
];

export const defaultInvoices: Invoice[] = [
  { id: '1', invoiceNumber: 'INV-001', orderId: '1', customerId: '1', customerName: 'Ahmed Khan', amount: 5200, status: 'paid', dueDate: '2024-03-01', createdAt: '2024-02-20' },
  { id: '2', invoiceNumber: 'INV-002', orderId: '2', customerId: '2', customerName: 'Fatima Ali', amount: 3650, status: 'paid', dueDate: '2024-03-15', createdAt: '2024-03-01' },
  { id: '3', invoiceNumber: 'INV-003', orderId: '3', customerId: '3', customerName: 'Muhammad Usman', amount: 5600, status: 'sent', dueDate: '2024-03-25', createdAt: '2024-03-10' },
];
