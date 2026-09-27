import { useState } from 'react';
import { Order, OrderChannel, OrderStatus, PaymentStatus, Customer, Product, BusinessSettings, OrderItem, MediaItem } from '../types';
import { Plus, Search, Eye, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';
import MediaPage from './MediaPage';

interface Props {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  customers: Customer[];
  products: Product[];
  settings: BusinessSettings;
  media: MediaItem[];
}

export default function OrdersPage({ orders, setOrders, customers, products, settings, media }: Props) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<number>(-1);
  const [form, setForm] = useState({
    customerId: '', customerName: '', channel: 'website' as OrderChannel,
    status: 'pending' as OrderStatus, paymentStatus: 'unpaid' as PaymentStatus,
    paymentMethod: 'Cash on Delivery', shippingAddress: '', shippingCost: settings.defaultShippingCost,
    discount: 0, tax: 0, notes: '', items: [] as { productId: string; quantity: number; image?: string }[],
  });

  const filtered = orders.filter(o => {
    const matchSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchChannel = channelFilter === 'all' || o.channel === channelFilter;
    return matchSearch && matchStatus && matchChannel;
  });

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800', confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800', shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800', cancelled: 'bg-red-100 text-red-800', returned: 'bg-gray-100 text-gray-800',
  };

  const channelIcons: Record<string, string> = {
    website: '🌐', daraz: '🟠', shopify: '🛍️', whatsapp: '💬', instagram: '📷', facebook: '📘', phone: '📞', 'walk-in': '🚶'
  };

  const openNew = () => {
    setEditingOrder(null);
    setForm({ customerId: '', customerName: '', channel: 'website', status: 'pending', paymentStatus: 'unpaid', paymentMethod: 'Cash on Delivery', shippingAddress: '', shippingCost: settings.defaultShippingCost, discount: 0, tax: 0, notes: '', items: [] });
    setShowModal(true);
  };

  const openEdit = (order: Order) => {
    setEditingOrder(order);
    setForm({
      customerId: order.customerId, customerName: order.customerName, channel: order.channel,
      status: order.status, paymentStatus: order.paymentStatus, paymentMethod: order.paymentMethod,
      shippingAddress: order.shippingAddress, shippingCost: order.shippingCost, discount: order.discount,
      tax: order.tax, notes: order.notes,
      items: order.items.map(i => ({ productId: i.productId, quantity: i.quantity, image: i.image })),
    });
    setShowModal(true);
  };

  const addItem = () => setForm(f => ({ ...f, items: [...f.items, { productId: '', quantity: 1, image: '' }] }));
  const removeItem = (idx: number) => setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  const updateItem = (idx: number, field: string, value: string | number) => {
    setForm(f => ({
      ...f, items: f.items.map((item, i) => {
        if (i !== idx) return item;
        if (field === 'productId') {
          const product = products.find(p => p.id === value);
          return { ...item, productId: value as string, image: product?.image || item.image };
        }
        return { ...item, [field]: value };
      })
    }));
  };

  const calculateTotals = () => {
    const orderItems: OrderItem[] = form.items.map(item => {
      const product = products.find(p => p.id === item.productId);
      const price = product?.price || 0;
      return { productId: item.productId, productName: product?.name || '', quantity: item.quantity, price, total: price * item.quantity, image: item.image || product?.image };
    });
    const subtotal = orderItems.reduce((s, i) => s + i.total, 0);
    const total = subtotal + form.shippingCost + form.tax - form.discount;
    return { orderItems, subtotal, total };
  };

  const handleSave = () => {
    const { orderItems, subtotal, total } = calculateTotals();
    const now = new Date().toISOString().split('T')[0];
    if (editingOrder) {
      setOrders(orders.map(o => o.id === editingOrder.id ? {
        ...o, ...form, items: orderItems, subtotal, total, updatedAt: now,
      } : o));
    } else {
      const newOrder: Order = {
        id: Date.now().toString(), orderNumber: `${settings.orderPrefix}-${String(orders.length + 1).padStart(3, '0')}`,
        ...form, items: orderItems, subtotal, total, createdAt: now, updatedAt: now,
      };
      setOrders([newOrder, ...orders]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this order?')) setOrders(orders.filter(o => o.id !== id));
  };

  const selectCustomer = (customerId: string) => {
    const c = customers.find(cu => cu.id === customerId);
    if (c) setForm(f => ({ ...f, customerId: c.id, customerName: c.name, shippingAddress: `${c.address}, ${c.city}` }));
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
            <option value="all">All Status</option>
            <option value="pending">Pending</option><option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option><option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option><option value="cancelled">Cancelled</option>
            <option value="returned">Returned</option>
          </select>
          <select value={channelFilter} onChange={e => setChannelFilter(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
            <option value="all">All Channels</option>
            <option value="website">Website</option><option value="daraz">Daraz</option>
            <option value="shopify">Shopify</option><option value="whatsapp">WhatsApp</option>
            <option value="instagram">Instagram</option><option value="facebook">Facebook</option>
            <option value="phone">Phone</option><option value="walk-in">Walk-in</option>
          </select>
          <button onClick={openNew} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Order
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Order</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Items</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Channel</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Payment</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Total</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
                  <td className="px-4 py-3">{order.customerName}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {order.items.slice(0, 3).map((item, i) => (
                        <div key={i} className="w-7 h-7 rounded bg-gray-100 overflow-hidden flex items-center justify-center border">
                          {item.image ? (
                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs text-gray-400">{item.productName[0]}</span>
                          )}
                        </div>
                      ))}
                      {order.items.length > 3 && <span className="text-xs text-gray-400 ml-1">+{order.items.length - 3}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className="capitalize">{channelIcons[order.channel]} {order.channel}</span></td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>{order.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : order.paymentStatus === 'refunded' ? 'bg-gray-100 text-gray-800' : 'bg-orange-100 text-orange-800'}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">{settings.currency} {order.total.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-500">{order.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => setShowDetail(order)} className="p-1.5 hover:bg-gray-100 rounded"><Eye className="w-4 h-4 text-gray-500" /></button>
                      <button onClick={() => openEdit(order)} className="p-1.5 hover:bg-gray-100 rounded"><Edit2 className="w-4 h-4 text-blue-500" /></button>
                      <button onClick={() => handleDelete(order.id)} className="p-1.5 hover:bg-gray-100 rounded"><Trash2 className="w-4 h-4 text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-center py-12 text-gray-400">No orders found</p>}
        </div>
      </div>

      {/* Order Detail Modal */}
      {showDetail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDetail(null)}>
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">{showDetail.orderNumber}</h3>
              <button onClick={() => setShowDetail(null)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">Customer:</span><p className="font-medium">{showDetail.customerName}</p></div>
                <div><span className="text-gray-500">Channel:</span><p className="font-medium capitalize">{channelIcons[showDetail.channel]} {showDetail.channel}</p></div>
                <div><span className="text-gray-500">Status:</span><p><span className={`px-2 py-1 rounded-full text-xs ${statusColors[showDetail.status]}`}>{showDetail.status}</span></p></div>
                <div><span className="text-gray-500">Payment:</span><p className="font-medium">{showDetail.paymentMethod}</p></div>
                <div className="col-span-2"><span className="text-gray-500">Shipping:</span><p className="font-medium">{showDetail.shippingAddress}</p></div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Items</h4>
                <div className="border rounded-lg divide-y">
                  {showDetail.items.map((item, i) => (
                    <div key={i} className="p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden flex items-center justify-center shrink-0 border">
                        {item.image ? (
                          <img src={item.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-sm text-gray-400">{item.productName[0]}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.productName}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity} × {settings.currency} {item.price.toLocaleString()}</p>
                      </div>
                      <span className="text-sm font-medium">{settings.currency} {item.total.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t pt-3 text-sm space-y-1">
                <div className="flex justify-between"><span>Subtotal</span><span>{settings.currency} {showDetail.subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>{settings.currency} {showDetail.shippingCost.toLocaleString()}</span></div>
                {showDetail.discount > 0 && <div className="flex justify-between text-red-600"><span>Discount</span><span>-{settings.currency} {showDetail.discount.toLocaleString()}</span></div>}
                <div className="flex justify-between font-bold text-base pt-1 border-t"><span>Total</span><span>{settings.currency} {showDetail.total.toLocaleString()}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">{editingOrder ? 'Edit Order' : 'New Order'}</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                  <select value={form.customerId} onChange={e => selectCustomer(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
                    <option value="">Select customer</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                  <input type="text" value={form.customerName} onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Channel</label>
                  <select value={form.channel} onChange={e => setForm(f => ({ ...f, channel: e.target.value as OrderChannel }))} className="w-full border rounded-lg px-3 py-2 text-sm">
                    <option value="website">🌐 Website</option><option value="daraz">🟠 Daraz</option>
                    <option value="shopify">🛍️ Shopify</option><option value="whatsapp">💬 WhatsApp</option>
                    <option value="instagram">📷 Instagram</option><option value="facebook">📘 Facebook</option>
                    <option value="phone">📞 Phone</option><option value="walk-in">🚶 Walk-in</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as OrderStatus }))} className="w-full border rounded-lg px-3 py-2 text-sm">
                    <option value="pending">Pending</option><option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option><option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option><option value="cancelled">Cancelled</option>
                    <option value="returned">Returned</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                  <select value={form.paymentStatus} onChange={e => setForm(f => ({ ...f, paymentStatus: e.target.value as PaymentStatus }))} className="w-full border rounded-lg px-3 py-2 text-sm">
                    <option value="unpaid">Unpaid</option><option value="partial">Partial</option>
                    <option value="paid">Paid</option><option value="refunded">Refunded</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <input type="text" value={form.paymentMethod} onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Cash on Delivery, JazzCash, etc." />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
                  <input type="text" value={form.shippingAddress} onChange={e => setForm(f => ({ ...f, shippingAddress: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>

              {/* Items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Order Items</label>
                  <button onClick={addItem} className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">+ Add Item</button>
                </div>
                <div className="space-y-2">
                  {form.items.map((item, idx) => {
                    const product = products.find(p => p.id === item.productId);
                    return (
                      <div key={idx} className="flex gap-2 items-center bg-gray-50 rounded-lg p-2">
                        <div className="w-10 h-10 rounded bg-white border overflow-hidden flex items-center justify-center shrink-0">
                          {item.image ? (
                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-4 h-4 text-gray-300" />
                          )}
                        </div>
                        <select value={item.productId} onChange={e => updateItem(idx, 'productId', e.target.value)} className="flex-1 border rounded-lg px-3 py-2 text-sm bg-white">
                          <option value="">Select product</option>
                          {products.map(p => <option key={p.id} value={p.id}>{p.name} - {settings.currency} {p.price}</option>)}
                        </select>
                        <input type="number" min="1" value={item.quantity} onChange={e => updateItem(idx, 'quantity', parseInt(e.target.value) || 1)} className="w-16 border rounded-lg px-2 py-2 text-sm bg-white" />
                        <button onClick={() => { setMediaPickerTarget(idx); setShowMediaPicker(true); }} className="p-2 hover:bg-white rounded border" title="Set image">
                          <ImageIcon className="w-4 h-4 text-emerald-600" />
                        </button>
                        <button onClick={() => removeItem(idx)} className="p-2 text-red-500 hover:bg-white rounded border"><X className="w-4 h-4" /></button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shipping ({settings.currency})</label>
                  <input type="number" value={form.shippingCost} onChange={e => setForm(f => ({ ...f, shippingCost: parseFloat(e.target.value) || 0 }))} className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount ({settings.currency})</label>
                  <input type="number" value={form.discount} onChange={e => setForm(f => ({ ...f, discount: parseFloat(e.target.value) || 0 }))} className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tax ({settings.currency})</label>
                  <input type="number" value={form.tax} onChange={e => setForm(f => ({ ...f, tax: parseFloat(e.target.value) || 0 }))} className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>

              {form.items.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
                  <div className="flex justify-between"><span>Subtotal</span><span>{settings.currency} {calculateTotals().subtotal.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Shipping</span><span>{settings.currency} {form.shippingCost.toLocaleString()}</span></div>
                  {form.discount > 0 && <div className="flex justify-between text-red-600"><span>Discount</span><span>-{settings.currency} {form.discount.toLocaleString()}</span></div>}
                  <div className="flex justify-between font-bold border-t pt-1"><span>Total</span><span>{settings.currency} {calculateTotals().total.toLocaleString()}</span></div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" rows={2} />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Cancel</button>
                <button onClick={handleSave} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">
                  {editingOrder ? 'Update Order' : 'Create Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Media Picker for order items */}
      {showMediaPicker && (
        <MediaPage
          media={media}
          setMedia={() => {}}
          selectMode
          onSelect={(url) => {
            if (url && mediaPickerTarget >= 0) {
              setForm(f => ({
                ...f,
                items: f.items.map((item, i) => i === mediaPickerTarget ? { ...item, image: url } : item)
              }));
            }
            setShowMediaPicker(false);
          }}
        />
      )}
    </div>
  );
}
