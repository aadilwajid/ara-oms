import { useState, useEffect } from 'react';
import { BusinessSettings, Customer } from '../types';
import { Mail, MessageSquare, Users, Gift, TrendingUp, Send, Calendar, Award, Plus } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'whatsapp';
  status: 'draft' | 'scheduled' | 'sent' | 'completed';
  recipients: number;
  sent: number;
  opened: number;
  clicked: number;
  converted: number;
  scheduledDate: string;
  createdAt: string;
}

interface Referral {
  id: string;
  referrerId: string;
  referrerName: string;
  refereeName: string;
  refereeEmail: string;
  status: 'pending' | 'completed' | 'expired';
  reward: number;
  createdAt: string;
}

interface Affiliate {
  id: string;
  name: string;
  email: string;
  commission: number;
  totalSales: number;
  totalCommission: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface Contest {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  participants: number;
  prize: string;
  status: 'upcoming' | 'active' | 'ended';
}

interface Props { settings: BusinessSettings; customers: Customer[]; }

type Tab = 'campaigns' | 'referrals' | 'affiliates' | 'contests' | 'automation';

export default function MarketingAutomationPage({ settings, customers }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('campaigns');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [contests, setContests] = useState<Contest[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('oms_marketing');
    if (saved) {
      const data = JSON.parse(saved);
      setCampaigns(data.campaigns || []);
      setReferrals(data.referrals || []);
      setAffiliates(data.affiliates || []);
      setContests(data.contests || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('oms_marketing', JSON.stringify({ campaigns, referrals, affiliates, contests }));
  }, [campaigns, referrals, affiliates, contests]);

  const stats = {
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter(c => c.status === 'scheduled' || c.status === 'sent').length,
    totalReferrals: referrals.length,
    completedReferrals: referrals.filter(r => r.status === 'completed').length,
    activeAffiliates: affiliates.filter(a => a.status === 'active').length,
    totalCommission: affiliates.reduce((s, a) => s + a.totalCommission, 0),
    activeContests: contests.filter(c => c.status === 'active').length,
  };

  const tabs = [
    { id: 'campaigns' as Tab, label: 'Campaigns', icon: Mail },
    { id: 'referrals' as Tab, label: 'Referrals', icon: Users },
    { id: 'affiliates' as Tab, label: 'Affiliates', icon: Award },
    { id: 'contests' as Tab, label: 'Contests', icon: Gift },
    { id: 'automation' as Tab, label: 'Automation', icon: TrendingUp },
  ];

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Campaigns</p>
            <Mail className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.totalCampaigns}</p>
          <p className="text-xs text-gray-400">{stats.activeCampaigns} active</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Referrals</p>
            <Users className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.totalReferrals}</p>
          <p className="text-xs text-gray-400">{stats.completedReferrals} completed</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Affiliates</p>
            <Award className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.activeAffiliates}</p>
          <p className="text-xs text-gray-400">Active partners</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Commission Paid</p>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">{settings.currency} {stats.totalCommission.toLocaleString()}</p>
          <p className="text-xs text-gray-400">Total paid</p>
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
          {/* CAMPAIGNS TAB */}
          {activeTab === 'campaigns' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Create Campaign
                </button>
              </div>
              <div className="space-y-3">
                {campaigns.map(campaign => (
                  <div key={campaign.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">{campaign.name}</h4>
                        <p className="text-xs text-gray-500 capitalize">{campaign.type} campaign • {campaign.scheduledDate}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        campaign.status === 'completed' ? 'bg-green-100 text-green-700' :
                        campaign.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                        campaign.status === 'scheduled' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                      }`}>{campaign.status}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-xs text-gray-500">Sent</p>
                        <p className="font-bold">{campaign.sent}</p>
                      </div>
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-xs text-gray-500">Opened</p>
                        <p className="font-bold text-blue-600">{campaign.opened}</p>
                      </div>
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-xs text-gray-500">Clicked</p>
                        <p className="font-bold text-purple-600">{campaign.clicked}</p>
                      </div>
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-xs text-gray-500">Converted</p>
                        <p className="font-bold text-green-600">{campaign.converted}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {campaigns.length === 0 && <p className="text-center py-12 text-gray-400">No campaigns yet</p>}
              </div>
            </div>
          )}

          {/* REFERRALS TAB */}
          {activeTab === 'referrals' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-2">Referral Program</h3>
                <p className="text-sm opacity-90">Reward customers for bringing new business</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Referrer</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Referee</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">Reward</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {referrals.map(ref => (
                      <tr key={ref.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{ref.referrerName}</td>
                        <td className="px-4 py-3">{ref.refereeName}</td>
                        <td className="px-4 py-3 text-right font-medium text-green-600">{settings.currency} {ref.reward}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            ref.status === 'completed' ? 'bg-green-100 text-green-700' :
                            ref.status === 'expired' ? 'bg-gray-100 text-gray-600' : 'bg-yellow-100 text-yellow-700'
                          }`}>{ref.status}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{ref.createdAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {referrals.length === 0 && <p className="text-center py-12 text-gray-400">No referrals yet</p>}
              </div>
            </div>
          )}

          {/* AFFILIATES TAB */}
          {activeTab === 'affiliates' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Affiliate
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {affiliates.map(aff => (
                  <div key={aff.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">{aff.name}</h4>
                        <p className="text-xs text-gray-500">{aff.email}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${aff.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {aff.status}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Commission Rate:</span>
                        <span className="font-medium">{aff.commission}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Total Sales:</span>
                        <span className="font-medium">{settings.currency} {aff.totalSales.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="text-gray-500">Commission Earned:</span>
                        <span className="font-bold text-purple-600">{settings.currency} {aff.totalCommission.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CONTESTS TAB */}
          {activeTab === 'contests' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button className="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pink-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Create Contest
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contests.map(contest => (
                  <div key={contest.id} className="border-2 border-pink-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-gradient-to-br from-pink-50 to-white">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">{contest.name}</h4>
                        <p className="text-xs text-gray-500">{contest.startDate} - {contest.endDate}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        contest.status === 'active' ? 'bg-green-100 text-green-700' :
                        contest.status === 'ended' ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-700'
                      }`}>{contest.status}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{contest.description}</p>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div>
                        <p className="text-xs text-gray-500">Prize</p>
                        <p className="font-bold text-pink-600">{contest.prize}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Participants</p>
                        <p className="font-bold">{contest.participants}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AUTOMATION TAB */}
          {activeTab === 'automation' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-2">Marketing Automation Rules</h3>
                <p className="text-sm opacity-90">Set up automated marketing workflows</p>
              </div>
              <div className="space-y-3">
                {[
                  { title: 'Welcome Email', trigger: 'New customer signs up', action: 'Send welcome email with 10% discount', enabled: true },
                  { title: 'Abandoned Cart', trigger: 'Cart inactive for 24 hours', action: 'Send reminder email', enabled: true },
                  { title: 'Post-Purchase Follow-up', trigger: 'Order delivered', action: 'Send review request after 7 days', enabled: true },
                  { title: 'Birthday Wish', trigger: 'Customer birthday', action: 'Send birthday greeting with special offer', enabled: false },
                  { title: 'Re-engagement', trigger: 'No purchase in 60 days', action: 'Send win-back offer', enabled: false },
                  { title: 'Loyalty Tier Upgrade', trigger: 'Points threshold reached', action: 'Send tier upgrade notification', enabled: true },
                ].map((rule, idx) => (
                  <div key={idx} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-800">{rule.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">Trigger: {rule.trigger}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={rule.enabled} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>
                    <p className="text-sm text-gray-600">Action: {rule.action}</p>
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
