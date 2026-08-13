import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [isAuthenticated, setIsAuthenticated] =
    useState(
      localStorage.getItem(
        "nti_admin_logged_in"
      ) === "true"
    );

  useEffect(() => {

    localStorage.setItem(
      "nti_admin_logged_in",
      String(isAuthenticated)
    );

  }, [isAuthenticated]);

  const login = (email, password) => {

    if (
      email ===
        "admin@newtajindustries.com" &&
      password === "admin123"
    ) {

      setIsAuthenticated(true);

      return {
        success: true
      };
    }

    return {
      success: false,
      message: "Invalid email or password."
    };
  };

  const logout = () => {

    setIsAuthenticated(false);

    localStorage.removeItem(
      "nti_admin_logged_in"
    );
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () =>
  useContext(AuthContext);