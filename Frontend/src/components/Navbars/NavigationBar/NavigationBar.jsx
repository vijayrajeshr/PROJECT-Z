import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import menuBar from "/icons/menu.png";
import downArrow from "/icons/down-arrow.png";
import profilePic from "/images/profilepic.jpg";

import Login from "../../Auth/Login/Login";
import Signup from "../../Auth/Signup/Signup";

import css from "./NavigationBar.module.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

let NavigationBar = ({ toogleMenu, setToggleMenu, page, helpText }) => {
  let [menuDisplay, setMenuDisplay] = useState(false);
  const { user, loading, loggedIn, setAuth, auth } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [hamburgerMenuOpen, setHamburgerMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [profilePhoto, setProfilePhoto] = useState(() => {
    const savedPhoto = localStorage.getItem("userProfilePhoto");
    return savedPhoto || profilePic;
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const logoutHandler = () => {
    window.open(`${import.meta.env.VITE_SERVER_URL}/api/logout`, "_self", {
      withCredentials: true,
    });
    sessionStorage.clear();
    localStorage.removeItem("userProfileData");
  };

  const HamburgerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  );

  return (
    <>
      <nav className={`${css.navbar} ${isScrolled ? css.scrolled : ""}`}>
        <div className={css.navbarInner}>
          {/* Left Side: Dynamic Logo/Text */}
          <div className={css.leftSide}>
            {isScrolled ? (
              <a href="#get-app" className={css.getAppTxt}>
                Get the app
              </a>
            ) : (
              <Link to="/" className={css.logoTxt}>
                Project-Z
              </Link>
            )}
          </div>

          {/* Right Side: Links and Auth */}
          <div className={css.rightSide}>
            {helpText && <div className={css.helpText}>{helpText}</div>}

            {/* Desktop Nav Links - Order depends on scroll state */}
            <div className={css.desktopNavLinks}>
              {!isScrolled ? (
                <>
                  <Link to="/add-restaurant" className={css.menuItem}>
                    Add Restaurant
                  </Link>
                  <div
                    className={css.menuItem}
                    onClick={() =>
                      setAuth({ closed: false, login: true, signup: false })
                    }
                  >
                    Log In
                  </div>
                  <Link to="/dashboard-login" className={css.menuItem}>
                    Dashboard Login
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/add-restaurant" className={css.menuItem}>
                    Add Restaurant
                  </Link>
                  <Link to="/dashboard-login" className={css.menuItem}>
                    Dashboard Login
                  </Link>
                  <div
                    className={css.menuItem}
                    onClick={() =>
                      setAuth({ closed: false, login: true, signup: false })
                    }
                  >
                    Log In
                  </div>
                </>
              )}
            </div>

            {/* Mobile Hamburger Logic */}
            <div className={css.hamburgerContainer}>
              <button
                className={css.hamburgerButton}
                onClick={() => setHamburgerMenuOpen((prev) => !prev)}
              >
                <HamburgerIcon />
              </button>
              {hamburgerMenuOpen && (
                <div className={css.hamburgerMenu}>
                  <a
                    href="#get-app"
                    className={css.hamburgerMenuItem}
                    onClick={() => setHamburgerMenuOpen(false)}
                  >
                    Get the app
                  </a>
                  <Link
                    to="/add-restaurant"
                    className={css.hamburgerMenuItem}
                    onClick={() => setHamburgerMenuOpen(false)}
                  >
                    Add Restaurant
                  </Link>
                  <Link
                    to="/dashboard-login"
                    className={css.hamburgerMenuItem}
                    onClick={() => setHamburgerMenuOpen(false)}
                  >
                    Dashboard Login
                  </Link>
                  {!loggedIn && (
                    <>
                      <div
                        className={css.hamburgerMenuItem}
                        onClick={() => {
                          setAuth({
                            closed: false,
                            login: true,
                            signup: false,
                          });
                          setHamburgerMenuOpen(false);
                        }}
                      >
                        Log In
                      </div>
                      <div
                        className={css.hamburgerMenuItem}
                        onClick={() => {
                          setAuth({
                            closed: false,
                            login: false,
                            signup: true,
                          });
                          setHamburgerMenuOpen(false);
                        }}
                      >
                        Sign Up
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* User Profile or Auth Buttons */}
            {loggedIn ? (
              <div className={css.profileContainer}>
                <div
                  className={css.profile}
                  onClick={() => setMenuDisplay((val) => !val)}
                >
                  <img
                    src={profilePhoto}
                    alt="profile pic"
                    className={css.profilePic}
                  />
                  <div className={css.profileName}>{user}</div>
                  <img src={downArrow} alt="arrow" className={css.arrow} />
                </div>
                {menuDisplay && (
                  <div className={css.menu}>
                    <Link
                      to="/user/ll/reviews"
                      className={css.menuItemLinkTxt}
                      onClick={() => setMenuDisplay(false)}
                    >
                      <div className={css.menuItemLink}>Profile</div>
                    </Link>
                    <Link
                      to="/user/ll/reviews"
                      className={css.menuItemLinkTxt}
                      onClick={() => setMenuDisplay(false)}
                    >
                      <div className={css.menuItemLink}>Reviews</div>
                    </Link>
                    <div
                      className={css.menuItemLinkTxt}
                      onClick={() => {
                        logoutHandler();
                        setMenuDisplay(false);
                      }}
                    >
                      <div className={css.menuItemLink}>Logout</div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className={css.desktopAuthButtons}>
                <div
                  className={css.signupBtn}
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
      </nav>

      {/* Auth Modals - Moved outside to avoid transform issues */}
      <div className={css.modals}>
        {!auth.closed && auth.login && <Login setAuth={setAuth} />}
        {!auth.closed && auth.signup && <Signup setAuth={setAuth} />}
      </div>
    </>
  );
};

export default NavigationBar;
