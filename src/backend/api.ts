// Backend API Service Layer
// Handles all business logic and data operations

import { db } from './database';
import { Product, Customer, Order, Invoice, Expense, Income, MediaItem, ActivityLog } from '../types';

// Response types
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

// API Service Class
class ApiService {
  // Products
  async getProducts(): Promise<ApiResponse<Product[]>> {
    try {
      const products = await db.getAll<Product>('products');
      return { success: true, data: products, timestamp: new Date().toISOString() };
    } catch (error) {
      return { success: false, error: 'Failed to fetch products', timestamp: new Date().toISOString() };
    }
  }

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    try {
      const product = await db.getById<Product>('products', id);
      if (!product) {
        return { success: false, error: 'Product not found', timestamp: new Date().toISOString() };
      }
      return { success: true, data: product, timestamp: new Date().toISOString() };
    } catch (error) {
      return { success: false, error: 'Failed to fetch product', timestamp: new Date().toISOString() };
    }
  }

  async createProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<ApiResponse<Product>> {
    try {
      const newProduct: Product = {
        ...product,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      await db.create('products', newProduct);
      await this.logActivity('Product Created', `Created product: ${product.name}`);
      return { success: true, data: newProduct, timestamp: new Date().toISOString() };
    } catch (error) {
      return { success: false, error: 'Failed to create product', timestamp: new Date().toISOString() };
    }
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<ApiResponse<Product>> {
    try {
      const updated = await db.update<Product>('products', id, updates);
      if (!updated) {
        return { success: false, error: 'Product not found', timestamp: new Date().toISOString() };
      }
      await this.logActivity('Product Updated', `Updated product: ${updated.name}`);
      return { success: true, data: updated, timestamp: new Date().toISOString() };
    } catch (error) {
      return { success: false, error: 'Failed to update product', timestamp: new Date().toISOString() };
    }
  }

  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    try {
      const product = await db.getById<Product>('products', id);
      const deleted = await db.delete('products', id);
      if (!deleted) {
        return { success: false, error: 'Product not found', timestamp: new Date().toISOString() };
      }
      await this.logActivity('Product Deleted', `Deleted product: ${product?.name}`);
      return { success: true, timestamp: new Date().toISOString() };
    } catch (error) {
      return { success: false, error: 'Failed to delete product', timestamp: new Date().toISOString() };
    }
  }

  // Customers
  async getCustomers(): Promise<ApiResponse<Customer[]>> {
    try {
      const customers = await db.getAll<Customer>('customers');
      return { success: true, data: customers, timestamp: new Date().toISOString() };
    } catch (error) {
      return { success: false, error: 'Failed to fetch customers', timestamp: new Date().toISOString() };
    }
  }

  async createCustomer(customer: Omit<Customer, 'id' | 'createdAt'>): Promise<ApiResponse<Customer>> {
    try {
      const newCustomer: Customer = {
        ...customer,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      await db.create('customers', newCustomer);
      await this.logActivity('Customer Created', `Created customer: ${customer.name}`);
      return { success: true, data: newCustomer, timestamp: new Date().toISOString() };
    } catch (error) {
      return { success: false, error: 'Failed to create customer', timestamp: new Date().toISOString() };
    }
  }

  // Orders
  async getOrders(): Promise<ApiResponse<Order[]>> {
    try {
      const orders = await db.getAll<Order>('orders');
      return { success: true, data: orders, timestamp: new Date().toISOString() };
    } catch (error) {
      return { success: false, error: 'Failed to fetch orders', timestamp: new Date().toISOString() };
    }
  }

  async createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Order>> {
    try {
      const newOrder: Order = {
        ...order,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await db.create('orders', newOrder);
      
      // Update customer stats
      const customer = await db.getById<Customer>('customers', order.customerId);
      if (customer) {
        await db.update('customers', customer.id, {
          totalOrders: customer.totalOrders + 1,
          totalSpent: customer.totalSpent + order.total,
        });
      }
      
      // Update product stock
      for (const item of order.items) {
        const product = await db.getById<Product>('products', item.productId);
        if (product) {
          await db.update('products', product.id, {
            stock: product.stock - item.quantity,
          });
        }
      }
      
      await this.logActivity('Order Created', `Created order: ${order.orderNumber}`);
      return { success: true, data: newOrder, timestamp: new Date().toISOString() };
    } catch (error) {
      return { success: false, error: 'Failed to create order', timestamp: new Date().toISOString() };
    }
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<ApiResponse<Order>> {
    try {
      const updated = await db.update<Order>('orders', id, { 
        status, 
        updatedAt: new Date().toISOString() 
      });
      if (!updated) {
        return { success: false, error: 'Order not found', timestamp: new Date().toISOString() };
      }
      await this.logActivity('Order Status Updated', `Order ${updated.orderNumber} status: ${status}`);
      return { success: true, data: updated, timestamp: new Date().toISOString() };
    } catch (error) {
      return { success: false, error: 'Failed to update order', timestamp: new Date().toISOString() };
    }
  }

  // Invoices
  async getInvoices(): Promise<ApiResponse<Invoice[]>> {
    try {
      const invoices = await db.getAll<Invoice>('invoices');
      return { success: true, data: invoices, timestamp: new Date().toISOString() };
    } catch (error) {
      return { success: false, error: 'Failed to fetch invoices', timestamp: new Date().toISOString() };
    }
  }

  async createInvoice(invoice: Omit<Invoice, 'id' | 'createdAt'>): Promise<ApiResponse<Invoice>> {
    try {
      const newInvoice: Invoice = {
        ...invoice,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      await db.create('invoices', newInvoice);
      await this.logActivity('Invoice Created', `Created invoice: ${invoice.invoiceNumber}`);
      return { success: true, data: newInvoice, timestamp: new Date().toISOString() };
    } catch (error) {
      return { success: false, error: 'Failed to create invoice', timestamp: new Date().toISOString() };
    }
  }

  // Expenses
  async getExpenses(): Promise<ApiResponse<Expense[]>> {
    try {
      const expenses = await db.getAll<Expense>('expenses');
      return { success: true, data: expenses, timestamp: new Date().toISOString() };
    } catch (error) {
      return { success: false, error: 'Failed to fetch expenses', timestamp: new Date().toISOString() };
    }
  }

  async createExpense(expense: Omit<Expense, 'id' | 'createdAt'>): Promise<ApiResponse<Expense>> {
    try {
      const newExpense: Expense = {
        ...expense,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      await db.create('expenses', newExpense);
      await this.logActivity('Expense Created', `Created expense: ${expense.description}`);
      return { success: true, data: newExpense, timestamp: new Date().toISOString() };
    } catch (error) {
      return { success: false, error: 'Failed to create expense', timestamp: new Date().toISOString() };
    }
  }

  // Income
  async getIncome(): Promise<ApiResponse<Income[]>> {
    try {
      const income = await db.getAll<Income>('income');
      return { success: true, data: income, timestamp: new Date().toISOString() };
    } catch (error) {
      return { success: false, error: 'Failed to fetch income', timestamp: new Date().toISOString() };
    }
  }

  async createIncome(income: Omit<Income, 'id' | 'createdAt'>): Promise<ApiResponse<Income>> {
    try {
      const newIncome: Income = {
        ...income,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      await db.create('income', newIncome);
      await this.logActivity('Income Created', `Created income: ${income.description}`);
      return { success: true, data: newIncome, timestamp: new Date().toISOString() };
    } catch (error) {
      return { success: false, error: 'Failed to create income', timestamp: new Date().toISOString() };
    }
  }

  // Media
  async getMedia(): Promise<ApiResponse<MediaItem[]>> {
    try {
      const media = await db.getAll<MediaItem>('media');
      return { success: true, data: media, timestamp: new Date().toISOString() };
    } catch (error) {
      return { success: false, error: 'Failed to fetch media', timestamp: new Date().toISOString() };
    }
  }

  async uploadMedia(media: Omit<MediaItem, 'id' | 'createdAt'>): Promise<ApiResponse<MediaItem>> {
    try {
      const newMedia: MediaItem = {
        ...media,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      await db.create('media', newMedia);
      return { success: true, data: newMedia, timestamp: new Date().toISOString() };
    } catch (error) {
      return { success: false, error: 'Failed to upload media', timestamp: new Date().toISOString() };
    }
  }

  // Analytics
  async getDashboardStats(): Promise<ApiResponse<any>> {
    try {
      const orders = await db.getAll<Order>('orders');
      const customers = await db.getAll<Customer>('customers');
      const products = await db.getAll<Product>('products');
      const expenses = await db.getAll<Expense>('expenses');
      const income = await db.getAll<Income>('income');

      const totalRevenue = income.reduce((sum, i) => sum + i.amount, 0);
      const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
      const netProfit = totalRevenue - totalExpenses;
      const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
      const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold).length;

      return {
        success: true,
        data: {
          totalRevenue,
          totalExpenses,
          netProfit,
          totalOrders: orders.length,
          pendingOrders,
          totalCustomers: customers.length,
          totalProducts: products.length,
          lowStockProducts,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return { success: false, error: 'Failed to fetch dashboard stats', timestamp: new Date().toISOString() };
    }
  }

  // Activity Logging
  private async logActivity(action: string, details: string): Promise<void> {
    const currentUser = localStorage.getItem('current_user');
    const user = currentUser ? JSON.parse(currentUser) : { name: 'System' };
    
    const log: ActivityLog = {
      id: Date.now().toString(),
      action,
      details,
      timestamp: new Date().toISOString(),
      user: user.name,
    };
    
    const logs = await db.getAll<ActivityLog>('activity_logs');
    logs.unshift(log);
    // Keep only last 100 logs
    const trimmedLogs = logs.slice(0, 100);
    localStorage.setItem('db_activity_logs', JSON.stringify(trimmedLogs));
  }

  async getActivityLogs(): Promise<ApiResponse<ActivityLog[]>> {
    try {
      const logs = await db.getAll<ActivityLog>('activity_logs');
      return { success: true, data: logs, timestamp: new Date().toISOString() };
    } catch (error) {
      return { success: false, error: 'Failed to fetch activity logs', timestamp: new Date().toISOString() };
    }
  }

  // Backup & Restore
  async backup(): Promise<ApiResponse<string>> {
    try {
      const backup = await db.backup();
      return { success: true, data: backup, timestamp: new Date().toISOString() };
    } catch (error) {
      return { success: false, error: 'Failed to backup data', timestamp: new Date().toISOString() };
    }
  }

  async restore(backupData: string): Promise<ApiResponse<void>> {
    try {
      await db.restore(backupData);
      return { success: true, timestamp: new Date().toISOString() };
    } catch (error) {
      return { success: false, error: 'Failed to restore data', timestamp: new Date().toISOString() };
    }
  }
}

export const api = new ApiService();
