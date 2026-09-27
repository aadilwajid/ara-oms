import { Order, Customer, Product, Expense, Income, BusinessSettings } from '../types';
import { ShoppingCart, Users, Package, TrendingUp, TrendingDown, AlertTriangle, ArrowUpRight } from 'lucide-react';

interface Props {
  orders: Order[];
  customers: Customer[];
  products: Product[];
  expenses: Expense[];
  income: Income[];
  settings: BusinessSettings;
}

export default function Dashboard({ orders, customers, products, expenses, income, settings }: Props) {
  const totalRevenue = income.reduce((s, i) => s + i.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const profit = totalRevenue - totalExpenses;
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold);
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const channelStats = orders.reduce((acc, o) => {
    acc[o.channel] = (acc[o.channel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    returned: 'bg-gray-100 text-gray-800',
  };

  const channelIcons: Record<string, string> = {
    website: '🌐', daraz: '🟠', shopify: '🛍️', whatsapp: '💬', instagram: '📷', facebook: '📘', phone: '📞', 'walk-in': '🚶'
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800">{settings.currency} {totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-xl">💰</span>
            </div>
          </div>
          <div className="flex items-center mt-2 text-sm text-green-600">
            <ArrowUpRight className="w-4 h-4 mr-1" /> +12.5% from last month
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-2 text-sm text-blue-600">
            <ArrowUpRight className="w-4 h-4 mr-1" /> {pendingOrders} pending
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Customers</p>
              <p className="text-2xl font-bold text-gray-800">{customers.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-2 text-sm text-purple-600">
            <ArrowUpRight className="w-4 h-4 mr-1" /> +3 new this week
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Net Profit</p>
              <p className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {settings.currency} {profit.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <TrendingDown className="w-4 h-4 mr-1" /> Expenses: {settings.currency} {totalExpenses.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border">
          <div className="p-5 border-b flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Recent Orders</h3>
            <Package className="w-5 h-5 text-gray-400" />
          </div>
          <div className="divide-y">
            {recentOrders.map(order => (
              <div key={order.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{channelIcons[order.channel] || '📦'}</span>
                  <div>
                    <p className="font-medium text-gray-800">{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">{order.customerName}</p>
                    {/* Show product thumbnails */}
                    <div className="flex items-center gap-1 mt-1">
                      {order.items.slice(0, 4).map((item, i) => (
                        <div key={i} className="w-6 h-6 rounded bg-gray-100 overflow-hidden border flex items-center justify-center" title={item.productName}>
                          {item.image ? (
                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] text-gray-400">{item.productName[0]}</span>
                          )}
                        </div>
                      ))}
                      {order.items.length > 4 && <span className="text-xs text-gray-400">+{order.items.length - 4}</span>}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800">{settings.currency} {order.total.toLocaleString()}</p>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            {recentOrders.length === 0 && (
              <p className="p-8 text-center text-gray-400">No orders yet</p>
            )}
          </div>
        </div>

        {/* Channel Stats & Low Stock */}
        <div className="space-y-6">
          {/* Channel Distribution */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-5 border-b">
              <h3 className="font-semibold text-gray-800">Sales Channels</h3>
            </div>
            <div className="p-4 space-y-3">
              {Object.entries(channelStats).map(([channel, count]) => (
                <div key={channel} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{channelIcons[channel] || '📦'}</span>
                    <span className="text-sm capitalize text-gray-700">{channel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(count / orders.length) * 100}%` }} />
                    </div>
                    <span className="text-sm font-medium text-gray-800 w-6 text-right">{count}</span>
                  </div>
                </div>
              ))}
              {Object.keys(channelStats).length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">No data</p>
              )}
            </div>
          </div>

          {/* Low Stock Alert */}
          {lowStockProducts.length > 0 && (
            <div className="bg-amber-50 rounded-xl border border-amber-200">
              <div className="p-4 border-b border-amber-200 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-amber-800">Low Stock Alert</h3>
              </div>
              <div className="p-4 space-y-2">
                {lowStockProducts.slice(0, 5).map(p => (
                  <div key={p.id} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {p.image && <img src={p.image} alt="" className="w-6 h-6 rounded object-cover shrink-0" />}
                      <span className="text-sm text-gray-700 truncate">{p.name}</span>
                    </div>
                    <span className="text-sm font-medium text-amber-700 shrink-0">{p.stock} left</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Products</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Products</span>
                <span className="font-medium">{products.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Stock Value</span>
                <span className="font-medium">{settings.currency} {products.reduce((s, p) => s + p.stock * p.costPrice, 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Low Stock Items</span>
                <span className="font-medium text-amber-600">{lowStockProducts.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
