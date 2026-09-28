import { useState } from 'react';
import { BusinessSettings } from '../types';
import { Plus, Search, Edit2, Trash2, X, Tag, Gift, Repeat, Percent } from 'lucide-react';

interface Props { settings: BusinessSettings; }

type Tab = 'coupons' | 'gift-cards' | 'subscriptions';

export default function PromotionsPage({ settings }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('coupons');

  const coupons = [
    { id: '1', code: 'SUMMER20', type: 'percentage', value: 20, minOrder: 2000, uses: 45, maxUses: 100, expires: '2024-06-30', active: true },
    { id: '2', code: 'FLAT500', type: 'fixed', value: 500, minOrder: 3000, uses: 23, maxUses: 50, expires: '2024-05-15', active: true },
    { id: '3', code: 'FREESHIP', type: 'free-shipping', value: 0, minOrder: 1500, uses: 78, maxUses: 200, expires: '2024-12-31', active: true },
  ];

  const giftCards = [
    { id: '1', code: 'GC-ABC123', amount: 5000, balance: 5000, recipient: 'Ahmed Khan', status: 'active', purchased: '2024-03-01' },
    { id: '2', code: 'GC-XYZ789', amount: 3000, balance: 1500, recipient: 'Fatima Ali', status: 'active', purchased: '2024-02-15' },
    { id: '3', code: 'GC-DEF456', amount: 10000, balance: 0, recipient: 'Usman Ghani', status: 'redeemed', purchased: '2024-01-20' },
  ];

  const subscriptions = [
    { id: '1', customer: 'Ahmed Khan', products: 3, frequency: 'monthly', nextDelivery: '2024-04-01', amount: 4500, status: 'active' },
    { id: '2', customer: 'Fatima Ali', products: 2, frequency: 'weekly', nextDelivery: '2024-03-15', amount: 2200, status: 'active' },
    { id: '3', customer: 'Sara Khan', products: 4, frequency: 'quarterly', nextDelivery: '2024-06-01', amount: 8500, status: 'paused' },
  ];

  const stats = {
    totalCoupons: coupons.length,
    activeCoupons: coupons.filter(c => c.active).length,
    totalRedemptions: coupons.reduce((s, c) => s + c.uses, 0),
    giftCardValue: giftCards.reduce((s, gc) => s + gc.balance, 0),
    activeSubscriptions: subscriptions.filter(s => s.status === 'active').length,
    monthlyRevenue: subscriptions.filter(s => s.status === 'active').reduce((s, sub) => s + sub.amount, 0),
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Active Coupons</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.activeCoupons}</p>
          <p className="text-xs text-gray-400">{stats.totalRedemptions} redemptions</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Gift Card Balance</p>
          <p className="text-2xl font-bold text-purple-600">{settings.currency} {stats.giftCardValue.toLocaleString()}</p>
          <p className="text-xs text-gray-400">{giftCards.length} cards</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Active Subscriptions</p>
          <p className="text-2xl font-bold text-blue-600">{stats.activeSubscriptions}</p>
          <p className="text-xs text-gray-400">Recurring revenue</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Monthly Recurring</p>
          <p className="text-2xl font-bold text-amber-600">{settings.currency} {stats.monthlyRevenue.toLocaleString()}</p>
          <p className="text-xs text-gray-400">From subscriptions</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="border-b px-4">
          <div className="flex gap-4">
            <button onClick={() => setActiveTab('coupons')} className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'coupons' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500'}`}>
              <Tag className="w-4 h-4 inline mr-2" />Coupons & Discounts
            </button>
            <button onClick={() => setActiveTab('gift-cards')} className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'gift-cards' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500'}`}>
              <Gift className="w-4 h-4 inline mr-2" />Gift Cards
            </button>
            <button onClick={() => setActiveTab('subscriptions')} className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'subscriptions' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500'}`}>
              <Repeat className="w-4 h-4 inline mr-2" />Subscriptions
            </button>
          </div>
        </div>

        <div className="p-4">
          {/* COUPONS TAB */}
          {activeTab === 'coupons' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Create Coupon
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {coupons.map(coupon => (
                  <div key={coupon.id} className="border-2 border-dashed border-emerald-300 rounded-xl p-4 hover:shadow-md transition-shadow bg-gradient-to-br from-emerald-50 to-white">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Coupon Code</p>
                        <p className="text-2xl font-bold text-emerald-700 font-mono">{coupon.code}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${coupon.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {coupon.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2">
                        <Percent className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          {coupon.type === 'percentage' && `${coupon.value}% off`}
                          {coupon.type === 'fixed' && `${settings.currency} ${coupon.value} off`}
                          {coupon.type === 'free-shipping' && 'Free Shipping'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">Min. order: {settings.currency} {coupon.minOrder.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Uses: {coupon.uses}/{coupon.maxUses}</p>
                      <p className="text-xs text-gray-500">Expires: {coupon.expires}</p>
                    </div>
                    <div className="flex gap-2 pt-3 border-t">
                      <button className="flex-1 py-1.5 bg-blue-50 text-blue-600 rounded text-xs font-medium hover:bg-blue-100">Edit</button>
                      <button className="flex-1 py-1.5 bg-red-50 text-red-600 rounded text-xs font-medium hover:bg-red-100">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GIFT CARDS TAB */}
          {activeTab === 'gift-cards' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Create Gift Card
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {giftCards.map(gc => (
                  <div key={gc.id} className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-4 text-white shadow-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-xs opacity-80">Gift Card</p>
                        <p className="text-lg font-bold font-mono">{gc.code}</p>
                      </div>
                      <Gift className="w-8 h-8 opacity-50" />
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm opacity-80">Amount:</span>
                        <span className="font-bold">{settings.currency} {gc.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm opacity-80">Balance:</span>
                        <span className="font-bold">{settings.currency} {gc.balance.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm opacity-80">Recipient:</span>
                        <span className="font-medium">{gc.recipient}</span>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-white/20">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${gc.status === 'active' ? 'bg-white/20' : 'bg-white/10'}`}>
                        {gc.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUBSCRIPTIONS TAB */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Create Subscription
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Customer</th>
                      <th className="text-center px-4 py-3 font-medium text-gray-600">Products</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Frequency</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">Amount</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Next Delivery</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {subscriptions.map(sub => (
                      <tr key={sub.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{sub.customer}</td>
                        <td className="px-4 py-3 text-center">{sub.products}</td>
                        <td className="px-4 py-3 capitalize">{sub.frequency}</td>
                        <td className="px-4 py-3 text-right font-medium">{settings.currency} {sub.amount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-gray-500">{sub.nextDelivery}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${sub.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {sub.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
