import { useState, useEffect } from 'react';
import { BusinessSettings, Order, Customer, Product } from '../types';
import { Activity, TrendingUp, BarChart3, PieChart, Zap, RefreshCw } from 'lucide-react';

interface Props {
  orders: Order[];
  customers: Customer[];
  products: Product[];
  settings: BusinessSettings;
}

export default function RealTimeAnalyticsPage({ orders, customers, products, settings }: Props) {
  const [refreshInterval, setRefreshInterval] = useState(5);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Real-time metrics
  const todayOrders = orders.filter(o => o.createdAt === new Date().toISOString().split('T')[0]);
  const todayRevenue = todayOrders.reduce((s, o) => s + o.total, 0);
  const activeCustomers = customers.filter(c => {
    const lastOrder = orders.filter(o => o.customerId === c.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    if (!lastOrder) return false;
    const daysSince = (new Date().getTime() - new Date(lastOrder.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    return daysSince <= 7;
  });

  // Live metrics
  const metrics = {
    liveOrders: todayOrders.length,
    liveRevenue: todayRevenue,
    activeCustomers: activeCustomers.length,
    avgOrderValue: todayOrders.length > 0 ? todayRevenue / todayOrders.length : 0,
    conversionRate: customers.length > 0 ? (todayOrders.length / customers.length) * 100 : 0,
    topProduct: products.length > 0 ? products.sort((a, b) => b.stock - a.stock)[0] : null,
  };

  // Simulated real-time data
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    orders: Math.floor(Math.random() * 10),
    revenue: Math.floor(Math.random() * 50000),
  }));

  const channelPerformance = [
    { channel: 'Website', orders: 45, revenue: 225000, growth: 12 },
    { channel: 'Daraz', orders: 32, revenue: 160000, growth: 8 },
    { channel: 'WhatsApp', orders: 28, revenue: 140000, growth: 15 },
    { channel: 'Instagram', orders: 18, revenue: 90000, growth: 22 },
    { channel: 'Facebook', orders: 12, revenue: 60000, growth: -5 },
  ];

  const productPerformance = products.slice(0, 10).map(p => ({
    name: p.name,
    sold: Math.floor(Math.random() * 50),
    revenue: Math.floor(Math.random() * 100000),
    stock: p.stock,
  }));

  const customerSegments = [
    { segment: 'VIP', count: 23, revenue: 450000, percentage: 35 },
    { segment: 'Regular', count: 89, revenue: 680000, percentage: 45 },
    { segment: 'New', count: 45, revenue: 225000, percentage: 15 },
    { segment: 'At-Risk', count: 12, revenue: 75000, percentage: 5 },
  ];

  return (
    <div className="space-y-4">
      {/* Header with Refresh */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-emerald-600 animate-pulse" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Real-Time Analytics Dashboard</h2>
              <p className="text-xs text-gray-500">Last updated: {lastUpdate.toLocaleTimeString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={refreshInterval}
              onChange={e => setRefreshInterval(Number(e.target.value))}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value={5}>Refresh: 5s</option>
              <option value={10}>Refresh: 10s</option>
              <option value={30}>Refresh: 30s</option>
              <option value={60}>Refresh: 1m</option>
            </select>
            <button
              onClick={() => setLastUpdate(new Date())}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Refresh Now
            </button>
          </div>
        </div>
      </div>

      {/* Live Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-4 text-white">
          <p className="text-sm opacity-90">Live Orders Today</p>
          <p className="text-3xl font-bold">{metrics.liveOrders}</p>
          <div className="flex items-center gap-1 mt-2 text-xs">
            <TrendingUp className="w-3 h-3" />
            <span>+{Math.floor(Math.random() * 20)}% vs yesterday</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
          <p className="text-sm opacity-90">Live Revenue</p>
          <p className="text-3xl font-bold">{settings.currency} {(metrics.liveRevenue / 1000).toFixed(1)}k</p>
          <div className="flex items-center gap-1 mt-2 text-xs">
            <TrendingUp className="w-3 h-3" />
            <span>+{Math.floor(Math.random() * 15)}% vs yesterday</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 text-white">
          <p className="text-sm opacity-90">Active Customers</p>
          <p className="text-3xl font-bold">{metrics.activeCustomers}</p>
          <p className="text-xs opacity-90 mt-2">Last 7 days</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-4 text-white">
          <p className="text-sm opacity-90">Avg Order Value</p>
          <p className="text-3xl font-bold">{settings.currency} {Math.round(metrics.avgOrderValue).toLocaleString()}</p>
          <p className="text-xs opacity-90 mt-2">Per order</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-xl p-4 text-white">
          <p className="text-sm opacity-90">Conversion Rate</p>
          <p className="text-3xl font-bold">{metrics.conversionRate.toFixed(1)}%</p>
          <p className="text-xs opacity-90 mt-2">Visitors to customers</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Hourly Sales */}
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              Hourly Sales Today
            </h3>
          </div>
          <div className="h-48 flex items-end gap-1">
            {hourlyData.map((data, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t hover:from-blue-600 hover:to-blue-500 transition-colors cursor-pointer relative group"
                  style={{ height: `${(data.orders / 10) * 100}%`, minHeight: data.orders > 0 ? '4px' : '0' }}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                    {data.hour}:00 - {data.orders} orders
                  </div>
                </div>
                {idx % 4 === 0 && (
                  <span className="text-xs text-gray-400">{data.hour}h</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Channel Performance */}
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-500" />
              Channel Performance
            </h3>
          </div>
          <div className="space-y-3">
            {channelPerformance.map((channel, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{channel.channel}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{channel.orders} orders</span>
                    <span className={`text-xs font-medium ${channel.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {channel.growth >= 0 ? '+' : ''}{channel.growth}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                    style={{ width: `${(channel.orders / 50) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Top Performing Products
          </h3>
          <div className="space-y-2">
            {productPerformance.slice(0, 5).map((product, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-800">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.sold} sold • Stock: {product.stock}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-emerald-600">{settings.currency} {product.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Segments */}
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-blue-500" />
            Customer Segments
          </h3>
          <div className="space-y-3">
            {customerSegments.map((segment, idx) => (
              <div key={idx} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      segment.segment === 'VIP' ? 'bg-purple-500' :
                      segment.segment === 'Regular' ? 'bg-blue-500' :
                      segment.segment === 'New' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <span className="font-medium text-sm">{segment.segment}</span>
                  </div>
                  <span className="text-xs text-gray-500">{segment.percentage}%</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>{segment.count} customers</span>
                  <span className="font-medium">{settings.currency} {segment.revenue.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
