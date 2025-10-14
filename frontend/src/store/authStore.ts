import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axiosInstance from "../api/axiosInstance";

interface User {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  university: string;
  department: string;
  is_admin: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  university: string;
  department: string;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.post<LoginResponse>(
            "/auth/login",
            { email, password }
          );

          const { user: userData } = response.data;

          set({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.detail || error.message || "Wystąpił błąd";
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      register: async (registerData: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
          await axiosInstance.post("/auth/register", registerData);

          set({ isLoading: false, error: null });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Wystąpił błąd";
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await axiosInstance.post("/auth/logout");
        } catch (err) {
          console.error("Logout error:", err);
        }
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user
          ? {
              user_id: state.user.user_id,
              first_name: state.user.first_name,
              last_name: state.user.last_name,
              email: state.user.email,
              university: state.user.university,
              department: state.user.department,
              is_admin: state.user.is_admin,
            }
          : null,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
