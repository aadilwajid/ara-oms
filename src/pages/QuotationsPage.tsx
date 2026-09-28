import { useState, useEffect } from 'react';
import { Product, Customer, BusinessSettings } from '../types';
import { Plus, Search, Edit2, Trash2, X, FileText, Send, CheckCircle, XCircle, Clock } from 'lucide-react';
import { generateQuotationPDF } from '../utils/pdfGenerator';

interface QuotationItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

interface Quotation {
  id: string;
  quoteNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: QuotationItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  validUntil: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'converted';
  notes: string;
  createdAt: string;
}

interface Props {
  products: Product[];
  customers: Customer[];
  settings: BusinessSettings;
}

export default function QuotationsPage({ products, customers, settings }: Props) {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quotation | null>(null);
  const [form, setForm] = useState({
    customerId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    validUntil: '',
    notes: '',
    discount: 0,
    tax: 0,
    items: [] as { productId: string; quantity: number }[],
  });

  useEffect(() => {
    const saved = localStorage.getItem('oms_quotations');
    if (saved) {
      setQuotations(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('oms_quotations', JSON.stringify(quotations));
  }, [quotations]);

  const filtered = quotations.filter(q => {
    const matchSearch = q.quoteNumber.toLowerCase().includes(search.toLowerCase()) ||
      q.customerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || q.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    sent: 'bg-blue-100 text-blue-700',
    accepted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    expired: 'bg-orange-100 text-orange-700',
    converted: 'bg-purple-100 text-purple-700',
  };

  const openNew = () => {
    setEditingQuote(null);
    setForm({
      customerId: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: '',
      discount: 0,
      tax: 0,
      items: [],
    });
    setShowModal(true);
  };

  const openEdit = (quote: Quotation) => {
    setEditingQuote(quote);
    setForm({
      customerId: quote.customerId,
      customerName: quote.customerName,
      customerEmail: quote.customerEmail,
      customerPhone: quote.customerPhone,
      validUntil: quote.validUntil,
      notes: quote.notes,
      discount: quote.discount,
      tax: quote.tax,
      items: quote.items.map(i => ({ productId: i.productId, quantity: i.quantity })),
    });
    setShowModal(true);
  };

  const selectCustomer = (customerId: string) => {
    const c = customers.find(cu => cu.id === customerId);
    if (c) {
      setForm(f => ({
        ...f,
        customerId: c.id,
        customerName: c.name,
        customerEmail: c.email,
        customerPhone: c.phone,
      }));
    }
  };

  const addItem = () => setForm(f => ({ ...f, items: [...f.items, { productId: '', quantity: 1 }] }));
  const removeItem = (idx: number) => setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  const updateItem = (idx: number, field: string, value: string | number) => {
    setForm(f => ({
      ...f,
      items: f.items.map((item, i) => i === idx ? { ...item, [field]: value } : item)
    }));
  };

  const calculateTotals = () => {
    const quoteItems: QuotationItem[] = form.items.map(item => {
      const product = products.find(p => p.id === item.productId);
      const price = product?.price || 0;
      return {
        productId: item.productId,
        productName: product?.name || '',
        quantity: item.quantity,
        price,
        total: price * item.quantity,
      };
    });
    const subtotal = quoteItems.reduce((s, i) => s + i.total, 0);
    const total = subtotal + form.tax - form.discount;
    return { quoteItems, subtotal, total };
  };

  const handleSave = () => {
    const { quoteItems, subtotal, total } = calculateTotals();
    const now = new Date().toISOString().split('T')[0];

    if (editingQuote) {
      setQuotations(quotations.map(q => q.id === editingQuote.id ? {
        ...q,
        ...form,
        items: quoteItems,
        subtotal,
        total,
      } : q));
    } else {
      const newQuote: Quotation = {
        id: Date.now().toString(),
        quoteNumber: `QT-${String(quotations.length + 1).padStart(4, '0')}`,
        ...form,
        items: quoteItems,
        subtotal,
        total,
        status: 'draft',
        createdAt: now,
      };
      setQuotations([newQuote, ...quotations]);
    }
    setShowModal(false);
  };

  const updateStatus = (id: string, status: Quotation['status']) => {
    setQuotations(quotations.map(q => q.id === id ? { ...q, status } : q));
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this quotation?')) {
      setQuotations(quotations.filter(q => q.id !== id));
    }
  };

  const stats = {
    total: quotations.length,
    draft: quotations.filter(q => q.status === 'draft').length,
    sent: quotations.filter(q => q.status === 'sent').length,
    accepted: quotations.filter(q => q.status === 'accepted').length,
    totalValue: quotations.reduce((s, q) => s + q.total, 0),
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Total Quotes</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Draft</p>
          <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Sent</p>
          <p className="text-2xl font-bold text-blue-600">{stats.sent}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Accepted</p>
          <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Total Value</p>
          <p className="text-2xl font-bold text-emerald-600">{settings.currency} {stats.totalValue.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search quotations..."
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
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
          <option value="expired">Expired</option>
          <option value="converted">Converted</option>
        </select>
        <button
          onClick={openNew}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Quotation
        </button>
      </div>

      {/* Quotations Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Quote #</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Customer</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Amount</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Valid Until</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Created</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(quote => (
                <tr key={quote.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{quote.quoteNumber}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{quote.customerName}</p>
                      <p className="text-xs text-gray-500">{quote.customerEmail}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">{settings.currency} {quote.total.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-500">{quote.validUntil}</td>
                  <td className="px-4 py-3">
                    <select
                      value={quote.status}
                      onChange={e => updateStatus(quote.id, e.target.value as Quotation['status'])}
                      className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${statusColors[quote.status]}`}
                    >
                      <option value="draft">Draft</option>
                      <option value="sent">Sent</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                      <option value="expired">Expired</option>
                      <option value="converted">Converted</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{quote.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => generateQuotationPDF(quote, settings)}
                        className="p-1.5 hover:bg-gray-100 rounded"
                        title="Download PDF"
                      >
                        <FileText className="w-4 h-4 text-blue-500" />
                      </button>
                      <button
                        onClick={() => openEdit(quote)}
                        className="p-1.5 hover:bg-gray-100 rounded"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4 text-emerald-500" />
                      </button>
                      <button
                        onClick={() => handleDelete(quote.id)}
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
            <p className="text-center py-12 text-gray-400">No quotations found</p>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">{editingQuote ? 'Edit Quotation' : 'New Quotation'}</h3>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                  <select
                    value={form.customerId}
                    onChange={e => selectCustomer(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="">Select customer</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={form.customerEmail}
                    onChange={e => setForm(f => ({ ...f, customerEmail: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={form.customerPhone}
                    onChange={e => setForm(f => ({ ...f, customerPhone: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                  <input
                    type="date"
                    value={form.validUntil}
                    onChange={e => setForm(f => ({ ...f, validUntil: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>

              {/* Items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Quotation Items</label>
                  <button onClick={addItem} className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">+ Add Item</button>
                </div>
                <div className="space-y-2">
                  {form.items.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center bg-gray-50 rounded-lg p-2">
                      <select
                        value={item.productId}
                        onChange={e => updateItem(idx, 'productId', e.target.value)}
                        className="flex-1 border rounded-lg px-3 py-2 text-sm bg-white"
                      >
                        <option value="">Select product</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.name} - {settings.currency} {p.price}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={e => updateItem(idx, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-20 border rounded-lg px-3 py-2 text-sm bg-white"
                      />
                      <button onClick={() => removeItem(idx)} className="p-2 text-red-500 hover:bg-white rounded border">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount ({settings.currency})</label>
                  <input
                    type="number"
                    value={form.discount}
                    onChange={e => setForm(f => ({ ...f, discount: parseFloat(e.target.value) || 0 }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tax ({settings.currency})</label>
                  <input
                    type="number"
                    value={form.tax}
                    onChange={e => setForm(f => ({ ...f, tax: parseFloat(e.target.value) || 0 }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                  <div className="border rounded-lg px-3 py-2 text-sm bg-gray-50 font-bold">
                    {settings.currency} {calculateTotals().total.toLocaleString()}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  rows={3}
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
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700"
                >
                  {editingQuote ? 'Update Quotation' : 'Create Quotation'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
