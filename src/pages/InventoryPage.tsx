import { useState } from 'react';
import { Product, BusinessSettings } from '../types';
import { Search, AlertTriangle, Package } from 'lucide-react';

interface Props { products: Product[]; setProducts: React.Dispatch<React.SetStateAction<Product[]>>; settings: BusinessSettings; }

export default function InventoryPage({ products, setProducts, settings }: Props) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'value'>('name');

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    if (filter === 'low') return matchSearch && p.stock <= p.lowStockThreshold && p.stock > 0;
    if (filter === 'out') return matchSearch && p.stock === 0;
    return matchSearch;
  }).sort((a, b) => {
    if (sortBy === 'stock') return a.stock - b.stock;
    if (sortBy === 'value') return (b.stock * b.costPrice) - (a.stock * a.costPrice);
    return a.name.localeCompare(b.name);
  });

  const totalValue = products.reduce((s, p) => s + p.stock * p.costPrice, 0);
  const totalItems = products.reduce((s, p) => s + p.stock, 0);
  const lowStockCount = products.filter(p => p.stock <= p.lowStockThreshold && p.stock > 0).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  const updateStock = (id: string, newStock: number) => {
    setProducts(products.map(p => p.id === id ? { ...p, stock: Math.max(0, newStock) } : p));
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Total Products</p>
          <p className="text-2xl font-bold text-gray-800">{products.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Total Stock Items</p>
          <p className="text-2xl font-bold text-gray-800">{totalItems.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Inventory Value</p>
          <p className="text-2xl font-bold text-emerald-700">{settings.currency} {totalValue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Low/Out of Stock</p>
          <p className="text-2xl font-bold text-amber-600">{lowStockCount + outOfStockCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search inventory..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setFilter('all')} className={`px-3 py-2 rounded-lg text-sm ${filter === 'all' ? 'bg-emerald-100 text-emerald-700 font-medium' : 'bg-gray-100 text-gray-600'}`}>All</button>
          <button onClick={() => setFilter('low')} className={`px-3 py-2 rounded-lg text-sm flex items-center gap-1 ${filter === 'low' ? 'bg-amber-100 text-amber-700 font-medium' : 'bg-gray-100 text-gray-600'}`}>
            <AlertTriangle className="w-3.5 h-3.5" /> Low Stock
          </button>
          <button onClick={() => setFilter('out')} className={`px-3 py-2 rounded-lg text-sm ${filter === 'out' ? 'bg-red-100 text-red-700 font-medium' : 'bg-gray-100 text-gray-600'}`}>Out of Stock</button>
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value as 'name' | 'stock' | 'value')} className="border rounded-lg px-3 py-2 text-sm">
          <option value="name">Sort by Name</option>
          <option value="stock">Sort by Stock</option>
          <option value="value">Sort by Value</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600 w-14">Image</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Product</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">SKU</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Cost</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Price</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Stock</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Value</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(p => (
                <tr key={p.id} className={`hover:bg-gray-50 ${p.stock === 0 ? 'bg-red-50' : p.stock <= p.lowStockThreshold ? 'bg-amber-50' : ''}`}>
                  <td className="px-4 py-2">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center border">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-5 h-5 text-gray-300" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-gray-500">{p.sku}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{p.category}</span></td>
                  <td className="px-4 py-3 text-right">{settings.currency} {p.costPrice.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-medium">{settings.currency} {p.price.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center font-bold">{p.stock}</td>
                  <td className="px-4 py-3 text-right">{settings.currency} {(p.stock * p.costPrice).toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    {p.stock === 0 ? <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Out</span>
                      : p.stock <= p.lowStockThreshold ? <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">Low</span>
                      : <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">OK</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => updateStock(p.id, p.stock - 1)} className="w-7 h-7 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm font-bold">-</button>
                      <button onClick={() => updateStock(p.id, p.stock + 1)} className="w-7 h-7 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm font-bold">+</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-center py-12 text-gray-400">No products in inventory</p>}
        </div>
      </div>
    </div>
  );
}
