import { useEffect, useState, useContext, createContext } from "react";
import axios from "axios";
import { useSocket } from "./SocketContext";
import { toast } from "react-toastify";

const Admin = createContext(null);

export const useAdmin = () => {
  const context = useContext(Admin);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminContextProvider");
  }
  return context;
};

export const AdminContextProvider = ({ children }) => {
  const [type, setType] = useState('');
  const [latestOrder, setLatestOrder] = useState(null);

  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      socket.emit("admin_alerts");

      const handleNotification = (data) => {
        toast.success(data.message);
      };

      const handleOrders = (data) => {
        setType(data.orderType);
        setLatestOrder(data.order);
        toast.success(data.message || `New ${data.orderType} order received!`);
      };

      socket.on('newNotification', handleNotification);
      socket.on('newOrder', handleOrders);

      return () => {
        socket.off("newNotification", handleNotification);
        socket.off("newOrder", handleOrders);
        setType('');
        setLatestOrder(null);
      };
    }
  }, [socket]);

  const data = {
    type,
    setType,
    latestOrder,
    setLatestOrder,
  };

  return (
    <Admin.Provider value={data}>
      {children}
    </Admin.Provider>
  );
};