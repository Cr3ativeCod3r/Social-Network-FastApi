import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  university: string;
  department: string;
  is_admin:string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
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
}

const API_URL = import.meta.env.VITE_API_URL;

const cookieStorage = {
  getItem: (name: string): string | null => {
    return Cookies.get(name) || null;
  },
  setItem: (name: string, value: string): void => {
    Cookies.set(name, value, {
      expires: 7, 
      secure: true, 
      sameSite: "strict",
    });
  },
  removeItem: (name: string): void => {
    Cookies.remove(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            let errorMessage = "Błąd logowania";
            try {
              const errorData = await response.json();
              if (typeof errorData.detail === "string") {
                errorMessage = errorData.detail;
              } else if (Array.isArray(errorData.detail)) {
                errorMessage = errorData.detail
                  .map((e: any) => e.msg)
                  .join(", ");
              } else {
                errorMessage = JSON.stringify(errorData);
              }
            } catch {
              errorMessage = "Nie udało się odczytać błędu z serwera";
            }
            throw new Error(errorMessage);
          }

          const data: LoginResponse = await response.json();

          const userResponse = await fetch(`${API_URL}/users/me`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${data.access_token}`,
            },
          });

          if (!userResponse.ok) {
            throw new Error("Nie udało się pobrać danych użytkownika");
          }

          const userData: User = await userResponse.json();

          set({
            user: userData,
            token: data.access_token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Wystąpił błąd",
          });
          throw error;
        }
      },

      register: async (registerData: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(registerData),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Błąd rejestracji");
          }
          set({
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Wystąpił błąd",
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "token",
      storage: createJSONStorage(() => cookieStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user
          ? {
              first_name: state.user.first_name,
              last_name: state.user.last_name,
              is_admin: state.user.is_admin
            }
          : null
      }),
    }
  )
);
