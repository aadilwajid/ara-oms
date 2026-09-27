import { useState } from 'react';
import { Plus, ShoppingCart, Package, Users, X } from 'lucide-react';

interface Props {
  onNewOrder: () => void;
  onNewProduct: () => void;
  onNewCustomer: () => void;
}

export default function QuickActions({ onNewOrder, onNewProduct, onNewCustomer }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { icon: ShoppingCart, label: 'New Order', onClick: onNewOrder, color: 'bg-blue-500 hover:bg-blue-600' },
    { icon: Package, label: 'New Product', onClick: onNewProduct, color: 'bg-purple-500 hover:bg-purple-600' },
    { icon: Users, label: 'New Customer', onClick: onNewCustomer, color: 'bg-orange-500 hover:bg-orange-600' },
  ];

  return (
    <div className="relative">
      {/* Action Buttons */}
      {isOpen && (
        <div className="absolute right-0 bottom-12 space-y-2 animate-fade-in">
          {actions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => {
                action.onClick();
                setIsOpen(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white shadow-lg transition-all hover:scale-105 ${action.color}`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <action.icon className="w-4 h-4" />
              <span className="text-sm font-medium whitespace-nowrap">{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center w-10 h-10 rounded-full shadow-lg transition-all hover:scale-110 ${
          isOpen ? 'bg-gray-600 rotate-45' : 'bg-emerald-600 hover:bg-emerald-700'
        }`}
      >
        {isOpen ? <X className="w-5 h-5 text-white" /> : <Plus className="w-5 h-5 text-white" />}
      </button>
    </div>
  );
}
