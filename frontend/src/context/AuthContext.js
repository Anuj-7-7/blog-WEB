import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("userInfo")) || null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("userInfo");

    if (!token || !storedUser || storedUser === "undefined") {
      console.warn("No valid user info or token found, logging out...");
      logout();
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // Fetch latest user data from API
      API.get("/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => setUser(res.data))
        .catch((error) => {
          console.warn("Invalid token or session expired:", error.response?.data || error);
          logout();
        })
        .finally(() => setLoading(false));
    } catch (error) {
      console.error("Error parsing user data, logging out:", error);
      logout();
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await API.post("/users/login", { email, password });
      const responseData = res.data;

      if (!responseData.token) {
        console.error("Invalid login response:", responseData);
        return null;
      }

      // Store token and user info
      localStorage.setItem("token", responseData.token);
      localStorage.setItem("userInfo", JSON.stringify(responseData));
      setUser(responseData);

      return responseData;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    setUser(null);
    setLoading(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
