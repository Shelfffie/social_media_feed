import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useConfirm } from "./alertContext";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const { confirm } = useConfirm();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/un/auth-status",
          {
            withCredentials: true,
          }
        );
        if (response.data.auth) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const LogOut = async () => {
    const ok = await confirm({
      title: "Вийти з облікового запису?",
    });

    if (ok) {
      try {
        setIsLoggedOut(true);
        await axios.post(
          "http://localhost:5000/un/logout",
          {},
          { withCredentials: true }
        );
        navigate("/");
        setUser(null);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setIsLoggedOut(false);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        isLoggedIn: !!user,
        LogOut,
        isLoggedOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
