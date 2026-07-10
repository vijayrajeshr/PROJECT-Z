import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import { useSocket } from './SocketContext.jsx'
const DashboardContext = createContext(null);

export const useDas = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDas must be used within a DashboardProvider');
  }
  return context;
};

export const DashboardProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState(null);
  const [latestNewOrder, setLatestNewOrder] = useState(null);
  const socket = useSocket();
  const fetchProfile = async () => {
    setLoadingProfile(true);
    setProfileError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
      `${serverUrl}/user/get-my-profile`,
        {
        // 🔴 STEP 3: Attach it to the Authorization Header
        headers: {
          Authorization: `Bearer ${token}` 
        }
        }
      );
      setUser(res.data.userData);
      if (!token) {
        setProfileError("Authentication token not found.");
        setLoadingProfile(false);
        return;
      }
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/tiffin/email`,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      if (response.status === 200) {
        setProfile(response.data.data);
      } else {
        setProfileError(`Failed to fetch profile: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setProfileError("Failed to fetch profile. Please try again.");
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (socket && profile && profile._id) {
      const tiffinEntityId = profile._id.toString();

      console.log(`DashboardContext: Attempting to join Socket.IO room: ${tiffinEntityId}`);
      socket.emit('joinEntityRoom', tiffinEntityId);

      const handleNewOrder = (data) => {
        console.log('DashboardContext: New order received via Socket.IO:', data);
        toast.success(`New Order! Order ID: ${data.order._id.substring(0, 8)}... from ${data.order.userId?.username || 'a user'}`);
        setLatestNewOrder(data.order);
    };

    socket.on('newOrder', handleNewOrder);

    return () => {
        console.log(`DashboardContext: Leaving Socket.IO room: ${tiffinEntityId}`);
        socket.emit('leaveEntityRoom', tiffinEntityId);
        socket.off('newOrder', handleNewOrder);
        setLatestNewOrder(null);
      };
    }
  }, [socket, profile]);

  const contextValue = {
    profile,
    loadingProfile,
    profileError,
    fetchProfile,
    setLatestNewOrder,
    latestNewOrder,
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};
