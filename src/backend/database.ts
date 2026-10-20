// Backend Database Abstraction Layer
// Simulates a real backend database using localStorage

export interface DatabaseConfig {
  version: string;
  lastBackup?: string;
  tables: string[];
}

export class Database {
  private static instance: Database;
  private config: DatabaseConfig;

  private constructor() {
    this.config = this.loadConfig();
  }

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private loadConfig(): DatabaseConfig {
    const saved = localStorage.getItem('db_config');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      version: '1.0.0',
      tables: ['products', 'customers', 'orders', 'invoices', 'expenses', 'income', 'media', 'users'],
    };
  }

  private saveConfig(): void {
    localStorage.setItem('db_config', JSON.stringify(this.config));
  }

  // Generic CRUD operations
  async getAll<T>(table: string): Promise<T[]> {
    const data = localStorage.getItem(`db_${table}`);
    return data ? JSON.parse(data) : [];
  }

  async getById<T>(table: string, id: string): Promise<T | null> {
    const items = await this.getAll<T & { id: string }>(table);
    return items.find(item => item.id === id) || null;
  }

  async create<T extends { id: string }>(table: string, item: T): Promise<T> {
    const items = await this.getAll<T>(table);
    items.push(item);
    localStorage.setItem(`db_${table}`, JSON.stringify(items));
    return item;
  }

  async update<T>(table: string, id: string, updates: Partial<T>): Promise<T | null> {
    const items = await this.getAll<T & { id: string }>(table);
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    items[index] = { ...items[index], ...updates } as T & { id: string };
    localStorage.setItem(`db_${table}`, JSON.stringify(items));
    return items[index] as T;
  }

  async delete(table: string, id: string): Promise<boolean> {
    const items = await this.getAll<any>(table);
    const filtered = items.filter(item => item.id !== id);
    if (filtered.length === items.length) return false;
    
    localStorage.setItem(`db_${table}`, JSON.stringify(filtered));
    return true;
  }

  async query<T>(table: string, predicate: (item: T) => boolean): Promise<T[]> {
    const items = await this.getAll<T>(table);
    return items.filter(predicate);
  }

  async count(table: string): Promise<number> {
    const items = await this.getAll<any>(table);
    return items.length;
  }

  async clear(table: string): Promise<void> {
    localStorage.setItem(`db_${table}`, JSON.stringify([]));
  }

  async backup(): Promise<string> {
    const backup: Record<string, any> = {};
    for (const table of this.config.tables) {
      backup[table] = await this.getAll(table);
    }
    const backupData = JSON.stringify(backup, null, 2);
    this.config.lastBackup = new Date().toISOString();
    this.saveConfig();
    return backupData;
  }

  async restore(backupData: string): Promise<void> {
    const backup = JSON.parse(backupData);
    for (const table of Object.keys(backup)) {
      localStorage.setItem(`db_${table}`, JSON.stringify(backup[table]));
    }
  }

  getTables(): string[] {
    return this.config.tables;
  }
}

export const db = Database.getInstance();
