import { useState, useEffect } from 'react';
import { BusinessSettings } from '../types';
import { Store, Building2, Globe, Users, TrendingUp, Plus, Edit2, Trash2 } from 'lucide-react';

interface MultiStore {
  id: string;
  name: string;
  type: 'retail' | 'wholesale' | 'marketplace' | 'franchise';
  location: string;
  manager: string;
  status: 'active' | 'inactive';
  revenue: number;
  orders: number;
  createdAt: string;
}

interface B2BCustomer {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  creditLimit: number;
  totalOrders: number;
  totalSpent: number;
}

interface Marketplace {
  id: string;
  name: string;
  type: 'daraz' | 'amazon' | 'ebay' | 'aliexpress' | 'custom';
  status: 'connected' | 'disconnected';
  products: number;
  orders: number;
  revenue: number;
}

interface Props { settings: BusinessSettings; }

type Tab = 'stores' | 'b2b' | 'marketplaces';

export default function MultiStorePage({ settings }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('stores');
  const [stores, setStores] = useState<MultiStore[]>([]);
  const [b2bCustomers, setB2bCustomers] = useState<B2BCustomer[]>([]);
  const [marketplaces, setMarketplaces] = useState<Marketplace[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('oms_multistore');
    if (saved) {
      const data = JSON.parse(saved);
      setStores(data.stores || []);
      setB2bCustomers(data.b2bCustomers || []);
      setMarketplaces(data.marketplaces || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('oms_multistore', JSON.stringify({ stores, b2bCustomers, marketplaces }));
  }, [stores, b2bCustomers, marketplaces]);

  const stats = {
    totalStores: stores.length,
    activeStores: stores.filter(s => s.status === 'active').length,
    totalRevenue: stores.reduce((s, store) => s + store.revenue, 0),
    totalOrders: stores.reduce((s, store) => s + store.orders, 0),
    b2bCustomers: b2bCustomers.length,
    b2bRevenue: b2bCustomers.reduce((s, c) => s + c.totalSpent, 0),
    marketplaces: marketplaces.length,
    marketplaceRevenue: marketplaces.reduce((s, m) => s + m.revenue, 0),
  };

  const tabs = [
    { id: 'stores' as Tab, label: 'Multi-Store', icon: Store },
    { id: 'b2b' as Tab, label: 'B2B Portal', icon: Building2 },
    { id: 'marketplaces' as Tab, label: 'Marketplaces', icon: Globe },
  ];

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Total Stores</p>
            <Store className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.totalStores}</p>
          <p className="text-xs text-gray-400">{stats.activeStores} active</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Store Revenue</p>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-600">{settings.currency} {stats.totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-gray-400">{stats.totalOrders} orders</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">B2B Customers</p>
            <Building2 className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-blue-600">{stats.b2bCustomers}</p>
          <p className="text-xs text-gray-400">{settings.currency} {stats.b2bRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Marketplaces</p>
            <Globe className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-purple-600">{stats.marketplaces}</p>
          <p className="text-xs text-gray-400">{settings.currency} {stats.marketplaceRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="border-b px-4 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          {/* STORES TAB */}
          {activeTab === 'stores' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Store
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stores.map(store => (
                  <div key={store.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">{store.name}</h4>
                        <p className="text-xs text-gray-500 capitalize">{store.type} • {store.location}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${store.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {store.status}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Manager:</span>
                        <span className="font-medium">{store.manager}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Revenue:</span>
                        <span className="font-bold text-green-600">{settings.currency} {store.revenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Orders:</span>
                        <span className="font-medium">{store.orders}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3 pt-3 border-t">
                      <button className="flex-1 py-1.5 bg-blue-50 text-blue-600 rounded text-xs font-medium hover:bg-blue-100">View</button>
                      <button className="flex-1 py-1.5 bg-emerald-50 text-emerald-600 rounded text-xs font-medium hover:bg-emerald-100">Edit</button>
                    </div>
                  </div>
                ))}
              </div>
              {stores.length === 0 && (
                <p className="text-center py-12 text-gray-400">No stores added yet</p>
              )}
            </div>
          )}

          {/* B2B TAB */}
          {activeTab === 'b2b' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add B2B Customer
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Company</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Contact</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Tier</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">Credit Limit</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">Total Spent</th>
                      <th className="text-center px-4 py-3 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {b2bCustomers.map(customer => (
                      <tr key={customer.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <p className="font-medium">{customer.companyName}</p>
                          <p className="text-xs text-gray-500">{customer.email}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p>{customer.contactPerson}</p>
                          <p className="text-xs text-gray-500">{customer.phone}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            customer.tier === 'platinum' ? 'bg-purple-100 text-purple-700' :
                            customer.tier === 'gold' ? 'bg-yellow-100 text-yellow-700' :
                            customer.tier === 'silver' ? 'bg-gray-100 text-gray-700' : 'bg-amber-100 text-amber-700'
                          }`}>{customer.tier}</span>
                        </td>
                        <td className="px-4 py-3 text-right">{settings.currency} {customer.creditLimit.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right font-bold text-blue-600">{settings.currency} {customer.totalSpent.toLocaleString()}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button className="p-1.5 hover:bg-gray-100 rounded"><Edit2 className="w-4 h-4 text-blue-500" /></button>
                            <button className="p-1.5 hover:bg-gray-100 rounded"><Trash2 className="w-4 h-4 text-red-500" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {b2bCustomers.length === 0 && (
                  <p className="text-center py-12 text-gray-400">No B2B customers yet</p>
                )}
              </div>
            </div>
          )}

          {/* MARKETPLACES TAB */}
          {activeTab === 'marketplaces' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Connect Marketplace
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {marketplaces.map(mp => (
                  <div key={mp.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">{mp.name}</h4>
                        <p className="text-xs text-gray-500 capitalize">{mp.type}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${mp.status === 'connected' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {mp.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-xs text-gray-500">Products</p>
                        <p className="font-bold">{mp.products}</p>
                      </div>
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-xs text-gray-500">Orders</p>
                        <p className="font-bold">{mp.orders}</p>
                      </div>
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-xs text-gray-500">Revenue</p>
                        <p className="font-bold text-green-600">{settings.currency} {(mp.revenue / 1000).toFixed(0)}k</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3 pt-3 border-t">
                      <button className="flex-1 py-1.5 bg-blue-50 text-blue-600 rounded text-xs font-medium hover:bg-blue-100">Sync</button>
                      <button className="flex-1 py-1.5 bg-purple-50 text-purple-600 rounded text-xs font-medium hover:bg-purple-100">Settings</button>
                    </div>
                  </div>
                ))}
              </div>
              {marketplaces.length === 0 && (
                <p className="text-center py-12 text-gray-400">No marketplaces connected</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
