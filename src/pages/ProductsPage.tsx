import { useState } from 'react';
import { Product, MediaItem } from '../types';
import { Plus, Search, Edit2, Trash2, X, Package, Image as ImageIcon } from 'lucide-react';
import MediaPage from './MediaPage';

interface Props { products: Product[]; setProducts: React.Dispatch<React.SetStateAction<Product[]>>; media: MediaItem[]; }

export default function ProductsPage({ products, setProducts, media }: Props) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: '', sku: '', category: '', price: 0, costPrice: 0, stock: 0, lowStockThreshold: 10, description: '', image: '' });
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const categories = [...new Set(products.map(p => p.category))];
  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const openNew = () => { setEditing(null); setForm({ name: '', sku: '', category: '', price: 0, costPrice: 0, stock: 0, lowStockThreshold: 10, description: '', image: '' }); setShowModal(true); };
  const openEdit = (p: Product) => { setEditing(p); setForm({ name: p.name, sku: p.sku, category: p.category, price: p.price, costPrice: p.costPrice, stock: p.stock, lowStockThreshold: p.lowStockThreshold, description: p.description, image: p.image || '' }); setShowModal(true); };

  const handleSave = () => {
    if (editing) {
      setProducts(products.map(p => p.id === editing.id ? { ...p, ...form } : p));
    } else {
      const newProduct: Product = { id: Date.now().toString(), ...form, createdAt: new Date().toISOString().split('T')[0] };
      setProducts([newProduct, ...products]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => { if (confirm('Delete this product?')) setProducts(products.filter(p => p.id !== id)); };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm border p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
        </div>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={openNew} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(p => (
          <div key={p.id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 flex items-center justify-center h-40 relative overflow-hidden">
              {p.image ? (
                <img src={p.image} alt={p.name} className="w-full h-full object-cover rounded" />
              ) : (
                <Package className="w-12 h-12 text-emerald-300" />
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-gray-800 text-sm truncate">{p.name}</h4>
                  <p className="text-xs text-gray-500">SKU: {p.sku}</p>
                </div>
                <div className="flex gap-1 shrink-0 ml-2">
                  <button onClick={() => openEdit(p)} className="p-1 hover:bg-gray-100 rounded"><Edit2 className="w-3.5 h-3.5 text-blue-500" /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-1 hover:bg-gray-100 rounded"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
                </div>
              </div>
              <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs mb-2">{p.category}</span>
              <div className="flex items-center justify-between mt-2">
                <span className="text-lg font-bold text-emerald-700">PKR {p.price.toLocaleString()}</span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${p.stock <= p.lowStockThreshold ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {p.stock} in stock
                </span>
              </div>
              <div className="mt-2 pt-2 border-t text-xs text-gray-500 flex justify-between">
                <span>Cost: PKR {p.costPrice.toLocaleString()}</span>
                <span>Margin: {p.price > 0 ? Math.round(((p.price - p.costPrice) / p.price) * 100) : 0}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-center py-12 text-gray-400">No products found</p>}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">{editing ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                    {form.image ? (
                      <img src={form.image} alt="Product" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-gray-300" />
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => setShowMediaPicker(true)} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5" /> {form.image ? 'Change Image' : 'Select from Media'}
                    </button>
                    {form.image && (
                      <button onClick={() => setForm(f => ({ ...f, image: '' }))} className="px-3 py-1.5 border rounded-lg text-xs text-red-600 hover:bg-red-50">
                        Remove Image
                      </button>
                    )}
                  </div>
                </div>
                {media.length === 0 && (
                  <p className="text-xs text-amber-600 mt-2">No images in media library. Go to Media page to upload images first.</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                  <input type="text" value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input type="text" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" list="categories" />
                  <datalist id="categories">{categories.map(c => <option key={c} value={c} />)}</datalist></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (PKR)</label>
                  <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Cost Price (PKR)</label>
                  <input type="number" value={form.costPrice} onChange={e => setForm(f => ({ ...f, costPrice: parseFloat(e.target.value) || 0 }))} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                  <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: parseInt(e.target.value) || 0 }))} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Alert</label>
                  <input type="number" value={form.lowStockThreshold} onChange={e => setForm(f => ({ ...f, lowStockThreshold: parseInt(e.target.value) || 0 }))} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
                <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" rows={2} /></div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Cancel</button>
                <button onClick={handleSave} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">
                  {editing ? 'Update' : 'Add Product'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Media Picker */}
      {showMediaPicker && (
        <MediaPage
          media={media}
          setMedia={() => {}}
          selectMode
          onSelect={(url) => {
            if (url) setForm(f => ({ ...f, image: url }));
            setShowMediaPicker(false);
          }}
        />
      )}
    </div>
  );
}
