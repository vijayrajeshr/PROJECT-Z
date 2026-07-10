import { useEffect, useRef, useState, createContext, useContext } from "react";
import io from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socketRef.current) {
      const newSocket = io(`${import.meta.env.VITE_SERVER_URL}`);
      socketRef.current = newSocket;

      newSocket.on("connect", () => {
        console.log('Socket.IO connected successfully with ID:', newSocket.id);
        setIsConnected(true);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket.IO connection error:', error);
        setIsConnected(false);
      });

      newSocket.on('disconnect', (reason) => {
        console.log('Socket.IO disconnected:', reason);
        setIsConnected(false);
      });

      newSocket.on('error', (error) => {
        console.error('Socket.IO general error:', error);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        console.log('Socket disconnected on cleanup');
      }
    };
  }, []);

  const contextValue = socketRef.current;

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};