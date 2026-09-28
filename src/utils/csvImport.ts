import { Product, Customer, Order } from '../types';

export function parseCSV(text: string): string[][] {
  const lines = text.trim().split('\n');
  return lines.map(line => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  });
}

export function importProducts(csv: string): Partial<Product>[] {
  const rows = parseCSV(csv);
  if (rows.length < 2) return [];
  
  const headers = rows[0].map(h => h.toLowerCase().trim());
  const products: Partial<Product>[] = [];
  
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length === 0 || row.every(cell => !cell)) continue;
    
    const product: Partial<Product> = {};
    headers.forEach((header, idx) => {
      const value = row[idx] || '';
      switch (header) {
        case 'name': product.name = value; break;
        case 'sku': product.sku = value; break;
        case 'category': product.category = value; break;
        case 'price': product.price = parseFloat(value) || 0; break;
        case 'cost': case 'costprice': product.costPrice = parseFloat(value) || 0; break;
        case 'stock': case 'quantity': product.stock = parseInt(value) || 0; break;
        case 'description': product.description = value; break;
        case 'threshold': case 'lowstock': product.lowStockThreshold = parseInt(value) || 10; break;
      }
    });
    
    if (product.name) {
      products.push(product);
    }
  }
  
  return products;
}

export function importCustomers(csv: string): Partial<Customer>[] {
  const rows = parseCSV(csv);
  if (rows.length < 2) return [];
  
  const headers = rows[0].map(h => h.toLowerCase().trim());
  const customers: Partial<Customer>[] = [];
  
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length === 0 || row.every(cell => !cell)) continue;
    
    const customer: Partial<Customer> = {};
    headers.forEach((header, idx) => {
      const value = row[idx] || '';
      switch (header) {
        case 'name': customer.name = value; break;
        case 'email': customer.email = value; break;
        case 'phone': customer.phone = value; break;
        case 'address': customer.address = value; break;
        case 'city': customer.city = value; break;
      }
    });
    
    if (customer.name) {
      customers.push(customer);
    }
  }
  
  return customers;
}

export function generateProductCSV(products: Product[]): string {
  const headers = ['Name', 'SKU', 'Category', 'Price', 'CostPrice', 'Stock', 'LowStockThreshold', 'Description'];
  const rows = products.map(p => [
    p.name, p.sku, p.category, p.price.toString(), p.costPrice.toString(),
    p.stock.toString(), p.lowStockThreshold.toString(), p.description
  ]);
  
  return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
}

export function generateCustomerCSV(customers: Customer[]): string {
  const headers = ['Name', 'Email', 'Phone', 'Address', 'City'];
  const rows = customers.map(c => [c.name, c.email, c.phone, c.address, c.city]);
  
  return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
}

export function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
