// Backend Module Index
// Exports all backend services and utilities

export { db, Database } from './database';
export { api } from './api';
export { authService } from './auth';
export type { AuthUser, LoginCredentials, AuthResponse } from './auth';
export { AppProvider, useApp } from './store';
