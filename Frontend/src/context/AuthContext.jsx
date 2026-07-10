import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize all required state variables
  const [user, setUser] = useState(null);
  const [userId,setUserId]=useState('');
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [profileData, setProfileData] = useState(() => {
    const saved = localStorage.getItem("userProfileData");
    return saved ? JSON.parse(saved) : {};
  });
  const [auth, setAuth] = useState({
    closed: true,
    login: false,
    signup: false,
  });

  // Fetch authenticated user on app load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/user`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        console.log(data);
        if (data.user) {
          const savedData = localStorage.getItem("userProfileData");
          const existingData = savedData ? JSON.parse(savedData) : {};

          // Prioritize existing profile data over server data
          const updatedData = {
            username: data.user.username,
            email: data.user.email,
            fullName:
              existingData.fullName || data.user.fullName || data.user.username,
            profileImage:
              existingData.profileImage || data.user.profileImage || "",
            coverImage: existingData.coverImage || data.user.coverImage || "",
          };

          // Update state with merged data
          setUser(data.user.username);
          setProfileData(updatedData);
          setUserId(data.user?.id || data?.user?._id);
          setLoggedIn(true);

          // Ensure profile data is saved in localStorage
          if (!savedData) {
            localStorage.setItem(
              "userProfileData",
              JSON.stringify(updatedData)
            );
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        loggedIn,
        setAuth,
        auth,
        profileData,
        setProfileData,
        userId
      }}

    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
