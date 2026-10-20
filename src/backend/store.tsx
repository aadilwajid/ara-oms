// Global State Management using React Context
// Centralized state for the entire application

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { api } from './api';
import { authService, AuthUser } from './auth';
import { Product, Customer, Order, Invoice, Expense, Income, MediaItem, BusinessSettings } from '../types';

// State interface
interface AppState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  products: Product[];
  customers: Customer[];
  orders: Order[];
  invoices: Invoice[];
  expenses: Expense[];
  income: Income[];
  media: MediaItem[];
  settings: BusinessSettings;
  loading: boolean;
  error: string | null;
  notifications: Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>;
}

// Action types
type AppAction =
  | { type: 'SET_USER'; payload: AuthUser | null }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'SET_CUSTOMERS'; payload: Customer[] }
  | { type: 'ADD_CUSTOMER'; payload: Customer }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER'; payload: Order }
  | { type: 'SET_INVOICES'; payload: Invoice[] }
  | { type: 'ADD_INVOICE'; payload: Invoice }
  | { type: 'SET_EXPENSES'; payload: Expense[] }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'SET_INCOME'; payload: Income[] }
  | { type: 'ADD_INCOME'; payload: Income }
  | { type: 'SET_MEDIA'; payload: MediaItem[] }
  | { type: 'ADD_MEDIA'; payload: MediaItem }
  | { type: 'SET_SETTINGS'; payload: BusinessSettings }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_NOTIFICATION'; payload: { id: string; message: string; type: 'success' | 'error' | 'info' } }
  | { type: 'REMOVE_NOTIFICATION'; payload: string };

// Initial state
const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  products: [],
  customers: [],
  orders: [],
  invoices: [],
  expenses: [],
  income: [],
  media: [],
  settings: {
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
    bannerColor: '#059669',
    receiptFooter: 'Thank you for your business!',
  },
  loading: false,
  error: null,
  notifications: [],
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: action.payload !== null };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'ADD_PRODUCT':
      return { ...state, products: [action.payload, ...state.products] };
    case 'UPDATE_PRODUCT':
      return { ...state, products: state.products.map(p => p.id === action.payload.id ? action.payload : p) };
    case 'DELETE_PRODUCT':
      return { ...state, products: state.products.filter(p => p.id !== action.payload) };
    case 'SET_CUSTOMERS':
      return { ...state, customers: action.payload };
    case 'ADD_CUSTOMER':
      return { ...state, customers: [action.payload, ...state.customers] };
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    case 'ADD_ORDER':
      return { ...state, orders: [action.payload, ...state.orders] };
    case 'UPDATE_ORDER':
      return { ...state, orders: state.orders.map(o => o.id === action.payload.id ? action.payload : o) };
    case 'SET_INVOICES':
      return { ...state, invoices: action.payload };
    case 'ADD_INVOICE':
      return { ...state, invoices: [action.payload, ...state.invoices] };
    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload };
    case 'ADD_EXPENSE':
      return { ...state, expenses: [action.payload, ...state.expenses] };
    case 'SET_INCOME':
      return { ...state, income: action.payload };
    case 'ADD_INCOME':
      return { ...state, income: [action.payload, ...state.income] };
    case 'SET_MEDIA':
      return { ...state, media: action.payload };
    case 'ADD_MEDIA':
      return { ...state, media: [action.payload, ...state.media] };
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] };
    case 'REMOVE_NOTIFICATION':
      return { ...state, notifications: state.notifications.filter(n => n.id !== action.payload) };
    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadInitialData: () => Promise<void>;
  notify: (message: string, type: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider Component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const loadInitialData = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const [productsRes, customersRes, ordersRes, invoicesRes, expensesRes, incomeRes, mediaRes] = await Promise.all([
        api.getProducts(),
        api.getCustomers(),
        api.getOrders(),
        api.getInvoices(),
        api.getExpenses(),
        api.getIncome(),
        api.getMedia(),
      ]);

      if (productsRes.success && productsRes.data) dispatch({ type: 'SET_PRODUCTS', payload: productsRes.data });
      if (customersRes.success && customersRes.data) dispatch({ type: 'SET_CUSTOMERS', payload: customersRes.data });
      if (ordersRes.success && ordersRes.data) dispatch({ type: 'SET_ORDERS', payload: ordersRes.data });
      if (invoicesRes.success && invoicesRes.data) dispatch({ type: 'SET_INVOICES', payload: invoicesRes.data });
      if (expensesRes.success && expensesRes.data) dispatch({ type: 'SET_EXPENSES', payload: expensesRes.data });
      if (incomeRes.success && incomeRes.data) dispatch({ type: 'SET_INCOME', payload: incomeRes.data });
      if (mediaRes.success && mediaRes.data) dispatch({ type: 'SET_MEDIA', payload: mediaRes.data });

      const savedSettings = localStorage.getItem('settings');
      if (savedSettings) {
        dispatch({ type: 'SET_SETTINGS', payload: JSON.parse(savedSettings) });
      }

      const user = authService.getCurrentUser();
      if (user) {
        dispatch({ type: 'SET_USER', payload: user });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load data' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    if (response.success && response.user) {
      dispatch({ type: 'SET_USER', payload: response.user });
      notify('Login successful', 'success');
    } else {
      notify(response.error || 'Login failed', 'error');
    }
  };

  const logout = async () => {
    await authService.logout();
    dispatch({ type: 'SET_USER', payload: null });
    notify('Logged out successfully', 'info');
  };

  const notify = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString();
    dispatch({ type: 'ADD_NOTIFICATION', payload: { id, message, type } });
    setTimeout(() => {
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
    }, 3000);
  };

  useEffect(() => {
    loadInitialData();
    authService.initializeDefaultUsers();
  }, []);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(state.settings));
  }, [state.settings]);

  return (
    <AppContext.Provider value={{ state, dispatch, login, logout, loadInitialData, notify }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
