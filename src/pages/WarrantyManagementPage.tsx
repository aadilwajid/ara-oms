import { useState, useEffect } from 'react';
import { BusinessSettings, Order } from '../types';
import { Shield, Plus, Search, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface Warranty {
  id: string;
  orderId: string;
  orderNumber: string;
  productName: string;
  customerName: string;
  startDate: string;
  endDate: string;
  durationMonths: number;
  status: 'active' | 'expired' | 'claimed';
  claimDate?: string;
  claimReason?: string;
}

interface Props {
  orders: Order[];
  settings: BusinessSettings;
}

export default function WarrantyManagementPage({ orders, settings }: Props) {
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired' | 'claimed'>('all');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    orderId: '',
    productName: '',
    customerName: '',
    durationMonths: 12,
  });

  useEffect(() => {
    const saved = localStorage.getItem('oms_warranties');
    if (saved) {
      setWarranties(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // Update expired warranties
    const now = new Date();
    const updated = warranties.map(w => {
      if (w.status === 'active' && new Date(w.endDate) < now) {
        return { ...w, status: 'expired' as const };
      }
      return w;
    });
    if (JSON.stringify(updated) !== JSON.stringify(warranties)) {
      setWarranties(updated);
    }
    localStorage.setItem('oms_warranties', JSON.stringify(updated));
  }, [warranties]);

  const filtered = warranties.filter(w => {
    const matchSearch = w.productName.toLowerCase().includes(search.toLowerCase()) ||
      w.customerName.toLowerCase().includes(search.toLowerCase()) ||
      w.orderNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || w.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: warranties.length,
    active: warranties.filter(w => w.status === 'active').length,
    expired: warranties.filter(w => w.status === 'expired').length,
    claimed: warranties.filter(w => w.status === 'claimed').length,
  };

  const handleSave = () => {
    const order = orders.find(o => o.id === form.orderId);
    if (!order) return;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + form.durationMonths);

    const warranty: Warranty = {
      id: Date.now().toString(),
      orderId: form.orderId,
      orderNumber: order.orderNumber,
      productName: form.productName,
      customerName: form.customerName || order.customerName,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      durationMonths: form.durationMonths,
      status: 'active',
    };

    setWarranties([warranty, ...warranties]);
    setShowModal(false);
    setForm({ orderId: '', productName: '', customerName: '', durationMonths: 12 });
  };

  const markAsClaimed = (id: string) => {
    const reason = prompt('Enter claim reason:');
    if (reason) {
      setWarranties(warranties.map(w =>
        w.id === id ? { ...w, status: 'claimed', claimDate: new Date().toISOString().split('T')[0], claimReason: reason } : w
      ));
    }
  };

  const statusColors = {
    active: 'bg-emerald-100 text-emerald-700',
    expired: 'bg-gray-100 text-gray-600',
    claimed: 'bg-blue-100 text-blue-700',
  };

  const statusIcons = {
    active: CheckCircle,
    expired: Clock,
    claimed: AlertCircle,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Warranty Management</h1>
            <p className="text-emerald-100">Track product warranties and claims</p>
          </div>
          <Shield className="w-16 h-16 opacity-50" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Total Warranties</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Expired</p>
          <p className="text-2xl font-bold text-gray-600">{stats.expired}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Claimed</p>
          <p className="text-2xl font-bold text-blue-600">{stats.claimed}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search warranties..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="claimed">Claimed</option>
          </select>
          <button
            onClick={() => setShowModal(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Warranty
          </button>
        </div>
      </div>

      {/* Warranties List */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Order</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Product</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Period</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(warranty => {
                const StatusIcon = statusIcons[warranty.status];
                return (
                  <tr key={warranty.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{warranty.orderNumber}</td>
                    <td className="px-4 py-3">{warranty.productName}</td>
                    <td className="px-4 py-3">{warranty.customerName}</td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-gray-500">{warranty.startDate}</p>
                      <p className="text-xs text-gray-500">to {warranty.endDate}</p>
                      <p className="text-xs text-emerald-600 font-medium">{warranty.durationMonths} months</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${statusColors[warranty.status]}`}>
                        <StatusIcon className="w-3 h-3" />
                        {warranty.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {warranty.status === 'active' && (
                        <button
                          onClick={() => markAsClaimed(warranty.id)}
                          className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          Mark Claimed
                        </button>
                      )}
                      {warranty.status === 'claimed' && (
                        <p className="text-xs text-gray-500">{warranty.claimDate}</p>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center py-12 text-gray-400">No warranties found</p>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">Add Warranty</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Order</label>
                <select
                  value={form.orderId}
                  onChange={e => {
                    const order = orders.find(o => o.id === e.target.value);
                    setForm({
                      ...form,
                      orderId: e.target.value,
                      customerName: order?.customerName || '',
                      productName: order?.items[0]?.productName || '',
                    });
                  }}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">Select order</option>
                  {orders.map(o => (
                    <option key={o.id} value={o.id}>{o.orderNumber} - {o.customerName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                <input
                  type="text"
                  value={form.productName}
                  onChange={e => setForm({ ...form, productName: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                <input
                  type="text"
                  value={form.customerName}
                  onChange={e => setForm({ ...form, customerName: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Warranty Duration (months)</label>
                <select
                  value={form.durationMonths}
                  onChange={e => setForm({ ...form, durationMonths: Number(e.target.value) })}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-emerald-500 focus:outline-none"
                >
                  <option value={3}>3 months</option>
                  <option value={6}>6 months</option>
                  <option value={12}>12 months</option>
                  <option value={24}>24 months</option>
                  <option value={36}>36 months</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 border-2 border-gray-200 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
              >
                Add Warranty
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
