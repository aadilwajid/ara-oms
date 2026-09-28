import { useState } from 'react';
import { Product, BusinessSettings } from '../types';
import { Plus, Search, Edit2, Trash2, X, Package, Layers, ArrowRightLeft, ScanLine, Warehouse as WarehouseIcon, Boxes } from 'lucide-react';

interface Props {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  settings: BusinessSettings;
}

type Tab = 'variants' | 'bundles' | 'warehouses' | 'transfers' | 'scanner';

export default function AdvancedInventoryPage({ products, setProducts, settings }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('variants');
  const [search, setSearch] = useState('');

  // Variants State
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [variantForm, setVariantForm] = useState({ name: '', size: '', color: '', price: 0, stock: 0, sku: '' });

  // Bundles State
  const [bundles, setBundles] = useState<Array<{ id: string; name: string; products: { productId: string; qty: number }[]; bundlePrice: number; active: boolean }>>([
    { id: '1', name: 'Summer Collection Bundle', products: [{ productId: '1', qty: 1 }, { productId: '5', qty: 2 }], bundlePrice: 3500, active: true },
  ]);
  const [showBundleModal, setShowBundleModal] = useState(false);

  // Warehouses State
  const [warehouses, setWarehouses] = useState([
    { id: '1', name: 'Main Warehouse - Karachi', address: 'SITE Area', city: 'Karachi', manager: 'Ahmed', stock: 245 },
    { id: '2', name: 'Lahore Hub', address: 'Sundar Estate', city: 'Lahore', manager: 'Bilal', stock: 120 },
    { id: '3', name: 'Islamabad Store', address: 'I-9 Industrial Area', city: 'Islamabad', manager: 'Usman', stock: 80 },
  ]);
  const [showWarehouseModal, setShowWarehouseModal] = useState(false);

  // Transfers State
  const [transfers, setTransfers] = useState([
    { id: '1', number: 'TRF-001', from: 'Main Warehouse - Karachi', to: 'Lahore Hub', items: 5, status: 'in-transit', date: '2024-03-10' },
    { id: '2', number: 'TRF-002', from: 'Lahore Hub', to: 'Islamabad Store', items: 3, status: 'received', date: '2024-03-08' },
  ]);

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));

  const tabs = [
    { id: 'variants' as Tab, label: 'Product Variants', icon: Layers },
    { id: 'bundles' as Tab, label: 'Bundles & Kits', icon: Boxes },
    { id: 'warehouses' as Tab, label: 'Warehouses', icon: WarehouseIcon },
    { id: 'transfers' as Tab, label: 'Stock Transfers', icon: ArrowRightLeft },
    { id: 'scanner' as Tab, label: 'Barcode Scanner', icon: ScanLine },
  ];

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="border-b px-4 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          {/* VARIANTS TAB */}
          {activeTab === 'variants' && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm" />
                </div>
                <button onClick={() => setShowVariantModal(true)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Variant
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 text-sm mb-2">💡 Product Variants</h4>
                <p className="text-xs text-blue-700">Create size, color, and material variations for your products. Each variant can have its own price, stock, and SKU.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Product</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Variant</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">SKU</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">Price</th>
                      <th className="text-center px-4 py-3 font-medium text-gray-600">Stock</th>
                      <th className="text-center px-4 py-3 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filtered.map(p => (
                      <>
                        <tr key={p.id} className="bg-gray-50">
                          <td className="px-4 py-3 font-medium" colSpan={6}>
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-gray-400" />
                              {p.name}
                              <span className="text-xs text-gray-500">({p.sku})</span>
                            </div>
                          </td>
                        </tr>
                        <tr key={`${p.id}-base`} className="hover:bg-gray-50">
                          <td className="px-4 py-2 pl-10 text-gray-500">Base Product</td>
                          <td className="px-4 py-2 text-gray-500">-</td>
                          <td className="px-4 py-2 text-gray-500">{p.sku}</td>
                          <td className="px-4 py-2 text-right">{settings.currency} {p.price.toLocaleString()}</td>
                          <td className="px-4 py-2 text-center">{p.stock}</td>
                          <td className="px-4 py-2 text-center">
                            <button className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">+ Add Variant</button>
                          </td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* BUNDLES TAB */}
          {activeTab === 'bundles' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Product Bundles & Kits</h3>
                <button onClick={() => setShowBundleModal(true)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Create Bundle
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bundles.map(bundle => (
                  <div key={bundle.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">{bundle.name}</h4>
                        <p className="text-xs text-gray-500">{bundle.products.length} products</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${bundle.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {bundle.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="space-y-1 mb-3">
                      {bundle.products.map((bp, i) => {
                        const product = products.find(p => p.id === bp.productId);
                        return (
                          <div key={i} className="flex items-center justify-between text-sm bg-gray-50 rounded px-2 py-1">
                            <span>{product?.name || 'Unknown'}</span>
                            <span className="text-gray-500">x{bp.qty}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div>
                        <p className="text-xs text-gray-500">Bundle Price</p>
                        <p className="font-bold text-emerald-600">{settings.currency} {bundle.bundlePrice.toLocaleString()}</p>
                      </div>
                      <div className="flex gap-1">
                        <button className="p-1.5 hover:bg-gray-100 rounded"><Edit2 className="w-4 h-4 text-blue-500" /></button>
                        <button className="p-1.5 hover:bg-gray-100 rounded"><Trash2 className="w-4 h-4 text-red-500" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* WAREHOUSES TAB */}
          {activeTab === 'warehouses' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Warehouse Locations</h3>
                <button onClick={() => setShowWarehouseModal(true)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Warehouse
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {warehouses.map(wh => (
                  <div key={wh.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <WarehouseIcon className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{wh.name}</h4>
                        <p className="text-xs text-gray-500">{wh.address}, {wh.city}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-xs text-gray-500">Manager</p>
                        <p className="font-medium">{wh.manager}</p>
                      </div>
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-xs text-gray-500">Total Stock</p>
                        <p className="font-medium text-emerald-600">{wh.stock} items</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button className="flex-1 py-1.5 bg-blue-50 text-blue-600 rounded text-xs font-medium hover:bg-blue-100">View Stock</button>
                      <button className="flex-1 py-1.5 bg-purple-50 text-purple-600 rounded text-xs font-medium hover:bg-purple-100">Transfer</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TRANSFERS TAB */}
          {activeTab === 'transfers' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Stock Transfers</h3>
                <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> New Transfer
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Transfer #</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">From</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">To</th>
                      <th className="text-center px-4 py-3 font-medium text-gray-600">Items</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {transfers.map(t => (
                      <tr key={t.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{t.number}</td>
                        <td className="px-4 py-3">{t.from}</td>
                        <td className="px-4 py-3">{t.to}</td>
                        <td className="px-4 py-3 text-center">{t.items}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            t.status === 'received' ? 'bg-green-100 text-green-700' :
                            t.status === 'in-transit' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>{t.status}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{t.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SCANNER TAB */}
          {activeTab === 'scanner' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-8 text-center">
                <ScanLine className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Barcode / QR Scanner</h3>
                <p className="text-sm text-gray-600 mb-6">Scan product barcodes for quick inventory operations</p>
                <div className="max-w-md mx-auto">
                  <input type="text" placeholder="Scan or enter barcode..." className="w-full border-2 border-emerald-300 rounded-lg px-4 py-3 text-center text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" autoFocus />
                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">Add Stock</button>
                    <button className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">Remove Stock</button>
                    <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">View Product</button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border rounded-xl p-4">
                  <p className="text-sm text-gray-500">Scans Today</p>
                  <p className="text-2xl font-bold text-gray-800">47</p>
                </div>
                <div className="bg-white border rounded-xl p-4">
                  <p className="text-sm text-gray-500">Products Updated</p>
                  <p className="text-2xl font-bold text-emerald-600">32</p>
                </div>
                <div className="bg-white border rounded-xl p-4">
                  <p className="text-sm text-gray-500">Last Scan</p>
                  <p className="text-2xl font-bold text-gray-800">2m ago</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Variant Modal */}
      {showVariantModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowVariantModal(false)}>
          <div className="bg-white rounded-xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Add Product Variant</h3>
              <button onClick={() => setShowVariantModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Product</label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm">
                  <option>Select product</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                  <select className="w-full border rounded-lg px-3 py-2 text-sm">
                    <option>Small</option><option>Medium</option><option>Large</option><option>X-Large</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <input type="text" placeholder="e.g., Red, Blue" className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (PKR)</label>
                  <input type="number" className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input type="number" className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowVariantModal(false)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Cancel</button>
                <button onClick={() => setShowVariantModal(false)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">Add Variant</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bundle Modal */}
      {showBundleModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowBundleModal(false)}>
          <div className="bg-white rounded-xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Create Bundle</h3>
              <button onClick={() => setShowBundleModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bundle Name</label>
                <input type="text" placeholder="e.g., Summer Collection" className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Products</label>
                <div className="space-y-2 max-h-40 overflow-auto border rounded-lg p-2">
                  {products.map(p => (
                    <label key={p.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-sm flex-1">{p.name}</span>
                      <input type="number" defaultValue={1} min={1} className="w-16 border rounded px-2 py-1 text-xs" />
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bundle Price (PKR)</label>
                <input type="number" className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowBundleModal(false)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Cancel</button>
                <button onClick={() => setShowBundleModal(false)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">Create Bundle</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Warehouse Modal */}
      {showWarehouseModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowWarehouseModal(false)}>
          <div className="bg-white rounded-xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Add Warehouse</h3>
              <button onClick={() => setShowWarehouseModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse Name</label>
                <input type="text" placeholder="e.g., North Karachi Hub" className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input type="text" className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <select className="w-full border rounded-lg px-3 py-2 text-sm">
                    <option>Karachi</option><option>Lahore</option><option>Islamabad</option><option>Rawalpindi</option>
                    <option>Faisalabad</option><option>Multan</option><option>Peshawar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
                  <input type="text" className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowWarehouseModal(false)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Cancel</button>
                <button onClick={() => setShowWarehouseModal(false)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">Add Warehouse</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
