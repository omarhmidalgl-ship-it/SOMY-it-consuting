import { create } from "zustand";
import api from "../api/client";

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  fetchUser: async () => {
    try {
      const token = localStorage.getItem("somy_token");
      if (!token) {
        set({ loading: false });
        return;
      }
      const { data } = await api.get("/auth/me");
      set({ user: data.user, loading: false });
    } catch {
      localStorage.removeItem("somy_token");
      set({ user: null, loading: false });
    }
  },

  login: async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("somy_token", data.token);
    set({ user: data.user });
    return data;
  },

  loginWithGoogle: async (credential) => {
    const { data } = await api.post("/auth/google", { credential });
    localStorage.setItem("somy_token", data.token);
    set({ user: data.user });
    return data;
  },

  logout: () => {
    localStorage.removeItem("somy_token");
    set({ user: null });
  },
}));
