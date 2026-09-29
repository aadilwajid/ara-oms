import { useState, useEffect } from 'react';
import { BusinessSettings } from '../types';
import { Plus, Search, Edit2, Trash2, X, Users, Calendar, DollarSign, TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  salary: number;
  joinDate: string;
  status: 'active' | 'inactive';
  performance: number;
}

interface Shift {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'completed' | 'missed';
}

interface Props { settings: BusinessSettings; }

type Tab = 'tasks' | 'employees' | 'shifts' | 'payroll' | 'performance';

export default function TeamManagementPage({ settings }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('tasks');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const savedTasks = localStorage.getItem('oms_tasks');
    const savedEmployees = localStorage.getItem('oms_employees');
    const savedShifts = localStorage.getItem('oms_shifts');
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedEmployees) setEmployees(JSON.parse(savedEmployees));
    if (savedShifts) setShifts(JSON.parse(savedShifts));
  }, []);

  useEffect(() => { localStorage.setItem('oms_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('oms_employees', JSON.stringify(employees)); }, [employees]);
  useEffect(() => { localStorage.setItem('oms_shifts', JSON.stringify(shifts)); }, [shifts]);

  const [taskForm, setTaskForm] = useState({ title: '', description: '', assignee: '', priority: 'medium' as Task['priority'], category: '', dueDate: '' });
  const [employeeForm, setEmployeeForm] = useState({ name: '', email: '', phone: '', role: '', department: '', salary: 0, joinDate: '' });

  const stats = {
    totalTasks: tasks.length,
    pendingTasks: tasks.filter(t => t.status === 'pending').length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    totalEmployees: employees.length,
    activeEmployees: employees.filter(e => e.status === 'active').length,
    avgPerformance: employees.length > 0 ? employees.reduce((s, e) => s + e.performance, 0) / employees.length : 0,
    totalPayroll: employees.reduce((s, e) => s + e.salary, 0),
  };

  const tabs = [
    { id: 'tasks' as Tab, label: 'Tasks', icon: CheckCircle },
    { id: 'employees' as Tab, label: 'Employees', icon: Users },
    { id: 'shifts' as Tab, label: 'Shifts', icon: Calendar },
    { id: 'payroll' as Tab, label: 'Payroll', icon: DollarSign },
    { id: 'performance' as Tab, label: 'Performance', icon: TrendingUp },
  ];

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Total Tasks</p>
          <p className="text-2xl font-bold text-gray-800">{stats.totalTasks}</p>
          <p className="text-xs text-gray-400">{stats.pendingTasks} pending</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Employees</p>
          <p className="text-2xl font-bold text-blue-600">{stats.totalEmployees}</p>
          <p className="text-xs text-gray-400">{stats.activeEmployees} active</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Monthly Payroll</p>
          <p className="text-2xl font-bold text-emerald-600">{settings.currency} {stats.totalPayroll.toLocaleString()}</p>
          <p className="text-xs text-gray-400">Total salary</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Avg Performance</p>
          <p className="text-2xl font-bold text-purple-600">{stats.avgPerformance.toFixed(1)}%</p>
          <p className="text-xs text-gray-400">Team average</p>
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
          {/* TASKS TAB */}
          {activeTab === 'tasks' && (
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm" />
                </div>
                <button onClick={() => setShowTaskModal(true)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Task
                </button>
              </div>

              <div className="space-y-2">
                {tasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase())).map(task => (
                  <div key={task.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{task.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <select value={task.status} onChange={e => setTasks(tasks.map(t => t.id === task.id ? { ...t, status: e.target.value as Task['status'] } : t))}
                          className={`px-2 py-1 rounded text-xs font-medium border-0 ${
                            task.status === 'completed' ? 'bg-green-100 text-green-700' :
                            task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                        <button onClick={() => setTasks(tasks.filter(t => t.id !== task.id))} className="p-1 hover:bg-gray-100 rounded">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Assigned: {task.assignee}</span>
                      <span>Priority: <span className={`font-medium ${task.priority === 'high' ? 'text-red-600' : task.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>{task.priority}</span></span>
                      <span>Due: {task.dueDate}</span>
                    </div>
                  </div>
                ))}
                {tasks.length === 0 && <p className="text-center py-12 text-gray-400">No tasks yet. Create your first task!</p>}
              </div>
            </div>
          )}

          {/* EMPLOYEES TAB */}
          {activeTab === 'employees' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={() => setShowEmployeeModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Employee
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {employees.map(emp => (
                  <div key={emp.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">{emp.name}</h4>
                        <p className="text-xs text-gray-500">{emp.role} • {emp.department}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${emp.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {emp.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      <p>📧 {emp.email}</p>
                      <p>📞 {emp.phone}</p>
                      <p>💰 {settings.currency} {emp.salary.toLocaleString()}/month</p>
                    </div>
                    <div className="pt-3 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Performance</span>
                        <span className="text-sm font-bold text-purple-600">{emp.performance}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${emp.performance}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SHIFTS TAB */}
          {activeTab === 'shifts' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Schedule Shift
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Employee</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Time</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {shifts.map(shift => (
                      <tr key={shift.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{shift.employeeName}</td>
                        <td className="px-4 py-3">{shift.date}</td>
                        <td className="px-4 py-3">{shift.startTime} - {shift.endTime}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            shift.status === 'completed' ? 'bg-green-100 text-green-700' :
                            shift.status === 'missed' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                          }`}>{shift.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {shifts.length === 0 && <p className="text-center py-12 text-gray-400">No shifts scheduled</p>}
              </div>
            </div>
          )}

          {/* PAYROLL TAB */}
          {activeTab === 'payroll' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-2">Monthly Payroll Summary</h3>
                <p className="text-3xl font-bold">{settings.currency} {stats.totalPayroll.toLocaleString()}</p>
                <p className="text-sm opacity-90 mt-1">Total monthly salary for {stats.activeEmployees} employees</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Employee</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">Salary</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">Bonus</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">Deductions</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">Net Pay</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {employees.map(emp => {
                      const bonus = emp.performance > 80 ? emp.salary * 0.1 : 0;
                      const deductions = emp.salary * 0.05;
                      const netPay = emp.salary + bonus - deductions;
                      return (
                        <tr key={emp.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{emp.name}</td>
                          <td className="px-4 py-3">{emp.role}</td>
                          <td className="px-4 py-3 text-right">{settings.currency} {emp.salary.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right text-green-600">+{settings.currency} {bonus.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right text-red-600">-{settings.currency} {deductions.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right font-bold">{settings.currency} {netPay.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PERFORMANCE TAB */}
          {activeTab === 'performance' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">Team Performance Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {employees.sort((a, b) => b.performance - a.performance).map((emp, idx) => (
                  <div key={emp.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{emp.name}</h4>
                        <p className="text-xs text-gray-500">{emp.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-purple-600">{emp.performance}%</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className={`h-3 rounded-full ${emp.performance >= 80 ? 'bg-green-500' : emp.performance >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${emp.performance}%` }} />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>Tasks Completed: {Math.floor(emp.performance / 10)}</span>
                      <span>Rating: {emp.performance >= 80 ? '⭐⭐⭐⭐⭐' : emp.performance >= 60 ? '⭐⭐⭐⭐' : '⭐⭐⭐'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowTaskModal(false)}>
          <div className="bg-white rounded-xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Add Task</h3>
              <button onClick={() => setShowTaskModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" value={taskForm.title} onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={taskForm.description} onChange={e => setTaskForm({ ...taskForm, description: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" rows={3} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                  <input type="text" value={taskForm.assignee} onChange={e => setTaskForm({ ...taskForm, assignee: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select value={taskForm.priority} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value as Task['priority'] })} className="w-full border rounded-lg px-3 py-2 text-sm">
                    <option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
                  </select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input type="text" value={taskForm.category} onChange={e => setTaskForm({ ...taskForm, category: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input type="date" value={taskForm.dueDate} onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowTaskModal(false)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Cancel</button>
                <button onClick={() => {
                  setTasks([...tasks, { id: Date.now().toString(), ...taskForm, status: 'pending', createdAt: new Date().toISOString().split('T')[0] }]);
                  setShowTaskModal(false);
                  setTaskForm({ title: '', description: '', assignee: '', priority: 'medium', category: '', dueDate: '' });
                }} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">Add Task</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Employee Modal */}
      {showEmployeeModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowEmployeeModal(false)}>
          <div className="bg-white rounded-xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Add Employee</h3>
              <button onClick={() => setShowEmployeeModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" value={employeeForm.name} onChange={e => setEmployeeForm({ ...employeeForm, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={employeeForm.email} onChange={e => setEmployeeForm({ ...employeeForm, email: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="text" value={employeeForm.phone} onChange={e => setEmployeeForm({ ...employeeForm, phone: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input type="text" value={employeeForm.role} onChange={e => setEmployeeForm({ ...employeeForm, role: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input type="text" value={employeeForm.department} onChange={e => setEmployeeForm({ ...employeeForm, department: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Salary (PKR)</label>
                  <input type="number" value={employeeForm.salary} onChange={e => setEmployeeForm({ ...employeeForm, salary: parseFloat(e.target.value) || 0 })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                  <input type="date" value={employeeForm.joinDate} onChange={e => setEmployeeForm({ ...employeeForm, joinDate: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" /></div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowEmployeeModal(false)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Cancel</button>
                <button onClick={() => {
                  setEmployees([...employees, { id: Date.now().toString(), ...employeeForm, status: 'active', performance: 75 }]);
                  setShowEmployeeModal(false);
                  setEmployeeForm({ name: '', email: '', phone: '', role: '', department: '', salary: 0, joinDate: '' });
                }} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Add Employee</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
