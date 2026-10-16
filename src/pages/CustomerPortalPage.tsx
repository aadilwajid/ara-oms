import { useState, useEffect } from 'react';
import { BusinessSettings, Customer } from '../types';
import { HelpCircle, MessageCircle, LifeBuoy, FileText, Search, Plus, ThumbsUp, ThumbsDown } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  notHelpful: number;
}

interface QAItem {
  id: string;
  productId: string;
  productName: string;
  question: string;
  answer: string;
  askedBy: string;
  answeredBy: string;
  status: 'pending' | 'answered';
  createdAt: string;
}

interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  createdAt: string;
  resolvedAt?: string;
}

interface Props { settings: BusinessSettings; customers: Customer[]; }

type Tab = 'portal' | 'faq' | 'qa' | 'tickets';

export default function CustomerPortalPage({ settings, customers }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('portal');
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [qaItems, setQaItems] = useState<QAItem[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('oms_customer_portal');
    if (saved) {
      const data = JSON.parse(saved);
      setFaqs(data.faqs || []);
      setQaItems(data.qaItems || []);
      setTickets(data.tickets || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('oms_customer_portal', JSON.stringify({ faqs, qaItems, tickets }));
  }, [faqs, qaItems, tickets]);

  const stats = {
    totalFAQs: faqs.length,
    totalQA: qaItems.length,
    answeredQA: qaItems.filter(q => q.status === 'answered').length,
    openTickets: tickets.filter(t => t.status === 'open' || t.status === 'in-progress').length,
    resolvedTickets: tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length,
  };

  const tabs = [
    { id: 'portal' as Tab, label: 'Customer Portal', icon: LifeBuoy },
    { id: 'faq' as Tab, label: 'FAQ', icon: HelpCircle },
    { id: 'qa' as Tab, label: 'Q&A', icon: MessageCircle },
    { id: 'tickets' as Tab, label: 'Support Tickets', icon: FileText },
  ];

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">FAQ Articles</p>
            <HelpCircle className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.totalFAQs}</p>
          <p className="text-xs text-gray-400">Help articles</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Q&A Items</p>
            <MessageCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.totalQA}</p>
          <p className="text-xs text-gray-400">{stats.answeredQA} answered</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Open Tickets</p>
            <FileText className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600">{stats.openTickets}</p>
          <p className="text-xs text-gray-400">Need attention</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Resolved</p>
            <FileText className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.resolvedTickets}</p>
          <p className="text-xs text-gray-400">Tickets closed</p>
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
          {/* PORTAL TAB */}
          {activeTab === 'portal' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-2">Customer Self-Service Portal</h3>
                <p className="text-sm opacity-90 mb-4">Empower customers to manage their accounts independently</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
                    <p className="text-sm opacity-90">Track Orders</p>
                    <p className="text-2xl font-bold">Real-time</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
                    <p className="text-sm opacity-90">Download Invoices</p>
                    <p className="text-2xl font-bold">PDF</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
                    <p className="text-sm opacity-90">Request Returns</p>
                    <p className="text-2xl font-bold">Easy</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
                    <p className="text-sm opacity-90">Manage Wishlist</p>
                    <p className="text-2xl font-bold">Save</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <p className="font-medium text-sm">📦 Track My Order</p>
                      <p className="text-xs text-gray-500">Real-time order status updates</p>
                    </button>
                    <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <p className="font-medium text-sm">📄 Download Invoice</p>
                      <p className="text-xs text-gray-500">Get PDF invoices for your records</p>
                    </button>
                    <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <p className="font-medium text-sm">🔄 Request Return</p>
                      <p className="text-xs text-gray-500">Easy return process</p>
                    </button>
                    <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <p className="font-medium text-sm">💝 Manage Wishlist</p>
                      <p className="text-xs text-gray-500">Save items for later</p>
                    </button>
                  </div>
                </div>

                <div className="border rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Account Settings</h4>
                  <div className="space-y-2">
                    <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <p className="font-medium text-sm">👤 Profile Information</p>
                      <p className="text-xs text-gray-500">Update your personal details</p>
                    </button>
                    <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <p className="font-medium text-sm">📍 Address Book</p>
                      <p className="text-xs text-gray-500">Manage shipping addresses</p>
                    </button>
                    <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <p className="font-medium text-sm">💳 Payment Methods</p>
                      <p className="text-xs text-gray-500">Add or remove payment options</p>
                    </button>
                    <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <p className="font-medium text-sm">🔔 Notification Preferences</p>
                      <p className="text-xs text-gray-500">Customize your alerts</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FAQ TAB */}
          {activeTab === 'faq' && (
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Search FAQs..." className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm" />
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add FAQ
                </button>
              </div>
              <div className="space-y-3">
                {faqs.map(faq => (
                  <div key={faq.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-800 flex-1">{faq.question}</h4>
                      <span className="text-xs text-gray-500 ml-2">{faq.category}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{faq.answer}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <button className="flex items-center gap-1 hover:text-green-600">
                        <ThumbsUp className="w-3 h-3" /> {faq.helpful}
                      </button>
                      <button className="flex items-center gap-1 hover:text-red-600">
                        <ThumbsDown className="w-3 h-3" /> {faq.notHelpful}
                      </button>
                    </div>
                  </div>
                ))}
                {faqs.length === 0 && (
                  <p className="text-center py-12 text-gray-400">No FAQs yet</p>
                )}
              </div>
            </div>
          )}

          {/* Q&A TAB */}
          {activeTab === 'qa' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Question
                </button>
              </div>
              <div className="space-y-3">
                {qaItems.map(qa => (
                  <div key={qa.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">Product: {qa.productName}</p>
                        <h4 className="font-semibold text-gray-800">Q: {qa.question}</h4>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${qa.status === 'answered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {qa.status}
                      </span>
                    </div>
                    {qa.answer && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-700"><strong>A:</strong> {qa.answer}</p>
                        <p className="text-xs text-gray-500 mt-1">Answered by {qa.answeredBy}</p>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                      <span>Asked by {qa.askedBy} on {qa.createdAt}</span>
                      {qa.status === 'pending' && (
                        <button className="text-blue-600 hover:text-blue-700 font-medium">Answer</button>
                      )}
                    </div>
                  </div>
                ))}
                {qaItems.length === 0 && (
                  <p className="text-center py-12 text-gray-400">No Q&A items yet</p>
                )}
              </div>
            </div>
          )}

          {/* TICKETS TAB */}
          {activeTab === 'tickets' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> New Ticket
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Ticket #</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Customer</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Subject</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Priority</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {tickets.map(ticket => (
                      <tr key={ticket.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{ticket.ticketNumber}</td>
                        <td className="px-4 py-3">{ticket.customerName}</td>
                        <td className="px-4 py-3">{ticket.subject}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            ticket.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                            ticket.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                            ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                          }`}>{ticket.priority}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            ticket.status === 'resolved' || ticket.status === 'closed' ? 'bg-green-100 text-green-700' :
                            ticket.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>{ticket.status}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{ticket.createdAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {tickets.length === 0 && (
                  <p className="text-center py-12 text-gray-400">No support tickets</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
