import { useState, useEffect } from 'react';
import { Order, BusinessSettings } from '../types';
import { Package, MapPin, Clock, CheckCircle, Truck, Phone, MessageCircle } from 'lucide-react';
import { sendWhatsAppMessage, generateOrderStatusMessage } from '../utils/whatsapp';

interface Props {
  orders: Order[];
  settings: BusinessSettings;
}

export default function OrderTrackingPage({ orders, settings }: Props) {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleTrack = () => {
    setNotFound(false);
    const order = orders.find(o => 
      o.orderNumber.toLowerCase() === trackingNumber.toLowerCase() ||
      o.trackingNumber?.toLowerCase() === trackingNumber.toLowerCase()
    );
    
    if (order) {
      setFoundOrder(order);
    } else {
      setNotFound(true);
      setFoundOrder(null);
    }
  };

  const getStatusStep = (status: string) => {
    const steps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = steps.indexOf(status);
    return steps.map((step, idx) => ({
      step,
      completed: idx <= currentIndex,
      current: idx === currentIndex,
    }));
  };

  const statusLabels: Record<string, string> = {
    pending: 'Order Placed',
    confirmed: 'Order Confirmed',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
  };

  const statusIcons: Record<string, any> = {
    pending: Clock,
    confirmed: CheckCircle,
    processing: Package,
    shipped: Truck,
    delivered: CheckCircle,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 text-white text-center">
        <Package className="w-16 h-16 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Track Your Order</h1>
        <p className="text-emerald-100">Enter your order number or tracking number</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={trackingNumber}
            onChange={e => setTrackingNumber(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleTrack()}
            placeholder="Enter order number (e.g., ORD-001)"
            className="flex-1 border-2 border-gray-200 rounded-lg px-4 py-3 text-lg focus:border-emerald-500 focus:outline-none"
          />
          <button
            onClick={handleTrack}
            className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            Track
          </button>
        </div>
      </div>

      {/* Not Found */}
      {notFound && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <Package className="w-12 h-12 mx-auto mb-3 text-red-400" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Order Not Found</h3>
          <p className="text-red-600">Please check your order number and try again.</p>
        </div>
      )}

      {/* Order Details */}
      {foundOrder && (
        <div className="space-y-4">
          {/* Status Timeline */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-6">Order Status</h2>
            <div className="relative">
              {getStatusStep(foundOrder.status).map((item, idx) => {
                const Icon = statusIcons[item.step];
                return (
                  <div key={item.step} className="flex items-start gap-4 mb-6 last:mb-0">
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        item.completed ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'
                      } ${item.current ? 'ring-4 ring-emerald-200' : ''}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      {idx < 4 && (
                        <div className={`w-0.5 h-12 ${item.completed ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                      )}
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className={`font-semibold ${item.completed ? 'text-gray-800' : 'text-gray-400'}`}>
                        {statusLabels[item.step]}
                      </h3>
                      {item.current && (
                        <p className="text-sm text-emerald-600 mt-1">Current Status</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Info */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-4">Order Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Order Number</p>
                <p className="font-semibold text-lg">{foundOrder.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-semibold">{foundOrder.createdAt}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-semibold">{foundOrder.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-semibold text-emerald-600 text-lg">
                  {settings.currency} {foundOrder.total.toLocaleString()}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Shipping Address</p>
                <p className="font-semibold flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-1 text-gray-400" />
                  {foundOrder.shippingAddress}
                </p>
              </div>
              {foundOrder.trackingNumber && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Tracking Number</p>
                  <p className="font-semibold font-mono">{foundOrder.trackingNumber}</p>
                </div>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-4">Items Ordered</h2>
            <div className="space-y-3">
              {foundOrder.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  {item.image ? (
                    <img src={item.image} alt={item.productName} className="w-16 h-16 rounded-lg object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.productName}</h3>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity} × {settings.currency} {item.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-600">
                      {settings.currency} {item.total.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-4">Need Help?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => {
                  const message = `Hi, I have a question about order ${foundOrder.orderNumber}`;
                  sendWhatsAppMessage(settings.phone, message);
                }}
                className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Contact via WhatsApp
              </button>
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center justify-center gap-2 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                <Phone className="w-5 h-5" />
                Call Support
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
