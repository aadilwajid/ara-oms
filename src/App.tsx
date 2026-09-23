import { useState, useEffect } from 'react';
import { Page, Product, Customer, Order, Invoice, Expense, Income, BusinessSettings } from './types';
import { loadFromStorage, saveToStorage, defaultSettings, defaultProducts, defaultCustomers, defaultOrders, defaultInvoices, defaultExpenses, defaultIncome } from './store';
import Dashboard from './pages/Dashboard';
import OrdersPage from './pages/OrdersPage';
import CustomersPage from './pages/CustomersPage';
import ProductsPage from './pages/ProductsPage';
import InventoryPage from './pages/InventoryPage';
import InvoicesPage from './pages/InvoicesPage';
import ExpensesPage from './pages/ExpensesPage';
import IncomePage from './pages/IncomePage';
import SettingsPage from './pages/SettingsPage';
import { LayoutDashboard, ShoppingCart, Users, Package, Warehouse, FileText, TrendingDown, TrendingUp, Settings, Menu, X, Store } from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncome] = useState<Income[]>([]);
  const [settings, setSettings] = useState<BusinessSettings>(defaultSettings);

  useEffect(() => {
    setProducts(loadFromStorage('oms_products', defaultProducts));
    setCustomers(loadFromStorage('oms_customers', defaultCustomers));
    setOrders(loadFromStorage('oms_orders', defaultOrders));
    setInvoices(loadFromStorage('oms_invoices', defaultInvoices));
    setExpenses(loadFromStorage('oms_expenses', defaultExpenses));
    setIncome(loadFromStorage('oms_income', defaultIncome));
    setSettings(loadFromStorage('oms_settings', defaultSettings));
  }, []);

  useEffect(() => { saveToStorage('oms_products', products); }, [products]);
  useEffect(() => { saveToStorage('oms_customers', customers); }, [customers]);
  useEffect(() => { saveToStorage('oms_orders', orders); }, [orders]);
  useEffect(() => { saveToStorage('oms_invoices', invoices); }, [invoices]);
  useEffect(() => { saveToStorage('oms_expenses', expenses); }, [expenses]);
  useEffect(() => { saveToStorage('oms_income', income); }, [income]);
  useEffect(() => { saveToStorage('oms_settings', settings); }, [settings]);

  const navItems = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders' as Page, label: 'Orders', icon: ShoppingCart },
    { id: 'customers' as Page, label: 'Customers', icon: Users },
    { id: 'products' as Page, label: 'Products', icon: Package },
    { id: 'inventory' as Page, label: 'Inventory', icon: Warehouse },
    { id: 'invoices' as Page, label: 'Invoices', icon: FileText },
    { id: 'expenses' as Page, label: 'Expenses', icon: TrendingDown },
    { id: 'income' as Page, label: 'Income', icon: TrendingUp },
    { id: 'settings' as Page, label: 'Settings', icon: Settings },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard orders={orders} customers={customers} products={products} expenses={expenses} income={income} settings={settings} />;
      case 'orders': return <OrdersPage orders={orders} setOrders={setOrders} customers={customers} products={products} settings={settings} />;
      case 'customers': return <CustomersPage customers={customers} setCustomers={setCustomers} />;
      case 'products': return <ProductsPage products={products} setProducts={setProducts} />;
      case 'inventory': return <InventoryPage products={products} setProducts={setProducts} settings={settings} />;
      case 'invoices': return <InvoicesPage invoices={invoices} setInvoices={setInvoices} orders={orders} customers={customers} settings={settings} />;
      case 'expenses': return <ExpensesPage expenses={expenses} setExpenses={setExpenses} />;
      case 'income': return <IncomePage income={income} setIncome={setIncome} />;
      case 'settings': return <SettingsPage settings={settings} setSettings={setSettings} />;
      default: return <Dashboard orders={orders} customers={customers} products={products} expenses={expenses} income={income} settings={settings} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-emerald-800 to-emerald-900 text-white transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-emerald-700">
          <Store className="w-8 h-8 text-emerald-300" />
          <div>
            <h1 className="text-lg font-bold">{settings.storeName}</h1>
            <p className="text-xs text-emerald-300">Order Management</p>
          </div>
          <button className="lg:hidden ml-auto" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="mt-4 px-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setCurrentPage(item.id); setSidebarOpen(false); }}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg mb-1 text-left transition-colors ${
                currentPage === item.id
                  ? 'bg-emerald-700 text-white font-medium'
                  : 'text-emerald-200 hover:bg-emerald-700/50 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b px-4 lg:px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <h2 className="text-xl font-semibold text-gray-800 capitalize">{currentPage}</h2>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-gray-500">{settings.currency}</span>
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-medium">
              {settings.ownerName ? settings.ownerName[0].toUpperCase() : 'A'}
            </div>
          </div>
        </header>
        <div className="p-4 lg:p-6">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;
