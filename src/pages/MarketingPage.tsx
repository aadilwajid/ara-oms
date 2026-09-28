import { useState } from 'react';
import { BusinessSettings } from '../types';
import { Award, ShoppingCart, Mail, MessageSquare, Users, TrendingUp } from 'lucide-react';

interface Props { settings: BusinessSettings; }

type Tab = 'loyalty' | 'abandoned-carts' | 'templates' | 'segments';

export default function MarketingPage({ settings }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('loyalty');

  // Loyalty
  const loyaltyStats = {
    totalMembers: 156,
    activeMembers: 134,
    totalPointsIssued: 45600,
    totalPointsRedeemed: 23400,
    avgPointsPerCustomer: 292,
  };

  const topMembers = [
    { id: '1', name: 'Ahmed Khan', points: 2450, tier: 'Gold', spent: 45000 },
    { id: '2', name: 'Fatima Ali', points: 1890, tier: 'Silver', spent: 32000 },
    { id: '3', name: 'Usman Ghani', points: 1560, tier: 'Silver', spent: 28000 },
    { id: '4', name: 'Sara Khan', points: 980, tier: 'Bronze', spent: 18000 },
  ];

  const tiers = [
    { name: 'Bronze', minPoints: 0, discount: 0, color: 'bg-amber-600', members: 78 },
    { name: 'Silver', minPoints: 1000, discount: 5, color: 'bg-gray-400', members: 45 },
    { name: 'Gold', minPoints: 2000, discount: 10, color: 'bg-yellow-500', members: 23 },
    { name: 'Platinum', minPoints: 5000, discount: 15, color: 'bg-purple-500', members: 10 },
  ];

  // Abandoned Carts
  const abandonedCarts = [
    { id: '1', customer: 'Ali Hassan', email: 'ali@email.com', items: 3, total: 4500, created: '2024-03-10 14:30', reminderSent: true, recovered: false },
    { id: '2', customer: 'Ayesha Malik', email: 'ayesha@email.com', items: 2, total: 2800, created: '2024-03-10 12:15', reminderSent: false, recovered: false },
    { id: '3', customer: 'Bilal Ahmed', phone: '0300-1234567', items: 4, total: 6200, created: '2024-03-09 18:45', reminderSent: true, recovered: true },
  ];

  // Templates
  const smsTemplates = [
    { id: '1', name: 'Order Confirmation', type: 'order', content: 'Your order #{order_number} has been confirmed! Total: {currency} {total}', active: true },
    { id: '2', name: 'Shipping Update', type: 'shipping', content: 'Your order #{order_number} has been shipped! Tracking: {tracking}', active: true },
    { id: '3', name: 'Payment Reminder', type: 'payment', content: 'Reminder: Payment pending for order #{order_number}. Amount: {currency} {total}', active: true },
  ];

  const emailTemplates = [
    { id: '1', name: 'Welcome Email', type: 'welcome', subject: 'Welcome to {store_name}!', active: true },
    { id: '2', name: 'Abandoned Cart', type: 'abandoned', subject: 'You left items in your cart!', active: true },
    { id: '3', name: 'Promotional Offer', type: 'promotion', subject: 'Special offer just for you!', active: false },
  ];

  // Segments
  const segments = [
    { id: '1', name: 'VIP Customers', criteria: 'Spent > 50,000', count: 23, created: '2024-01-15' },
    { id: '2', name: 'New Customers', criteria: 'Joined < 30 days', count: 45, created: '2024-03-01' },
    { id: '3', name: 'Inactive Customers', criteria: 'No order > 90 days', count: 67, created: '2024-02-20' },
    { id: '4', name: 'Karachi Customers', criteria: 'City = Karachi', count: 89, created: '2024-01-10' },
  ];

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Loyalty Members</p>
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{loyaltyStats.totalMembers}</p>
          <p className="text-xs text-gray-400">{loyaltyStats.activeMembers} active</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Abandoned Carts</p>
            <ShoppingCart className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-600">{abandonedCarts.filter(c => !c.recovered).length}</p>
          <p className="text-xs text-gray-400">{settings.currency} {abandonedCarts.filter(c => !c.recovered).reduce((s, c) => s + c.total, 0).toLocaleString()} at risk</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Active Templates</p>
            <MessageSquare className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-blue-600">{smsTemplates.filter(t => t.active).length + emailTemplates.filter(t => t.active).length}</p>
          <p className="text-xs text-gray-400">SMS + Email</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Segments</p>
            <Users className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-purple-600">{segments.length}</p>
          <p className="text-xs text-gray-400">{segments.reduce((s, seg) => s + seg.count, 0)} customers</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="border-b px-4 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            <button onClick={() => setActiveTab('loyalty')} className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'loyalty' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500'}`}>
              <Award className="w-4 h-4 inline mr-2" />Loyalty Program
            </button>
            <button onClick={() => setActiveTab('abandoned-carts')} className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'abandoned-carts' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500'}`}>
              <ShoppingCart className="w-4 h-4 inline mr-2" />Abandoned Carts
            </button>
            <button onClick={() => setActiveTab('templates')} className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'templates' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500'}`}>
              <Mail className="w-4 h-4 inline mr-2" />Templates
            </button>
            <button onClick={() => setActiveTab('segments')} className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'segments' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500'}`}>
              <Users className="w-4 h-4 inline mr-2" />Segments
            </button>
          </div>
        </div>

        <div className="p-4">
          {/* LOYALTY TAB */}
          {activeTab === 'loyalty' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {tiers.map(tier => (
                  <div key={tier.name} className={`${tier.color} text-white rounded-xl p-4`}>
                    <h4 className="font-bold text-lg mb-1">{tier.name}</h4>
                    <p className="text-sm opacity-90">{tier.minPoints}+ points</p>
                    <p className="text-2xl font-bold mt-2">{tier.members}</p>
                    <p className="text-xs opacity-80">members</p>
                    {tier.discount > 0 && (
                      <p className="text-sm font-medium mt-2 bg-white/20 rounded px-2 py-1 inline-block">{tier.discount}% off</p>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Top Loyalty Members</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Customer</th>
                        <th className="text-right px-4 py-3 font-medium text-gray-600">Points</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Tier</th>
                        <th className="text-right px-4 py-3 font-medium text-gray-600">Total Spent</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {topMembers.map(member => (
                        <tr key={member.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{member.name}</td>
                          <td className="px-4 py-3 text-right font-bold text-amber-600">{member.points.toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              member.tier === 'Gold' ? 'bg-yellow-100 text-yellow-700' :
                              member.tier === 'Silver' ? 'bg-gray-100 text-gray-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>{member.tier}</span>
                          </td>
                          <td className="px-4 py-3 text-right">{settings.currency} {member.spent.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ABANDONED CARTS TAB */}
          {activeTab === 'abandoned-carts' && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-800 text-sm mb-1">💰 Revenue at Risk</h4>
                <p className="text-2xl font-bold text-red-600">{settings.currency} {abandonedCarts.filter(c => !c.recovered).reduce((s, c) => s + c.total, 0).toLocaleString()}</p>
                <p className="text-xs text-red-700">Send reminders to recover these sales</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Customer</th>
                      <th className="text-center px-4 py-3 font-medium text-gray-600">Items</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">Total</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Created</th>
                      <th className="text-center px-4 py-3 font-medium text-gray-600">Reminder</th>
                      <th className="text-center px-4 py-3 font-medium text-gray-600">Status</th>
                      <th className="text-center px-4 py-3 font-medium text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {abandonedCarts.map(cart => (
                      <tr key={cart.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <p className="font-medium">{cart.customer}</p>
                          <p className="text-xs text-gray-500">{cart.email || cart.phone}</p>
                        </td>
                        <td className="px-4 py-3 text-center">{cart.items}</td>
                        <td className="px-4 py-3 text-right font-medium">{settings.currency} {cart.total.toLocaleString()}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{cart.created}</td>
                        <td className="px-4 py-3 text-center">
                          {cart.reminderSent ? (
                            <span className="text-xs text-green-600">✓ Sent</span>
                          ) : (
                            <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">Send</button>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {cart.recovered ? (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Recovered</span>
                          ) : (
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Lost</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {!cart.recovered && (
                            <button className="text-xs bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700">Recover</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TEMPLATES TAB */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-500" /> SMS Templates
                  </h3>
                  <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">+ Add Template</button>
                </div>
                <div className="space-y-2">
                  {smsTemplates.map(template => (
                    <div key={template.id} className="border rounded-lg p-3 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-sm">{template.name}</h4>
                          <p className="text-xs text-gray-500 capitalize">{template.type}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${template.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {template.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 bg-gray-50 rounded p-2 font-mono">{template.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-purple-500" /> Email Templates
                  </h3>
                  <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">+ Add Template</button>
                </div>
                <div className="space-y-2">
                  {emailTemplates.map(template => (
                    <div key={template.id} className="border rounded-lg p-3 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-sm">{template.name}</h4>
                          <p className="text-xs text-gray-500">Subject: {template.subject}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${template.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {template.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SEGMENTS TAB */}
          {activeTab === 'segments' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2">
                  <Users className="w-4 h-4" /> Create Segment
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {segments.map(segment => (
                  <div key={segment.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">{segment.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">{segment.criteria}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-purple-600">{segment.count}</p>
                        <p className="text-xs text-gray-500">customers</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 py-1.5 bg-blue-50 text-blue-600 rounded text-xs font-medium hover:bg-blue-100">Send Campaign</button>
                      <button className="flex-1 py-1.5 bg-purple-50 text-purple-600 rounded text-xs font-medium hover:bg-purple-100">View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
