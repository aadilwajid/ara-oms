import { useState, useEffect, useRef } from 'react';
import { Search, X, ShoppingCart, Users, Package, FileText } from 'lucide-react';
import { Order, Customer, Product, Invoice } from '../types';

interface Props {
  orders: Order[];
  customers: Customer[];
  products: Product[];
  invoices: Invoice[];
  onNavigate: (page: string, id?: string) => void;
}

export default function GlobalSearch({ orders, customers, products, invoices, onNavigate }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const results = query.length >= 2 ? {
    orders: orders.filter(o => 
      o.orderNumber.toLowerCase().includes(query.toLowerCase()) ||
      o.customerName.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 3),
    customers: customers.filter(c => 
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.phone.includes(query) ||
      c.email.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 3),
    products: products.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.sku.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 3),
    invoices: invoices.filter(i => 
      i.invoiceNumber.toLowerCase().includes(query.toLowerCase()) ||
      i.customerName.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 3),
  } : null;

  const totalResults = results ? Object.values(results).flat().length : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-start justify-center pt-20 p-4" onClick={() => setIsOpen(false)}>
      <div className="bg-white rounded-xl max-w-xl w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search orders, customers, products, invoices..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 text-sm outline-none"
            autoFocus
          />
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-auto">
          {query.length < 2 && (
            <div className="p-8 text-center text-gray-400 text-sm">
              Type at least 2 characters to search...
            </div>
          )}

          {results && totalResults === 0 && (
            <div className="p-8 text-center text-gray-400 text-sm">
              No results found for "{query}"
            </div>
          )}

          {results && results.orders.length > 0 && (
            <div className="p-2">
              <h4 className="px-3 py-1 text-xs font-medium text-gray-400 uppercase">Orders</h4>
              {results.orders.map(order => (
                <button
                  key={order.id}
                  onClick={() => { onNavigate('orders'); setIsOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg text-left"
                >
                  <ShoppingCart className="w-4 h-4 text-blue-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500 truncate">{order.customerName}</p>
                  </div>
                  <span className="text-xs text-gray-400">PKR {order.total.toLocaleString()}</span>
                </button>
              ))}
            </div>
          )}

          {results && results.customers.length > 0 && (
            <div className="p-2">
              <h4 className="px-3 py-1 text-xs font-medium text-gray-400 uppercase">Customers</h4>
              {results.customers.map(customer => (
                <button
                  key={customer.id}
                  onClick={() => { onNavigate('customers'); setIsOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg text-left"
                >
                  <Users className="w-4 h-4 text-purple-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{customer.name}</p>
                    <p className="text-xs text-gray-500 truncate">{customer.phone}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {results && results.products.length > 0 && (
            <div className="p-2">
              <h4 className="px-3 py-1 text-xs font-medium text-gray-400 uppercase">Products</h4>
              {results.products.map(product => (
                <button
                  key={product.id}
                  onClick={() => { onNavigate('products'); setIsOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg text-left"
                >
                  <Package className="w-4 h-4 text-emerald-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-gray-500 truncate">SKU: {product.sku}</p>
                  </div>
                  <span className="text-xs text-gray-400">PKR {product.price.toLocaleString()}</span>
                </button>
              ))}
            </div>
          )}

          {results && results.invoices.length > 0 && (
            <div className="p-2">
              <h4 className="px-3 py-1 text-xs font-medium text-gray-400 uppercase">Invoices</h4>
              {results.invoices.map(invoice => (
                <button
                  key={invoice.id}
                  onClick={() => { onNavigate('invoices'); setIsOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg text-left"
                >
                  <FileText className="w-4 h-4 text-orange-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{invoice.invoiceNumber}</p>
                    <p className="text-xs text-gray-500 truncate">{invoice.customerName}</p>
                  </div>
                  <span className="text-xs text-gray-400">PKR {invoice.amount.toLocaleString()}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-3 border-t bg-gray-50 rounded-b-xl flex items-center justify-between text-xs text-gray-400">
          <span>{totalResults} results</span>
          <span>Press <kbd className="px-1.5 py-0.5 bg-white border rounded">Esc</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}
