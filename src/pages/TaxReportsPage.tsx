import { useState, useMemo } from 'react';
import { Order, Expense, Income, BusinessSettings } from '../types';
import { FileText, Download, Calendar, TrendingUp, DollarSign } from 'lucide-react';

interface Props {
  orders: Order[];
  expenses: Expense[];
  income: Income[];
  settings: BusinessSettings;
}

export default function TaxReportsPage({ orders, expenses, income, settings }: Props) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedProvince, setSelectedProvince] = useState('Punjab');

  const provinces = ['Punjab', 'Sindh', 'KPK', 'Balochistan', 'Islamabad', 'Federal'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Calculate tax data
  const taxData = useMemo(() => {
    const monthOrders = orders.filter(o => {
      const date = new Date(o.createdAt);
      return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
    });

    const monthExpenses = expenses.filter(e => {
      const date = new Date(e.date);
      return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
    });

    const monthIncome = income.filter(i => {
      const date = new Date(i.date);
      return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
    });

    const totalSales = monthOrders.reduce((sum, o) => sum + o.total, 0);
    const totalExpenses = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalIncome = monthIncome.reduce((sum, i) => sum + i.amount, 0);

    // Tax calculations (simplified)
    const salesTaxRate = 0.17; // 17% standard rate
    const salesTax = totalSales * salesTaxRate;
    const incomeTaxRate = 0.15; // Simplified rate
    const incomeTax = (totalIncome - totalExpenses) * incomeTaxRate;

    return {
      totalSales,
      totalExpenses,
      totalIncome,
      salesTax,
      incomeTax,
      totalTax: salesTax + incomeTax,
      orderCount: monthOrders.length,
      netProfit: totalIncome - totalExpenses,
    };
  }, [orders, expenses, income, selectedMonth, selectedYear]);

  const generateFBRReport = () => {
    const report = {
      title: 'FBR Tax Report',
      period: `${months[selectedMonth]} ${selectedYear}`,
      province: selectedProvince,
      ntn: settings.ntn,
      storeName: settings.storeName,
      summary: {
        totalSales: taxData.totalSales,
        totalExpenses: taxData.totalExpenses,
        totalIncome: taxData.totalIncome,
        netProfit: taxData.netProfit,
      },
      tax: {
        salesTax: taxData.salesTax,
        incomeTax: taxData.incomeTax,
        totalTax: taxData.totalTax,
      },
      orders: orders.filter(o => {
        const date = new Date(o.createdAt);
        return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
      }).map(o => ({
        orderNumber: o.orderNumber,
        date: o.createdAt,
        customer: o.customerName,
        total: o.total,
        status: o.status,
      })),
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FBR_Tax_Report_${months[selectedMonth]}_${selectedYear}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateSalesTaxReturn = () => {
    const report = {
      form: 'Sales Tax Return',
      period: `${months[selectedMonth]} ${selectedYear}`,
      province: selectedProvince,
      ntn: settings.ntn,
      businessName: settings.storeName,
      taxableSales: taxData.totalSales,
      salesTaxCollected: taxData.salesTax,
      taxRate: '17%',
      dueDate: new Date(selectedYear, selectedMonth + 1, 15).toISOString().split('T')[0],
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sales_Tax_Return_${months[selectedMonth]}_${selectedYear}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Tax Reports & Compliance</h1>
            <p className="text-blue-100">FBR, Sales Tax, and Provincial Tax Reports</p>
          </div>
          <FileText className="w-16 h-16 opacity-50" />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-bold mb-4">Select Period</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(Number(e.target.value))}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
            >
              {months.map((month, idx) => (
                <option key={idx} value={idx}>{month}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
            >
              {[2024, 2023, 2022].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Province</label>
            <select
              value={selectedProvince}
              onChange={e => setSelectedProvince(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
            >
              {provinces.map(province => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Total Sales</p>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {settings.currency} {taxData.totalSales.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">{taxData.orderCount} orders</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Total Expenses</p>
            <DollarSign className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {settings.currency} {taxData.totalExpenses.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">Business expenses</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Net Profit</p>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">
            {settings.currency} {taxData.netProfit.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {taxData.netProfit > 0 ? 'Profit' : 'Loss'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Total Tax</p>
            <FileText className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {settings.currency} {taxData.totalTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-gray-500 mt-1">Sales + Income tax</p>
        </div>
      </div>

      {/* Tax Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-bold mb-4">Tax Breakdown</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <p className="font-semibold text-gray-800">Sales Tax (17%)</p>
              <p className="text-sm text-gray-600">Collected on taxable sales</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {settings.currency} {taxData.salesTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>

          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
            <div>
              <p className="font-semibold text-gray-800">Income Tax (15%)</p>
              <p className="text-sm text-gray-600">On net profit</p>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              {settings.currency} {taxData.incomeTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>

          <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border-2 border-emerald-200">
            <div>
              <p className="font-bold text-gray-800 text-lg">Total Tax Liability</p>
              <p className="text-sm text-gray-600">Combined tax obligation</p>
            </div>
            <p className="text-3xl font-bold text-emerald-600">
              {settings.currency} {taxData.totalTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
      </div>

      {/* Business Info */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-bold mb-4">Business Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Business Name</p>
            <p className="font-semibold">{settings.storeName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">NTN</p>
            <p className="font-semibold font-mono">{settings.ntn || 'Not Set'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Province</p>
            <p className="font-semibold">{selectedProvince}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Period</p>
            <p className="font-semibold">{months[selectedMonth]} {selectedYear}</p>
          </div>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-bold mb-4">Generate Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={generateFBRReport}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            Download FBR Report
          </button>
          <button
            onClick={generateSalesTaxReturn}
            className="flex items-center justify-center gap-2 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            Download Sales Tax Return
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Reports are generated in JSON format and can be uploaded to FBR portal or shared with your accountant.
        </p>
      </div>

      {/* NTN Notice */}
      {!settings.ntn && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h3 className="font-bold text-amber-800 mb-2">⚠️ NTN Not Set</h3>
          <p className="text-amber-700 mb-3">
            Please set your NTN (National Tax Number) in Settings to generate compliant tax reports.
          </p>
          <p className="text-sm text-amber-600">
            Go to Settings → Store Information → NTN to add your tax number.
          </p>
        </div>
      )}
    </div>
  );
}
