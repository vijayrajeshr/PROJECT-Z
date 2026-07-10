import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userId, setUserId] = useState("");
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoadingUser(true);

      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/api/dashboard/profile`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
          );
          console.log(response.data.userData, "getting dah dat");
          setUser(response.data.userData);
          setUserId(response.data.userData._id);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          localStorage.removeItem("token");
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoadingUser(false);
    };

    fetchUserProfile();
  }, []);

  const updateUserProfile = (newUserData) => {
    setUser((prevUser) => ({ ...prevUser, ...newUserData }));
  };

  return (
    <UserContext.Provider
      value={{ userId, user, setUser, loadingUser, updateUserProfile }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
