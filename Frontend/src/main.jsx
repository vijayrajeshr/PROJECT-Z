import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { OutletProvider } from "./context/OutletContext";
import EmailDataInfo from "./context/EmmailDataInfo";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartCotent";
import { UserProvider } from './context/userContent.jsx';
import {SocketProvider} from "./context/SocketContext.jsx";
import {DashboardProvider} from "./context/TiffinDashboardContext.jsx";
import {AdminContextProvider} from "./context/AdminDashboardContext.jsx";
import {UserProviderNotify}from "./context/userNotificationContext.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <BrowserRouter>
    <OutletProvider>
      <AuthProvider>
        <EmailDataInfo>
          <CartProvider>
            <UserProvider>
              <SocketProvider>
                <DashboardProvider>
                  <AdminContextProvider>
                    <UserProviderNotify>
                        <App />
                    </UserProviderNotify>
                  
                  </AdminContextProvider>
                  
                </DashboardProvider>
                
              </SocketProvider>
              
            </UserProvider>
          
          </CartProvider>
          
        </EmailDataInfo>
      </AuthProvider>
    </OutletProvider>
  </BrowserRouter>
  // </React.StrictMode>
);
