import { useState, useEffect } from 'react';
import { BusinessSettings, Customer, Product, Order } from '../types';
import { MessageSquare, Star, Heart, Bell, Send, ThumbsUp, ThumbsDown, TrendingUp, Users } from 'lucide-react';

interface Feedback {
  id: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  category: string;
  status: 'new' | 'responded' | 'resolved';
  createdAt: string;
}

interface Review {
  id: string;
  productId: string;
  productName: string;
  customerId: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface Wishlist {
  id: string;
  customerId: string;
  customerName: string;
  products: { productId: string; productName: string; price: number }[];
  createdAt: string;
}

interface Survey {
  id: string;
  title: string;
  questions: string[];
  responses: number;
  status: 'active' | 'closed';
  createdAt: string;
}

interface Props {
  customers: Customer[];
  products: Product[];
  orders: Order[];
  settings: BusinessSettings;
}

type Tab = 'feedback' | 'reviews' | 'wishlist' | 'surveys' | 'notifications';

export default function CustomerExperiencePage({ customers, products, orders, settings }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('feedback');
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [surveys, setSurveys] = useState<Survey[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('oms_customer_experience');
    if (saved) {
      const data = JSON.parse(saved);
      setFeedbacks(data.feedbacks || []);
      setReviews(data.reviews || []);
      setWishlists(data.wishlists || []);
      setSurveys(data.surveys || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('oms_customer_experience', JSON.stringify({ feedbacks, reviews, wishlists, surveys }));
  }, [feedbacks, reviews, wishlists, surveys]);

  const stats = {
    totalFeedback: feedbacks.length,
    avgRating: feedbacks.length > 0 ? feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length : 0,
    totalReviews: reviews.length,
    avgProductRating: reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0,
    totalWishlists: wishlists.length,
    activeSurveys: surveys.filter(s => s.status === 'active').length,
  };

  const tabs = [
    { id: 'feedback' as Tab, label: 'Customer Feedback', icon: MessageSquare },
    { id: 'reviews' as Tab, label: 'Product Reviews', icon: Star },
    { id: 'wishlist' as Tab, label: 'Wishlists', icon: Heart },
    { id: 'surveys' as Tab, label: 'Surveys', icon: Users },
    { id: 'notifications' as Tab, label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Customer Feedback</p>
            <MessageSquare className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.totalFeedback}</p>
          <p className="text-xs text-gray-400">Avg Rating: {stats.avgRating.toFixed(1)} ⭐</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Product Reviews</p>
            <Star className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.totalReviews}</p>
          <p className="text-xs text-gray-400">Avg: {stats.avgProductRating.toFixed(1)} ⭐</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Wishlists</p>
            <Heart className="w-5 h-5 text-pink-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.totalWishlists}</p>
          <p className="text-xs text-gray-400">Customer wishlists</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Active Surveys</p>
            <Users className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.activeSurveys}</p>
          <p className="text-xs text-gray-400">Running now</p>
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
          {/* FEEDBACK TAB */}
          {activeTab === 'feedback' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feedbacks.map(fb => (
                  <div key={fb.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">{fb.customerName}</h4>
                        <p className="text-xs text-gray-500">{fb.createdAt}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < fb.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{fb.comment}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Category: {fb.category}</span>
                      <select value={fb.status} onChange={e => setFeedbacks(feedbacks.map(f => f.id === fb.id ? { ...f, status: e.target.value as Feedback['status'] } : f))}
                        className={`px-2 py-1 rounded text-xs font-medium border-0 ${
                          fb.status === 'resolved' ? 'bg-green-100 text-green-700' :
                          fb.status === 'responded' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                        <option value="new">New</option>
                        <option value="responded">Responded</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>
                  </div>
                ))}
                {feedbacks.length === 0 && <p className="text-center py-12 text-gray-400 col-span-2">No feedback yet</p>}
              </div>
            </div>
          )}

          {/* REVIEWS TAB */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="space-y-3">
                {reviews.map(review => (
                  <div key={review.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">{review.productName}</h4>
                        <p className="text-xs text-gray-500">by {review.customerName} • {review.createdAt}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <select value={review.status} onChange={e => setReviews(reviews.map(r => r.id === review.id ? { ...r, status: e.target.value as Review['status'] } : r))}
                          className="px-2 py-1 rounded text-xs font-medium border">
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                    <h5 className="font-medium text-gray-800 mb-1">{review.title}</h5>
                    <p className="text-sm text-gray-700">{review.comment}</p>
                  </div>
                ))}
                {reviews.length === 0 && <p className="text-center py-12 text-gray-400">No reviews yet</p>}
              </div>
            </div>
          )}

          {/* WISHLIST TAB */}
          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wishlists.map(wl => (
                  <div key={wl.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-800">{wl.customerName}'s Wishlist</h4>
                      <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                    </div>
                    <div className="space-y-2">
                      {wl.products.map((prod, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-gray-50 rounded p-2">
                          <span className="text-sm">{prod.productName}</span>
                          <span className="text-sm font-medium">{settings.currency} {prod.price.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-3">Created: {wl.createdAt}</p>
                  </div>
                ))}
                {wishlists.length === 0 && <p className="text-center py-12 text-gray-400 col-span-2">No wishlists yet</p>}
              </div>
            </div>
          )}

          {/* SURVEYS TAB */}
          {activeTab === 'surveys' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2">
                  <Users className="w-4 h-4" /> Create Survey
                </button>
              </div>
              <div className="space-y-3">
                {surveys.map(survey => (
                  <div key={survey.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">{survey.title}</h4>
                        <p className="text-xs text-gray-500">{survey.questions.length} questions • {survey.responses} responses</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${survey.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {survey.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 py-1.5 bg-blue-50 text-blue-600 rounded text-xs font-medium hover:bg-blue-100">View Results</button>
                      <button className="flex-1 py-1.5 bg-purple-50 text-purple-600 rounded text-xs font-medium hover:bg-purple-100">Edit Survey</button>
                    </div>
                  </div>
                ))}
                {surveys.length === 0 && <p className="text-center py-12 text-gray-400">No surveys created yet</p>}
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 text-sm mb-2">🔔 Notification Settings</h4>
                <p className="text-xs text-blue-700">Configure automatic notifications for customers</p>
              </div>
              <div className="space-y-3">
                {[
                  { title: 'Order Confirmation', desc: 'Send confirmation when order is placed', enabled: true },
                  { title: 'Shipping Update', desc: 'Notify when order is shipped', enabled: true },
                  { title: 'Delivery Confirmation', desc: 'Notify when order is delivered', enabled: true },
                  { title: 'Payment Reminder', desc: 'Send reminder for pending payments', enabled: false },
                  { title: 'Birthday Wishes', desc: 'Auto-send birthday greetings', enabled: false },
                  { title: 'Low Stock Alert', desc: 'Notify when product is low in stock', enabled: true },
                ].map((notif, idx) => (
                  <div key={idx} className="flex items-center justify-between border rounded-lg p-4">
                    <div>
                      <h4 className="font-medium text-gray-800">{notif.title}</h4>
                      <p className="text-xs text-gray-500">{notif.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={notif.enabled} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
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
