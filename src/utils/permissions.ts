// Role-Based Access Control (RBAC) System

export type UserRole = 'admin' | 'manager' | 'staff' | 'warehouse' | 'delivery' | 'marketing' | 'finance' | 'support';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  active: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface RolePermissions {
  role: UserRole;
  label: string;
  description: string;
  color: string;
  icon: string;
  pages: string[]; // Allowed page IDs
  actions: string[]; // Allowed actions
}

// Define all available pages
export const ALL_PAGES = [
  'dashboard',
  'orders',
  'customers',
  'products',
  'inventory',
  'advanced-inventory',
  'suppliers',
  'promotions',
  'marketing',
  'media',
  'invoices',
  'quotations',
  'reports',
  'returns',
  'expenses',
  'income',
  'team',
  'customer-experience',
  'advanced-analytics',
  'marketing-automation',
  'financial-advanced',
  'users',
  'settings',
];

// Define role permissions
export const ROLE_PERMISSIONS: RolePermissions[] = [
  {
    role: 'admin',
    label: 'Administrator',
    description: 'Full access to all features and settings',
    color: '#dc2626',
    icon: '👑',
    pages: [...ALL_PAGES, 'users'],
    actions: ['create', 'read', 'update', 'delete', 'export', 'import', 'settings', 'users'],
  },
  {
    role: 'manager',
    label: 'Manager',
    description: 'Manage operations, team, and reports',
    color: '#7c3aed',
    icon: '💼',
    pages: [
      'dashboard', 'orders', 'customers', 'products', 'inventory',
      'advanced-inventory', 'suppliers', 'promotions', 'marketing',
      'invoices', 'quotations', 'reports', 'returns', 'team',
      'customer-experience', 'advanced-analytics', 'marketing-automation',
    ],
    actions: ['create', 'read', 'update', 'delete', 'export'],
  },
  {
    role: 'staff',
    label: 'Staff',
    description: 'Handle daily operations and orders',
    color: '#2563eb',
    icon: '👤',
    pages: [
      'dashboard', 'orders', 'customers', 'products', 'inventory',
      'invoices', 'quotations', 'returns', 'customer-experience',
    ],
    actions: ['create', 'read', 'update'],
  },
  {
    role: 'warehouse',
    label: 'Warehouse Staff',
    description: 'Manage inventory and stock operations',
    color: '#059669',
    icon: '📦',
    pages: [
      'dashboard', 'inventory', 'advanced-inventory', 'products',
      'suppliers', 'media',
    ],
    actions: ['read', 'update'],
  },
  {
    role: 'delivery',
    label: 'Delivery Staff',
    description: 'Manage deliveries and shipments',
    color: '#ea580c',
    icon: '🚚',
    pages: [
      'dashboard', 'orders', 'customers',
    ],
    actions: ['read', 'update'],
  },
  {
    role: 'marketing',
    label: 'Marketing Team',
    description: 'Run campaigns and manage customers',
    color: '#ec4899',
    icon: '📣',
    pages: [
      'dashboard', 'customers', 'promotions', 'marketing',
      'customer-experience', 'marketing-automation', 'media',
      'advanced-analytics',
    ],
    actions: ['create', 'read', 'update'],
  },
  {
    role: 'finance',
    label: 'Finance Team',
    description: 'Manage financial operations and reports',
    color: '#0891b2',
    icon: '💰',
    pages: [
      'dashboard', 'invoices', 'quotations', 'expenses', 'income',
      'financial-advanced', 'reports', 'advanced-analytics',
    ],
    actions: ['create', 'read', 'update', 'export'],
  },
  {
    role: 'support',
    label: 'Support Team',
    description: 'Handle customer support and returns',
    color: '#6366f1',
    icon: '🎧',
    pages: [
      'dashboard', 'orders', 'customers', 'returns',
      'customer-experience',
    ],
    actions: ['read', 'update'],
  },
];

// Helper functions
export function getRolePermissions(role: UserRole): RolePermissions {
  return ROLE_PERMISSIONS.find(r => r.role === role) || ROLE_PERMISSIONS[0];
}

export function hasPageAccess(role: UserRole, pageId: string): boolean {
  const permissions = getRolePermissions(role);
  return permissions.pages.includes(pageId);
}

export function hasActionAccess(role: UserRole, action: string): boolean {
  const permissions = getRolePermissions(role);
  return permissions.actions.includes(action);
}

export function getFilteredPages(role: UserRole, allNavItems: Array<{ id: string }>): Array<{ id: string }> {
  return allNavItems.filter(item => hasPageAccess(role, item.id));
}

// Default users for demo
export const DEFAULT_USERS: User[] = [
  {
    id: '1',
    name: 'Ahmed Khan',
    email: 'admin@storeos.pk',
    phone: '0300-1234567',
    role: 'admin',
    active: true,
    createdAt: '2024-01-01',
    lastLogin: '2024-03-15',
  },
  {
    id: '2',
    name: 'Fatima Ali',
    email: 'manager@storeos.pk',
    phone: '0321-9876543',
    role: 'manager',
    active: true,
    createdAt: '2024-01-15',
    lastLogin: '2024-03-14',
  },
  {
    id: '3',
    name: 'Usman Ghani',
    email: 'staff@storeos.pk',
    phone: '0333-5551234',
    role: 'staff',
    active: true,
    createdAt: '2024-02-01',
    lastLogin: '2024-03-15',
  },
  {
    id: '4',
    name: 'Bilal Ahmed',
    email: 'warehouse@storeos.pk',
    phone: '0345-1112233',
    role: 'warehouse',
    active: true,
    createdAt: '2024-02-10',
    lastLogin: '2024-03-15',
  },
  {
    id: '5',
    name: 'Sara Khan',
    email: 'marketing@storeos.pk',
    phone: '0312-4445566',
    role: 'marketing',
    active: true,
    createdAt: '2024-02-15',
    lastLogin: '2024-03-14',
  },
  {
    id: '6',
    name: 'Omar Farooq',
    email: 'finance@storeos.pk',
    phone: '0321-7778899',
    role: 'finance',
    active: true,
    createdAt: '2024-02-20',
    lastLogin: '2024-03-15',
  },
];
