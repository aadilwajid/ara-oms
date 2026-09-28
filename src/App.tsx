import { useState, useEffect, useCallback } from 'react';
import { Page, Product, Customer, Order, Invoice, Expense, Income, BusinessSettings, MediaItem, ActivityLog, ReturnRequest } from './types';
import { loadFromStorage, saveToStorage, defaultSettings, defaultProducts, defaultCustomers, defaultOrders, defaultInvoices, defaultExpenses, defaultIncome, defaultMedia, defaultActivityLog } from './store';
import Dashboard from './pages/Dashboard';
import OrdersPage from './pages/OrdersPage';
import CustomersPage from './pages/CustomersPage';
import ProductsPage from './pages/ProductsPage';
import InventoryPage from './pages/InventoryPage';
import InvoicesPage from './pages/InvoicesPage';
import ExpensesPage from './pages/ExpensesPage';
import IncomePage from './pages/IncomePage';
import MediaPage from './pages/MediaPage';
import ReportsPage from './pages/ReportsPage';
import ReturnsPage from './pages/ReturnsPage';
import AdvancedInventoryPage from './pages/AdvancedInventoryPage';
import SuppliersPage from './pages/SuppliersPage';
import PromotionsPage from './pages/PromotionsPage';
import MarketingPage from './pages/MarketingPage';
import SettingsPage from './pages/SettingsPage';
import { LayoutDashboard, ShoppingCart, Users, Package, Warehouse, FileText, TrendingDown, TrendingUp, Settings, Menu, X, Store, Image as ImageIcon, Plus, Download, Moon, Sun, Bell, BarChart3, RotateCcw, Boxes, Truck, Award } from 'lucide-react';
import Toast from './components/Toast';
import QuickActions from './components/QuickActions';
import AuditLog from './components/AuditLog';
import GlobalSearch from './components/GlobalSearch';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncome] = useState<Income[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [settings, setSettings] = useState<BusinessSettings>(defaultSettings);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    setProducts(loadFromStorage('oms_products', defaultProducts));
    setCustomers(loadFromStorage('oms_customers', defaultCustomers));
    setOrders(loadFromStorage('oms_orders', defaultOrders));
    setInvoices(loadFromStorage('oms_invoices', defaultInvoices));
    setExpenses(loadFromStorage('oms_expenses', defaultExpenses));
    setIncome(loadFromStorage('oms_income', defaultIncome));
    setMedia(loadFromStorage('oms_media', defaultMedia));
    setActivityLog(loadFromStorage('oms_activity_log', defaultActivityLog));
    setReturns(loadFromStorage('oms_returns', []));
    setSettings(loadFromStorage('oms_settings', defaultSettings));
    setDarkMode(loadFromStorage('oms_dark_mode', false));
  }, []);

  useEffect(() => { saveToStorage('oms_products', products); }, [products]);
  useEffect(() => { saveToStorage('oms_customers', customers); }, [customers]);
  useEffect(() => { saveToStorage('oms_orders', orders); }, [orders]);
  useEffect(() => { saveToStorage('oms_invoices', invoices); }, [invoices]);
  useEffect(() => { saveToStorage('oms_expenses', expenses); }, [expenses]);
  useEffect(() => { saveToStorage('oms_income', income); }, [income]);
  useEffect(() => { saveToStorage('oms_media', media); }, [media]);
  useEffect(() => { saveToStorage('oms_returns', returns); }, [returns]);
  useEffect(() => { saveToStorage('oms_activity_log', activityLog); }, [activityLog]);
  useEffect(() => { saveToStorage('oms_settings', settings); }, [settings]);
  
  // Dark mode effect - apply to document element
  useEffect(() => {
    saveToStorage('oms_dark_mode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Toast notification system
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  // Activity logging
  const logActivity = useCallback((action: string, details: string) => {
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      action,
      details,
      timestamp: new Date().toISOString(),
      user: settings.ownerName || 'Admin',
    };
    setActivityLog(prev => [newLog, ...prev].slice(0, 100)); // Keep last 100 entries
  }, [settings.ownerName]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'n':
            e.preventDefault();
            if (currentPage === 'orders') {
              // Trigger new order modal (handled by OrdersPage)
              window.dispatchEvent(new CustomEvent('oms:newOrder'));
            }
            break;
          case 'k':
            e.preventDefault();
            // Focus search
            const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
            searchInput?.focus();
            break;
          case 'd':
            e.preventDefault();
            setDarkMode(prev => !prev);
            showToast(`${!darkMode ? 'Dark' : 'Light'} mode enabled`, 'info');
            break;
        }
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, darkMode, showToast]);

  // Export data
  const exportData = (format: 'json' | 'csv') => {
    const data = {
      products,
      customers,
      orders,
      invoices,
      expenses,
      income,
      settings,
      exportDate: new Date().toISOString(),
    };

    let content: string;
    let mimeType: string;
    let extension: string;

    if (format === 'json') {
      content = JSON.stringify(data, null, 2);
      mimeType = 'application/json';
      extension = 'json';
    } else {
      // CSV export - combine all data
      const rows = [
        ['Type', 'ID', 'Name/Number', 'Amount', 'Date', 'Status'],
        ...products.map(p => ['Product', p.id, p.name, p.price.toString(), p.createdAt, '']),
        ...customers.map(c => ['Customer', c.id, c.name, c.totalSpent.toString(), c.createdAt, '']),
        ...orders.map(o => ['Order', o.id, o.orderNumber, o.total.toString(), o.createdAt, o.status]),
      ];
      content = rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
      mimeType = 'text/csv';
      extension = 'csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `store-backup-${new Date().toISOString().split('T')[0]}.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Data exported as ${format.toUpperCase()}`, 'success');
    logActivity('Data Export', `Exported all data as ${format.toUpperCase()}`);
  };

  // Notifications
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold).length;
  const overdueInvoices = invoices.filter(i => i.status === 'sent' && new Date(i.dueDate) < new Date()).length;
  const hasNotifications = pendingOrders > 0 || lowStockProducts > 0 || overdueInvoices > 0;

  const navItems = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders' as Page, label: 'Orders', icon: ShoppingCart },
    { id: 'customers' as Page, label: 'Customers', icon: Users },
    { id: 'products' as Page, label: 'Products', icon: Package },
    { id: 'inventory' as Page, label: 'Inventory', icon: Warehouse },
    { id: 'advanced-inventory' as Page, label: 'Advanced Inventory', icon: Boxes },
    { id: 'suppliers' as Page, label: 'Suppliers & PO', icon: Truck },
    { id: 'promotions' as Page, label: 'Promotions', icon: Award },
    { id: 'marketing' as Page, label: 'Marketing & CRM', icon: Users },
    { id: 'media' as Page, label: 'Media', icon: ImageIcon },
    { id: 'invoices' as Page, label: 'Invoices', icon: FileText },
    { id: 'reports' as Page, label: 'Reports', icon: BarChart3 },
    { id: 'returns' as Page, label: 'Returns', icon: RotateCcw },
    { id: 'expenses' as Page, label: 'Expenses', icon: TrendingDown },
    { id: 'income' as Page, label: 'Income', icon: TrendingUp },
    { id: 'settings' as Page, label: 'Settings', icon: Settings },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard orders={orders} customers={customers} products={products} expenses={expenses} income={income} settings={settings} />;
      case 'orders': return <OrdersPage orders={orders} setOrders={setOrders} customers={customers} products={products} settings={settings} media={media} showToast={showToast} logActivity={logActivity} />;
      case 'customers': return <CustomersPage customers={customers} setCustomers={setCustomers} settings={settings} />;
      case 'products': return <ProductsPage products={products} setProducts={setProducts} media={media} />;
      case 'inventory': return <InventoryPage products={products} setProducts={setProducts} settings={settings} />;
      case 'advanced-inventory': return <AdvancedInventoryPage products={products} setProducts={setProducts} settings={settings} />;
      case 'suppliers': return <SuppliersPage settings={settings} />;
      case 'promotions': return <PromotionsPage settings={settings} />;
      case 'marketing': return <MarketingPage settings={settings} />;
      case 'invoices': return <InvoicesPage invoices={invoices} setInvoices={setInvoices} orders={orders} customers={customers} settings={settings} />;
      case 'expenses': return <ExpensesPage expenses={expenses} setExpenses={setExpenses} />;
      case 'income': return <IncomePage income={income} setIncome={setIncome} />;
      case 'media': return <MediaPage media={media} setMedia={setMedia} />;
      case 'reports': return <ReportsPage orders={orders} customers={customers} products={products} expenses={expenses} income={income} settings={settings} />;
      case 'returns': return <ReturnsPage returns={returns} setReturns={setReturns} orders={orders} customers={customers} settings={settings} />;
      case 'settings': return <SettingsPage settings={settings} setSettings={setSettings} media={media} activityLog={activityLog} />;
      default: return <Dashboard orders={orders} customers={customers} products={products} expenses={expenses} income={income} settings={settings} />;
    }
  };

  return (
    <div className={`flex h-screen bg-gray-50 overflow-hidden ${darkMode ? 'dark' : ''}`}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-emerald-800 to-emerald-900 text-white transform transition-transform duration-200 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-emerald-700 shrink-0">
          {settings.logo ? (
            <img src={settings.logo} alt="Logo" className="w-8 h-8 rounded-lg object-cover" />
          ) : (
            <Store className="w-8 h-8 text-emerald-300" />
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold truncate">{settings.storeName}</h1>
            <p className="text-xs text-emerald-300">Order Management</p>
          </div>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="mt-4 px-3 flex-1 overflow-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setCurrentPage(item.id); setSidebarOpen(false); }}
              className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg mb-0.5 text-left transition-colors text-sm ${
                currentPage === item.id
                  ? 'bg-emerald-700 text-white font-medium'
                  : 'text-emerald-200 hover:bg-emerald-700/50 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
              {item.id === 'media' && media.length > 0 && (
                <span className="ml-auto bg-emerald-600 text-xs px-1.5 py-0.5 rounded-full">{media.length}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-emerald-700 shrink-0 space-y-1">
          <div className="flex gap-1">
            <button onClick={() => exportData('json')} className="flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-lg text-emerald-200 hover:bg-emerald-700/50 hover:text-white text-xs transition-colors" title="Export as JSON">
              <Download className="w-4 h-4" />
              <span>JSON</span>
            </button>
            <button onClick={() => exportData('csv')} className="flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-lg text-emerald-200 hover:bg-emerald-700/50 hover:text-white text-xs transition-colors" title="Export as CSV">
              <Download className="w-4 h-4" />
              <span>CSV</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b px-4 lg:px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <h2 className="text-xl font-semibold text-gray-800 capitalize">{currentPage}</h2>
          <div className="ml-auto flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
                {hasNotifications && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border z-50">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-auto">
                    {pendingOrders > 0 && (
                      <div className="p-4 border-b hover:bg-gray-50 cursor-pointer" onClick={() => { setCurrentPage('orders'); setShowNotifications(false); }}>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                            <ShoppingCart className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{pendingOrders} Pending Orders</p>
                            <p className="text-xs text-gray-500 mt-0.5">Orders need processing</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {lowStockProducts > 0 && (
                      <div className="p-4 border-b hover:bg-gray-50 cursor-pointer" onClick={() => { setCurrentPage('inventory'); setShowNotifications(false); }}>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                            <Package className="w-4 h-4 text-amber-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{lowStockProducts} Low Stock Items</p>
                            <p className="text-xs text-gray-500 mt-0.5">Products need restocking</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {overdueInvoices > 0 && (
                      <div className="p-4 border-b hover:bg-gray-50 cursor-pointer" onClick={() => { setCurrentPage('invoices'); setShowNotifications(false); }}>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4 text-red-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{overdueInvoices} Overdue Invoices</p>
                            <p className="text-xs text-gray-500 mt-0.5">Invoices past due date</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {!hasNotifications && (
                      <div className="p-8 text-center text-gray-400">
                        <Bell className="w-12 h-12 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No notifications</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button onClick={() => { setDarkMode(!darkMode); showToast(`${!darkMode ? 'Dark' : 'Light'} mode enabled`, 'info'); }} className="p-2 hover:bg-gray-100 rounded-lg">
              {darkMode ? <Sun className="w-5 h-5 text-gray-600" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>

            <span className="text-sm text-gray-500 hidden sm:inline">{settings.currency}</span>
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-medium overflow-hidden">
              {settings.logo ? (
                <img src={settings.logo} alt="" className="w-full h-full object-cover" />
              ) : (
                settings.ownerName ? settings.ownerName[0].toUpperCase() : 'A'
              )}
            </div>
          </div>
        </header>
        <div className="p-4 lg:p-6">
          {renderPage()}
        </div>
      </main>

      {/* Floating Action Button - Fixed Bottom Right */}
      <div className="fixed bottom-6 right-6 z-40">
        <QuickActions
          onNewOrder={() => { setCurrentPage('orders'); window.dispatchEvent(new CustomEvent('oms:newOrder')); }}
          onNewProduct={() => { setCurrentPage('products'); window.dispatchEvent(new CustomEvent('oms:newProduct')); }}
          onNewCustomer={() => { setCurrentPage('customers'); window.dispatchEvent(new CustomEvent('oms:newCustomer')); }}
        />
      </div>

      {/* Global Search */}
      <GlobalSearch
        orders={orders}
        customers={customers}
        products={products}
        invoices={invoices}
        onNavigate={(page) => setCurrentPage(page as Page)}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} />
    </div>
  );
}

export default App;
