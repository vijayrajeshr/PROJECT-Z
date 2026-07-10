import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";
import { useSocket } from "./SocketContext";
import {toast }from "react-toastify"
const UserContext = createContext(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserContext.Provider");
  }
  return context;
};

export const UserProviderNotify = ({ children }) => {
  const socket = useSocket();
  const [user, setUser] = useState(null);

  const [notification, setNotification] = useState("");

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/user`, { withCredentials: true });
      console.log(response.data);
      if (response.status === 200) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("Error fetching user in UserProviderNotify:", error); // Use console.error for errors
      setUser(null); 
    }
  };

  useEffect(() => {
    fetchUser();
  }, []); // Run once on mount

  useEffect(() => {
    if (socket && user && user.id) {
      socket.emit('joinUserNotification', user.id);
      console.log(`Attempting to join user notification channel for user ID: ${user.id}`);
        
        const handleUserNotification=(data)=>{
            toast.info(data.message);
            console.log(data);
        }


      socket.on('userNotification',handleUserNotification);
      return () => {
        console.log(`Cleaning up for user ID: ${user.id}`);
        socket.off('userNotification');
      };
    }
  }, [socket, user]);

  const data = {
    notification,
    setNotification,
    // If other components might need the user object, expose it here
    currentUser: user,
  };

  return (
    <>
      <UserContext.Provider value={data}>
        {children}
      </UserContext.Provider>
    </>
  );
};