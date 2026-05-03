import { useAuth } from "./auth-hook";
import { Navigate } from "react-router-dom";

function NoLoggedIn({ children }) {
  const { isLoggedIn, loading, user, isLoggedOut } = useAuth();
  if (loading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (isLoggedOut) {
    return <Navigate to="/" replace />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default NoLoggedIn;
