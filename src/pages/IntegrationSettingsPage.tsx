import { useState, useEffect } from 'react';
import { BusinessSettings } from '../types';
import { Truck, MessageSquare, CreditCard, Globe, Save, CheckCircle, AlertCircle } from 'lucide-react';

interface CourierConfig {
  provider: string;
  apiKey: string;
  accountNumber: string;
  enabled: boolean;
}

interface SmsConfig {
  provider: string;
  apiKey: string;
  senderId: string;
  enabled: boolean;
}

interface PaymentConfig {
  provider: string;
  apiKey: string;
  merchantId: string;
  enabled: boolean;
}

interface Props {
  settings: BusinessSettings;
}

export default function IntegrationSettingsPage({ settings }: Props) {
  const [couriers, setCouriers] = useState<CourierConfig[]>([
    { provider: 'TCS', apiKey: '', accountNumber: '', enabled: false },
    { provider: 'Leopards', apiKey: '', accountNumber: '', enabled: false },
    { provider: 'CallCourier', apiKey: '', accountNumber: '', enabled: false },
    { provider: 'Trax', apiKey: '', accountNumber: '', enabled: false },
    { provider: 'PostEx', apiKey: '', accountNumber: '', enabled: false },
  ]);

  const [smsProviders, setSmsProviders] = useState<SmsConfig[]>([
    { provider: 'Jazz', apiKey: '', senderId: '', enabled: false },
    { provider: 'Telenor', apiKey: '', senderId: '', enabled: false },
    { provider: 'Zong', apiKey: '', senderId: '', enabled: false },
  ]);

  const [paymentGateways, setPaymentGateways] = useState<PaymentConfig[]>([
    { provider: 'JazzCash', apiKey: '', merchantId: '', enabled: false },
    { provider: 'EasyPaisa', apiKey: '', merchantId: '', enabled: false },
    { provider: 'Stripe', apiKey: '', merchantId: '', enabled: false },
    { provider: 'PayPal', apiKey: '', merchantId: '', enabled: false },
  ]);

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('oms_integrations');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.couriers) setCouriers(data.couriers);
      if (data.smsProviders) setSmsProviders(data.smsProviders);
      if (data.paymentGateways) setPaymentGateways(data.paymentGateways);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('oms_integrations', JSON.stringify({
      couriers,
      smsProviders,
      paymentGateways,
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateCourier = (index: number, field: keyof CourierConfig, value: any) => {
    const updated = [...couriers];
    updated[index] = { ...updated[index], [field]: value };
    setCouriers(updated);
  };

  const updateSms = (index: number, field: keyof SmsConfig, value: any) => {
    const updated = [...smsProviders];
    updated[index] = { ...updated[index], [field]: value };
    setSmsProviders(updated);
  };

  const updatePayment = (index: number, field: keyof PaymentConfig, value: any) => {
    const updated = [...paymentGateways];
    updated[index] = { ...updated[index], [field]: value };
    setPaymentGateways(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Integration Settings</h1>
            <p className="text-indigo-100">Configure couriers, SMS providers, and payment gateways</p>
          </div>
          <Globe className="w-16 h-16 opacity-50" />
        </div>
      </div>

      {/* Save Status */}
      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <p className="text-emerald-800 font-medium">Settings saved successfully!</p>
        </div>
      )}

      {/* Courier Services */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Truck className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold">Courier Services</h2>
        </div>
        <p className="text-gray-600 mb-6">Configure shipping courier integrations for automatic label generation and tracking.</p>
        
        <div className="space-y-4">
          {couriers.map((courier, idx) => (
            <div key={courier.provider} className="border-2 border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">{courier.provider}</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={courier.enabled}
                    onChange={e => updateCourier(idx, 'enabled', e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium">Enabled</span>
                </label>
              </div>
              
              {courier.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                    <input
                      type="password"
                      value={courier.apiKey}
                      onChange={e => updateCourier(idx, 'apiKey', e.target.value)}
                      placeholder="Enter API key"
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                    <input
                      type="text"
                      value={courier.accountNumber}
                      onChange={e => updateCourier(idx, 'accountNumber', e.target.value)}
                      placeholder="Enter account number"
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SMS Providers */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-bold">SMS Providers</h2>
        </div>
        <p className="text-gray-600 mb-6">Configure SMS providers for order notifications and marketing campaigns.</p>
        
        <div className="space-y-4">
          {smsProviders.map((sms, idx) => (
            <div key={sms.provider} className="border-2 border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">{sms.provider}</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sms.enabled}
                    onChange={e => updateSms(idx, 'enabled', e.target.checked)}
                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                  />
                  <span className="text-sm font-medium">Enabled</span>
                </label>
              </div>
              
              {sms.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                    <input
                      type="password"
                      value={sms.apiKey}
                      onChange={e => updateSms(idx, 'apiKey', e.target.value)}
                      placeholder="Enter API key"
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sender ID</label>
                    <input
                      type="text"
                      value={sms.senderId}
                      onChange={e => updateSms(idx, 'senderId', e.target.value)}
                      placeholder="e.g., MYSTORE"
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Payment Gateways */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold">Payment Gateways</h2>
        </div>
        <p className="text-gray-600 mb-6">Configure payment gateways for online payments and checkout.</p>
        
        <div className="space-y-4">
          {paymentGateways.map((gateway, idx) => (
            <div key={gateway.provider} className="border-2 border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">{gateway.provider}</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gateway.enabled}
                    onChange={e => updatePayment(idx, 'enabled', e.target.checked)}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium">Enabled</span>
                </label>
              </div>
              
              {gateway.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                    <input
                      type="password"
                      value={gateway.apiKey}
                      onChange={e => updatePayment(idx, 'apiKey', e.target.value)}
                      placeholder="Enter API key"
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Merchant ID</label>
                    <input
                      type="text"
                      value={gateway.merchantId}
                      onChange={e => updatePayment(idx, 'merchantId', e.target.value)}
                      placeholder="Enter merchant ID"
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <button
          onClick={handleSave}
          className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          Save All Integration Settings
        </button>
      </div>

      {/* Info Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-bold text-blue-800 mb-2">Integration Setup Guide</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Obtain API keys from your service provider's dashboard</li>
              <li>• Keep your API keys secure and never share them publicly</li>
              <li>• Test integrations in sandbox mode before going live</li>
              <li>• Contact support if you need help with configuration</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
