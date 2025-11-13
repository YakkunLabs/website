import axios from 'axios';

import { apiClient } from './api';

const CREATOR_TOKEN_KEY = 'yl_creator_token';
const CREATOR_EMAIL_KEY = 'yl_creator_email';

const DEFAULT_BASE_URL = import.meta.env.VITE_API_BASE ?? 'http://localhost:4000';

const creatorClient = axios.create({
  baseURL: DEFAULT_BASE_URL,
});

creatorClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem(CREATOR_TOKEN_KEY);
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

creatorClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const errorData = error.response.data as { code?: string; message?: string };
      
      // Handle token expiration specifically
      if (errorData.code === 'TOKEN_EXPIRED' || errorData.message?.includes('expired')) {
        clearCreatorAuth();
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/creator/login') && !window.location.pathname.includes('/creator/signup')) {
          window.location.href = '/creator/login';
        }
      } else {
        // Other 401 errors (invalid token, etc.)
        clearCreatorAuth();
        if (!window.location.pathname.includes('/creator/login') && !window.location.pathname.includes('/creator/signup')) {
          window.location.href = '/creator/login';
        }
      }
    }
    return Promise.reject(error);
  },
);

export interface CreatorUser {
  id: string;
  email: string;
}

export interface Metaverse {
  id: string;
  userId: string;
  name: string;
  kind: 'TWO_D' | 'THREE_D';
  region: 'ASIA' | 'EU' | 'US';
  status: 'RUNNING' | 'STOPPED' | 'ERROR' | 'STARTING' | 'STOPPING';
  playersOnline: number;
  uptimeMinutes: number;
  hoursUsed: number;
  version: string;
  thumbnail?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'INDIE' | 'PRO' | 'STUDIO';
  monthlyHours: number;
  usedHours: number;
  resetDate: string;
  nextBilling: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: CreatorUser;
}

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function getCreatorToken(): string | null {
  return isBrowser() ? window.localStorage.getItem(CREATOR_TOKEN_KEY) : null;
}

export function getCreatorEmail(): string | null {
  return isBrowser() ? window.localStorage.getItem(CREATOR_EMAIL_KEY) : null;
}

function persistAuth(token: string, email: string) {
  if (!isBrowser()) return;
  window.localStorage.setItem(CREATOR_TOKEN_KEY, token);
  window.localStorage.setItem(CREATOR_EMAIL_KEY, email);
  // Dispatch custom event to notify components that auth state changed
  window.dispatchEvent(new Event('creatorAuthChange'));
}

export function clearCreatorAuth() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(CREATOR_TOKEN_KEY);
  window.localStorage.removeItem(CREATOR_EMAIL_KEY);
  // Dispatch custom event to notify components that auth state changed
  window.dispatchEvent(new Event('creatorAuthChange'));
}

export async function loginCreator(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await creatorClient.post<AuthResponse>('/api/auth/login', payload);
  persistAuth(data.token, data.user.email);
  return data;
}

export async function registerCreator(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await creatorClient.post<AuthResponse>('/api/auth/signup', payload);
  persistAuth(data.token, data.user.email);
  return data;
}

export async function fetchMetaverses(): Promise<Metaverse[]> {
  const { data } = await creatorClient.get<Metaverse[]>('/api/metaverses');
  return data;
}

export async function fetchMetaverse(id: string): Promise<Metaverse> {
  const { data } = await creatorClient.get<Metaverse>(`/api/metaverses/${id}`);
  return data;
}

export async function controlMetaverse(
  id: string,
  action: 'start' | 'stop' | 'restart',
): Promise<Metaverse> {
  const { data } = await creatorClient.post<Metaverse>(`/api/metaverses/${action}/${id}`);
  return data;
}

export async function createMetaverse(payload: {
  name: string;
  kind: 'TWO_D' | 'THREE_D';
  region?: 'ASIA' | 'EU' | 'US';
}): Promise<Metaverse> {
  const { data } = await creatorClient.post<Metaverse>('/api/metaverses', payload);
  return data;
}

export async function deleteMetaverse(id: string): Promise<void> {
  await creatorClient.delete(`/api/metaverses/delete/${id}`);
}

export async function fetchSubscription(): Promise<Subscription> {
  const { data } = await creatorClient.get<Subscription>('/api/subscription');
  return data;
}

export async function buySubscriptionHours(hours: number): Promise<Subscription> {
  const { data } = await creatorClient.post<Subscription>('/api/subscription/buy-hours', { hours });
  return data;
}

export async function upgradeSubscription(
  plan: Subscription['plan'],
  monthlyHours?: number,
): Promise<Subscription> {
  const { data } = await creatorClient.post<Subscription>('/api/subscription/upgrade', {
    plan,
    monthlyHours,
  });
  return data;
}


