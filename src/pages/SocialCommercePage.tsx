import { useState, useEffect } from 'react';
import { BusinessSettings, Customer } from '../types';
import { Instagram, Facebook, Twitter, Users, Camera, Star, Share2, TrendingUp, Plus } from 'lucide-react';

interface Influencer {
  id: string;
  name: string;
  platform: 'instagram' | 'facebook' | 'tiktok' | 'youtube';
  followers: number;
  engagement: number;
  commission: number;
  totalSales: number;
  status: 'active' | 'pending' | 'inactive';
}

interface UGCItem {
  id: string;
  customerId: string;
  customerName: string;
  imageUrl: string;
  caption: string;
  platform: string;
  likes: number;
  approved: boolean;
  createdAt: string;
}

interface SocialCampaign {
  id: string;
  name: string;
  platform: string;
  type: 'post' | 'story' | 'reel' | 'live';
  status: 'scheduled' | 'published' | 'draft';
  reach: number;
  engagement: number;
  scheduledDate: string;
}

interface ReferralProgram {
  id: string;
  referrerName: string;
  refereeName: string;
  reward: number;
  status: 'pending' | 'completed' | 'expired';
  createdAt: string;
}

interface Props { settings: BusinessSettings; customers: Customer[]; }

type Tab = 'influencers' | 'ugc' | 'campaigns' | 'referrals';

export default function SocialCommercePage({ settings, customers }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('influencers');
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [ugcItems, setUgcItems] = useState<UGCItem[]>([]);
  const [campaigns, setCampaigns] = useState<SocialCampaign[]>([]);
  const [referrals, setReferrals] = useState<ReferralProgram[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('oms_social');
    if (saved) {
      const data = JSON.parse(saved);
      setInfluencers(data.influencers || []);
      setUgcItems(data.ugcItems || []);
      setCampaigns(data.campaigns || []);
      setReferrals(data.referrals || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('oms_social', JSON.stringify({ influencers, ugcItems, campaigns, referrals }));
  }, [influencers, ugcItems, campaigns, referrals]);

  const stats = {
    totalInfluencers: influencers.length,
    activeInfluencers: influencers.filter(i => i.status === 'active').length,
    totalUGC: ugcItems.length,
    approvedUGC: ugcItems.filter(u => u.approved).length,
    activeCampaigns: campaigns.filter(c => c.status === 'published').length,
    totalReach: campaigns.reduce((s, c) => s + c.reach, 0),
    totalReferrals: referrals.length,
    completedReferrals: referrals.filter(r => r.status === 'completed').length,
  };

  const tabs = [
    { id: 'influencers' as Tab, label: 'Influencers', icon: Star },
    { id: 'ugc' as Tab, label: 'User Content', icon: Camera },
    { id: 'campaigns' as Tab, label: 'Social Campaigns', icon: Share2 },
    { id: 'referrals' as Tab, label: 'Referral Program', icon: Users },
  ];

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Influencers</p>
            <Star className="w-5 h-5 text-pink-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.totalInfluencers}</p>
          <p className="text-xs text-gray-400">{stats.activeInfluencers} active</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">User Content</p>
            <Camera className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.totalUGC}</p>
          <p className="text-xs text-gray-400">{stats.approvedUGC} approved</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Total Reach</p>
            <Share2 className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-blue-600">{(stats.totalReach / 1000).toFixed(1)}k</p>
          <p className="text-xs text-gray-400">{stats.activeCampaigns} campaigns</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Referrals</p>
            <Users className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.totalReferrals}</p>
          <p className="text-xs text-gray-400">{stats.completedReferrals} completed</p>
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
          {/* INFLUENCERS TAB */}
          {activeTab === 'influencers' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button className="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pink-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Influencer
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {influencers.map(inf => (
                  <div key={inf.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">{inf.name}</h4>
                        <p className="text-xs text-gray-500 capitalize flex items-center gap-1">
                          {inf.platform === 'instagram' && <Instagram className="w-3 h-3" />}
                          {inf.platform === 'facebook' && <Facebook className="w-3 h-3" />}
                          {inf.platform === 'tiktok' && <span>🎵</span>}
                          {inf.platform}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${inf.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {inf.status}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Followers:</span>
                        <span className="font-bold">{(inf.followers / 1000).toFixed(1)}k</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Engagement:</span>
                        <span className="font-medium text-blue-600">{inf.engagement}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Commission:</span>
                        <span className="font-medium">{inf.commission}%</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="text-gray-500">Total Sales:</span>
                        <span className="font-bold text-green-600">{settings.currency} {inf.totalSales.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {influencers.length === 0 && (
                <p className="text-center py-12 text-gray-400">No influencers added yet</p>
              )}
            </div>
          )}

          {/* UGC TAB */}
          {activeTab === 'ugc' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-2">User-Generated Content</h3>
                <p className="text-sm opacity-90">Leverage customer photos and content for marketing</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {ugcItems.map(item => (
                  <div key={item.id} className="border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      <Camera className="w-12 h-12 text-purple-300" />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium text-gray-800 mb-1">{item.customerName}</p>
                      <p className="text-xs text-gray-600 line-clamp-2">{item.caption}</p>
                      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                        <span>❤️ {item.likes}</span>
                        <span>{item.platform}</span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button className={`flex-1 py-1 rounded text-xs font-medium ${item.approved ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {item.approved ? '✓ Approved' : 'Approve'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {ugcItems.length === 0 && (
                <p className="text-center py-12 text-gray-400">No user content yet</p>
              )}
            </div>
          )}

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
                        <p className="text-xs text-gray-500 capitalize">{campaign.platform} • {campaign.type}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        campaign.status === 'published' ? 'bg-green-100 text-green-700' :
                        campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                      }`}>{campaign.status}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-xs text-gray-500">Reach</p>
                        <p className="font-bold">{(campaign.reach / 1000).toFixed(1)}k</p>
                      </div>
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-xs text-gray-500">Engagement</p>
                        <p className="font-bold text-blue-600">{campaign.engagement}%</p>
                      </div>
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="font-bold text-xs">{campaign.scheduledDate}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {campaigns.length === 0 && (
                  <p className="text-center py-12 text-gray-400">No campaigns created</p>
                )}
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
                        <td className="px-4 py-3 text-right font-bold text-green-600">{settings.currency} {ref.reward}</td>
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
                {referrals.length === 0 && (
                  <p className="text-center py-12 text-gray-400">No referrals yet</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
