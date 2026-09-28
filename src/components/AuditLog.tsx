import { useState } from 'react';
import { ActivityLog } from '../types';
import { Search, Clock, User, Filter } from 'lucide-react';

interface Props {
  activityLog: ActivityLog[];
}

export default function AuditLog({ activityLog }: Props) {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const actions = [...new Set(activityLog.map(log => log.action))];

  const filtered = activityLog.filter(log => {
    const matchSearch = log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.user.toLowerCase().includes(search.toLowerCase());
    const matchAction = actionFilter === 'all' || log.action === actionFilter;
    return matchSearch && matchAction;
  });

  const getActionColor = (action: string) => {
    if (action.includes('Created')) return 'bg-green-100 text-green-700';
    if (action.includes('Updated')) return 'bg-blue-100 text-blue-700';
    if (action.includes('Deleted')) return 'bg-red-100 text-red-700';
    if (action.includes('Export')) return 'bg-purple-100 text-purple-700';
    return 'bg-gray-100 text-gray-700';
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border">
      <div className="p-5 border-b">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-600" />
            Activity Log
          </h3>
          <span className="text-sm text-gray-500">{activityLog.length} entries</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search activity..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <select
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Actions</option>
            {actions.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      <div className="divide-y max-h-96 overflow-auto">
        {filtered.length > 0 ? (
          filtered.map(log => (
            <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                    <span className="text-xs text-gray-400">{formatTime(log.timestamp)}</span>
                  </div>
                  <p className="text-sm text-gray-700">{log.details}</p>
                  <p className="text-xs text-gray-400 mt-1">by {log.user}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-gray-400">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No activity recorded yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
