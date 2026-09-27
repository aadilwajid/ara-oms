import { useState, useEffect } from 'react';
import { Page, Product, Customer, Order, Invoice, Expense, Income, BusinessSettings, MediaItem } from './types';
import { loadFromStorage, saveToStorage, defaultSettings, defaultProducts, defaultCustomers, defaultOrders, defaultInvoices, defaultExpenses, defaultIncome, defaultMedia } from './store';
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
import { LayoutDashboard, ShoppingCart, Users, Package, Warehouse, FileText, TrendingDown, TrendingUp, Settings, Menu, X, Store, Image as ImageIcon, Lightbulb } from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncome] = useState<Income[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [settings, setSettings] = useState<BusinessSettings>(defaultSettings);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setProducts(loadFromStorage('oms_products', defaultProducts));
    setCustomers(loadFromStorage('oms_customers', defaultCustomers));
    setOrders(loadFromStorage('oms_orders', defaultOrders));
    setInvoices(loadFromStorage('oms_invoices', defaultInvoices));
    setExpenses(loadFromStorage('oms_expenses', defaultExpenses));
    setIncome(loadFromStorage('oms_income', defaultIncome));
    setMedia(loadFromStorage('oms_media', defaultMedia));
    setSettings(loadFromStorage('oms_settings', defaultSettings));
  }, []);

  useEffect(() => { saveToStorage('oms_products', products); }, [products]);
  useEffect(() => { saveToStorage('oms_customers', customers); }, [customers]);
  useEffect(() => { saveToStorage('oms_orders', orders); }, [orders]);
  useEffect(() => { saveToStorage('oms_invoices', invoices); }, [invoices]);
  useEffect(() => { saveToStorage('oms_expenses', expenses); }, [expenses]);
  useEffect(() => { saveToStorage('oms_income', income); }, [income]);
  useEffect(() => { saveToStorage('oms_media', media); }, [media]);
  useEffect(() => { saveToStorage('oms_settings', settings); }, [settings]);

  const navItems = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders' as Page, label: 'Orders', icon: ShoppingCart },
    { id: 'customers' as Page, label: 'Customers', icon: Users },
    { id: 'products' as Page, label: 'Products', icon: Package },
    { id: 'inventory' as Page, label: 'Inventory', icon: Warehouse },
    { id: 'media' as Page, label: 'Media', icon: ImageIcon },
    { id: 'invoices' as Page, label: 'Invoices', icon: FileText },
    { id: 'expenses' as Page, label: 'Expenses', icon: TrendingDown },
    { id: 'income' as Page, label: 'Income', icon: TrendingUp },
    { id: 'settings' as Page, label: 'Settings', icon: Settings },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard orders={orders} customers={customers} products={products} expenses={expenses} income={income} settings={settings} />;
      case 'orders': return <OrdersPage orders={orders} setOrders={setOrders} customers={customers} products={products} settings={settings} media={media} />;
      case 'customers': return <CustomersPage customers={customers} setCustomers={setCustomers} />;
      case 'products': return <ProductsPage products={products} setProducts={setProducts} media={media} />;
      case 'inventory': return <InventoryPage products={products} setProducts={setProducts} settings={settings} />;
      case 'invoices': return <InvoicesPage invoices={invoices} setInvoices={setInvoices} orders={orders} customers={customers} settings={settings} />;
      case 'expenses': return <ExpensesPage expenses={expenses} setExpenses={setExpenses} />;
      case 'income': return <IncomePage income={income} setIncome={setIncome} />;
      case 'media': return <MediaPage media={media} setMedia={setMedia} />;
      case 'settings': return <SettingsPage settings={settings} setSettings={setSettings} media={media} />;
      default: return <Dashboard orders={orders} customers={customers} products={products} expenses={expenses} income={income} settings={settings} />;
    }
  };

  const suggestedFeatures = [
    { title: 'Bulk Order Import', desc: 'Import orders from CSV/Excel files for bulk processing', icon: '📥' },
    { title: 'Courier Integration', desc: 'Auto-generate shipping labels with TCS, Leopards, CallCourier APIs', icon: '🚚' },
    { title: 'SMS/WhatsApp Notifications', desc: 'Auto-send order confirmations and delivery updates', icon: '💬' },
    { title: 'Multi-Warehouse Support', desc: 'Manage stock across multiple warehouse locations', icon: '🏭' },
    { title: 'Supplier Management', desc: 'Track suppliers, purchase orders, and lead times', icon: '🤝' },
    { title: 'Sales Reports & Analytics', desc: 'Detailed charts for revenue, best sellers, and trends', icon: '📊' },
    { title: 'Discount & Coupon System', desc: 'Create promo codes and automatic discounts', icon: '🏷️' },
    { title: 'Return & Refund Management', desc: 'Process returns with RMA numbers and refund tracking', icon: '↩️' },
    { title: 'Employee/User Roles', desc: 'Multi-user access with role-based permissions', icon: '👥' },
    { title: 'Tax Reports (FBR)', desc: 'Generate tax reports compliant with FBR Pakistan', icon: '📋' },
    { title: 'Barcode/QR Scanner', desc: 'Scan barcodes for quick inventory and order processing', icon: '📱' },
    { title: 'Customer Loyalty Program', desc: 'Reward points system for repeat customers', icon: '⭐' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
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
        <div className="p-3 border-t border-emerald-700 shrink-0">
          <button onClick={() => setShowSuggestions(true)} className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-emerald-200 hover:bg-emerald-700/50 hover:text-white text-sm transition-colors">
            <Lightbulb className="w-5 h-5" />
            <span>Feature Ideas</span>
          </button>
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

      {/* Feature Suggestions Modal */}
      {showSuggestions && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowSuggestions(false)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b flex items-center justify-between sticky top-0 bg-white">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-semibold">Suggested Features</h3>
              </div>
              <button onClick={() => setShowSuggestions(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-600 mb-4">Here are powerful features you can add to make your OMS even better for your Pakistani e-commerce business:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {suggestedFeatures.map((f, i) => (
                  <div key={i} className="border rounded-lg p-3 hover:border-emerald-300 hover:bg-emerald-50/30 transition-colors">
                    <div className="flex items-start gap-2">
                      <span className="text-xl">{f.icon}</span>
                      <div>
                        <h4 className="font-medium text-sm text-gray-800">{f.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h4 className="font-medium text-blue-800 text-sm mb-1">💡 Pro Tips for Your Store</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Use Media Manager to upload product photos, then assign them in Products page</li>
                  <li>• Set up your store logo in Settings for professional invoices</li>
                  <li>• Track all channels (Daraz, WhatsApp, Instagram) in one place</li>
                  <li>• Monitor low stock alerts from the Dashboard</li>
                  <li>• Use expense tracking to calculate your actual profit margins</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
