import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ Correct usage

export default function RestaurantDashboardProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // Check if token is missing
  if (!token) {
    return <Navigate to="/unauthorized" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // in seconds

    if (decoded.exp < currentTime) {
      // Token is expired
      localStorage.removeItem("token"); // Optional: clear token
      return <Navigate to="/dashboard-login" replace />;
    }

    return children;
  } catch (err) {
    // Invalid token format
    localStorage.removeItem("token");
    return <Navigate to="/dashboard-login" replace />;
  }
}
