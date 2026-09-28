import { useState, useEffect } from 'react';
import { BusinessSettings } from '../types';
import { Wallet, CreditCard, FileText, PiggyBank, TrendingUp, Calculator, Plus } from 'lucide-react';

interface PettyCashEntry {
  id: string;
  description: string;
  amount: number;
  type: 'in' | 'out';
  date: string;
  category: string;
}

interface Cheque {
  id: string;
  chequeNumber: string;
  bankName: string;
  amount: number;
  issueDate: string;
  status: 'issued' | 'cleared' | 'bounced' | 'cancelled';
  partyName: string;
}

interface Budget {
  id: string;
  category: string;
  allocated: number;
  spent: number;
  period: string;
}

interface Props { settings: BusinessSettings; }

type Tab = 'petty-cash' | 'cheques' | 'credit' | 'budgets' | 'reconciliation';

export default function FinancialAdvancedPage({ settings }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('petty-cash');
  const [pettyCash, setPettyCash] = useState<PettyCashEntry[]>([]);
  const [cheques, setCheques] = useState<Cheque[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('oms_financial_advanced');
    if (saved) {
      const data = JSON.parse(saved);
      setPettyCash(data.pettyCash || []);
      setCheques(data.cheques || []);
      setBudgets(data.budgets || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('oms_financial_advanced', JSON.stringify({ pettyCash, cheques, budgets }));
  }, [pettyCash, cheques, budgets]);

  const pettyCashBalance = pettyCash.reduce((s, e) => e.type === 'in' ? s + e.amount : s - e.amount, 0);
  const totalChequesIssued = cheques.filter(c => c.status === 'issued' || c.status === 'cleared').reduce((s, c) => s + c.amount, 0);
  const totalBudgetAllocated = budgets.reduce((s, b) => s + b.allocated, 0);
  const totalBudgetSpent = budgets.reduce((s, b) => s + b.spent, 0);

  const tabs = [
    { id: 'petty-cash' as Tab, label: 'Petty Cash', icon: Wallet },
    { id: 'cheques' as Tab, label: 'Cheques', icon: CreditCard },
    { id: 'credit' as Tab, label: 'Credit Limits', icon: FileText },
    { id: 'budgets' as Tab, label: 'Budgets', icon: PiggyBank },
    { id: 'reconciliation' as Tab, label: 'Reconciliation', icon: Calculator },
  ];

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Petty Cash Balance</p>
            <Wallet className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{settings.currency} {pettyCashBalance.toLocaleString()}</p>
          <p className="text-xs text-gray-400">{pettyCash.length} entries</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Cheques Issued</p>
            <CreditCard className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-blue-600">{settings.currency} {totalChequesIssued.toLocaleString()}</p>
          <p className="text-xs text-gray-400">{cheques.length} cheques</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Budget Allocated</p>
            <PiggyBank className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-purple-600">{settings.currency} {totalBudgetAllocated.toLocaleString()}</p>
          <p className="text-xs text-gray-400">{budgets.length} categories</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Budget Utilization</p>
            <TrendingUp className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600">{totalBudgetAllocated > 0 ? Math.round((totalBudgetSpent / totalBudgetAllocated) * 100) : 0}%</p>
          <p className="text-xs text-gray-400">Spent: {settings.currency} {totalBudgetSpent.toLocaleString()}</p>
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
          {/* PETTY CASH TAB */}
          {activeTab === 'petty-cash' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-2">Petty Cash Management</h3>
                <p className="text-3xl font-bold">{settings.currency} {pettyCashBalance.toLocaleString()}</p>
                <p className="text-sm opacity-90 mt-1">Current balance</p>
              </div>
              <div className="flex justify-end">
                <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Entry
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Description</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">Amount</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {pettyCash.map(entry => (
                      <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-500">{entry.date}</td>
                        <td className="px-4 py-3">{entry.description}</td>
                        <td className="px-4 py-3"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{entry.category}</span></td>
                        <td className={`px-4 py-3 text-right font-medium ${entry.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                          {entry.type === 'in' ? '+' : '-'}{settings.currency} {entry.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${entry.type === 'in' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {entry.type === 'in' ? 'Income' : 'Expense'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {pettyCash.length === 0 && <p className="text-center py-12 text-gray-400">No petty cash entries</p>}
              </div>
            </div>
          )}

          {/* CHEQUES TAB */}
          {activeTab === 'cheques' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Issue Cheque
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Cheque #</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Bank</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Party</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">Amount</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Issue Date</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {cheques.map(cheque => (
                      <tr key={cheque.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{cheque.chequeNumber}</td>
                        <td className="px-4 py-3">{cheque.bankName}</td>
                        <td className="px-4 py-3">{cheque.partyName}</td>
                        <td className="px-4 py-3 text-right font-medium">{settings.currency} {cheque.amount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-gray-500">{cheque.issueDate}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            cheque.status === 'cleared' ? 'bg-green-100 text-green-700' :
                            cheque.status === 'bounced' ? 'bg-red-100 text-red-700' :
                            cheque.status === 'cancelled' ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-700'
                          }`}>{cheque.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {cheques.length === 0 && <p className="text-center py-12 text-gray-400">No cheques issued</p>}
              </div>
            </div>
          )}

          {/* CREDIT TAB */}
          {activeTab === 'credit' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-2">Customer Credit Management</h3>
                <p className="text-sm opacity-90">Manage credit limits and outstanding balances</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-medium text-purple-800 text-sm mb-2">💳 Credit Policy</h4>
                <ul className="text-xs text-purple-700 space-y-1">
                  <li>• Maximum credit limit: PKR 100,000 per customer</li>
                  <li>• Credit period: 30 days</li>
                  <li>• Late payment penalty: 2% per month</li>
                  <li>• Credit review: Monthly</li>
                </ul>
              </div>
              <p className="text-center py-12 text-gray-400">Credit management interface - Configure customer credit limits</p>
            </div>
          )}

          {/* BUDGETS TAB */}
          {activeTab === 'budgets' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Create Budget
                </button>
              </div>
              <div className="space-y-3">
                {budgets.map(budget => {
                  const utilization = budget.allocated > 0 ? (budget.spent / budget.allocated) * 100 : 0;
                  return (
                    <div key={budget.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-800">{budget.category}</h4>
                        <span className="text-xs text-gray-500">{budget.period}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-500">Allocated</p>
                          <p className="font-bold">{settings.currency} {budget.allocated.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Spent</p>
                          <p className="font-bold text-amber-600">{settings.currency} {budget.spent.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Remaining</p>
                          <p className="font-bold text-green-600">{settings.currency} {(budget.allocated - budget.spent).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className={`h-3 rounded-full ${utilization > 90 ? 'bg-red-500' : utilization > 70 ? 'bg-amber-500' : 'bg-green-500'}`}
                          style={{ width: `${Math.min(utilization, 100)}%` }} />
                      </div>
                      <p className="text-xs text-gray-500 mt-1 text-right">{utilization.toFixed(1)}% utilized</p>
                    </div>
                  );
                })}
                {budgets.length === 0 && <p className="text-center py-12 text-gray-400">No budgets created</p>}
              </div>
            </div>
          )}

          {/* RECONCILIATION TAB */}
          {activeTab === 'reconciliation' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-2">Bank Reconciliation</h3>
                <p className="text-sm opacity-90">Match transactions with bank statements</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border-2 border-blue-200 rounded-xl p-6 text-center">
                  <p className="text-sm text-gray-500 mb-2">Book Balance</p>
                  <p className="text-3xl font-bold text-blue-600">{settings.currency} 450,000</p>
                  <p className="text-xs text-gray-400 mt-2">As per books</p>
                </div>
                <div className="border-2 border-green-200 rounded-xl p-6 text-center">
                  <p className="text-sm text-gray-500 mb-2">Bank Balance</p>
                  <p className="text-3xl font-bold text-green-600">{settings.currency} 448,500</p>
                  <p className="text-xs text-gray-400 mt-2">As per bank statement</p>
                </div>
                <div className="border-2 border-amber-200 rounded-xl p-6 text-center">
                  <p className="text-sm text-gray-500 mb-2">Difference</p>
                  <p className="text-3xl font-bold text-amber-600">{settings.currency} 1,500</p>
                  <p className="text-xs text-gray-400 mt-2">Needs reconciliation</p>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 text-sm mb-2">🏦 Bank Accounts</h4>
                <div className="space-y-2">
                  {['HBL - Business Account', 'Meezan Bank - Current', 'UBL - Savings'].map((bank, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white rounded p-2">
                      <span className="text-sm font-medium">{bank}</span>
                      <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Reconcile</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
