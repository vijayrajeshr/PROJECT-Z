// // import { useState, useEffect } from "react";
// // import Navbar from "../../Navbars/NavigationBar/NavigationBar";
// // import MobileNavbar from "../../Navbars/MobileNavbar/MobileNavbar";
// // import SearchBar from "../../../utils/SearchBar/SearchBar";
// // import css from "./HomePageBanner.module.css";

// // import banner from "/banners/banner1.jpg";
// // import axios from "axios";

// // let HomePageBanner = ({ loggedIn, user }) => {
// //   const [toogleMenu, setToggleMenu] = useState(true);
// //   const [city, setCity] = useState("Your City");
// //   const [loading, setLoading] = useState(true);

// //   const API_URL = `${import.meta.env.VITE_SERVER_URL}`; // Your backend URL

// //   const getCity = async () => {
// //     try {
// //       const response = await fetch(`${API_URL}/api/location`, {
// //         method: "GET",
// //         headers: {
// //           Accept: "application/json",
// //           "Content-Type": "application/json",
// //         },
// //         credentials: "include",
// //       });

// //       if (!response.ok) {
// //         throw new Error(`HTTP error! status: ${response.status}`);
// //       }

// //       const data = await response.json();
// //       if (data.error) {
// //         throw new Error(data.error);
// //       }
// //       console.log(data, "this is my city name");
// //       setCity(data.city || "Unknown City");
// //     } catch (error) {
// //       console.error("Error fetching city:", error);
// //       setCity("Your City"); // Fallback to a neutral message
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // homepage banner from marketing dashboard
// //   const [FetchBannerImg, setFetchBannerImg] = useState(null);
// //   const [homepageBg, setHomepageBg] = useState(banner);

// //   useEffect(() => {
// //     getCity();

// //     const fetchBanners = async () => {
// //       try {
// //         const response = await axios.get(
// //           `${import.meta.env.VITE_API_PATH}/banners/active`,
// //           { withCredentials: true }
// //         );
// //         const HomePageBanner = response.data
// //           .filter((b) => b.pages.includes("Homepage"))
// //           .filter((b) => b.photoWeb && b.photoWeb.trim() !== "");

// //         console.log(HomePageBanner);
// //         setFetchBannerImg(
// //           HomePageBanner.length > 0 ? HomePageBanner[0].photoWeb : null
// //         );
// //       } catch (err) {
// //         console.log("error while fetching banners: ", err.message);
// //       }
// //     };

// //     fetchBanners();
// //   }, []);

// //   const handleBannerClick = () => {
// //     if (FetchBannerImg) alert("banner image clicked"); // redirect user to offers page when they click on banner
// //   };

// //   useEffect(() => {
// //     if (FetchBannerImg) {
// //       setHomepageBg(FetchBannerImg);
// //     }
// //   }, [FetchBannerImg]);

// //   let toggleBanner = toogleMenu ? (
// //     <div className={css.banner}>
// //       <Navbar
// //         setToggleMenu={setToggleMenu}
// //         toogleMenu={toogleMenu}
// //         loggedIn={loggedIn}
// //         user={user}
// //       />

// //       <div className={css.bannerInner}>
// //         <img
// //           src={homepageBg}
// //           alt="banner"
// //           className={css.bannerImg}
// //           onClick={handleBannerClick}
// //         />

// //         <div
// //           className={`${css.bannerTxt} max-sm:space-y-6 max-sm:max-w-sm max-sm:mt-20 max-md:mt-16 max-md:space-y-4 max-lg:mt-16 max-lg:space-y-4 max-xl:space-y-4 max-xl:mt-14`}
// //         >
// //           <div
// //             className={`${css.title} max-sm:text-5xl max-md:text-6xl max-lg:text-6xl max-xl:text-6xl`}
// //           >
// //             Zomato
// //           </div>
// //           <div
// //             className={`${css.tag} max-sm:text-2xl max-md:text-4xl max-lg:text-4xl max-xl:text-4xl`}
// //           >
// //             Discover the best food & drinks in{" "}
// //             <span className={css.bld}>{loading ? "Loading..." : city}</span>
// //           </div>
// //           <div className={`${css.searchbar} max-sm:max-w-sm`}>
// //             <SearchBar />
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   ) : (
// //     <MobileNavbar setToggleMenu={setToggleMenu} toogleMenu={toogleMenu} />
// //   );

// //   return toggleBanner;
// // };

// // export default HomePageBanner;

// import { useState, useEffect } from "react";
// import Navbar from "../../Navbars/NavigationBar/NavigationBar";
// import MobileNavbar from "../../Navbars/MobileNavbar/MobileNavbar";
// import SearchBar from "../../../utils/SearchBar/SearchBar";
// import css from "./HomePageBanner.module.css"; // Keep for structural CSS

// import defaultBanner from "/banners/banner1.jpg"; // Renamed for clarity
// import axios from "axios";

// let HomePageBanner = ({ loggedIn, user }) => {
//   const [toggleMenu, setToggleMenu] = useState(true);
//   const [city, setCity] = useState("Your City");
//   const [loading, setLoading] = useState(true);
//   const [homepageBg, setHomepageBg] = useState(defaultBanner);
//   const [fetchBannerImg, setFetchBannerImg] = useState(null);

//   const API_URL = import.meta.env.VITE_SERVER_URL;
//   const API_PATH = import.meta.env.VITE_API_PATH;

//   const getCity = async () => {
//     try {
//       const response = await fetch(`${API_URL}/api/location`, {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       if (data.error) {
//         throw new Error(data.error);
//       }
//       console.log(data, "this is my city name");
//       setCity(data.city || "Unknown City");
//     } catch (error) {
//       console.error("Error fetching city:", error);
//       setCity("Your City");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getCity();

//     const fetchBanners = async () => {
//       try {
//         const response = await axios.get(`${API_PATH}/banners/active`, {
//           withCredentials: true,
//         });
//         const activeHomePageBanners = response.data
//           .filter((b) => b.pages.includes("Homepage"))
//           .filter((b) => b.photoWeb && b.photoWeb.trim() !== "");

//         if (activeHomePageBanners.length > 0) {
//           setFetchBannerImg(activeHomePageBanners[0].photoWeb);
//         } else {
//           setFetchBannerImg(null);
//         }
//       } catch (err) {
//         console.error("Error while fetching banners:", err.message);
//         setFetchBannerImg(null);
//       }
//     };

//     fetchBanners();
//   }, []);

//   useEffect(() => {
//     if (fetchBannerImg) {
//       setHomepageBg(fetchBannerImg);
//     } else {
//       setHomepageBg(defaultBanner);
//     }
//   }, [fetchBannerImg]);

//   const handleBannerClick = () => {
//     if (fetchBannerImg) {
//       alert("Banner image clicked! Redirecting to offers page...");
//       // In a real application, use a routing library like react-router-dom:
//       // navigate("/offers");
//     }
//   };

//   return toggleMenu ? (
//     <div className={`${css.banner} h-[60vh] md:h-[70vh] lg:h-[80vh]`}>
//       <Navbar
//         setToggleMenu={setToggleMenu}
//         toggleMenu={toggleMenu}
//         loggedIn={loggedIn}
//         user={user}
//       />

//       <div className={css.bannerImageContainer}>
//         <img
//           src={homepageBg}
//           alt="banner"
//           className={css.bannerImage}
//           onClick={handleBannerClick}
//           style={{ cursor: fetchBannerImg ? "pointer" : "default" }}
//         />
//         <div className={css.bannerOverlay}></div>
//       </div>

//       <div
//         className={`${css.bannerInner} flex flex-col items-center justify-center text-center p-4 flex-grow`}
//       >
//         <div
//           className={`
//             flex flex-col items-center
//             space-y-4 md:space-y-6 lg:space-y-8
//             mt-16 md:mt-20 lg:mt-24
//             max-w-xl lg:max-w-2xl
//           `}
//         >
//           <div
//             className={`
//               text-5xl md:text-6xl lg:text-7xl xl:text-8xl
//               font-bold tracking-tight
//               drop-shadow-lg
//             `}
//           >
//             Zomato
//           </div>
//           <div
//             className={`
//               text-2xl md:text-3xl lg:text-4xl xl:text-5xl
//               font-normal leading-tight
//             `}
//           >
//             Discover the best food & drinks in{" "}
//             <span className={css.bld}>{loading ? "Loading..." : city}</span>
//           </div>
//           <div className="w-full max-w-lg md:max-w-xl lg:max-w-2xl mt-4">
//             <SearchBar />
//           </div>
//         </div>
//       </div>
//     </div>
//   ) : (
//     <MobileNavbar setToggleMenu={setToggleMenu} toggleMenu={toggleMenu} />
//   );
// };

// export default HomePageBanner;

import header_img from "/banners/header_img.png";

import { useState, useEffect } from "react";
import Navbar from "../../Navbars/NavigationBar/NavigationBar";
import MobileNavbar from "../../Navbars/MobileNavbar/MobileNavbar";
import SearchBar from "../../../utils/SearchBar/SearchBar";
import { toast } from "react-toastify";
import { useLocation } from "../../../context/locationContext.jsx";
import { FaChevronDown } from "react-icons/fa";

import axios from "axios";

const HomePageBanner = ({ loggedIn, user }) => {
  const [toggleMenu, setToggleMenu] = useState(true);
  const [city, setCity] = useState("Your City");
  const [loading, setLoading] = useState(true);

  const API_URL = `${import.meta.env.VITE_SERVER_URL}`;

  // const getCity = async () => {
  //   try {
  //     const response = await fetch(`${API_URL}/api/location`, {
  //       method: "GET",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //       },
  //       credentials: "include",
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     if (data.error) {
  //       throw new Error(data.error);
  //     }
  //     setCity(data.city || "Unknown City");
  //   } catch (error) {
  //     console.error("Error fetching city:", error);
  //     toast.error("Error Fetching City..!");
  //     setCity("Your City"); // Fallback to a neutral message
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const { currentLocation, isLoading: isLocationLoading } = useLocation();

  const [fetchBannerImg, setFetchBannerImg] = useState(null);
  const [homepageBg, setHomepageBg] = useState(header_img);

  useEffect(() => {
    // getCity();

    const fetchBanners = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_PATH}/banners/active`,
          { withCredentials: true }
        );
        const HomePageBannerData = response.data
          .filter((b) => b.pages.includes("Homepage"))
          .filter((b) => b.photoWeb && b.photoWeb.trim() !== "");

        setFetchBannerImg(
          HomePageBannerData.length > 0 ? HomePageBannerData[0].photoWeb : null
        );
      } catch (err) {
        console.log("Error while fetching banners:", err.message);
      }
    };

    fetchBanners();
  }, []);

  // const handleBannerClick = () => {
  //   if (fetchBannerImg) {
  //     alert("Banner image clicked!"); // redirect user to offers page when they click on banner
  //     // In a real app, you'd use something like react-router-dom's navigate:
  //     // import { useNavigate } from 'react-router-dom';
  //     // const navigate = useNavigate();
  //     // navigate('/offers');
  //   }
  // };

  /*const handleBannerClick = () => {
    if (fetchBannerImg) {
      alert("Banner image clicked!"); // redirect user to offers page when they click on banner
      // In a real app, you'd use something like react-router-dom's navigate:
      // import { useNavigate } from 'react-router-dom';
      // const navigate = useNavigate();
      // navigate('/offers');
    }
  };
     */
  useEffect(() => {
    if (fetchBannerImg) {
      setHomepageBg(fetchBannerImg);
    }
  }, [fetchBannerImg]);

  const handleScrollDown = () => {
    window.scrollBy({
      top: window.innerHeight - 80, // Scroll down by roughly viewport height
      behavior: "smooth",
    });
  };

  return toggleMenu ? (
    // Outer container for the entire page, providing a relative context
    // This allows Navbar and the banner background to be siblings and thus layer correctly.
    <div className="relative w-full min-h-screen flex flex-col">
      {/* Navbar positioned at the very top. Give it a high z-index to ensure it's always clickable. */}
      {/* If your Navbar component internally uses `position: fixed` or `position: sticky`,
          it will automatically be on top of most content.
          However, explicitly adding a high z-index here or inside Navbar.jsx is a good failsafe. */}
      <Navbar
        setToggleMenu={setToggleMenu}
        toggleMenu={toggleMenu}
        loggedIn={loggedIn}
        user={user}
      />

      {/* This div will hold the banner background and the central content (Zomato title, tagline, search bar) */}
      {/* It should NOT have the onClick={handleBannerClick} directly on it
          if you want Navbar elements to be clickable. */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat flex flex-col items-center justify-start"
        style={{ backgroundImage: `url(${homepageBg})` }}
      >
        {/* Overlay for text readability, sits on top of the background image */}
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

        {/* Banner Content (Zomato title, tagline, search bar) - make sure it's above the overlay */}
        {/* Adjusted padding top values using arbitrary values for better compatibility.
            You might need to fine-tune these pixel values to match your design.
            The values are just examples for common screen sizes. */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-grow text-center px-4 pt-20 pb-24">
          {/* Zomato Title */}
          <h1 className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-6 drop-shadow-lg tracking-wide">
            Zomato
          </h1>

          {/* Tagline */}
          <p className="text-white text-lg sm:text-xl md:text-2xl lg:text-4xl font-medium mb-8 max-w-4xl drop-shadow-md">
            Discover the best food & drinks in{" "}
            <span className="font-extrabold">
              {isLocationLoading
                ? "Loading..."
                : currentLocation?.address?.split(",")[0] || "your area"}
            </span>
          </p>
          {/* Search Bar - Increased width */}
          {/* Search Bar - Increased width */}
          <div className="relative z-50 w-full max-w-xs sm:max-w-md md:max-w-xl lg:max-w-3xl px-4 transition-all duration-300 ease-in-out hover:scale-105">
            <SearchBar />
          </div>

          {/* Scroll Down Button */}
          <div className="absolute bottom-8 w-full flex justify-center pb-10 z-0">
            <button
              onClick={handleScrollDown}
              className="animate-bounce flex items-center gap-2 text-white cursor-pointer hover:text-gray-200 transition-colors"
              aria-label="Scroll Down"
            >
              <span className="text-xl font-medium">Scroll down</span>
              <FaChevronDown size={24} />
            </button>
          </div>
        </div>

        {/* Optional: A separate, transparent div for the banner click if you want the background to be clickable.
            This div should have a z-index higher than the overlay but lower than the Navbar.
            Ensure it doesn't overlap with the Navbar itself. */}
        {/* {fetchBannerImg && (
       {/* {fetchBannerImg && (
          <div
            className="absolute inset-0 z-[1] cursor-pointer"
            onClick={handleBannerClick}
          ></div>
        )} */}
      </div>
    </div>
  ) : (
    <MobileNavbar setToggleMenu={setToggleMenu} toggleMenu={toggleMenu} />
  );
};

export default HomePageBanner;
