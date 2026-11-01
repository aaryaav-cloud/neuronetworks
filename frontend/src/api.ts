// Small wrapper around fetch for the NeuroNetworks API.

const TOKEN_KEY = 'nn_token';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Checkin {
  id: number;
  rating: number;
  symptoms: string[];
  createdAt: string;
}

export interface PlanReason {
  symptom: string;
  symptomTitle: string;
  level: 'direct' | 'related';
  reason: string;
}

export interface PlanExercise {
  id: number;
  name: string;
  kind: 'stretch' | 'range' | 'strength' | 'core';
  effort: 1 | 2 | 3;
  need: string;
  setup: string;
  steps: string[];
  benefits: string[];
  tips: string[];
  reasons: PlanReason[];
  timer: ExerciseTimer;
}

export interface ExerciseTimer {
  hold: number;
  rest: number;
  reps: number;
  sides: 1 | 2;
  holdCue: string;
  restCue: string;
}

export interface Plan {
  message: string;
  exercises: PlanExercise[];
  skipped: { id: number; name: string; symptomTitle: string; reason: string }[];
  guidance: { beforeYouBegin: string; stopRule: string; howOften: string; breathing: string; core: string };
}

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage blocked: the person just signs in again next visit */
  }
}

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`/api${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  } catch {
    throw new ApiError("We can't reach NeuroNetworks right now. Check your internet connection and try again.", 0);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError((data as { error?: string }).error || 'Something went wrong. Please try again.', res.status);
  }
  return data as T;
}

export const api = {
  signup: (name: string, email: string, password: string) =>
    request<{ token: string; user: User }>('POST', '/auth/signup', { name, email, password }),
  login: (email: string, password: string) =>
    request<{ token: string; user: User }>('POST', '/auth/login', { email, password }),
  me: () => request<{ user: User }>('GET', '/auth/me'),
  forgot: (email: string) => request<{ ok: true; devResetLink?: string }>('POST', '/auth/forgot', { email }),
  reset: (token: string, password: string) => request<{ ok: true }>('POST', '/auth/reset', { token, password }),
  saveCheckin: (rating: number, symptoms: string[]) =>
    request<{ checkin: Checkin; plan: Plan }>('POST', '/checkins', { rating, symptoms }),
  latestPlan: () => request<{ checkin: Checkin; plan: Plan }>('GET', '/checkins/latest/plan'),
  checkins: () => request<{ checkins: Checkin[] }>('GET', '/checkins'),
};
