import { useState } from 'react';
import { Customer } from '../types';
import { Plus, Search, Edit2, Trash2, X, Phone, Mail, MapPin } from 'lucide-react';

interface Props { customers: Customer[]; setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>; }

export default function CustomersPage({ customers, setCustomers }: Props) {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '' });

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => { setEditing(null); setForm({ name: '', email: '', phone: '', address: '', city: '' }); setShowModal(true); };
  const openEdit = (c: Customer) => { setEditing(c); setForm({ name: c.name, email: c.email, phone: c.phone, address: c.address, city: c.city }); setShowModal(true); };

  const handleSave = () => {
    if (editing) {
      setCustomers(customers.map(c => c.id === editing.id ? { ...c, ...form } : c));
    } else {
      const newCustomer: Customer = { id: Date.now().toString(), ...form, totalOrders: 0, totalSpent: 0, createdAt: new Date().toISOString().split('T')[0] };
      setCustomers([newCustomer, ...customers]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => { if (confirm('Delete this customer?')) setCustomers(customers.filter(c => c.id !== id)); };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm border p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
        </div>
        <button onClick={openNew} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Customer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(c => (
          <div key={c.id} className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                  {c.name[0].toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{c.name}</h4>
                  <p className="text-xs text-gray-500">Since {c.createdAt}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(c)} className="p-1.5 hover:bg-gray-100 rounded"><Edit2 className="w-3.5 h-3.5 text-blue-500" /></button>
                <button onClick={() => handleDelete(c.id)} className="p-1.5 hover:bg-gray-100 rounded"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {c.phone}</div>
              <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {c.email}</div>
              <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {c.city}</div>
            </div>
            <div className="mt-3 pt-3 border-t flex justify-between text-sm">
              <span className="text-gray-500">{c.totalOrders} orders</span>
              <span className="font-medium text-emerald-700">PKR {c.totalSpent.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-center py-12 text-gray-400">No customers found</p>}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">{editing ? 'Edit Customer' : 'Add Customer'}</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="text" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="03XX-XXXXXXX" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input type="text" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <select value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm">
                  <option value="">Select City</option>
                  <option value="Karachi">Karachi</option><option value="Lahore">Lahore</option>
                  <option value="Islamabad">Islamabad</option><option value="Rawalpindi">Rawalpindi</option>
                  <option value="Faisalabad">Faisalabad</option><option value="Multan">Multan</option>
                  <option value="Peshawar">Peshawar</option><option value="Quetta">Quetta</option>
                  <option value="Sialkot">Sialkot</option><option value="Gujranwala">Gujranwala</option>
                  <option value="Hyderabad">Hyderabad</option><option value="Other">Other</option>
                </select></div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Cancel</button>
                <button onClick={handleSave} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">
                  {editing ? 'Update' : 'Add Customer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
