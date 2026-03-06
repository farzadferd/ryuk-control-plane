import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "admin" | "sandbox_user";

interface AuthState {
  isAuthenticated: boolean;
  role: UserRole;
  email: string;
}

interface AuthContextType extends AuthState {
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    role: "sandbox_user",
    email: "",
  });

  const login = (email: string, role: UserRole) => {
    setAuth({ isAuthenticated: true, role, email });
  };

  const logout = () => {
    setAuth({ isAuthenticated: false, role: "sandbox_user", email: "" });
  };

  return (
    <AuthContext.Provider
      value={{
        ...auth,
        login,
        logout,
        isAdmin: auth.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}