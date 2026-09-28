import { useState } from 'react';
import { ReturnRequest, Order, Customer, BusinessSettings } from '../types';
import { Plus, Search, Eye, Edit2, Trash2, X, Package, AlertTriangle } from 'lucide-react';

interface Props {
  returns: ReturnRequest[];
  setReturns: React.Dispatch<React.SetStateAction<ReturnRequest[]>>;
  orders: Order[];
  customers: Customer[];
  settings: BusinessSettings;
}

export default function ReturnsPage({ returns, setReturns, orders, customers, settings }: Props) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState<ReturnRequest | null>(null);
  const [form, setForm] = useState({
    orderId: '',
    customerId: '',
    customerName: '',
    reason: '',
    notes: '',
    refundAmount: 0,
    items: [] as { productId: string; productName: string; quantity: number; reason: string }[],
  });

  const filtered = returns.filter(r => {
    const matchSearch = r.rmaNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.customerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusColors: Record<string, string> = {
    requested: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-blue-100 text-blue-800',
    received: 'bg-purple-100 text-purple-800',
    refunded: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  const stats = {
    total: returns.length,
    pending: returns.filter(r => r.status === 'requested' || r.status === 'approved').length,
    completed: returns.filter(r => r.status === 'refunded').length,
    totalRefund: returns.filter(r => r.status === 'refunded').reduce((s, r) => s + r.refundAmount, 0),
  };

  const openNew = () => {
    setForm({
      orderId: '',
      customerId: '',
      customerName: '',
      reason: '',
      notes: '',
      refundAmount: 0,
      items: [],
    });
    setShowModal(true);
  };

  const selectOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setForm(f => ({
        ...f,
        orderId: order.id,
        customerId: order.customerId,
        customerName: order.customerName,
        items: order.items.map(i => ({
          productId: i.productId,
          productName: i.productName,
          quantity: 0,
          reason: '',
        })),
      }));
    }
  };

  const handleSave = () => {
    const newReturn: ReturnRequest = {
      id: Date.now().toString(),
      rmaNumber: `RMA-${String(returns.length + 1).padStart(4, '0')}`,
      ...form,
      status: 'requested',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setReturns([newReturn, ...returns]);
    setShowModal(false);
  };

  const updateStatus = (id: string, status: ReturnRequest['status']) => {
    setReturns(returns.map(r =>
      r.id === id ? { ...r, status, updatedAt: new Date().toISOString().split('T')[0] } : r
    ));
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this return request?')) {
      setReturns(returns.filter(r => r.id !== id));
    }
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Total Returns</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Total Refunded</p>
          <p className="text-2xl font-bold text-red-600">{settings.currency} {stats.totalRefund.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search returns..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">All Status</option>
          <option value="requested">Requested</option>
          <option value="approved">Approved</option>
          <option value="received">Received</option>
          <option value="refunded">Refunded</option>
          <option value="rejected">Rejected</option>
        </select>
        <button
          onClick={openNew}
          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Return
        </button>
      </div>

      {/* Returns Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">RMA #</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Order</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Refund</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(ret => (
                <tr key={ret.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{ret.rmaNumber}</td>
                  <td className="px-4 py-3">{ret.customerName}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {orders.find(o => o.id === ret.orderId)?.orderNumber || 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={ret.status}
                      onChange={e => updateStatus(ret.id, e.target.value as ReturnRequest['status'])}
                      className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${statusColors[ret.status]}`}
                    >
                      <option value="requested">Requested</option>
                      <option value="approved">Approved</option>
                      <option value="received">Received</option>
                      <option value="refunded">Refunded</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-red-600">
                    {settings.currency} {ret.refundAmount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{ret.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setShowDetail(ret)}
                        className="p-1.5 hover:bg-gray-100 rounded"
                        title="View"
                      >
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleDelete(ret.id)}
                        className="p-1.5 hover:bg-gray-100 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center py-12 text-gray-400">No return requests found</p>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">New Return Request</h3>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Order</label>
                <select
                  value={form.orderId}
                  onChange={e => selectOrder(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Select order</option>
                  {orders.map(o => (
                    <option key={o.id} value={o.id}>
                      {o.orderNumber} - {o.customerName} ({settings.currency} {o.total})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={form.customerName}
                  onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Return Reason</label>
                <textarea
                  value={form.reason}
                  onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  rows={3}
                  placeholder="Describe the reason for return..."
                />
              </div>

              {form.items.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Items to Return</label>
                  <div className="space-y-2">
                    {form.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <input
                          type="checkbox"
                          checked={item.quantity > 0}
                          onChange={e => {
                            const newItems = [...form.items];
                            newItems[idx].quantity = e.target.checked ? 1 : 0;
                            setForm(f => ({ ...f, items: newItems }));
                          }}
                          className="w-4 h-4"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.productName}</p>
                          <input
                            type="text"
                            placeholder="Item-specific reason (optional)"
                            value={item.reason}
                            onChange={e => {
                              const newItems = [...form.items];
                              newItems[idx].reason = e.target.value;
                              setForm(f => ({ ...f, items: newItems }));
                            }}
                            className="mt-1 w-full border rounded px-2 py-1 text-xs"
                          />
                        </div>
                        <input
                          type="number"
                          min="0"
                          max={orders.find(o => o.id === form.orderId)?.items.find(i => i.productId === item.productId)?.quantity || 0}
                          value={item.quantity}
                          onChange={e => {
                            const newItems = [...form.items];
                            newItems[idx].quantity = parseInt(e.target.value) || 0;
                            setForm(f => ({ ...f, items: newItems }));
                          }}
                          className="w-16 border rounded px-2 py-1 text-sm"
                          placeholder="Qty"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Refund Amount ({settings.currency})</label>
                <input
                  type="number"
                  value={form.refundAmount}
                  onChange={e => setForm(f => ({ ...f, refundAmount: parseFloat(e.target.value) || 0 }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Internal)</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                >
                  Create Return Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDetail(null)}>
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">{showDetail.rmaNumber}</h3>
              <button onClick={() => setShowDetail(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Customer:</span>
                  <p className="font-medium">{showDetail.customerName}</p>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>
                  <p>
                    <span className={`px-2 py-1 rounded-full text-xs ${statusColors[showDetail.status]}`}>
                      {showDetail.status}
                    </span>
                  </p>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Reason:</span>
                  <p className="font-medium">{showDetail.reason}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">Items</h4>
                <div className="border rounded-lg divide-y">
                  {showDetail.items.filter(i => i.quantity > 0).map((item, i) => (
                    <div key={i} className="p-3">
                      <div className="flex justify-between">
                        <span className="font-medium">{item.productName}</span>
                        <span className="text-gray-500">x{item.quantity}</span>
                      </div>
                      {item.reason && <p className="text-sm text-gray-500 mt-1">{item.reason}</p>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Refund Amount:</span>
                  <span className="text-red-600">{settings.currency} {showDetail.refundAmount.toLocaleString()}</span>
                </div>
              </div>

              {showDetail.notes && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-500 mb-1">Internal Notes:</p>
                  <p className="text-sm">{showDetail.notes}</p>
                </div>
              )}

              <div className="text-xs text-gray-400">
                Created: {showDetail.createdAt} | Updated: {showDetail.updatedAt}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
