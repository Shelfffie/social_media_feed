import { useAuth } from "./auth-hook";
import { Navigate } from "react-router-dom";

function RedirectAuth({ children }) {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RedirectAuth;
