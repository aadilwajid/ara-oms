import { useState, useEffect } from 'react';
import { BusinessSettings } from '../types';
import { MessageSquare, Bell, Calendar, BookOpen, Users, Plus, Send, Search, Pin, CheckCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
  channel: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'urgent' | 'normal' | 'info';
  author: string;
  createdAt: string;
  pinned: boolean;
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'meeting' | 'holiday' | 'deadline' | 'shift';
  description: string;
}

interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  author: string;
  updatedAt: string;
  views: number;
}

interface Props { settings: BusinessSettings; }

type Tab = 'chat' | 'announcements' | 'calendar' | 'knowledge';

export default function CommunicationHubPage({ settings }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('general');

  useEffect(() => {
    const saved = localStorage.getItem('oms_communication');
    if (saved) {
      const data = JSON.parse(saved);
      setMessages(data.messages || []);
      setAnnouncements(data.announcements || []);
      setEvents(data.events || []);
      setArticles(data.articles || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('oms_communication', JSON.stringify({ messages, announcements, events, articles }));
  }, [messages, announcements, events, articles]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const msg: ChatMessage = {
      id: Date.now().toString(),
      userId: 'current',
      userName: 'You',
      message: newMessage,
      timestamp: new Date().toISOString(),
      channel: selectedChannel,
    };
    setMessages([...messages, msg]);
    setNewMessage('');
  };

  const channels = ['general', 'sales', 'warehouse', 'marketing', 'support'];

  const tabs = [
    { id: 'chat' as Tab, label: 'Team Chat', icon: MessageSquare },
    { id: 'announcements' as Tab, label: 'Announcements', icon: Bell },
    { id: 'calendar' as Tab, label: 'Calendar', icon: Calendar },
    { id: 'knowledge' as Tab, label: 'Knowledge Base', icon: BookOpen },
  ];

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Messages</p>
            <MessageSquare className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{messages.length}</p>
          <p className="text-xs text-gray-400">{channels.length} channels</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Announcements</p>
            <Bell className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{announcements.length}</p>
          <p className="text-xs text-gray-400">{announcements.filter(a => a.pinned).length} pinned</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Events</p>
            <Calendar className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{events.length}</p>
          <p className="text-xs text-gray-400">Upcoming events</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Articles</p>
            <BookOpen className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{articles.length}</p>
          <p className="text-xs text-gray-400">Knowledge base</p>
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
          {/* CHAT TAB */}
          {activeTab === 'chat' && (
            <div className="flex gap-4 h-[600px]">
              {/* Channels Sidebar */}
              <div className="w-48 border-r pr-4">
                <h3 className="font-semibold text-gray-800 mb-3">Channels</h3>
                <div className="space-y-1">
                  {channels.map(channel => (
                    <button
                      key={channel}
                      onClick={() => setSelectedChannel(channel)}
                      className={`w-full text-left px-3 py-2 rounded text-sm capitalize ${
                        selectedChannel === channel ? 'bg-emerald-100 text-emerald-700 font-medium' : 'hover:bg-gray-100'
                      }`}
                    >
                      # {channel}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 flex flex-col">
                <div className="flex-1 overflow-auto mb-4 space-y-3">
                  {messages.filter(m => m.channel === selectedChannel).map(msg => (
                    <div key={msg.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm shrink-0">
                        {msg.userName[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{msg.userName}</span>
                          <span className="text-xs text-gray-400">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                  {messages.filter(m => m.channel === selectedChannel).length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                      <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 border rounded-lg px-3 py-2 text-sm"
                  />
                  <button onClick={sendMessage} className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ANNOUNCEMENTS TAB */}
          {activeTab === 'announcements' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> New Announcement
                </button>
              </div>
              <div className="space-y-3">
                {announcements.sort((a, b) => b.pinned ? 1 : -1).map(ann => (
                  <div key={ann.id} className={`border rounded-xl p-4 ${ann.pinned ? 'border-amber-300 bg-amber-50' : ''}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {ann.pinned && <Pin className="w-4 h-4 text-amber-600" />}
                        <h4 className="font-semibold text-gray-800">{ann.title}</h4>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          ann.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                          ann.priority === 'normal' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                        }`}>{ann.priority}</span>
                      </div>
                      <span className="text-xs text-gray-500">{ann.createdAt}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{ann.content}</p>
                    <p className="text-xs text-gray-500">By {ann.author}</p>
                  </div>
                ))}
                {announcements.length === 0 && (
                  <p className="text-center py-12 text-gray-400">No announcements yet</p>
                )}
              </div>
            </div>
          )}

          {/* CALENDAR TAB */}
          {activeTab === 'calendar' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Event
                </button>
              </div>
              <div className="space-y-3">
                {events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(event => (
                  <div key={event.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-800">{event.title}</h4>
                        <p className="text-sm text-gray-600">{event.date} at {event.time}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        event.type === 'meeting' ? 'bg-blue-100 text-blue-700' :
                        event.type === 'holiday' ? 'bg-green-100 text-green-700' :
                        event.type === 'deadline' ? 'bg-red-100 text-red-700' : 'bg-purple-100 text-purple-700'
                      }`}>{event.type}</span>
                    </div>
                    <p className="text-sm text-gray-600">{event.description}</p>
                  </div>
                ))}
                {events.length === 0 && (
                  <p className="text-center py-12 text-gray-400">No events scheduled</p>
                )}
              </div>
            </div>
          )}

          {/* KNOWLEDGE BASE TAB */}
          {activeTab === 'knowledge' && (
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Search articles..." className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm" />
                </div>
                <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> New Article
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {articles.map(article => (
                  <div key={article.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-800">{article.title}</h4>
                        <span className="text-xs text-gray-500">{article.category}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{article.views} views</p>
                        <p className="text-xs text-gray-400">{article.updatedAt}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{article.content}</p>
                    <p className="text-xs text-gray-500 mt-2">By {article.author}</p>
                  </div>
                ))}
                {articles.length === 0 && (
                  <p className="text-center py-12 text-gray-400 col-span-2">No articles yet</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
