import { AUTH_KEY, ADMIN_PASSWORD } from '../constants/auth';

export function checkAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export function getStoredAuth(): boolean {
  return localStorage.getItem(AUTH_KEY) === 'true';
}

export function setStoredAuth(isAuthenticated: boolean): void {
  if (isAuthenticated) {
    localStorage.setItem(AUTH_KEY, 'true');
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
}