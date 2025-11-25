import { create } from "zustand";

type User = {
  id: string;
  email: string;
  name?: string | null;
};

type AuthResponse = {
  accessToken: string;
  user: User;
};

type AuthState = {
  token: string | null;
  user: User | null;
  isHydrated: boolean;
  initialize: () => void;
  setAuth: (payload: AuthResponse) => void;
  logout: () => void;
};

const STORAGE_KEY = "ggu-auth";

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isHydrated: false,
  initialize: () => {
    if (typeof window === "undefined") {
      return;
    }
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as AuthResponse;
        set({
          token: parsed.accessToken,
          user: parsed.user,
          isHydrated: true
        });
        return;
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    set({ isHydrated: true });
  },
  setAuth: (payload) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    }
    set({
      token: payload.accessToken,
      user: payload.user
    });
  },
  logout: () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    set({ token: null, user: null });
  }
}));


