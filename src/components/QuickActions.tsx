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
      {/* Action Buttons - Expand Upward */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 space-y-3 animate-fade-in">
          {actions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => {
                action.onClick();
                setIsOpen(false);
              }}
              className={`flex items-center gap-3 px-5 py-3 rounded-full text-white shadow-xl transition-all hover:scale-110 min-w-[180px] justify-start ${action.color}`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <action.icon className="w-5 h-5" />
              <span className="text-sm font-medium whitespace-nowrap">{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all hover:scale-110 ${
          isOpen ? 'bg-gray-700 rotate-45' : 'bg-emerald-600 hover:bg-emerald-700'
        }`}
      >
        {isOpen ? <X className="w-7 h-7 text-white" /> : <Plus className="w-7 h-7 text-white" />}
      </button>
    </div>
  );
}
