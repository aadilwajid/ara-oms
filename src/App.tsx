// Remodeled App.tsx - Complete sidebar with all 34+ features

import { useState } from 'react';
import { AppProvider, useApp } from './backend/store';
import { Page } from './types';
import { 
  LayoutDashboard, ShoppingCart, Users, Package, Warehouse, FileText, 
  TrendingDown, TrendingUp, Settings, Menu, X, Store, Image as ImageIcon, 
  Download, Moon, Sun, Bell, LogOut, ChevronDown, ChevronRight, Search,
  BarChart3, RotateCcw, FileSignature, Truck, Award, Briefcase, DollarSign,
  MessageSquare, Building2, LifeBuoy, CheckSquare, Activity, Share2, Zap,
  Shield, MapPin, Globe, ShieldCheck, Brain, Heart, Boxes
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
import ReportsPage from './pages/ReportsPage';
import ReturnsPage from './pages/ReturnsPage';
import AdvancedInventoryPage from './pages/AdvancedInventoryPage';
import SuppliersPage from './pages/SuppliersPage';
import PromotionsPage from './pages/PromotionsPage';
import MarketingPage from './pages/MarketingPage';
import QuotationsPage from './pages/QuotationsPage';
import TeamManagementPage from './pages/TeamManagementPage';
import CustomerExperiencePage from './pages/CustomerExperiencePage';
import AdvancedAnalyticsPage from './pages/AdvancedAnalyticsPage';
import MarketingAutomationPage from './pages/MarketingAutomationPage';
import FinancialAdvancedPage from './pages/FinancialAdvancedPage';
import CommunicationHubPage from './pages/CommunicationHubPage';
import MultiStorePage from './pages/MultiStorePage';
import CustomerPortalPage from './pages/CustomerPortalPage';
import AdvancedWorkflowsPage from './pages/AdvancedWorkflowsPage';
import RealTimeAnalyticsPage from './pages/RealTimeAnalyticsPage';
import SocialCommercePage from './pages/SocialCommercePage';
import AdvancedCommercePage from './pages/AdvancedCommercePage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import TaxReportsPage from './pages/TaxReportsPage';
import IntegrationSettingsPage from './pages/IntegrationSettingsPage';
import ShippingZonesPage from './pages/ShippingZonesPage';
import WarrantyManagementPage from './pages/WarrantyManagementPage';
import UserManagementPage from './pages/UserManagementPage';
import LoginPage from './pages/LoginPage';

// Navigation structure with groups
interface NavItem {
  id: Page;
  label: string;
  icon: any;
}

interface NavGroup {
  label: string;
  icon: any;
  items: NavItem[];
}

const NAVIGATION: NavGroup[] = [
  {
    label: 'Main',
    icon: LayoutDashboard,
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Sales & Orders',
    icon: ShoppingCart,
    items: [
      { id: 'orders', label: 'Orders', icon: ShoppingCart },
      { id: 'invoices', label: 'Invoices', icon: FileText },
      { id: 'quotations', label: 'Quotations', icon: FileSignature },
      { id: 'returns', label: 'Returns', icon: RotateCcw },
      { id: 'order-tracking', label: 'Order Tracking', icon: MapPin },
    ],
  },
  {
    label: 'Products & Inventory',
    icon: Package,
    items: [
      { id: 'products', label: 'Products', icon: Package },
      { id: 'inventory', label: 'Inventory', icon: Warehouse },
      { id: 'advanced-inventory', label: 'Advanced Inventory', icon: Boxes },
      { id: 'media', label: 'Media Library', icon: ImageIcon },
    ],
  },
  {
    label: 'Customers & Marketing',
    icon: Users,
    items: [
      { id: 'customers', label: 'Customers', icon: Users },
      { id: 'customer-portal', label: 'Customer Portal', icon: LifeBuoy },
      { id: 'customer-experience', label: 'Customer Experience', icon: Heart },
      { id: 'marketing', label: 'Marketing & CRM', icon: Briefcase },
      { id: 'promotions', label: 'Promotions', icon: Award },
      { id: 'social-commerce', label: 'Social Commerce', icon: Share2 },
      { id: 'marketing-automation', label: 'Marketing Automation', icon: Zap },
    ],
  },
  {
    label: 'Finance',
    icon: DollarSign,
    items: [
      { id: 'expenses', label: 'Expenses', icon: TrendingDown },
      { id: 'income', label: 'Income', icon: TrendingUp },
      { id: 'financial-advanced', label: 'Financial Advanced', icon: DollarSign },
      { id: 'tax-reports', label: 'Tax Reports', icon: FileText },
    ],
  },
  {
    label: 'Operations',
    icon: Truck,
    items: [
      { id: 'suppliers', label: 'Suppliers & PO', icon: Truck },
      { id: 'shipping-zones', label: 'Shipping Zones', icon: MapPin },
      { id: 'warranties', label: 'Warranties', icon: ShieldCheck },
    ],
  },
  {
    label: 'Analytics & Reports',
    icon: BarChart3,
    items: [
      { id: 'reports', label: 'Reports', icon: BarChart3 },
      { id: 'advanced-analytics', label: 'Advanced Analytics', icon: Brain },
      { id: 'realtime-analytics', label: 'Real-Time Analytics', icon: Activity },
    ],
  },
  {
    label: 'Team & Communication',
    icon: MessageSquare,
    items: [
      { id: 'team', label: 'Team & HR', icon: Users },
      { id: 'communication', label: 'Communication Hub', icon: MessageSquare },
      { id: 'workflows', label: 'Advanced Workflows', icon: CheckSquare },
    ],
  },
  {
    label: 'Advanced Features',
    icon: Zap,
    items: [
      { id: 'multistore', label: 'Multi-Store & B2B', icon: Building2 },
      { id: 'advanced-commerce', label: 'Advanced Commerce', icon: Zap },
    ],
  },
  {
    label: 'Settings & Admin',
    icon: Settings,
    items: [
      { id: 'settings', label: 'Settings', icon: Settings },
      { id: 'integrations', label: 'Integrations', icon: Globe },
      { id: 'users', label: 'User Management', icon: Shield },
    ],
  },
];

// Main App Content Component
function AppContent() {
  const { state, dispatch, logout } = useApp();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['Main', 'Sales & Orders']));
  const [searchQuery, setSearchQuery] = useState('');

  // Show login page if not authenticated
  if (!state.isAuthenticated) {
    return <LoginPage />;
  }

  // Toggle group expansion
  const toggleGroup = (groupLabel: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupLabel)) {
      newExpanded.delete(groupLabel);
    } else {
      newExpanded.add(groupLabel);
    }
    setExpandedGroups(newExpanded);
  };

  // Filter navigation items based on search
  const filteredNavigation = searchQuery
    ? NAVIGATION.map(group => ({
        ...group,
        items: group.items.filter(item => 
          item.label.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter(group => group.items.length > 0)
    : NAVIGATION;

  // Wrapper setters for backward compatibility
  const setProducts = (products: any) => dispatch({ type: 'SET_PRODUCTS', payload: products });
  const setCustomers = (customers: any) => dispatch({ type: 'SET_CUSTOMERS', payload: customers });
  const setOrders = (orders: any) => dispatch({ type: 'SET_ORDERS', payload: orders });
  const setInvoices = (invoices: any) => dispatch({ type: 'SET_INVOICES', payload: invoices });
  const setExpenses = (expenses: any) => dispatch({ type: 'SET_EXPENSES', payload: expenses });
  const setIncome = (income: any) => dispatch({ type: 'SET_INCOME', payload: income });
  const setMedia = (media: any) => dispatch({ type: 'SET_MEDIA', payload: media });
  const setSettings = (settings: any) => dispatch({ type: 'SET_SETTINGS', payload: settings });

  // Render current page - All 34+ pages wired
  const renderPage = () => {
    const { products, customers, orders, invoices, expenses, income, media, settings } = state;

    switch (currentPage) {
      // Main
      case 'dashboard':
        return <Dashboard orders={orders} customers={customers} products={products} expenses={expenses} income={income} settings={settings} />;
      
      // Sales & Orders
      case 'orders':
        return <OrdersPage orders={orders} setOrders={setOrders} customers={customers} products={products} settings={settings} media={media} />;
      case 'invoices':
        return <InvoicesPage invoices={invoices} setInvoices={setInvoices} orders={orders} customers={customers} settings={settings} />;
      case 'quotations':
        return <QuotationsPage products={products} customers={customers} settings={settings} />;
      case 'returns':
        return <ReturnsPage orders={orders} customers={customers} settings={settings} returns={[]} setReturns={() => {}} />;
      case 'order-tracking':
        return <OrderTrackingPage orders={orders} settings={settings} />;
      
      // Products & Inventory
      case 'products':
        return <ProductsPage products={products} setProducts={setProducts} media={media} />;
      case 'inventory':
        return <InventoryPage products={products} setProducts={setProducts} settings={settings} />;
      case 'advanced-inventory':
        return <AdvancedInventoryPage products={products} setProducts={setProducts} settings={settings} />;
      case 'media':
        return <MediaPage media={media} setMedia={setMedia} />;
      
      // Customers & Marketing
      case 'customers':
        return <CustomersPage customers={customers} setCustomers={setCustomers} settings={settings} />;
      case 'customer-portal':
        return <CustomerPortalPage settings={settings} customers={customers} />;
      case 'customer-experience':
        return <CustomerExperiencePage customers={customers} products={products} orders={orders} settings={settings} />;
      case 'marketing':
        return <MarketingPage settings={settings} />;
      case 'promotions':
        return <PromotionsPage settings={settings} />;
      case 'social-commerce':
        return <SocialCommercePage settings={settings} customers={customers} />;
      case 'marketing-automation':
        return <MarketingAutomationPage settings={settings} customers={customers} />;
      
      // Finance
      case 'expenses':
        return <ExpensesPage expenses={expenses} setExpenses={setExpenses} />;
      case 'income':
        return <IncomePage income={income} setIncome={setIncome} />;
      case 'financial-advanced':
        return <FinancialAdvancedPage settings={settings} />;
      case 'tax-reports':
        return <TaxReportsPage orders={orders} expenses={expenses} income={income} settings={settings} />;
      
      // Operations
      case 'suppliers':
        return <SuppliersPage settings={settings} />;
      case 'shipping-zones':
        return <ShippingZonesPage settings={settings} />;
      case 'warranties':
        return <WarrantyManagementPage orders={orders} settings={settings} />;
      
      // Analytics & Reports
      case 'reports':
        return <ReportsPage orders={orders} customers={customers} products={products} expenses={expenses} income={income} settings={settings} />;
      case 'advanced-analytics':
        return <AdvancedAnalyticsPage orders={orders} customers={customers} products={products} settings={settings} />;
      case 'realtime-analytics':
        return <RealTimeAnalyticsPage orders={orders} customers={customers} products={products} settings={settings} />;
      
      // Team & Communication
      case 'team':
        return <TeamManagementPage settings={settings} />;
      case 'communication':
        return <CommunicationHubPage settings={settings} />;
      case 'workflows':
        return <AdvancedWorkflowsPage settings={settings} />;
      
      // Advanced Features
      case 'multistore':
        return <MultiStorePage settings={settings} />;
      case 'advanced-commerce':
        return <AdvancedCommercePage settings={settings} products={products} customers={customers} />;
      
      // Settings & Admin
      case 'settings':
        return <SettingsPage settings={settings} setSettings={setSettings} media={media} />;
      case 'integrations':
        return <IntegrationSettingsPage settings={settings} />;
      case 'users':
        return <UserManagementPage />;
      
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

        {/* Search */}
        <div className="px-3 py-2 border-b" style={{borderColor: '#047857'}}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-300" />
            <input
              type="text"
              placeholder="Search features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-emerald-300 focus:outline-none focus:border-white/40"
            />
          </div>
        </div>

        {/* Navigation with Collapsible Groups */}
        <nav className="mt-2 px-2 flex-1 overflow-auto">
          {filteredNavigation.map((group) => {
            const isExpanded = expandedGroups.has(group.label);
            const GroupIcon = group.icon;
            
            return (
              <div key={group.label} className="mb-2">
                {/* Group Header */}
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded text-left text-xs font-semibold uppercase tracking-wider text-emerald-300 hover:bg-white/5 hover:text-white transition-colors border-0 bg-transparent"
                >
                  <GroupIcon className="w-4 h-4 shrink-0" />
                  <span className="flex-1">{group.label}</span>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                {/* Group Items */}
                {isExpanded && (
                  <div className="mt-1 space-y-0.5">
                    {group.items.map((item) => {
                      const ItemIcon = item.icon;
                      const isActive = currentPage === item.id;
                      
                      return (
                        <button
                          key={item.id}
                          onClick={() => { setCurrentPage(item.id); setSidebarOpen(false); }}
                          className={`flex items-center gap-2 w-full px-3 py-2 pl-9 rounded text-left text-sm transition-colors border-0 ${
                            isActive
                              ? 'text-white font-medium'
                              : 'text-emerald-200 hover:bg-white/10 hover:text-white'
                          }`}
                          style={{
                            backgroundColor: isActive ? '#047857' : 'transparent',
                            color: isActive ? '#fff' : '#a7f3d0'
                          }}
                        >
                          <ItemIcon className="w-4 h-4 shrink-0" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
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
