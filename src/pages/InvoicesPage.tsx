import { useState } from 'react';
import { Invoice, Order, Customer, BusinessSettings } from '../types';
import { Plus, Search, Eye, Trash2, X, Printer } from 'lucide-react';

interface Props {
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  orders: Order[];
  customers: Customer[];
  settings: BusinessSettings;
}

export default function InvoicesPage({ invoices, setInvoices, orders, customers, settings }: Props) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState<Invoice | null>(null);
  const [form, setForm] = useState({ orderId: '', customerId: '', customerName: '', amount: 0, status: 'draft' as Invoice['status'], dueDate: '' });

  const filtered = invoices.filter(inv => {
    const matchSearch = inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) || inv.customerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700', sent: 'bg-blue-100 text-blue-700',
    paid: 'bg-green-100 text-green-700', overdue: 'bg-red-100 text-red-700', cancelled: 'bg-gray-100 text-gray-500',
  };

  const selectOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) setForm(f => ({ ...f, orderId: order.id, customerId: order.customerId, customerName: order.customerName, amount: order.total }));
  };

  const handleCreate = () => {
    const newInvoice: Invoice = {
      id: Date.now().toString(),
      invoiceNumber: `${settings.invoicePrefix}-${String(invoices.length + 1).padStart(3, '0')}`,
      ...form, createdAt: new Date().toISOString().split('T')[0],
    };
    setInvoices([newInvoice, ...invoices]);
    setShowModal(false);
  };

  const handleDelete = (id: string) => { if (confirm('Delete this invoice?')) setInvoices(invoices.filter(i => i.id !== id)); };
  const updateStatus = (id: string, status: Invoice['status']) => {
    setInvoices(invoices.map(i => i.id === id ? { ...i, status } : i));
  };

  const totalAmount = invoices.reduce((s, i) => s + i.amount, 0);
  const paidAmount = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const pendingAmount = totalAmount - paidAmount;

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Total Invoiced</p>
          <p className="text-2xl font-bold">{settings.currency} {totalAmount.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Paid</p>
          <p className="text-2xl font-bold text-green-600">{settings.currency} {paidAmount.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-amber-600">{settings.currency} {pendingAmount.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search invoices..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
          <option value="all">All Status</option>
          <option value="draft">Draft</option><option value="sent">Sent</option>
          <option value="paid">Paid</option><option value="overdue">Overdue</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button onClick={() => { setForm({ orderId: '', customerId: '', customerName: '', amount: 0, status: 'draft', dueDate: '' }); setShowModal(true); }}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Invoice
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Invoice #</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Customer</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Amount</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Due Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Created</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(inv => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{inv.invoiceNumber}</td>
                  <td className="px-4 py-3">{inv.customerName}</td>
                  <td className="px-4 py-3 text-right font-medium">{settings.currency} {inv.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <select value={inv.status} onChange={e => updateStatus(inv.id, e.target.value as Invoice['status'])}
                      className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${statusColors[inv.status]}`}>
                      <option value="draft">Draft</option><option value="sent">Sent</option>
                      <option value="paid">Paid</option><option value="overdue">Overdue</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{inv.dueDate}</td>
                  <td className="px-4 py-3 text-gray-500">{inv.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => setShowPreview(inv)} className="p-1.5 hover:bg-gray-100 rounded"><Eye className="w-4 h-4 text-gray-500" /></button>
                      <button onClick={() => handleDelete(inv.id)} className="p-1.5 hover:bg-gray-100 rounded"><Trash2 className="w-4 h-4 text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-center py-12 text-gray-400">No invoices found</p>}
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">New Invoice</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">From Order</label>
                <select value={form.orderId} onChange={e => selectOrder(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
                  <option value="">Select order</option>
                  {orders.map(o => <option key={o.id} value={o.id}>{o.orderNumber} - {o.customerName} ({settings.currency} {o.total})</option>)}
                </select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input type="text" value={form.customerName} onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Amount ({settings.currency})</label>
                <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: parseFloat(e.target.value) || 0 }))} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Invoice['status'] }))} className="w-full border rounded-lg px-3 py-2 text-sm">
                  <option value="draft">Draft</option><option value="sent">Sent</option><option value="paid">Paid</option>
                </select></div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Cancel</button>
                <button onClick={handleCreate} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">Create Invoice</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowPreview(null)}>
          <div className="bg-white rounded-xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Invoice {showPreview.invoiceNumber}</h3>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded"><Printer className="w-4 h-4" /></button>
                <button onClick={() => setShowPreview(null)}><X className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  {settings.logo && <img src={settings.logo} alt="" className="w-12 h-12 rounded-lg object-cover" />}
                  <div>
                    <h2 className="text-xl font-bold" style={{ color: settings.bannerColor }}>{settings.storeName}</h2>
                    <p className="text-sm text-gray-500">{settings.address}, {settings.city}</p>
                    <p className="text-sm text-gray-500">{settings.phone}</p>
                    {settings.ntn && <p className="text-sm text-gray-500">NTN: {settings.ntn}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-800">INVOICE</p>
                  <p className="text-sm text-gray-500">{showPreview.invoiceNumber}</p>
                  <p className="text-sm text-gray-500">Date: {showPreview.createdAt}</p>
                  <p className="text-sm text-gray-500">Due: {showPreview.dueDate}</p>
                </div>
              </div>
              <div className="border-t border-b py-4 my-4">
                <p className="text-sm text-gray-500">Bill To:</p>
                <p className="font-medium">{showPreview.customerName}</p>
              </div>
              <div className="flex justify-between items-center py-4">
                <span className="text-gray-500">Amount Due</span>
                <span className="text-3xl font-bold text-gray-800">{settings.currency} {showPreview.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[showPreview.status]}`}>{showPreview.status}</span>
              </div>
              {settings.receiptFooter && (
                <div className="mt-6 pt-4 border-t text-center">
                  <p className="text-sm text-gray-500 italic">{settings.receiptFooter}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
