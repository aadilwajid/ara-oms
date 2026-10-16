// Remodeled App.tsx - Clean, modular architecture with backend integration

import { useState } from 'react';
import { AppProvider, useApp } from './backend/store';
import { Page } from './types';
import { 
  LayoutDashboard, ShoppingCart, Users, Package, Warehouse, FileText, 
  TrendingDown, TrendingUp, Settings, Menu, X, Store, Image as ImageIcon, 
  Download, Moon, Sun, Bell, LogOut
} from 'lucide-react';

// Import all pages
import Dashboard from './pages/Dashboard';
import OrdersPage from './pages/OrdersPage';
import CustomersPage from './pages/CustomersPage';
import ProductsPage from './pages/ProductsPage';
import InventoryPage from './pages/InventoryPage';
import InvoicesPage from './pages/InvoicesPage';
import ExpensesPage from './pages/ExpensesPage';
import IncomePage from './pages/IncomePage';
import MediaPage from './pages/MediaPage';
import SettingsPage from './pages/SettingsPage';

// Navigation items configuration
const NAV_ITEMS = [
  { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'orders' as Page, label: 'Orders', icon: ShoppingCart },
  { id: 'customers' as Page, label: 'Customers', icon: Users },
  { id: 'products' as Page, label: 'Products', icon: Package },
  { id: 'inventory' as Page, label: 'Inventory', icon: Warehouse },
  { id: 'invoices' as Page, label: 'Invoices', icon: FileText },
  { id: 'expenses' as Page, label: 'Expenses', icon: TrendingDown },
  { id: 'income' as Page, label: 'Income', icon: TrendingUp },
  { id: 'media' as Page, label: 'Media', icon: ImageIcon },
  { id: 'settings' as Page, label: 'Settings', icon: Settings },
];

// Import Login Page
import LoginPage from './pages/LoginPage';

// Main App Content Component
function AppContent() {
  const { state, dispatch, logout } = useApp();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Show login page if not authenticated
  if (!state.isAuthenticated) {
    return <LoginPage />;
  }

  // Wrapper setters for backward compatibility
  const setProducts = (products: any) => dispatch({ type: 'SET_PRODUCTS', payload: products });
  const setCustomers = (customers: any) => dispatch({ type: 'SET_CUSTOMERS', payload: customers });
  const setOrders = (orders: any) => dispatch({ type: 'SET_ORDERS', payload: orders });
  const setInvoices = (invoices: any) => dispatch({ type: 'SET_INVOICES', payload: invoices });
  const setExpenses = (expenses: any) => dispatch({ type: 'SET_EXPENSES', payload: expenses });
  const setIncome = (income: any) => dispatch({ type: 'SET_INCOME', payload: income });
  const setMedia = (media: any) => dispatch({ type: 'SET_MEDIA', payload: media });
  const setSettings = (settings: any) => dispatch({ type: 'SET_SETTINGS', payload: settings });

  // Render current page
  const renderPage = () => {
    const { products, customers, orders, invoices, expenses, income, media, settings } = state;

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard orders={orders} customers={customers} products={products} expenses={expenses} income={income} settings={settings} />;
      case 'orders':
        return <OrdersPage orders={orders} setOrders={setOrders} customers={customers} products={products} settings={settings} media={media} />;
      case 'customers':
        return <CustomersPage customers={customers} setCustomers={setCustomers} settings={settings} />;
      case 'products':
        return <ProductsPage products={products} setProducts={setProducts} media={media} />;
      case 'inventory':
        return <InventoryPage products={products} setProducts={setProducts} settings={settings} />;
      case 'invoices':
        return <InvoicesPage invoices={invoices} setInvoices={setInvoices} orders={orders} customers={customers} settings={settings} />;
      case 'expenses':
        return <ExpensesPage expenses={expenses} setExpenses={setExpenses} />;
      case 'income':
        return <IncomePage income={income} setIncome={setIncome} />;
      case 'media':
        return <MediaPage media={media} setMedia={setMedia} />;
      case 'settings':
        return <SettingsPage settings={settings} setSettings={setSettings} media={media} />;
      default:
        return <Dashboard orders={orders} customers={customers} products={products} expenses={expenses} income={income} settings={settings} />;
    }
  };

  // Loading state
  if (state.loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading StoreOS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen bg-gray-50 overflow-hidden ${darkMode ? 'dark' : ''}`}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 text-white transform transition-transform duration-200 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`} style={{background: 'linear-gradient(to bottom, #065f46, #064e3b)'}}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-3 border-b" style={{borderColor: '#047857'}}>
          {state.settings.logo ? (
            <img src={state.settings.logo} alt="Logo" className="rounded w-8 h-8 object-cover" />
          ) : (
            <Store className="w-8 h-8" style={{color: '#6ee7b7'}} />
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold truncate mb-0">{state.settings.storeName}</h1>
            <p className="text-xs mb-0" style={{color: '#6ee7b7'}}>Order Management</p>
          </div>
          <button className="lg:hidden text-white p-0 bg-transparent border-0" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-3 px-2 flex-1 overflow-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => { setCurrentPage(item.id); setSidebarOpen(false); }}
              className={`flex items-center gap-2 w-full px-3 py-2 rounded mb-1 text-left text-sm transition-colors border-0 ${
                currentPage === item.id
                  ? 'text-white font-medium'
                  : 'text-emerald-200 hover:bg-white/10 hover:text-white'
              }`}
              style={{
                backgroundColor: currentPage === item.id ? '#047857' : 'transparent',
                color: currentPage === item.id ? '#fff' : '#a7f3d0'
              }}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Info */}
        {state.user && (
          <div className="p-3 border-t" style={{borderColor: '#047857'}}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
                {state.user.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{state.user.name}</p>
                <p className="text-xs text-emerald-300 truncate">{state.user.role}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded text-emerald-200 hover:bg-white/10 hover:text-white text-sm transition-colors bg-transparent border-0"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b px-3 lg:px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
          <button className="lg:hidden p-0 bg-transparent border-0" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <h2 className="text-xl font-semibold text-gray-800 capitalize mb-0">{currentPage}</h2>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 hover:bg-gray-100 rounded-lg bg-transparent border-0">
              {darkMode ? <Sun className="w-5 h-5 text-gray-600" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>
            <span className="text-sm text-gray-500 hidden sm:inline">{state.settings.currency}</span>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-6">
          {renderPage()}
        </div>
      </main>

      {/* Notifications */}
      {state.notifications.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 space-y-2">
          {state.notifications.map(notification => (
            <div
              key={notification.id}
              className={`px-4 py-3 rounded-lg shadow-lg animate-slide-in ${
                notification.type === 'success' ? 'bg-green-500 text-white' :
                notification.type === 'error' ? 'bg-red-500 text-white' :
                'bg-blue-500 text-white'
              }`}
            >
              {notification.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Root App Component with Provider
export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
