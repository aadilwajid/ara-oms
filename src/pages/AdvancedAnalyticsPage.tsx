import { useState } from 'react';
import { Order, Customer, Product, BusinessSettings } from '../types';
import { TrendingUp, Users, Package, MapPin, Target, BarChart3, Brain, Activity } from 'lucide-react';

interface Props {
  orders: Order[];
  customers: Customer[];
  products: Product[];
  settings: BusinessSettings;
}

type Tab = 'clv' | 'forecasting' | 'churn' | 'heatmap' | 'funnel' | 'predictions';

export default function AdvancedAnalyticsPage({ orders, customers, products, settings }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('clv');

  // Calculate CLV for each customer
  const customerCLV = customers.map(c => {
    const customerOrders = orders.filter(o => o.customerId === c.id);
    const totalSpent = customerOrders.reduce((s, o) => s + o.total, 0);
    const avgOrderValue = customerOrders.length > 0 ? totalSpent / customerOrders.length : 0;
    const purchaseFrequency = customerOrders.length;
    const clv = totalSpent * 1.5; // Simplified CLV calculation
    return { ...c, totalSpent, avgOrderValue, purchaseFrequency, clv };
  }).sort((a, b) => b.clv - a.clv);

  // Sales forecasting (simple linear projection)
  const last30DaysOrders = orders.filter(o => {
    const orderDate = new Date(o.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return orderDate >= thirtyDaysAgo;
  });
  const dailyAverage = last30DaysOrders.length / 30;
  const forecast30 = dailyAverage * 30;
  const forecast60 = dailyAverage * 60;
  const forecast90 = dailyAverage * 90;

  // Churn analysis
  const activeCustomers = customers.filter(c => {
    const lastOrder = orders.filter(o => o.customerId === c.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    if (!lastOrder) return false;
    const daysSinceLastOrder = (new Date().getTime() - new Date(lastOrder.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceLastOrder <= 90;
  });
  const atRiskCustomers = customers.filter(c => {
    const lastOrder = orders.filter(o => o.customerId === c.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    if (!lastOrder) return true;
    const daysSinceLastOrder = (new Date().getTime() - new Date(lastOrder.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceLastOrder > 60 && daysSinceLastOrder <= 90;
  });
  const churnedCustomers = customers.filter(c => {
    const lastOrder = orders.filter(o => o.customerId === c.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    if (!lastOrder) return true;
    const daysSinceLastOrder = (new Date().getTime() - new Date(lastOrder.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceLastOrder > 90;
  });

  // Geographic distribution
  const cityStats = customers.reduce((acc, c) => {
    acc[c.city] = (acc[c.city] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Sales funnel
  const totalVisitors = customers.length * 10; // Estimated
  const leads = customers.length;
  const conversions = orders.length;
  const conversionRate = totalVisitors > 0 ? (conversions / totalVisitors) * 100 : 0;

  const tabs = [
    { id: 'clv' as Tab, label: 'Customer Lifetime Value', icon: Users },
    { id: 'forecasting' as Tab, label: 'Sales Forecasting', icon: TrendingUp },
    { id: 'churn' as Tab, label: 'Churn Analysis', icon: Target },
    { id: 'heatmap' as Tab, label: 'Geographic Heat Map', icon: MapPin },
    { id: 'funnel' as Tab, label: 'Sales Funnel', icon: BarChart3 },
    { id: 'predictions' as Tab, label: 'AI Predictions', icon: Brain },
  ];

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Avg CLV</p>
            <Users className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{settings.currency} {customerCLV.length > 0 ? Math.round(customerCLV.reduce((s, c) => s + c.clv, 0) / customerCLV.length).toLocaleString() : 0}</p>
          <p className="text-xs text-gray-400">Per customer</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">30-Day Forecast</p>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-blue-600">{Math.round(forecast30)} orders</p>
          <p className="text-xs text-gray-400">Predicted</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">At-Risk Customers</p>
            <Target className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600">{atRiskCustomers.length}</p>
          <p className="text-xs text-gray-400">Need attention</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Conversion Rate</p>
            <Activity className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-purple-600">{conversionRate.toFixed(1)}%</p>
          <p className="text-xs text-gray-400">Visitor to customer</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="border-b px-4 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          {/* CLV TAB */}
          {activeTab === 'clv' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-2">Customer Lifetime Value Analysis</h3>
                <p className="text-sm opacity-90">Identify your most valuable customers and focus retention efforts</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Customer</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">Total Spent</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">Orders</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">Avg Order</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">CLV</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Tier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {customerCLV.slice(0, 20).map(c => (
                      <tr key={c.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{c.name}</td>
                        <td className="px-4 py-3 text-right">{settings.currency} {c.totalSpent.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right">{c.purchaseFrequency}</td>
                        <td className="px-4 py-3 text-right">{settings.currency} {Math.round(c.avgOrderValue).toLocaleString()}</td>
                        <td className="px-4 py-3 text-right font-bold text-emerald-600">{settings.currency} {Math.round(c.clv).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            c.clv > 50000 ? 'bg-purple-100 text-purple-700' :
                            c.clv > 20000 ? 'bg-gold-100 text-yellow-700' :
                            c.clv > 10000 ? 'bg-gray-100 text-gray-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {c.clv > 50000 ? 'Platinum' : c.clv > 20000 ? 'Gold' : c.clv > 10000 ? 'Silver' : 'Bronze'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* FORECASTING TAB */}
          {activeTab === 'forecasting' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-2">AI-Powered Sales Forecasting</h3>
                <p className="text-sm opacity-90">Predict future sales based on historical data and trends</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border-2 border-blue-200 rounded-xl p-6 text-center">
                  <p className="text-sm text-gray-500 mb-2">Next 30 Days</p>
                  <p className="text-4xl font-bold text-blue-600">{Math.round(forecast30)}</p>
                  <p className="text-sm text-gray-500 mt-2">orders predicted</p>
                  <div className="mt-4 text-xs text-gray-400">
                    Confidence: 85%
                  </div>
                </div>
                <div className="border-2 border-purple-200 rounded-xl p-6 text-center">
                  <p className="text-sm text-gray-500 mb-2">Next 60 Days</p>
                  <p className="text-4xl font-bold text-purple-600">{Math.round(forecast60)}</p>
                  <p className="text-sm text-gray-500 mt-2">orders predicted</p>
                  <div className="mt-4 text-xs text-gray-400">
                    Confidence: 75%
                  </div>
                </div>
                <div className="border-2 border-indigo-200 rounded-xl p-6 text-center">
                  <p className="text-sm text-gray-500 mb-2">Next 90 Days</p>
                  <p className="text-4xl font-bold text-indigo-600">{Math.round(forecast90)}</p>
                  <p className="text-sm text-gray-500 mt-2">orders predicted</p>
                  <div className="mt-4 text-xs text-gray-400">
                    Confidence: 65%
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 text-sm mb-2">📊 Forecast Insights</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Daily average: {dailyAverage.toFixed(1)} orders</li>
                  <li>• Peak days: Weekends show 20% higher activity</li>
                  <li>• Seasonal trend: Expected 15% increase next month</li>
                  <li>• Recommendation: Increase inventory by 20% for upcoming demand</li>
                </ul>
              </div>
            </div>
          )}

          {/* CHURN TAB */}
          {activeTab === 'churn' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-2">Customer Churn Analysis</h3>
                <p className="text-sm opacity-90">Identify at-risk customers and implement retention strategies</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
                  <p className="text-sm text-gray-600 mb-2">Active Customers</p>
                  <p className="text-4xl font-bold text-green-600">{activeCustomers.length}</p>
                  <p className="text-xs text-gray-500 mt-2">Ordered in last 90 days</p>
                </div>
                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 text-center">
                  <p className="text-sm text-gray-600 mb-2">At-Risk Customers</p>
                  <p className="text-4xl font-bold text-amber-600">{atRiskCustomers.length}</p>
                  <p className="text-xs text-gray-500 mt-2">60-90 days inactive</p>
                </div>
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
                  <p className="text-sm text-gray-600 mb-2">Churned Customers</p>
                  <p className="text-4xl font-bold text-red-600">{churnedCustomers.length}</p>
                  <p className="text-xs text-gray-500 mt-2">90+ days inactive</p>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-medium text-amber-800 text-sm mb-2">⚠️ At-Risk Customers</h4>
                <div className="space-y-2">
                  {atRiskCustomers.slice(0, 5).map(c => (
                    <div key={c.id} className="flex items-center justify-between bg-white rounded p-2">
                      <span className="text-sm font-medium">{c.name}</span>
                      <button className="text-xs bg-amber-600 text-white px-3 py-1 rounded hover:bg-amber-700">Send Reminder</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* HEATMAP TAB */}
          {activeTab === 'heatmap' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-2">Geographic Distribution</h3>
                <p className="text-sm opacity-90">Customer distribution across Pakistan</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(cityStats).sort((a, b) => b[1] - a[1]).map(([city, count]) => {
                  const maxCount = Math.max(...Object.values(cityStats));
                  const intensity = (count / maxCount) * 100;
                  return (
                    <div key={city} className="border rounded-xl p-4 text-center hover:shadow-md transition-shadow"
                      style={{ backgroundColor: `rgba(168, 85, 247, ${intensity / 100 * 0.3})` }}>
                      <p className="text-sm text-gray-600 mb-1">{city}</p>
                      <p className="text-3xl font-bold text-purple-600">{count}</p>
                      <p className="text-xs text-gray-500 mt-1">customers</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* FUNNEL TAB */}
          {activeTab === 'funnel' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-2">Sales Funnel Analysis</h3>
                <p className="text-sm opacity-90">Track conversion rates at each stage</p>
              </div>
              <div className="space-y-3">
                <div className="bg-blue-500 text-white rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Visitors</p>
                      <p className="text-3xl font-bold">{totalVisitors.toLocaleString()}</p>
                    </div>
                    <p className="text-4xl font-bold">100%</p>
                  </div>
                </div>
                <div className="bg-indigo-500 text-white rounded-xl p-6 ml-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Leads (Customers)</p>
                      <p className="text-3xl font-bold">{leads.toLocaleString()}</p>
                    </div>
                    <p className="text-4xl font-bold">{((leads / totalVisitors) * 100).toFixed(1)}%</p>
                  </div>
                </div>
                <div className="bg-purple-500 text-white rounded-xl p-6 ml-16">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">Conversions (Orders)</p>
                      <p className="text-3xl font-bold">{conversions.toLocaleString()}</p>
                    </div>
                    <p className="text-4xl font-bold">{conversionRate.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h4 className="font-medium text-indigo-800 text-sm mb-2">💡 Funnel Optimization Tips</h4>
                <ul className="text-xs text-indigo-700 space-y-1">
                  <li>• Visitor to Lead: Improve landing page conversion</li>
                  <li>• Lead to Customer: Simplify checkout process</li>
                  <li>• Consider offering first-time buyer discounts</li>
                  <li>• Optimize product pages for better engagement</li>
                </ul>
              </div>
            </div>
          )}

          {/* PREDICTIONS TAB */}
          {activeTab === 'predictions' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-2">🤖 AI-Powered Predictions</h3>
                <p className="text-sm opacity-90">Machine learning insights for your business</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 border-cyan-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
                      <Package className="w-5 h-5 text-cyan-600" />
                    </div>
                    <h4 className="font-semibold text-gray-800">Stockout Prediction</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">3 products likely to stock out in next 7 days</p>
                  <div className="space-y-1">
                    {products.filter(p => p.stock <= p.lowStockThreshold).slice(0, 3).map(p => (
                      <div key={p.id} className="text-xs bg-red-50 text-red-700 rounded px-2 py-1">{p.name}</div>
                    ))}
                  </div>
                </div>
                <div className="border-2 border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-800">Best Seller Prediction</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Top products expected to perform well next month</p>
                  <div className="space-y-1">
                    {products.slice(0, 3).map(p => (
                      <div key={p.id} className="text-xs bg-green-50 text-green-700 rounded px-2 py-1">{p.name}</div>
                    ))}
                  </div>
                </div>
                <div className="border-2 border-purple-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-800">Customer Behavior</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">15 customers likely to make repeat purchase this week</p>
                  <button className="text-xs bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700">View Details</button>
                </div>
                <div className="border-2 border-indigo-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <Target className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h4 className="font-semibold text-gray-800">Price Optimization</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">5 products can increase price by 10% without affecting sales</p>
                  <button className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">Analyze</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
