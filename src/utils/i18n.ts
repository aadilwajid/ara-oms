// Multi-language support for StoreOS
export type Language = 'en' | 'ur';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.orders': 'Orders',
    'nav.customers': 'Customers',
    'nav.products': 'Products',
    'nav.inventory': 'Inventory',
    'nav.advancedInventory': 'Advanced Inventory',
    'nav.suppliers': 'Suppliers & PO',
    'nav.promotions': 'Promotions',
    'nav.marketing': 'Marketing & CRM',
    'nav.media': 'Media',
    'nav.invoices': 'Invoices',
    'nav.quotations': 'Quotations',
    'nav.reports': 'Reports',
    'nav.returns': 'Returns',
    'nav.expenses': 'Expenses',
    'nav.income': 'Income',
    'nav.team': 'Team & HR',
    'nav.customerExperience': 'Customer Experience',
    'nav.advancedAnalytics': 'Advanced Analytics',
    'nav.marketingAutomation': 'Marketing Automation',
    'nav.financialAdvanced': 'Financial Advanced',
    'nav.communication': 'Communication Hub',
    'nav.multistore': 'Multi-Store & B2B',
    'nav.customerPortal': 'Customer Portal',
    'nav.workflows': 'Advanced Workflows',
    'nav.realtimeAnalytics': 'Real-Time Analytics',
    'nav.socialCommerce': 'Social Commerce',
    'nav.advancedCommerce': 'Advanced Commerce',
    'nav.users': 'User Management',
    'nav.settings': 'Settings',
    'nav.orderTracking': 'Order Tracking',
    'nav.reviews': 'Reviews',
    'nav.warranties': 'Warranties',
    'nav.shipping': 'Shipping Zones',
    'nav.integrations': 'Integrations',
    'nav.taxReports': 'Tax Reports',
    
    // Common
    'common.search': 'Search',
    'common.add': 'Add',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.export': 'Export',
    'common.import': 'Import',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.view': 'View',
    'common.close': 'Close',
    'common.loading': 'Loading...',
    'common.noData': 'No data found',
    'common.actions': 'Actions',
    'common.status': 'Status',
    'common.date': 'Date',
    'common.amount': 'Amount',
    'common.total': 'Total',
    'common.name': 'Name',
    'common.email': 'Email',
    'common.phone': 'Phone',
    'common.address': 'Address',
    'common.city': 'City',
    'common.active': 'Active',
    'common.inactive': 'Inactive',
    'common.pending': 'Pending',
    'common.completed': 'Completed',
    'common.cancelled': 'Cancelled',
    
    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.totalRevenue': 'Total Revenue',
    'dashboard.totalOrders': 'Total Orders',
    'dashboard.customers': 'Customers',
    'dashboard.netProfit': 'Net Profit',
    'dashboard.recentOrders': 'Recent Orders',
    'dashboard.salesChannels': 'Sales Channels',
    'dashboard.lowStockAlert': 'Low Stock Alert',
    
    // Orders
    'orders.newOrder': 'New Order',
    'orders.orderNumber': 'Order Number',
    'orders.customer': 'Customer',
    'orders.channel': 'Channel',
    'orders.paymentStatus': 'Payment Status',
    'orders.shippingAddress': 'Shipping Address',
    
    // Products
    'products.addProduct': 'Add Product',
    'products.sku': 'SKU',
    'products.category': 'Category',
    'products.price': 'Price',
    'products.costPrice': 'Cost Price',
    'products.stock': 'Stock',
    'products.margin': 'Margin',
    
    // Pakistan specific
    'pakistan.ntn': 'NTN (National Tax Number)',
    'pakistan.fbr': 'FBR Tax Report',
    'pakistan.salesTax': 'Sales Tax',
    'pakistan.provincialTax': 'Provincial Sales Tax',
  },
  ur: {
    // Navigation
    'nav.dashboard': 'ڈیش بورڈ',
    'nav.orders': 'آرڈرز',
    'nav.customers': 'کسٹمرز',
    'nav.products': 'پروڈکٹس',
    'nav.inventory': 'انوینٹری',
    'nav.advancedInventory': 'ایڈوانسڈ انوینٹری',
    'nav.suppliers': 'سپلائرز',
    'nav.promotions': 'پروموشنز',
    'nav.marketing': 'مارکیٹنگ',
    'nav.media': 'میڈیا',
    'nav.invoices': 'انوائسز',
    'nav.quotations': 'کوٹیشنز',
    'nav.reports': 'رپورٹس',
    'nav.returns': 'واپسی',
    'nav.expenses': 'اخراجات',
    'nav.income': 'آمدنی',
    'nav.team': 'ٹیم مینجمنٹ',
    'nav.customerExperience': 'کسٹمر ایکسپیرینس',
    'nav.advancedAnalytics': 'تجزیات',
    'nav.marketingAutomation': 'مارکیٹنگ آٹومیشن',
    'nav.financialAdvanced': 'مالیاتی',
    'nav.communication': 'مواصلات',
    'nav.multistore': 'ملٹی اسٹور',
    'nav.customerPortal': 'کسٹمر پورٹل',
    'nav.workflows': 'ورک فلوز',
    'nav.realtimeAnalytics': 'ریئل ٹائم تجزیات',
    'nav.socialCommerce': 'سوشل کامرس',
    'nav.advancedCommerce': 'ایڈوانسڈ کامرس',
    'nav.users': 'یوزر مینجمنٹ',
    'nav.settings': 'ترتیبات',
    'nav.orderTracking': 'آرڈر ٹریکنگ',
    'nav.reviews': 'جائزے',
    'nav.warranties': 'وارنٹیاں',
    'nav.shipping': 'شپنگ زونز',
    'nav.integrations': 'انٹیگریشنز',
    'nav.taxReports': 'ٹیکس رپورٹس',
    
    // Common
    'common.search': 'تلاش کریں',
    'common.add': 'شامل کریں',
    'common.edit': 'ترمیم',
    'common.delete': 'حذف',
    'common.save': 'محفوظ کریں',
    'common.cancel': 'منسوخ',
    'common.confirm': 'تصدیق',
    'common.export': 'ایکسپورٹ',
    'common.import': 'امپورٹ',
    'common.filter': 'فلٹر',
    'common.sort': 'ترتیب',
    'common.view': 'دیکھیں',
    'common.close': 'بند کریں',
    'common.loading': 'لوڈ ہو رہا ہے...',
    'common.noData': 'کوئی ڈیٹا نہیں',
    'common.actions': 'اعمال',
    'common.status': 'حالت',
    'common.date': 'تاریخ',
    'common.amount': 'رقم',
    'common.total': 'کل',
    'common.name': 'نام',
    'common.email': 'ای میل',
    'common.phone': 'فون',
    'common.address': 'پتہ',
    'common.city': 'شہر',
    'common.active': 'فعال',
    'common.inactive': 'غیر فعال',
    'common.pending': 'زیر التواء',
    'common.completed': 'مکمل',
    'common.cancelled': 'منسوخ',
    
    // Dashboard
    'dashboard.welcome': 'خوش آمدید',
    'dashboard.totalRevenue': 'کل آمدنی',
    'dashboard.totalOrders': 'کل آرڈرز',
    'dashboard.customers': 'کسٹمرز',
    'dashboard.netProfit': 'خالص منافع',
    'dashboard.recentOrders': 'حالیہ آرڈرز',
    'dashboard.salesChannels': 'سیلز چینلز',
    'dashboard.lowStockAlert': 'کم اسٹاک الرٹ',
    
    // Orders
    'orders.newOrder': 'نیا آرڈر',
    'orders.orderNumber': 'آرڈر نمبر',
    'orders.customer': 'کسٹمر',
    'orders.channel': 'چینل',
    'orders.paymentStatus': 'ادائیگی کی حالت',
    'orders.shippingAddress': 'شپنگ ایڈریس',
    
    // Products
    'products.addProduct': 'پروڈکٹ شامل کریں',
    'products.sku': 'ایس کے یو',
    'products.category': 'کیٹیگری',
    'products.price': 'قیمت',
    'products.costPrice': 'لاگت',
    'products.stock': 'اسٹاک',
    'products.margin': 'مارجن',
    
    // Pakistan specific
    'pakistan.ntn': 'این ٹی این',
    'pakistan.fbr': 'ایف بی آر ٹیکس رپورٹ',
    'pakistan.salesTax': 'سیلز ٹیکس',
    'pakistan.provincialTax': 'صوبائی سیلز ٹیکس',
  },
};

export function t(key: string, lang: Language = 'en'): string {
  return translations[lang][key] || translations.en[key] || key;
}

export function getLanguage(): Language {
  return (localStorage.getItem('oms_language') as Language) || 'en';
}

export function setLanguage(lang: Language): void {
  localStorage.setItem('oms_language', lang);
  if (lang === 'ur') {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'ur');
  } else {
    document.documentElement.setAttribute('dir', 'ltr');
    document.documentElement.setAttribute('lang', 'en');
  }
}
