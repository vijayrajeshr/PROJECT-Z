import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, loading, setAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) {
      // Navigate to home page first
      navigate("/");

      // Activate the login modal
      setAuth({ closed: false, login: true, signup: false });
    }
  }, [user, loading, navigate, setAuth]);

  if (loading) return <p>Loading...</p>;

  return user ? children : null;
};

export default ProtectedRoute;
