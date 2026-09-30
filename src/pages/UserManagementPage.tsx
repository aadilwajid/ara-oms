import { useState, useEffect } from 'react';
import { User, UserRole, ROLE_PERMISSIONS, DEFAULT_USERS } from '../utils/permissions';
import { Users, Plus, Edit2, Trash2, X, Shield, CheckCircle, XCircle } from 'lucide-react';

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'staff' as UserRole,
  });

  useEffect(() => {
    const saved = localStorage.getItem('oms_users');
    setUsers(saved ? JSON.parse(saved) : DEFAULT_USERS);
  }, []);

  useEffect(() => {
    localStorage.setItem('oms_users', JSON.stringify(users));
  }, [users]);

  const openNew = () => {
    setEditingUser(null);
    setForm({ name: '', email: '', phone: '', role: 'staff' });
    setShowModal(true);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.email) return;

    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...form } : u));
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        ...form,
        active: true,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setUsers([...users, newUser]);
    }
    setShowModal(false);
  };

  const toggleActive = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, active: !u.active } : u));
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const getRoleColor = (role: UserRole) => {
    return ROLE_PERMISSIONS.find(r => r.role === role)?.color || '#6b7280';
  };

  const getRoleIcon = (role: UserRole) => {
    return ROLE_PERMISSIONS.find(r => r.role === role)?.icon || '👤';
  };

  const getRoleLabel = (role: UserRole) => {
    return ROLE_PERMISSIONS.find(r => r.role === role)?.label || 'User';
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.active).length,
    inactive: users.filter(u => !u.active).length,
    byRole: ROLE_PERMISSIONS.map(r => ({
      role: r.role,
      label: r.label,
      icon: r.icon,
      color: r.color,
      count: users.filter(u => u.role === r.role).length,
    })),
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Active Users</p>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Inactive Users</p>
          <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Roles</p>
          <p className="text-2xl font-bold text-purple-600">{ROLE_PERMISSIONS.length}</p>
        </div>
      </div>

      {/* Role Distribution */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Role Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.byRole.map(role => (
            <div
              key={role.role}
              className="rounded-lg p-3 border-2"
              style={{ borderColor: `${role.color}40`, backgroundColor: `${role.color}10` }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{role.icon}</span>
                <span className="font-medium text-sm" style={{ color: role.color }}>{role.label}</span>
              </div>
              <p className="text-2xl font-bold" style={{ color: role.color }}>{role.count}</p>
              <p className="text-xs text-gray-500">users</p>
            </div>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-gray-800">User Management</h3>
          </div>
          <button
            onClick={openNew}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add User
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">User</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Phone</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Last Login</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                        style={{ backgroundColor: `${getRoleColor(user.role)}20` }}
                      >
                        {getRoleIcon(user.role)}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3 text-gray-600">{user.phone}</td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: getRoleColor(user.role) }}
                    >
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(user.id)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        user.active
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {user.active ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {user.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{user.lastLogin || 'Never'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => openEdit(user)}
                        className="p-1.5 hover:bg-gray-100 rounded"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4 text-blue-500" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-1.5 hover:bg-gray-100 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Permissions Info */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-5 h-5 text-emerald-600" />
          <h3 className="font-semibold text-gray-800">Role Permissions</h3>
        </div>
        <div className="space-y-2">
          {ROLE_PERMISSIONS.map(role => (
            <div key={role.role} className="border rounded-lg p-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{role.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold" style={{ color: role.color }}>{role.label}</h4>
                    <span className="text-xs text-gray-500">({role.pages.length} pages)</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{role.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {role.pages.slice(0, 8).map(page => (
                      <span key={page} className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                        {page}
                      </span>
                    ))}
                    {role.pages.length > 8 && (
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                        +{role.pages.length - 8} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-xl max-w-md w-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-5 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h3>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="03XX-XXXXXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value as UserRole })}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  {ROLE_PERMISSIONS.map(role => (
                    <option key={role.role} value={role.role}>
                      {role.icon} {role.label} - {role.description}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700"
                >
                  {editingUser ? 'Update User' : 'Add User'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
