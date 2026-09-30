import { useState } from 'react';
import { User, DEFAULT_USERS, ROLE_PERMISSIONS, UserRole } from '../utils/permissions';
import { Store, Lock, Mail, ArrowRight } from 'lucide-react';

interface Props {
  onLogin: (user: User) => void;
}

export default function LoginPage({ onLogin }: Props) {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('oms_users');
    return saved ? JSON.parse(saved) : DEFAULT_USERS;
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'staff' as UserRole,
  });

  const handleLogin = (user: User) => {
    const updatedUser = { ...user, lastLogin: new Date().toISOString().split('T')[0] };
    const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
    setUsers(updatedUsers);
    localStorage.setItem('oms_users', JSON.stringify(updatedUsers));
    onLogin(updatedUser);
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return;
    
    const user: User = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      active: true,
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    const updatedUsers = [...users, user];
    setUsers(updatedUsers);
    localStorage.setItem('oms_users', JSON.stringify(updatedUsers));
    setNewUser({ name: '', email: '', phone: '', role: 'staff' });
    setShowAddUser(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg mb-4">
            <Store className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">StoreOS</h1>
          <p className="text-gray-600">Order Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-6 h-6 text-emerald-600" />
            <h2 className="text-2xl font-semibold text-gray-800">Select Your Account</h2>
          </div>

          {/* User Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {users.filter(u => u.active).map(user => (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  selectedUser?.id === user.id
                    ? 'border-emerald-500 bg-emerald-50 shadow-md'
                    : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ backgroundColor: `${getRoleColor(user.role)}20` }}
                  >
                    {getRoleIcon(user.role)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">{user.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    <span
                      className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: getRoleColor(user.role) }}
                    >
                      {getRoleLabel(user.role)}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Login Button */}
          {selectedUser && (
            <button
              onClick={() => handleLogin(selectedUser)}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Login as {selectedUser.name}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}

          {/* Add User Section */}
          <div className="mt-8 pt-6 border-t">
            {!showAddUser ? (
              <button
                onClick={() => setShowAddUser(true)}
                className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
              >
                + Add New User
              </button>
            ) : (
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-4">Add New User</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="text"
                      value={newUser.phone}
                      onChange={e => setNewUser({ ...newUser, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="03XX-XXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      value={newUser.role}
                      onChange={e => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      {ROLE_PERMISSIONS.map(role => (
                        <option key={role.role} value={role.role}>
                          {role.icon} {role.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddUser}
                    className="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700"
                  >
                    Add User
                  </button>
                  <button
                    onClick={() => setShowAddUser(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Role Info */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold text-gray-800 mb-3">Available Roles</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {ROLE_PERMISSIONS.map(role => (
                <div key={role.role} className="text-xs">
                  <div className="flex items-center gap-1 mb-1">
                    <span>{role.icon}</span>
                    <span className="font-medium" style={{ color: role.color }}>{role.label}</span>
                  </div>
                  <p className="text-gray-500 text-xs">{role.pages.length} pages</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>StoreOS v2.0 - Enterprise Order Management System</p>
        </div>
      </div>
    </div>
  );
}
