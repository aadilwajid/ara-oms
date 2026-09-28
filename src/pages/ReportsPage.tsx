import { useState, useMemo } from 'react';
import { Order, Customer, Product, Expense, Income, BusinessSettings } from '../types';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, Calendar, Filter } from 'lucide-react';

interface Props {
  orders: Order[];
  customers: Customer[];
  products: Product[];
  expenses: Expense[];
  income: Income[];
  settings: BusinessSettings;
}

export default function ReportsPage({ orders, customers, products, expenses, income, settings }: Props) {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [reportType, setReportType] = useState<'sales' | 'products' | 'customers' | 'channels'>('sales');

  const getDateFilter = () => {
    const now = new Date();
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : dateRange === '90d' ? 90 : 365;
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    return cutoff;
  };

  const filteredOrders = useMemo(() => {
    const cutoff = getDateFilter();
    return orders.filter(o => new Date(o.createdAt) >= cutoff);
  }, [orders, dateRange]);

  const filteredExpenses = useMemo(() => {
    const cutoff = getDateFilter();
    return expenses.filter(e => new Date(e.date) >= cutoff);
  }, [expenses, dateRange]);

  const filteredIncome = useMemo(() => {
    const cutoff = getDateFilter();
    return income.filter(i => new Date(i.date) >= cutoff);
  }, [income, dateRange]);

  // Sales Analytics
  const totalRevenue = filteredIncome.reduce((s, i) => s + i.amount, 0);
  const totalExpenses = filteredExpenses.reduce((s, e) => s + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
  const avgOrderValue = filteredOrders.length > 0 ? filteredOrders.reduce((s, o) => s + o.total, 0) / filteredOrders.length : 0;

  // Top Products
  const productSales = useMemo(() => {
    const sales: Record<string, { name: string; quantity: number; revenue: number }> = {};
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        if (!sales[item.productId]) {
          sales[item.productId] = { name: item.productName, quantity: 0, revenue: 0 };
        }
        sales[item.productId].quantity += item.quantity;
        sales[item.productId].revenue += item.total;
      });
    });
    return Object.values(sales).sort((a, b) => b.revenue - a.revenue).slice(0, 10);
  }, [filteredOrders]);

  // Top Customers
  const topCustomers = useMemo(() => {
    const customerSpending: Record<string, { name: string; orders: number; spent: number }> = {};
    filteredOrders.forEach(order => {
      if (!customerSpending[order.customerId]) {
        customerSpending[order.customerId] = { name: order.customerName, orders: 0, spent: 0 };
      }
      customerSpending[order.customerId].orders += 1;
      customerSpending[order.customerId].spent += order.total;
    });
    return Object.values(customerSpending).sort((a, b) => b.spent - a.spent).slice(0, 10);
  }, [filteredOrders]);

  // Channel Distribution
  const channelStats = useMemo(() => {
    const stats: Record<string, { count: number; revenue: number }> = {};
    filteredOrders.forEach(order => {
      if (!stats[order.channel]) {
        stats[order.channel] = { count: 0, revenue: 0 };
      }
      stats[order.channel].count += 1;
      stats[order.channel].revenue += order.total;
    });
    return Object.entries(stats).map(([channel, data]) => ({ channel, ...data }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredOrders]);

  // Daily Sales Trend (last 30 days)
  const dailySales = useMemo(() => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

    return last30Days.map(date => {
      const dayOrders = filteredOrders.filter(o => o.createdAt === date);
      const revenue = dayOrders.reduce((s, o) => s + o.total, 0);
      return { date, orders: dayOrders.length, revenue };
    });
  }, [filteredOrders]);

  const maxDailyRevenue = Math.max(...dailySales.map(d => d.revenue), 1);

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Reports & Analytics</h2>
          <div className="flex gap-2">
            <div className="flex gap-1 border rounded-lg p-1">
              {(['7d', '30d', '90d', 'all'] as const).map(range => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    dateRange === range
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : 'All Time'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Total Revenue</span>
            <DollarSign className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{settings.currency} {totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">{filteredOrders.length} orders</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Net Profit</span>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {settings.currency} {netProfit.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">{profitMargin.toFixed(1)}% margin</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Avg Order Value</span>
            <ShoppingCart className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{settings.currency} {avgOrderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          <p className="text-xs text-gray-500 mt-1">Per order average</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Total Expenses</span>
            <TrendingDown className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{settings.currency} {totalExpenses.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">{filteredExpenses.length} transactions</p>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="border-b px-4">
          <div className="flex gap-4">
            {(['sales', 'products', 'customers', 'channels'] as const).map(type => (
              <button
                key={type}
                onClick={() => setReportType(type)}
                className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                  reportType === type
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)} Report
              </button>
            ))}
          </div>
        </div>

        <div className="p-5">
          {/* Sales Report */}
          {reportType === 'sales' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Daily Sales Trend (Last 30 Days)</h3>
                <div className="h-64 flex items-end gap-1">
                  {dailySales.map((day, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-emerald-500 rounded-t hover:bg-emerald-600 transition-colors cursor-pointer relative group"
                        style={{ height: `${(day.revenue / maxDailyRevenue) * 100}%`, minHeight: day.revenue > 0 ? '4px' : '0' }}
                      >
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                          {day.date}: {settings.currency} {day.revenue.toLocaleString()}
                        </div>
                      </div>
                      {idx % 5 === 0 && (
                        <span className="text-xs text-gray-400 rotate-45 origin-top-left">
                          {day.date.slice(5)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Order Status Distribution</h3>
                  <div className="space-y-2">
                    {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => {
                      const count = filteredOrders.filter(o => o.status === status).length;
                      const percentage = filteredOrders.length > 0 ? (count / filteredOrders.length) * 100 : 0;
                      return (
                        <div key={status} className="flex items-center gap-3">
                          <span className="text-sm capitalize w-20 text-gray-600">{status}</span>
                          <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 flex items-center justify-end pr-2 text-white text-xs font-medium"
                              style={{ width: `${percentage}%` }}
                            >
                              {count > 0 && count}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500 w-12 text-right">{percentage.toFixed(0)}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Payment Status</h3>
                  <div className="space-y-2">
                    {['paid', 'unpaid', 'partial', 'refunded'].map(status => {
                      const count = filteredOrders.filter(o => o.paymentStatus === status).length;
                      const percentage = filteredOrders.length > 0 ? (count / filteredOrders.length) * 100 : 0;
                      return (
                        <div key={status} className="flex items-center gap-3">
                          <span className="text-sm capitalize w-20 text-gray-600">{status}</span>
                          <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                            <div
                              className={`h-full flex items-center justify-end pr-2 text-white text-xs font-medium ${
                                status === 'paid' ? 'bg-green-500' : status === 'unpaid' ? 'bg-red-500' : status === 'partial' ? 'bg-yellow-500' : 'bg-gray-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            >
                              {count > 0 && count}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500 w-12 text-right">{percentage.toFixed(0)}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Report */}
          {reportType === 'products' && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Top 10 Best Selling Products</h3>
              {productSales.length > 0 ? (
                <div className="space-y-3">
                  {productSales.map((product, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.quantity} units sold</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-600">{settings.currency} {product.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-12 text-gray-400">No product sales data for this period</p>
              )}
            </div>
          )}

          {/* Customers Report */}
          {reportType === 'customers' && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Top 10 Customers by Spending</h3>
              {topCustomers.length > 0 ? (
                <div className="space-y-3">
                  {topCustomers.map((customer, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{customer.name}</p>
                        <p className="text-sm text-gray-500">{customer.orders} orders</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">{settings.currency} {customer.spent.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-12 text-gray-400">No customer data for this period</p>
              )}
            </div>
          )}

          {/* Channels Report */}
          {reportType === 'channels' && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Sales by Channel</h3>
              {channelStats.length > 0 ? (
                <div className="space-y-3">
                  {channelStats.map((channel, idx) => {
                    const totalRevenue = channelStats.reduce((s, c) => s + c.revenue, 0);
                    const percentage = totalRevenue > 0 ? (channel.revenue / totalRevenue) * 100 : 0;
                    return (
                      <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">
                              {channel.channel === 'website' ? '🌐' : channel.channel === 'daraz' ? '🟠' : channel.channel === 'whatsapp' ? '💬' : '📦'}
                            </span>
                            <span className="font-medium text-gray-800 capitalize">{channel.channel}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-emerald-600">{settings.currency} {channel.revenue.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">{channel.count} orders</p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}% of total revenue</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center py-12 text-gray-400">No channel data for this period</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
