// frontend/src/context/OutletContext.jsx
import React, { createContext, useState, useContext } from "react";
import axios from "axios";

const axiosApi = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
});

// Create the context
export const OutletContext = createContext({
  outletInfo: null,
  setOutletInfo: () => {},
  axiosApi: null,
});

// Provider component
export function OutletProvider({ children }) {
  const [outletInfo, setOutletInfo] = useState({
    name: "",
    resId: "",
    address: "",
  });

  return (
    <OutletContext.Provider value={{ outletInfo, setOutletInfo, axiosApi }}>
      {children}
    </OutletContext.Provider>
  );
}

export const useContextData = () => useContext(OutletContext);
