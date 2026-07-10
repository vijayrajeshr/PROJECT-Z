import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const roles = [
  "admin",
  "moderator",
  "kitchenOwner",
  "restaurantOwner",
  "eventCreator",
  "marketingPerson",
];

const DashboardLoginPage = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/user/dashboard-login`,
        { email, role }, // e.g., selectedValue = "ADMIN"
        { withCredentials: true }
      );

      console.log(res, "dashlogin response");

      const { user, restaurants, token } = res.data;
      console.log({ user, restaurants }, "response data");
      // for deployment testing
      localStorage.setItem("token", token);

      // Navigation logic based on role
      switch (user.role.toLowerCase()) {
        case "restaurantowner":
          if (!restaurants || restaurants.length === 0) {
            navigate("/claim-your-restaurant");
          } else {
            navigate(`/dashboard/restaurants/home/${restaurants[0]._id}`);
          }
          break;
        case "kitchenowner":
          navigate("/dashboard/tiffins/home");
          break;
        case "admin":
          navigate("/dashboard/admins/home");
          break;
        case "moderator":
          navigate("/dashboard/moderators/home");
          break;
        case "eventcreator":
          navigate("/dashboard/live-event/home");
          break;
        case "marketingperson":
          navigate("/dashboard/marketing/home");
          break;
        default:
          setError("Invalid role. Please try again.");
          break;
      }
    } catch (err) {
      console.error("Error during login", err);
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-lg space-y-6">
      <h2 className="text-2xl font-semibold text-center">Login</h2>

      {error && <div className="text-red-500 text-sm text-center">{error}</div>}

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Select Role</label>
        <select
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">-- Select a role --</option>
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleLogin}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition"
        disabled={!email || !role}
      >
        Login
      </button>
    </div>
  );
};

export default DashboardLoginPage;
