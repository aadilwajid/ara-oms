import { useState, useEffect } from 'react';
import { BusinessSettings } from '../types';
import { CheckSquare, Clock, Award, BarChart3, Plus, CheckCircle, XCircle, Timer, Star } from 'lucide-react';

interface ApprovalRequest {
  id: string;
  type: string;
  title: string;
  requestedBy: string;
  amount?: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  description: string;
}

interface TimeEntry {
  id: string;
  userId: string;
  userName: string;
  taskId: string;
  taskName: string;
  hours: number;
  date: string;
  billable: boolean;
}

interface Recognition {
  id: string;
  fromUser: string;
  toUser: string;
  message: string;
  points: number;
  badge?: string;
  createdAt: string;
}

interface Poll {
  id: string;
  question: string;
  options: { text: string; votes: number }[];
  totalVotes: number;
  status: 'active' | 'closed';
  createdAt: string;
  createdBy: string;
}

interface Props { settings: BusinessSettings; }

type Tab = 'approvals' | 'time' | 'recognition' | 'polls';

export default function AdvancedWorkflowsPage({ settings }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('approvals');
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [recognitions, setRecognitions] = useState<Recognition[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('oms_workflows');
    if (saved) {
      const data = JSON.parse(saved);
      setApprovals(data.approvals || []);
      setTimeEntries(data.timeEntries || []);
      setRecognitions(data.recognitions || []);
      setPolls(data.polls || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('oms_workflows', JSON.stringify({ approvals, timeEntries, recognitions, polls }));
  }, [approvals, timeEntries, recognitions, polls]);

  const stats = {
    pendingApprovals: approvals.filter(a => a.status === 'pending').length,
    approvedThisMonth: approvals.filter(a => a.status === 'approved').length,
    totalHours: timeEntries.reduce((s, t) => s + t.hours, 0),
    billableHours: timeEntries.filter(t => t.billable).reduce((s, t) => s + t.hours, 0),
    recognitionsGiven: recognitions.length,
    totalPoints: recognitions.reduce((s, r) => s + r.points, 0),
    activePolls: polls.filter(p => p.status === 'active').length,
  };

  const handleApproval = (id: string, status: 'approved' | 'rejected') => {
    setApprovals(approvals.map(a => a.id === id ? { ...a, status } : a));
  };

  const tabs = [
    { id: 'approvals' as Tab, label: 'Approvals', icon: CheckSquare },
    { id: 'time' as Tab, label: 'Time Tracking', icon: Clock },
    { id: 'recognition' as Tab, label: 'Recognition', icon: Award },
    { id: 'polls' as Tab, label: 'Polls', icon: BarChart3 },
  ];

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Pending Approvals</p>
            <CheckSquare className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600">{stats.pendingApprovals}</p>
          <p className="text-xs text-gray-400">{stats.approvedThisMonth} approved</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Hours Tracked</p>
            <Timer className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.totalHours}h</p>
          <p className="text-xs text-gray-400">{stats.billableHours}h billable</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Recognitions</p>
            <Award className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-purple-600">{stats.recognitionsGiven}</p>
          <p className="text-xs text-gray-400">{stats.totalPoints} points awarded</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Active Polls</p>
            <BarChart3 className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.activePolls}</p>
          <p className="text-xs text-gray-400">Team polls</p>
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
          {/* APPROVALS TAB */}
          {activeTab === 'approvals' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> New Request
                </button>
              </div>
              <div className="space-y-3">
                {approvals.map(approval => (
                  <div key={approval.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">{approval.title}</h4>
                        <p className="text-xs text-gray-500">{approval.type} • Requested by {approval.requestedBy}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        approval.status === 'approved' ? 'bg-green-100 text-green-700' :
                        approval.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>{approval.status}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{approval.description}</p>
                    {approval.amount && (
                      <p className="text-sm font-medium text-gray-800 mb-3">Amount: {settings.currency} {approval.amount.toLocaleString()}</p>
                    )}
                    {approval.status === 'pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => handleApproval(approval.id, 'approved')} className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center justify-center gap-1">
                          <CheckCircle className="w-4 h-4" /> Approve
                        </button>
                        <button onClick={() => handleApproval(approval.id, 'rejected')} className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center justify-center gap-1">
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {approvals.length === 0 && (
                  <p className="text-center py-12 text-gray-400">No approval requests</p>
                )}
              </div>
            </div>
          )}

          {/* TIME TRACKING TAB */}
          {activeTab === 'time' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Log Time
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">User</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Task</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">Hours</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                      <th className="text-center px-4 py-3 font-medium text-gray-600">Billable</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {timeEntries.map(entry => (
                      <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{entry.userName}</td>
                        <td className="px-4 py-3">{entry.taskName}</td>
                        <td className="px-4 py-3 text-right font-bold">{entry.hours}h</td>
                        <td className="px-4 py-3 text-gray-500">{entry.date}</td>
                        <td className="px-4 py-3 text-center">
                          {entry.billable ? (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Yes</span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">No</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {timeEntries.length === 0 && (
                  <p className="text-center py-12 text-gray-400">No time entries yet</p>
                )}
              </div>
            </div>
          )}

          {/* RECOGNITION TAB */}
          {activeTab === 'recognition' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2">
                  <Star className="w-4 h-4" /> Give Recognition
                </button>
              </div>
              <div className="space-y-3">
                {recognitions.map(rec => (
                  <div key={rec.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow bg-gradient-to-r from-purple-50 to-pink-50">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-2xl">
                        🏆
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-800">{rec.fromUser}</span>
                          <span className="text-gray-500">→</span>
                          <span className="font-semibold text-purple-600">{rec.toUser}</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{rec.message}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            {rec.points} points
                          </span>
                          {rec.badge && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">{rec.badge}</span>}
                          <span>{rec.createdAt}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {recognitions.length === 0 && (
                  <p className="text-center py-12 text-gray-400">No recognitions yet</p>
                )}
              </div>
            </div>
          )}

          {/* POLLS TAB */}
          {activeTab === 'polls' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Create Poll
                </button>
              </div>
              <div className="space-y-3">
                {polls.map(poll => (
                  <div key={poll.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-gray-800">{poll.question}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${poll.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {poll.status}
                      </span>
                    </div>
                    <div className="space-y-2 mb-3">
                      {poll.options.map((option, idx) => {
                        const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0;
                        return (
                          <div key={idx}>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span>{option.text}</span>
                              <span className="text-gray-500">{option.votes} votes ({percentage.toFixed(0)}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{poll.totalVotes} total votes</span>
                      <span>Created by {poll.createdBy} on {poll.createdAt}</span>
                    </div>
                  </div>
                ))}
                {polls.length === 0 && (
                  <p className="text-center py-12 text-gray-400">No polls created yet</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
