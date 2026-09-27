import { useState } from 'react';
import { Income } from '../types';
import { Plus, Search, Trash2, X } from 'lucide-react';

interface Props { income: Income[]; setIncome: React.Dispatch<React.SetStateAction<Income[]>>; }

const incomeCategories = ['Sales', 'Refunds', 'Investment', 'Loan', 'Other'];

export default function IncomePage({ income, setIncome }: Props) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ category: '', description: '', amount: 0, date: '', source: '', paymentMethod: 'Bank Transfer' });

  const filtered = income.filter(i => {
    const matchSearch = i.description.toLowerCase().includes(search.toLowerCase()) || i.source.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'all' || i.category === categoryFilter;
    return matchSearch && matchCat;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalIncome = income.reduce((s, i) => s + i.amount, 0);
  const thisMonth = income.filter(i => {
    const d = new Date(i.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((s, i) => s + i.amount, 0);

  const sourceTotals = income.reduce((acc, i) => {
    acc[i.source] = (acc[i.source] || 0) + i.amount;
    return acc;
  }, {} as Record<string, number>);

  const handleSave = () => {
    const newIncome: Income = { id: Date.now().toString(), ...form, createdAt: new Date().toISOString().split('T')[0] };
    setIncome([newIncome, ...income]);
    setShowModal(false);
  };

  const handleDelete = (id: string) => { if (confirm('Delete this income entry?')) setIncome(income.filter(i => i.id !== id)); };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Total Income</p>
          <p className="text-2xl font-bold text-green-600">PKR {totalIncome.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">This Month</p>
          <p className="text-2xl font-bold text-green-600">PKR {thisMonth.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Sources</p>
          <p className="text-2xl font-bold text-gray-800">{Object.keys(sourceTotals).length}</p>
        </div>
      </div>

      {/* Source Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Income by Source</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(sourceTotals).sort((a, b) => b[1] - a[1]).map(([src, amount]) => (
            <div key={src} className="bg-green-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">{src}</p>
              <p className="font-bold text-green-700">PKR {amount.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search income..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
        </div>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
          <option value="all">All Categories</option>
          {incomeCategories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={() => { setForm({ category: '', description: '', amount: 0, date: new Date().toISOString().split('T')[0], source: '', paymentMethod: 'Bank Transfer' }); setShowModal(true); }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Income
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Description</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Source</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Payment</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Amount</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(i => (
                <tr key={i.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{i.date}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs font-medium">{i.category}</span></td>
                  <td className="px-4 py-3">{i.description}</td>
                  <td className="px-4 py-3 text-gray-600">{i.source}</td>
                  <td className="px-4 py-3 text-gray-600">{i.paymentMethod}</td>
                  <td className="px-4 py-3 text-right font-medium text-green-600">PKR {i.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => handleDelete(i.id)} className="p-1.5 hover:bg-gray-100 rounded"><Trash2 className="w-4 h-4 text-red-500" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-center py-12 text-gray-400">No income entries found</p>}
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Add Income</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm">
                  <option value="">Select category</option>
                  {incomeCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input type="text" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Amount (PKR)</label>
                <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: parseFloat(e.target.value) || 0 }))} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                <input type="text" value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="e.g., Website, Daraz, Shopify" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select value={form.paymentMethod} onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm">
                  <option value="Bank Transfer">Bank Transfer</option><option value="Cash">Cash</option>
                  <option value="JazzCash">JazzCash</option><option value="EasyPaisa">EasyPaisa</option>
                  <option value="Card">Card</option>
                </select></div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Cancel</button>
                <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">Add Income</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
