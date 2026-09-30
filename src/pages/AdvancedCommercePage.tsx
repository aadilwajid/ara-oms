import { useState, useEffect } from 'react';
import { BusinessSettings, Product, Customer } from '../types';
import { Repeat, Clock, Hammer, Truck, Users, Plus, Calendar, TrendingUp } from 'lucide-react';

interface Subscription {
  id: string;
  customerId: string;
  customerName: string;
  plan: string;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  amount: number;
  nextBilling: string;
  status: 'active' | 'paused' | 'cancelled';
  createdAt: string;
}

interface PreOrder {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  quantity: number;
  deposit: number;
  expectedDate: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: string;
}

interface Auction {
  id: string;
  productName: string;
  startPrice: number;
  currentBid: number;
  bids: number;
  endTime: string;
  status: 'active' | 'ended' | 'cancelled';
  winner?: string;
}

interface Rental {
  id: string;
  productName: string;
  customerName: string;
  startDate: string;
  endDate: string;
  dailyRate: number;
  totalAmount: number;
  status: 'active' | 'returned' | 'overdue';
}

interface GroupBuy {
  id: string;
  productName: string;
  targetQuantity: number;
  currentQuantity: number;
  discount: number;
  deadline: string;
  status: 'active' | 'completed' | 'expired';
}

interface Props { settings: BusinessSettings; products: Product[]; customers: Customer[]; }

type Tab = 'subscriptions' | 'preorders' | 'auctions' | 'rentals' | 'groupbuy';

export default function AdvancedCommercePage({ settings, products, customers }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('subscriptions');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [preOrders, setPreOrders] = useState<PreOrder[]>([]);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [groupBuys, setGroupBuys] = useState<GroupBuy[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('oms_advanced_commerce');
    if (saved) {
      const data = JSON.parse(saved);
      setSubscriptions(data.subscriptions || []);
      setPreOrders(data.preOrders || []);
      setAuctions(data.auctions || []);
      setRentals(data.rentals || []);
      setGroupBuys(data.groupBuys || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('oms_advanced_commerce', JSON.stringify({ subscriptions, preOrders, auctions, rentals, groupBuys }));
  }, [subscriptions, preOrders, auctions, rentals, groupBuys]);

  const stats = {
    activeSubscriptions: subscriptions.filter(s => s.status === 'active').length,
    monthlyRevenue: subscriptions.filter(s => s.status === 'active').reduce((s, sub) => s + sub.amount, 0),
    pendingPreOrders: preOrders.filter(p => p.status === 'pending' || p.status === 'confirmed').length,
    activeAuctions: auctions.filter(a => a.status === 'active').length,
    activeRentals: rentals.filter(r => r.status === 'active').length,
    activeGroupBuys: groupBuys.filter(g => g.status === 'active').length,
  };

  const tabs = [
    { id: 'subscriptions' as Tab, label: 'Subscriptions', icon: Repeat },
    { id: 'preorders' as Tab, label: 'Pre-Orders', icon: Calendar },
    { id: 'auctions' as Tab, label: 'Auctions', icon: Hammer },
    { id: 'rentals' as Tab, label: 'Rentals', icon: Truck },
    { id: 'groupbuy' as Tab, label: 'Group Buying', icon: Users },
  ];

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Active Subscriptions</p>
            <Repeat className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.activeSubscriptions}</p>
          <p className="text-xs text-gray-400">{settings.currency} {stats.monthlyRevenue.toLocaleString()}/mo</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Pre-Orders</p>
            <Calendar className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-purple-600">{stats.pendingPreOrders}</p>
          <p className="text-xs text-gray-400">Pending fulfillment</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Active Auctions</p>
            <Hammer className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600">{stats.activeAuctions}</p>
          <p className="text-xs text-gray-400">Live bidding</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Active Rentals</p>
            <Truck className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.activeRentals}</p>
          <p className="text-xs text-gray-400">{stats.activeGroupBuys} group buys</p>
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
          {/* SUBSCRIPTIONS TAB */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg p-4 text-white flex-1 mr-4">
                  <p className="text-sm opacity-90">Monthly Recurring Revenue</p>
                  <p className="text-3xl font-bold">{settings.currency} {stats.monthlyRevenue.toLocaleString()}</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> New Subscription
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Customer</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Plan</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Frequency</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">Amount</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Next Billing</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {subscriptions.map(sub => (
                      <tr key={sub.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{sub.customerName}</td>
                        <td className="px-4 py-3">{sub.plan}</td>
                        <td className="px-4 py-3 capitalize">{sub.frequency}</td>
                        <td className="px-4 py-3 text-right font-bold">{settings.currency} {sub.amount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-gray-500">{sub.nextBilling}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            sub.status === 'active' ? 'bg-green-100 text-green-700' :
                            sub.status === 'paused' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                          }`}>{sub.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {subscriptions.length === 0 && (
                  <p className="text-center py-12 text-gray-400">No subscriptions yet</p>
                )}
              </div>
            </div>
          )}

          {/* PRE-ORDERS TAB */}
          {activeTab === 'preorders' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> New Pre-Order
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Product</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Customer</th>
                      <th className="text-center px-4 py-3 font-medium text-gray-600">Qty</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">Deposit</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Expected</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {preOrders.map(po => (
                      <tr key={po.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{po.productName}</td>
                        <td className="px-4 py-3">{po.customerName}</td>
                        <td className="px-4 py-3 text-center">{po.quantity}</td>
                        <td className="px-4 py-3 text-right">{settings.currency} {po.deposit.toLocaleString()}</td>
                        <td className="px-4 py-3 text-gray-500">{po.expectedDate}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            po.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            po.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                            po.status === 'confirmed' ? 'bg-purple-100 text-purple-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>{po.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {preOrders.length === 0 && (
                  <p className="text-center py-12 text-gray-400">No pre-orders yet</p>
                )}
              </div>
            </div>
          )}

          {/* AUCTIONS TAB */}
          {activeTab === 'auctions' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Create Auction
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {auctions.map(auction => (
                  <div key={auction.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-gray-800">{auction.productName}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        auction.status === 'active' ? 'bg-green-100 text-green-700 animate-pulse' : 'bg-gray-100 text-gray-600'
                      }`}>{auction.status}</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Start Price:</span>
                        <span>{settings.currency} {auction.startPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Current Bid:</span>
                        <span className="font-bold text-amber-600">{settings.currency} {auction.currentBid.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Total Bids:</span>
                        <span className="font-medium">{auction.bids}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Ends:</span>
                        <span className="text-xs">{auction.endTime}</span>
                      </div>
                    </div>
                    {auction.status === 'active' && (
                      <button className="w-full mt-3 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700">
                        Place Bid
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {auctions.length === 0 && (
                <p className="text-center py-12 text-gray-400">No auctions created</p>
              )}
            </div>
          )}

          {/* RENTALS TAB */}
          {activeTab === 'rentals' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> New Rental
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Product</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Customer</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Period</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">Daily Rate</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">Total</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {rentals.map(rental => (
                      <tr key={rental.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{rental.productName}</td>
                        <td className="px-4 py-3">{rental.customerName}</td>
                        <td className="px-4 py-3 text-xs">{rental.startDate} to {rental.endDate}</td>
                        <td className="px-4 py-3 text-right">{settings.currency} {rental.dailyRate.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right font-bold">{settings.currency} {rental.totalAmount.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            rental.status === 'returned' ? 'bg-green-100 text-green-700' :
                            rental.status === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                          }`}>{rental.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {rentals.length === 0 && (
                  <p className="text-center py-12 text-gray-400">No rentals yet</p>
                )}
              </div>
            </div>
          )}

          {/* GROUP BUYING TAB */}
          {activeTab === 'groupbuy' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Create Group Buy
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groupBuys.map(group => {
                  const progress = (group.currentQuantity / group.targetQuantity) * 100;
                  return (
                    <div key={group.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-gray-800">{group.productName}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          group.status === 'active' ? 'bg-green-100 text-green-700' :
                          group.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                        }`}>{group.status}</span>
                      </div>
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">{group.currentQuantity}/{group.targetQuantity}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <p className="text-gray-500">Discount</p>
                          <p className="font-bold text-green-600">{group.discount}% OFF</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-500">Deadline</p>
                          <p className="font-medium text-xs">{group.deadline}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {groupBuys.length === 0 && (
                <p className="text-center py-12 text-gray-400">No group buys created</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
