import { useState } from 'react';
import { BusinessSettings } from '../types';
import { Plus, Search, Edit2, Trash2, X, Users, FileText, Package } from 'lucide-react';

interface Props { settings: BusinessSettings; }

type Tab = 'suppliers' | 'purchase-orders';

export default function SuppliersPage({ settings }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('suppliers');
  const [search, setSearch] = useState('');

  const suppliers = [
    { id: '1', name: 'Textile Mills Ltd', contact: 'Ali Hassan', phone: '0300-1234567', email: 'ali@textile.com', city: 'Faisalabad', products: 15, rating: 4.5, status: 'active' },
    { id: '2', name: 'Leather Crafts', contact: 'Sara Khan', phone: '0321-9876543', email: 'sara@leather.com', city: 'Sialkot', products: 8, rating: 4.8, status: 'active' },
    { id: '3', name: 'Electronics Hub', contact: 'Omar Farooq', phone: '0333-5551234', email: 'omar@electronics.com', city: 'Lahore', products: 22, rating: 4.2, status: 'active' },
  ];

  const purchaseOrders = [
    { id: '1', poNumber: 'PO-001', supplier: 'Textile Mills Ltd', items: 5, total: 125000, status: 'received', date: '2024-03-01', expected: '2024-03-05' },
    { id: '2', poNumber: 'PO-002', supplier: 'Leather Crafts', items: 3, total: 85000, status: 'sent', date: '2024-03-10', expected: '2024-03-20' },
    { id: '3', poNumber: 'PO-003', supplier: 'Electronics Hub', items: 8, total: 245000, status: 'partial', date: '2024-03-08', expected: '2024-03-15' },
  ];

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    sent: 'bg-blue-100 text-blue-700',
    partial: 'bg-yellow-100 text-yellow-700',
    received: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Total Suppliers</p>
          <p className="text-2xl font-bold text-gray-800">{suppliers.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Active POs</p>
          <p className="text-2xl font-bold text-blue-600">{purchaseOrders.filter(po => po.status !== 'received' && po.status !== 'cancelled').length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Pending Value</p>
          <p className="text-2xl font-bold text-amber-600">{settings.currency} {purchaseOrders.filter(po => po.status !== 'received').reduce((s, po) => s + po.total, 0).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Avg Rating</p>
          <p className="text-2xl font-bold text-emerald-600">{(suppliers.reduce((s, sup) => s + sup.rating, 0) / suppliers.length).toFixed(1)} ⭐</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="border-b px-4">
          <div className="flex gap-4">
            <button onClick={() => setActiveTab('suppliers')} className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'suppliers' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500'}`}>
              <Users className="w-4 h-4 inline mr-2" />Suppliers
            </button>
            <button onClick={() => setActiveTab('purchase-orders')} className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'purchase-orders' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500'}`}>
              <FileText className="w-4 h-4 inline mr-2" />Purchase Orders
            </button>
          </div>
        </div>

        <div className="p-4">
          {activeTab === 'suppliers' && (
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Search suppliers..." value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm" />
                </div>
                <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Supplier
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suppliers.map(sup => (
                  <div key={sup.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">{sup.name}</h4>
                        <p className="text-xs text-gray-500">{sup.contact}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm">⭐</span>
                        <span className="text-sm font-medium">{sup.rating}</span>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      <p>📞 {sup.phone}</p>
                      <p>📧 {sup.email}</p>
                      <p>📍 {sup.city}</p>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <span className="text-xs text-gray-500">{sup.products} products</span>
                      <div className="flex gap-1">
                        <button className="p-1.5 hover:bg-gray-100 rounded"><Edit2 className="w-3.5 h-3.5 text-blue-500" /></button>
                        <button className="p-1.5 hover:bg-gray-100 rounded"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'purchase-orders' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Create PO
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">PO #</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Supplier</th>
                      <th className="text-center px-4 py-3 font-medium text-gray-600">Items</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">Total</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Expected</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {purchaseOrders.map(po => (
                      <tr key={po.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{po.poNumber}</td>
                        <td className="px-4 py-3">{po.supplier}</td>
                        <td className="px-4 py-3 text-center">{po.items}</td>
                        <td className="px-4 py-3 text-right font-medium">{settings.currency} {po.total.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[po.status]}`}>{po.status}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{po.expected}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
