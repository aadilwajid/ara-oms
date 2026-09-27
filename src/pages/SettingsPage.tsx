import { useState } from 'react';
import { BusinessSettings } from '../types';
import { Save, Store, User, MapPin, Receipt, AlertTriangle } from 'lucide-react';

interface Props { settings: BusinessSettings; setSettings: React.Dispatch<React.SetStateAction<BusinessSettings>>; }

export default function SettingsPage({ settings, setSettings }: Props) {
  const [form, setForm] = useState<BusinessSettings>({ ...settings });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (confirm('Reset all data to defaults? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Store Info */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-5 border-b flex items-center gap-3">
          <Store className="w-5 h-5 text-emerald-600" />
          <h3 className="font-semibold text-gray-800">Store Information</h3>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
            <input type="text" value={form.storeName} onChange={e => setForm(f => ({ ...f, storeName: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
            <input type="text" value={form.ownerName} onChange={e => setForm(f => ({ ...f, ownerName: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="text" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NTN (National Tax Number)</label>
            <input type="text" value={form.ntn} onChange={e => setForm(f => ({ ...f, ntn: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option value="PKR">PKR - Pakistani Rupee</option>
              <option value="USD">USD - US Dollar</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="AED">AED - UAE Dirham</option>
              <option value="SAR">SAR - Saudi Riyal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-5 border-b flex items-center gap-3">
          <MapPin className="w-5 h-5 text-emerald-600" />
          <h3 className="font-semibold text-gray-800">Address</h3>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
            <input type="text" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <select value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option value="Karachi">Karachi</option><option value="Lahore">Lahore</option>
              <option value="Islamabad">Islamabad</option><option value="Rawalpindi">Rawalpindi</option>
              <option value="Faisalabad">Faisalabad</option><option value="Multan">Multan</option>
              <option value="Peshawar">Peshawar</option><option value="Quetta">Quetta</option>
              <option value="Sialkot">Sialkot</option><option value="Gujranwala">Gujranwala</option>
              <option value="Hyderabad">Hyderabad</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input type="text" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
      </div>

      {/* Order & Invoice Settings */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-5 border-b flex items-center gap-3">
          <Receipt className="w-5 h-5 text-emerald-600" />
          <h3 className="font-semibold text-gray-800">Order & Invoice Settings</h3>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order Number Prefix</label>
            <input type="text" value={form.orderPrefix} onChange={e => setForm(f => ({ ...f, orderPrefix: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number Prefix</label>
            <input type="text" value={form.invoicePrefix} onChange={e => setForm(f => ({ ...f, invoicePrefix: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Default Tax Rate (%)</label>
            <input type="number" value={form.taxRate} onChange={e => setForm(f => ({ ...f, taxRate: parseFloat(e.target.value) || 0 }))} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Default Shipping Cost ({form.currency})</label>
            <input type="number" value={form.defaultShippingCost} onChange={e => setForm(f => ({ ...f, defaultShippingCost: parseFloat(e.target.value) || 0 }))} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
      </div>

      {/* Inventory Alerts */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-5 border-b flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h3 className="font-semibold text-gray-800">Inventory Alerts</h3>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Threshold</label>
            <input type="number" value={form.lowStockAlert} onChange={e => setForm(f => ({ ...f, lowStockAlert: parseInt(e.target.value) || 0 }))} className="w-full border rounded-lg px-3 py-2 text-sm" />
            <p className="text-xs text-gray-500 mt-1">Alert when stock falls below this number</p>
          </div>
        </div>
      </div>

      {/* Payment Integration */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-5 border-b flex items-center gap-3">
          <Receipt className="w-5 h-5 text-emerald-600" />
          <h3 className="font-semibold text-gray-800">Payment Integration</h3>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Gateway API Key (optional)</label>
            <input type="text" value={form.stripe} onChange={e => setForm(f => ({ ...f, stripe: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Enter API key for payment integration" />
            <p className="text-xs text-gray-500 mt-1">For future payment gateway integration</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Supported Payment Methods in Pakistan:</p>
            <div className="flex flex-wrap gap-2">
              {['Cash on Delivery', 'JazzCash', 'EasyPaisa', 'Bank Transfer', 'HBL', 'Meezan Bank', 'UBL', 'MCB'].map(m => (
                <span key={m} className="px-3 py-1 bg-white border rounded-full text-xs text-gray-600">{m}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Save & Actions */}
      <div className="bg-white rounded-xl shadow-sm border p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={handleSave} className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Settings
          </button>
          {saved && <span className="text-sm text-green-600 font-medium">✓ Settings saved successfully!</span>}
        </div>
        <button onClick={handleReset} className="text-sm text-red-600 hover:text-red-700 font-medium">
          Reset All Data
        </button>
      </div>
    </div>
  );
}
