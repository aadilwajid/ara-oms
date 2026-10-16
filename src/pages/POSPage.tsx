import { useState, useEffect, useRef } from 'react';
import { Product, Customer, BusinessSettings, Order, OrderItem } from '../types';
import { Search, ShoppingCart, Plus, Minus, Trash2, Printer, CreditCard, Banknote, Smartphone, X, CheckCircle, User, Package } from 'lucide-react';

interface CartItem {
  product: Product;
  quantity: number;
}

interface Props {
  products: Product[];
  customers: Customer[];
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  settings: BusinessSettings;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

type PaymentMethod = 'cash' | 'card' | 'jazzcash' | 'easypaisa' | 'bank';

export default function POSPage({ products, customers, orders, setOrders, settings, showToast }: Props) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showCheckout, setShowCheckout] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [amountReceived, setAmountReceived] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const printRef = useRef<HTMLDivElement>(null);

  const categories = ['all', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchSearch && matchCategory && p.stock > 0;
  });

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const total = subtotal - discount;
  const change = amountReceived - total;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) {
        showToast('Not enough stock!', 'error');
        return;
      }
      setCart(cart.map(item =>
        item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
    showToast(`${product.name} added to cart`, 'success');
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.product.id === productId) {
        const newQty = item.quantity + delta;
        if (newQty <= 0) return item;
        if (newQty > item.product.stock) {
          showToast('Not enough stock!', 'error');
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
    setSelectedCustomer('');
    setAmountReceived(0);
  };

  const completeSale = () => {
    if (cart.length === 0) {
      showToast('Cart is empty!', 'error');
      return;
    }

    const customer = customers.find(c => c.id === selectedCustomer);
    const now = new Date().toISOString().split('T')[0];

    const orderItems: OrderItem[] = cart.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      total: item.product.price * item.quantity,
      image: item.product.image,
    }));

    const newOrder: Order = {
      id: Date.now().toString(),
      orderNumber: `POS-${String(orders.length + 1).padStart(4, '0')}`,
      customerId: selectedCustomer || 'walk-in',
      customerName: customer?.name || 'Walk-in Customer',
      items: orderItems,
      subtotal,
      shippingCost: 0,
      discount,
      tax: 0,
      total,
      channel: 'walk-in',
      status: 'delivered',
      paymentStatus: 'paid',
      paymentMethod: paymentMethod === 'cash' ? 'Cash' : paymentMethod === 'card' ? 'Card' : paymentMethod === 'jazzcash' ? 'JazzCash' : paymentMethod === 'easypaisa' ? 'EasyPaisa' : 'Bank Transfer',
      shippingAddress: 'Walk-in Purchase',
      notes: `POS Sale - Paid via ${paymentMethod}`,
      createdAt: now,
      updatedAt: now,
    };

    // Update stock
    cart.forEach(item => {
      const product = products.find(p => p.id === item.product.id);
      if (product) {
        product.stock -= item.quantity;
      }
    });

    setOrders([newOrder, ...orders]);
    setLastOrder(newOrder);
    setShowCheckout(false);
    setShowReceipt(true);
    showToast('Sale completed successfully!', 'success');
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - ${lastOrder?.orderNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Courier New', monospace; font-size: 12px; padding: 10px; max-width: 300px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 1px dashed #000; padding-bottom: 10px; margin-bottom: 10px; }
          .store-name { font-size: 16px; font-weight: bold; margin-bottom: 5px; }
          .store-info { font-size: 10px; color: #666; }
          .order-info { margin: 10px 0; }
          .order-info div { display: flex; justify-content: space-between; margin: 3px 0; }
          .items { border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 10px 0; margin: 10px 0; }
          .item { margin: 5px 0; }
          .item-name { font-weight: bold; }
          .item-detail { display: flex; justify-content: space-between; font-size: 11px; }
          .totals { border-top: 1px dashed #000; padding-top: 10px; margin-top: 10px; }
          .totals div { display: flex; justify-content: space-between; margin: 3px 0; }
          .total-final { font-size: 14px; font-weight: bold; border-top: 1px dashed #000; padding-top: 5px; margin-top: 5px; }
          .footer { text-align: center; margin-top: 15px; border-top: 1px dashed #000; padding-top: 10px; font-size: 10px; }
          @media print {
            body { padding: 0; }
            @page { margin: 0; size: 80mm auto; }
          }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="flex h-[calc(100vh-120px)] gap-4">
      {/* Products Section */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ShoppingCart className="w-6 h-6" />
              Point of Sale
            </h2>
            <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1.5">
              <Package className="w-4 h-4" />
              <span className="text-sm font-medium">{products.filter(p => p.stock > 0).length} Products</span>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
              <input
                type="text"
                placeholder="Search products or scan barcode..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:bg-white/30 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-3 overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  categoryFilter === cat
                    ? 'bg-white text-emerald-700'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filteredProducts.map(product => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="border-2 border-gray-200 rounded-xl p-3 hover:border-emerald-500 hover:shadow-md transition-all text-left group"
              >
                <div className="aspect-square bg-gray-100 rounded-lg mb-2 overflow-hidden flex items-center justify-center">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <Package className="w-12 h-12 text-gray-300" />
                  )}
                </div>
                <h3 className="font-semibold text-sm text-gray-800 truncate">{product.name}</h3>
                <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-emerald-600">{settings.currency} {product.price.toLocaleString()}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    product.stock <= product.lowStockThreshold ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {product.stock} left
                  </span>
                </div>
              </button>
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Package className="w-16 h-16 mx-auto mb-3 opacity-30" />
              <p>No products found</p>
            </div>
          )}
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-96 flex flex-col bg-white rounded-xl shadow-sm border overflow-hidden">
        {/* Cart Header */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-emerald-600" />
              Current Sale
            </h3>
            {cart.length > 0 && (
              <button onClick={clearCart} className="text-xs text-red-600 hover:text-red-700 font-medium">
                Clear All
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">{itemCount} items in cart</p>
        </div>

        {/* Customer Selection */}
        <div className="p-3 border-b">
          <select
            value={selectedCustomer}
            onChange={e => setSelectedCustomer(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Walk-in Customer</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.name} - {c.phone}</option>
            ))}
          </select>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-auto">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Cart is empty</p>
              <p className="text-xs mt-1">Click products to add them</p>
            </div>
          ) : (
            <div className="divide-y">
              {cart.map(item => (
                <div key={item.product.id} className="p-3 hover:bg-gray-50">
                  <div className="flex items-start gap-2">
                    {item.product.image && (
                      <img src={item.product.image} alt="" className="w-10 h-10 rounded object-cover" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.product.name}</p>
                      <p className="text-xs text-gray-500">{settings.currency} {item.product.price.toLocaleString()} each</p>
                    </div>
                    <button onClick={() => removeFromCart(item.product.id)} className="p-1 hover:bg-red-100 rounded">
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="w-7 h-7 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="w-7 h-7 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="font-bold text-emerald-600">
                      {settings.currency} {(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Footer */}
        <div className="border-t bg-gray-50 p-4">
          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">{settings.currency} {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm items-center">
              <span className="text-gray-600">Discount:</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={discount}
                  onChange={e => setDiscount(Number(e.target.value) || 0)}
                  className="w-20 border rounded px-2 py-1 text-sm text-right"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Total:</span>
              <span className="text-emerald-600">{settings.currency} {total.toLocaleString()}</span>
            </div>
          </div>
          <button
            onClick={() => setShowCheckout(true)}
            disabled={cart.length === 0}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <CreditCard className="w-5 h-5" />
            Checkout ({settings.currency} {total.toLocaleString()})
          </button>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCheckout(false)}>
          <div className="bg-white rounded-xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b flex items-center justify-between">
              <h3 className="text-lg font-bold">Checkout</h3>
              <button onClick={() => setShowCheckout(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'cash', label: 'Cash', icon: Banknote },
                    { id: 'card', label: 'Card', icon: CreditCard },
                    { id: 'jazzcash', label: 'JazzCash', icon: Smartphone },
                    { id: 'easypaisa', label: 'EasyPaisa', icon: Smartphone },
                  ].map(method => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                      className={`p-3 border-2 rounded-lg flex items-center gap-2 transition-colors ${
                        paymentMethod === method.id
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <method.icon className="w-5 h-5" />
                      <span className="font-medium text-sm">{method.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Subtotal:</span>
                  <span>{settings.currency} {subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm mb-2 text-red-600">
                    <span>Discount:</span>
                    <span>-{settings.currency} {discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total:</span>
                  <span className="text-emerald-600">{settings.currency} {total.toLocaleString()}</span>
                </div>
              </div>

              {paymentMethod === 'cash' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount Received</label>
                  <input
                    type="number"
                    value={amountReceived}
                    onChange={e => setAmountReceived(Number(e.target.value) || 0)}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 text-lg font-bold focus:border-emerald-500 focus:outline-none"
                    placeholder="Enter amount"
                  />
                  {amountReceived >= total && (
                    <div className="mt-2 p-3 bg-green-50 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span>Change:</span>
                        <span className="font-bold text-green-600">{settings.currency} {change.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={completeSale}
                disabled={paymentMethod === 'cash' && amountReceived < total}
                className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Complete Sale
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceipt && lastOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setShowReceipt(false); clearCart(); }}>
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b flex items-center justify-between">
              <h3 className="text-lg font-bold">Sale Complete!</h3>
              <button onClick={() => { setShowReceipt(false); clearCart(); }}><X className="w-5 h-5" /></button>
            </div>

            {/* Receipt Preview */}
            <div className="p-6">
              <div ref={printRef} className="font-mono text-xs">
                <div className="header text-center border-b border-dashed border-gray-400 pb-3 mb-3">
                  {settings.logo && <img src={settings.logo} alt="" className="w-12 h-12 mx-auto mb-2 rounded" />}
                  <div className="store-name text-base font-bold">{settings.storeName}</div>
                  <div className="store-info text-gray-600">{settings.address}, {settings.city}</div>
                  <div className="store-info text-gray-600">Phone: {settings.phone}</div>
                  {settings.ntn && <div className="store-info text-gray-600">NTN: {settings.ntn}</div>}
                </div>

                <div className="order-info mb-3">
                  <div className="flex justify-between"><span>Order #:</span><span className="font-bold">{lastOrder.orderNumber}</span></div>
                  <div className="flex justify-between"><span>Date:</span><span>{lastOrder.createdAt}</span></div>
                  <div className="flex justify-between"><span>Customer:</span><span>{lastOrder.customerName}</span></div>
                  <div className="flex justify-between"><span>Payment:</span><span>{lastOrder.paymentMethod}</span></div>
                </div>

                <div className="items border-y border-dashed border-gray-400 py-2 my-3">
                  {lastOrder.items.map((item, idx) => (
                    <div key={idx} className="item mb-2">
                      <div className="item-name font-bold">{item.productName}</div>
                      <div className="item-detail flex justify-between">
                        <span>{item.quantity} x {settings.currency} {item.price.toLocaleString()}</span>
                        <span>{settings.currency} {item.total.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="totals">
                  <div className="flex justify-between"><span>Subtotal:</span><span>{settings.currency} {lastOrder.subtotal.toLocaleString()}</span></div>
                  {lastOrder.discount > 0 && (
                    <div className="flex justify-between text-red-600"><span>Discount:</span><span>-{settings.currency} {lastOrder.discount.toLocaleString()}</span></div>
                  )}
                  <div className="total-final flex justify-between text-sm font-bold border-t border-dashed border-gray-400 pt-2 mt-2">
                    <span>TOTAL:</span>
                    <span>{settings.currency} {lastOrder.total.toLocaleString()}</span>
                  </div>
                  {paymentMethod === 'cash' && amountReceived > 0 && (
                    <>
                      <div className="flex justify-between mt-2"><span>Received:</span><span>{settings.currency} {amountReceived.toLocaleString()}</span></div>
                      <div className="flex justify-between font-bold"><span>Change:</span><span>{settings.currency} {change.toLocaleString()}</span></div>
                    </>
                  )}
                </div>

                <div className="footer text-center mt-4 border-t border-dashed border-gray-400 pt-3">
                  <div>{settings.receiptFooter || 'Thank you for your business!'}</div>
                  <div className="mt-2 text-gray-500">Powered by StoreOS</div>
                </div>
              </div>
            </div>

            <div className="p-5 border-t flex gap-3">
              <button
                onClick={handlePrint}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Printer className="w-5 h-5" />
                Print Receipt
              </button>
              <button
                onClick={() => { setShowReceipt(false); clearCart(); }}
                className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors"
              >
                New Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
