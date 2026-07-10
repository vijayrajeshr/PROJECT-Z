import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

import menuBar from "/icons/menu.png";
import downArrow from "/icons/down-arrow.png";
import profilePic from "/images/profilepic.jpg";
import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartCotent";
import SearchBar from "../../../utils/SearchBar/SearchBar";
import Login from "../../Auth/Login/Login";
import Signup from "../../Auth/Signup/Signup";
import Cart from "../../../pages/Cart/Cart";

export const cartUpdateEvent = new Event("cartUpdate");
export const profilePhotoUpdateEvent = new CustomEvent("profilePhotoUpdate");

let NavigationBar = () => {
  const [menuDisplay, setMenuDisplay] = useState(false);
  const [toggleMenu, setToggleMenu] = useState(false); // 👈 add this line
  const { user, loggedIn, setAuth, auth, profileData, setProfileData } =
    useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const { cartCount } = useCart();
  const [profilePhoto, setProfilePhoto] = useState(() => {
    const savedPhoto = localStorage.getItem("userProfilePhoto");
    return savedPhoto || profilePic;
  });

  useEffect(() => {
    const updateProfilePhoto = () => {
      const savedPhoto = localStorage.getItem("userProfilePhoto");
      setProfilePhoto(savedPhoto || profilePic);
    };

    window.addEventListener("profilePhotoUpdate", updateProfilePhoto);
    window.addEventListener("storage", (e) => {
      if (e.key === "userProfilePhoto") updateProfilePhoto();
    });

    return () => {
      window.removeEventListener("profilePhotoUpdate", updateProfilePhoto);
      window.removeEventListener("storage", updateProfilePhoto);
    };
  }, []);

  useEffect(() => {
    const updateProfileData = () => {
      const saved = localStorage.getItem("userProfileData");
      if (saved) setProfileData(JSON.parse(saved));
    };
    window.addEventListener("storage", updateProfileData);
    return () => window.removeEventListener("storage", updateProfileData);
  }, []);

  const logoutHandler = () => {
    window.open(`${import.meta.env.VITE_SERVER_URL}/api/logout`, "_self", {
      withCredentials: true,
    });
    localStorage.removeItem("userProfileData"); // Add this line
    sessionStorage.clear();
  };

  return (
    <>
      <div className="relative w-full border-b h-auto z-[80] bg-white">
        <div className="flex items-center justify-between max-w-[1400px] mx-auto px-5 py-2">
          {/* Left - Text Link */}
          <div className="flex items-center">
            <a
              href="#get-app"
              className="text-[#ff7e33] font-semibold text-[1.15rem] no-underline whitespace-nowrap"
            >
              Get the app
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden block"
            onClick={() => setToggleMenu(!toggleMenu)}
          >
            <img src={menuBar} alt="menu" className="w-6 h-6" />
          </button>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 mx-4">
            <SearchBar />
          </div>

          {/* Right Side - Desktop */}
          <div className="hidden md:flex items-center gap-4 whitespace-nowrap">
            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center bg-transparent border-0 cursor-pointer p-0"
            >
              <ShoppingCart className="text-gray-500 mr-2 cursor-pointer" />
              {cartCount > 0 && (
                <span className="absolute -top-2 right-1 bg-red-500 text-white text-xs font-bold min-w-[16px] h-[16px] rounded-full flex items-center justify-center px-[2px]">
                  {cartCount}
                </span>
              )}
            </button>

            {loggedIn ? (
              <div className="relative">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => setMenuDisplay((val) => !val)}
                >
                  <img
                    src={profilePhoto}
                    alt="profile pic"
                    className="w-[35px] h-[35px] rounded-full"
                  />
                  <div className="mx-2 max-w-[120px] truncate hidden sm:block">
                    {user || "User"}
                  </div>
                  <img
                    src={downArrow}
                    alt="arrow"
                    className="hidden sm:block w-4 h-4"
                  />
                </div>

                {/* Dropdown */}
                {menuDisplay && (
                  <div className="absolute top-14 right-0 w-40 bg-white rounded-lg shadow-md z-50">
                    <Link
                      to="/user/ll/reviews"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-t-lg"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/user/ll/notifications"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Notifications
                    </Link>
                    <Link
                      to="/user/ll/reviews"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Reviews
                    </Link>
                    <div
                      onClick={logoutHandler}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-b-lg cursor-pointer"
                    >
                      Logout
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <Link
                  to="/add-restaurant"
                  className="text-gray-700 font-medium no-underline hover:text-black"
                >
                  Add Restaurant
                </Link>
                <Link
                  to="/dashboard-login"
                  className="text-gray-700 font-medium no-underline hover:text-black"
                >
                  Dashboard Login
                </Link>
                <div
                  className="text-gray-700 font-medium cursor-pointer hover:text-black"
                  onClick={() =>
                    setAuth({ closed: false, login: true, signup: false })
                  }
                >
                  Log In
                </div>
                <div
                  className="bg-[#ff7e33] text-white px-8 py-2.5 rounded-full font-bold cursor-pointer hover:bg-[#e66b26] transition-all"
                  onClick={() =>
                    setAuth({ closed: false, login: false, signup: true })
                  }
                >
                  Sign Up
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {toggleMenu && (
          <div className="flex flex-col items-start gap-4 px-5 py-3 md:hidden bg-gray-50 border-t">
            {/* Search on Mobile */}
            <SearchBar />

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center bg-transparent border-0 cursor-pointer"
            >
              <ShoppingCart className="text-gray-500 mr-2 cursor-pointer" />
              {cartCount > 0 && (
                <span className="absolute -top-2 right-1 bg-red-500 text-white text-xs font-bold min-w-[16px] h-[16px] rounded-full flex items-center justify-center px-[2px]">
                  {cartCount}
                </span>
              )}
              <span className="ml-1">Cart</span>
            </button>

            {/* Auth / Profile */}
            {loggedIn ? (
              <>
                <Link to="/user/ll/reviews" className="text-gray-700">
                  Profile
                </Link>
                <Link to="/user/ll/notifications" className="text-gray-700">
                  Notifications
                </Link>
                <Link to="/user/ll/reviews" className="text-gray-700">
                  Reviews
                </Link>
                <div
                  onClick={logoutHandler}
                  className="text-gray-700 cursor-pointer"
                >
                  Logout
                </div>
              </>
            ) : (
              <>
                <div
                  className="text-gray-700 cursor-pointer"
                  onClick={() =>
                    setAuth({ closed: false, login: true, signup: false })
                  }
                >
                  Log in
                </div>
                <div
                  className="text-gray-700 cursor-pointer"
                  onClick={() =>
                    setAuth({ closed: false, login: false, signup: true })
                  }
                >
                  Sign up
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Auth Modals - Moved outside to prevent clipping */}
      <div>
        {!auth.closed && auth.login && <Login setAuth={setAuth} />}
        {!auth.closed && auth.signup && <Signup setAuth={setAuth} />}
      </div>
    </>
  );
};

export default NavigationBar;