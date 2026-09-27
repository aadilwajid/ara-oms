import { useState, useRef } from 'react';
import { BusinessSettings, MediaItem } from '../types';
import { compressImage } from '../store';
import { Save, Store, MapPin, Receipt, AlertTriangle, Image as ImageIcon, X, Camera } from 'lucide-react';
import MediaPage from './MediaPage';

interface Props { settings: BusinessSettings; setSettings: React.Dispatch<React.SetStateAction<BusinessSettings>>; media: MediaItem[]; }

export default function SettingsPage({ settings, setSettings, media }: Props) {
  const [form, setForm] = useState<BusinessSettings>({ ...settings });
  const [saved, setSaved] = useState(false);
  const [showLogoPicker, setShowLogoPicker] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file, 200, 0.8);
      setForm(f => ({ ...f, logo: compressed }));
    } catch (err) {
      console.error('Failed to upload logo:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Store Logo & Branding */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-5 border-b flex items-center gap-3">
          <Camera className="w-5 h-5 text-emerald-600" />
          <h3 className="font-semibold text-gray-800">Store Logo & Branding</h3>
        </div>
        <div className="p-5">
          <div className="flex items-start gap-6">
            <div className="shrink-0">
              <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 relative group">
                {form.logo ? (
                  <>
                    <img src={form.logo} alt="Logo" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <ImageIcon className="w-8 h-8 text-gray-300 mx-auto" />
                    <p className="text-xs text-gray-400 mt-1">No logo</p>
                  </div>
                )}
                <button onClick={() => logoInputRef.current?.click()} className="absolute inset-0 cursor-pointer" />
              </div>
              <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              <div className="flex gap-2 mt-2">
                <button onClick={() => logoInputRef.current?.click()} className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">Upload</button>
                {media.length > 0 && <button onClick={() => setShowLogoPicker(true)} className="text-xs text-blue-600 hover:text-blue-700 font-medium">From Media</button>}
                {form.logo && <button onClick={() => setForm(f => ({ ...f, logo: undefined }))} className="text-xs text-red-600 hover:text-red-700 font-medium">Remove</button>}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-2">Your store logo appears on invoices, the sidebar, and receipts.</p>
              <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500">
                <p>• Recommended size: 200×200px</p>
                <p>• Formats: PNG, JPG, SVG</p>
                <p>• Max file size: 2MB (auto-compressed)</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand Color</label>
            <div className="flex items-center gap-3">
              <input type="color" value={form.bannerColor} onChange={e => setForm(f => ({ ...f, bannerColor: e.target.value }))} className="w-10 h-10 rounded border cursor-pointer" />
              <input type="text" value={form.bannerColor} onChange={e => setForm(f => ({ ...f, bannerColor: e.target.value }))} className="border rounded-lg px-3 py-2 text-sm w-32" />
              <div className="flex gap-1">
                {['#059669', '#2563eb', '#7c3aed', '#dc2626', '#ea580c', '#0891b2', '#4f46e5', '#000000'].map(c => (
                  <button key={c} onClick={() => setForm(f => ({ ...f, bannerColor: c }))} className="w-6 h-6 rounded-full border" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

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
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Receipt/Invoice Footer Text</label>
            <input type="text" value={form.receiptFooter} onChange={e => setForm(f => ({ ...f, receiptFooter: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Thank you for your business!" />
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

      {/* Keyboard Shortcuts Reference */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-5 border-b">
          <h3 className="font-semibold text-gray-800">⌨️ Keyboard Shortcuts</h3>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-700">Create new order</span>
            <kbd className="px-2 py-1 bg-white border rounded text-xs font-mono">Ctrl + N</kbd>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-700">Focus search</span>
            <kbd className="px-2 py-1 bg-white border rounded text-xs font-mono">Ctrl + K</kbd>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-700">Toggle dark mode</span>
            <kbd className="px-2 py-1 bg-white border rounded text-xs font-mono">Ctrl + D</kbd>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-700">Close modal</span>
            <kbd className="px-2 py-1 bg-white border rounded text-xs font-mono">Esc</kbd>
          </div>
        </div>
      </div>

      {/* Logo Picker from Media */}
      {showLogoPicker && (
        <MediaPage
          media={media}
          setMedia={() => {}}
          selectMode
          onSelect={(url) => {
            if (url) setForm(f => ({ ...f, logo: url }));
            setShowLogoPicker(false);
          }}
        />
      )}
    </div>
  );
}
