import { useState, useEffect } from 'react';
import { BusinessSettings } from '../types';
import { MapPin, Plus, Edit2, Trash2, Save, Truck } from 'lucide-react';

interface ShippingZone {
  id: string;
  name: string;
  cities: string[];
  flatRate: number;
  freeShippingThreshold: number;
  estimatedDays: string;
  enabled: boolean;
}

interface Props {
  settings: BusinessSettings;
}

export default function ShippingZonesPage({ settings }: Props) {
  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);
  const [form, setForm] = useState({
    name: '',
    cities: [] as string[],
    flatRate: 0,
    freeShippingThreshold: 0,
    estimatedDays: '',
    enabled: true,
  });

  const allCities = [
    'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan',
    'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala', 'Hyderabad', 'Bahawalpur',
    'Sargodha', 'Sukkur', 'Larkana', 'Sheikhupura', 'Jhang', 'Gujrat',
    'Mardan', 'Kasur', 'Dera Ghazi Khan', 'Nawabshah', 'Mingora', 'Mirpur Khas',
  ];

  useEffect(() => {
    const saved = localStorage.getItem('oms_shipping_zones');
    if (saved) {
      setZones(JSON.parse(saved));
    } else {
      // Default zones
      const defaults: ShippingZone[] = [
        {
          id: '1',
          name: 'Local (Same City)',
          cities: [settings.city],
          flatRate: 150,
          freeShippingThreshold: 3000,
          estimatedDays: '1-2',
          enabled: true,
        },
        {
          id: '2',
          name: 'Major Cities',
          cities: ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi'],
          flatRate: 250,
          freeShippingThreshold: 5000,
          estimatedDays: '2-3',
          enabled: true,
        },
        {
          id: '3',
          name: 'Other Cities',
          cities: allCities.filter(c => !['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi'].includes(c)),
          flatRate: 350,
          freeShippingThreshold: 7000,
          estimatedDays: '3-5',
          enabled: true,
        },
      ];
      setZones(defaults);
    }
  }, [settings.city]);

  useEffect(() => {
    localStorage.setItem('oms_shipping_zones', JSON.stringify(zones));
  }, [zones]);

  const openNew = () => {
    setEditingZone(null);
    setForm({
      name: '',
      cities: [],
      flatRate: 0,
      freeShippingThreshold: 0,
      estimatedDays: '',
      enabled: true,
    });
    setShowModal(true);
  };

  const openEdit = (zone: ShippingZone) => {
    setEditingZone(zone);
    setForm({
      name: zone.name,
      cities: zone.cities,
      flatRate: zone.flatRate,
      freeShippingThreshold: zone.freeShippingThreshold,
      estimatedDays: zone.estimatedDays,
      enabled: zone.enabled,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingZone) {
      setZones(zones.map(z => z.id === editingZone.id ? { ...z, ...form } : z));
    } else {
      const newZone: ShippingZone = {
        id: Date.now().toString(),
        ...form,
      };
      setZones([...zones, newZone]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this shipping zone?')) {
      setZones(zones.filter(z => z.id !== id));
    }
  };

  const toggleCity = (city: string) => {
    if (form.cities.includes(city)) {
      setForm({ ...form, cities: form.cities.filter(c => c !== city) });
    } else {
      setForm({ ...form, cities: [...form.cities, city] });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Shipping Zones</h1>
            <p className="text-orange-100">Configure shipping rates and delivery areas</p>
          </div>
          <Truck className="w-16 h-16 opacity-50" />
        </div>
      </div>

      {/* Zones List */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Shipping Zones</h2>
          <button
            onClick={openNew}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Zone
          </button>
        </div>

        <div className="space-y-4">
          {zones.map(zone => (
            <div key={zone.id} className="border-2 border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg">{zone.name}</h3>
                  <p className="text-sm text-gray-500">{zone.cities.length} cities</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    zone.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {zone.enabled ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => openEdit(zone)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(zone.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Flat Rate</p>
                  <p className="font-bold text-lg">{settings.currency} {zone.flatRate}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Free Shipping Above</p>
                  <p className="font-bold text-lg">{settings.currency} {zone.freeShippingThreshold}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Delivery Time</p>
                  <p className="font-bold text-lg">{zone.estimatedDays} days</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {zone.cities.slice(0, 10).map(city => (
                  <span key={city} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                    {city}
                  </span>
                ))}
                {zone.cities.length > 10 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                    +{zone.cities.length - 10} more
                  </span>
                )}
              </div>
            </div>
          ))}

          {zones.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No shipping zones configured</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">{editingZone ? 'Edit Zone' : 'Add Zone'}</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Zone Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Major Cities"
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cities</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-auto border-2 border-gray-200 rounded-lg p-3">
                  {allCities.map(city => (
                    <label key={city} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={form.cities.includes(city)}
                        onChange={() => toggleCity(city)}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm">{city}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">{form.cities.length} cities selected</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Flat Rate ({settings.currency})</label>
                  <input
                    type="number"
                    value={form.flatRate}
                    onChange={e => setForm({ ...form, flatRate: Number(e.target.value) })}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Free Shipping Above ({settings.currency})</label>
                  <input
                    type="number"
                    value={form.freeShippingThreshold}
                    onChange={e => setForm({ ...form, freeShippingThreshold: Number(e.target.value) })}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Time (days)</label>
                  <input
                    type="text"
                    value={form.estimatedDays}
                    onChange={e => setForm({ ...form, estimatedDays: e.target.value })}
                    placeholder="e.g., 2-3"
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.enabled}
                    onChange={e => setForm({ ...form, enabled: e.target.checked })}
                    className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="font-medium">Enable this zone</span>
                </label>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 border-2 border-gray-200 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
