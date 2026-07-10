// import React, { useState, useRef, useEffect } from "react";
// import {
//   HiOutlineSearch,
//   HiOutlineBell,
//   HiOutlineUserCircle,
// } from "react-icons/hi";
// import { outletData } from "../../data/RestaurentDasData/dummy";
// import Axios from "axios";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import axios from "axios";
// import { useUser } from "../../context/userContent";
// export default function TopNav() {
//   const navigate = useNavigate();
//   const { DashboardloggedIn, dashboarduserprofiledata } = useAuth();
//   const [showProfileDropdown, setShowProfileDropdown] = useState(false);
//   const [showNotificationsDropdown, setShowNotificationsDropdown] =
//     useState(false);
//   const [count, setCount] = useState(null);
//   const [menudata, setMenuData] = useState([]);
//   const [searchQuery, setSearchQuery] = useState(""); // State for search input
//   const [filteredItems, setFilteredItems] = useState([]); // State for filtered items
//   const profileRef = useRef(null);
//   const notificationRef = useRef(null);
//   const searchRef = useRef(null); // Ref for search dropdown
//   const { id } = useParams();
//   const token = localStorage.getItem("token");

//   const { userId, user } = useUser();
//   // Handle clicks outside dropdowns
//   const handleClickOutside = (event) => {
//     if (profileRef.current && !profileRef.current.contains(event.target)) {
//       setShowProfileDropdown(false);
//     }
//     if (
//       notificationRef.current &&
//       !notificationRef.current.contains(event.target)
//     ) {
//       setShowNotificationsDropdown(false);
//     }
//     if (searchRef.current && !searchRef.current.contains(event.target)) {
//       setSearchQuery(""); // Clear search to hide dropdown
//       setFilteredItems([]);
//     }
//   };

//   // Fetch notifications and add event listener for clicks outside
//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);
//     Axios.get(`${import.meta.env.VITE_SERVER_URL}/notify/admin`, {
//       headers: { Authorization: `Bearer ${token}` },
//       withCredentials: true,
//     })
//       .then((response) => {
//         if (Array.isArray(response.data.data)) {
//           setCount(response.data?.data.length);
//         } else {
//           setCount(0);
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//       });

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // Fetch menu data
//   useEffect(() => {
//     const fetchSubcategories = async () => {
//       try {
//         const response = await axios.get(
//           `${
//             import.meta.env.VITE_SERVER_URL
//           }/firm/restaurants/dashboard/menu-sections-items/${id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//             withCredentials: true,
//           }
//         );
//         const menuSections = response.data || [];
//         setMenuData(menuSections.menuSections);
//       } catch (error) {
//         console.error("Error fetching subcategories:", error);
//       }
//     };
//     fetchSubcategories();
//   }, [id]);

//   // Filter items based on search query
//   useEffect(() => {
//     if (searchQuery.trim() === "") {
//       setFilteredItems([]);
//       return;
//     }

//     const filtered = menudata?.flatMap((menu) =>
//       menu?.sections.flatMap((section) =>
//         section.items
//           .filter((item) =>
//             item.name.toLowerCase().includes(searchQuery.toLowerCase())
//           )
//           .map((item) => ({
//             ...item,
//             sectionName: section.sectionName,
//             tabName: menu.tabName,
//           }))
//       )
//     );

//     setFilteredItems(filtered);
//   }, [searchQuery, menudata]);

//   const logoutHandler = () => {
//     localStorage.removeItem("token");
//     navigate("/dashboard-login");
//   };

//   return (
//     <div className="flex items-center justify-between bg-gray-100 text-gray-600 shadow px-6 py-4 z-10">
//       <div className="relative w-2/4" ref={searchRef}>
//         <HiOutlineSearch size={20} className="absolute top-2 left-2" />
//         <input
//           type="text"
//           placeholder="Search items, categories, item name"
//           className="pl-10 pr-3 py-2 w-full rounded border border-gray-300 focus:outline-none focus:border-blue-300"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//         {/* Search Results Dropdown */}
//         {filteredItems.length > 0 && searchQuery && (
//           <div className="absolute left-0 right-0  mt-2 bg-white border border-gray-200 shadow-lg rounded-lg max-h-72 overflow-y-auto z-20">
//             {filteredItems.map((item) => (
//               <Link
//                 to={
//                   item?.serviceType?.includes("Dine-in")
//                     ? `/dine-in-menu/${id}`
//                     : `/delivery-menu/${id}`
//                 }
//                 key={item.id}
//                 className="px-4 py-2  hover:bg-gray-100 cursor-pointer flex justify-between items-center"
//                 onClick={() => {
//                   // Optionally navigate to item details or perform action
//                   setSearchQuery("");
//                   setFilteredItems([]);
//                 }}
//               >
//                 <div className="">
//                   <p className="font-semibold">{item.name}</p>
//                   <p className="text-sm text-gray-500">
//                     {item.sectionName} - {item.tabName}
//                   </p>
//                   {item?.description && (
//                     <p className="text-sm">
//                       {item.description?.slice(0, 30) + "..."}
//                     </p>
//                   )}
//                   <div className=" flex gap-2 mt-2">
//                     {item.serviceType?.includes("Dine-in") && (
//                       <div className="flex items-center gap-2 bg-blue-50 px-2  rounded-md border border-blue-200">
//                         {/* <MdOutlineDeliveryDining size={20} className="text-blue-500" /> */}
//                         {/* <MdOutlineDining size={18} className="text-blue-500" /> */}
//                         <span className="text-blue-500 text-sm">Dine-in</span>
//                       </div>
//                     )}

//                     {/* Takeaway */}
//                     {item.serviceType?.includes("Takeaway") && (
//                       <div className="flex items-center gap-2 bg-yellow-50 px-2 rounded-md border border-yellow-200">
//                         {/* <TbPackage size={18} className="text-yellow-500" /> */}
//                         <span className="text-yellow-500 text-sm">
//                           Takeaway
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//                 <p className="text-blue-500 font-semibold">${item.price}</p>
//               </Link>
//             ))}
//           </div>
//         )}
//       </div>

//       <div className="flex items-center gap-4">
//         <div ref={notificationRef} className="relative">
//           <HiOutlineBell
//             size={24}
//             className="cursor-pointer hover:text-blue-500"
//             onClick={() => navigate(`/notifications/${id}`)}
//           />
//           <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs font-bold px-1 rounded-full">
//             {count > 0 ? count : "-1"}
//           </span>
//         </div>

//         {token && (
//           <div ref={profileRef} className="relative">
//             <HiOutlineUserCircle
//               size={24}
//               className="cursor-pointer hover:text-blue-500"
//               onClick={() => setShowProfileDropdown(!showProfileDropdown)}
//             />
//             {showProfileDropdown && (
//               <div className="absolute right-0 w-72 p-4 mt-2 bg-white text-gray-800 border border-gray-200 shadow-xl rounded-xl z-50">
//                 <div className="flex flex-col items-center text-center">
//                   <img
//                     src={
//                       "https://ui-avatars.com/api/?name=Restaurant&background=ddd&color=333"
//                     }
//                     alt="Restaurant"
//                     className="w-24 h-24 rounded-full mb-3 object-cover border"
//                   />
//                   <h3 className="text-lg font-semibold">
//                     {outletData?.name || "Your Restaurant"}
//                   </h3>
//                   <p className="text-sm text-gray-600 mb-1">
//                     Owner: {user?.username}
//                   </p>
//                   <p className="text-sm text-gray-600">Email: {user?.email}</p>

//                   <button
//                     onClick={logoutHandler}
//                     className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useState, useRef, useEffect } from "react";
import {
  HiOutlineSearch,
  HiOutlineBell,
  HiOutlineUserCircle,
} from "react-icons/hi";
import { outletData } from "../../data/RestaurentDasData/dummy";
import Axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { useUser } from "../../context/userContent";
import { useSearch } from "../../context/SearchContext";

export default function TopNav() {
  const navigate = useNavigate();
  const { DashboardloggedIn, dashboarduserprofiledata } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] =
    useState(false);
  const [count, setCount] = useState(null);
  const [menudata, setMenuData] = useState([]);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const searchRef = useRef(null); // Ref for search dropdown
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const { userId, user } = useUser();
  // Add this line to extract searchQuery and setSearchQuery from useSearch hook
  const { searchQuery, setSearchQuery } = useSearch();

  
  // Handle clicks outside dropdowns
  const handleClickOutside = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setShowProfileDropdown(false);
    }
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target)
    ) {
      setShowNotificationsDropdown(false);
    }
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      // We'll keep this but remove setFilteredItems since we're using context
      setSearchQuery("");
    }
  };

  // Fetch notifications and add event listener for clicks outside
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    Axios.get(`${import.meta.env.VITE_SERVER_URL}/notify/admin`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    })
      .then((response) => {
        if (Array.isArray(response.data.data)) {
          setCount(response.data?.data.length);
        } else {
          setCount(0);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch menu data
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_URL
          }/firm/restaurants/dashboard/menu-sections-items/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        const menuSections = response.data || [];
        setMenuData(menuSections.menuSections);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };
    fetchSubcategories();
  }, [id]);

  // Filter items based on search query
  // Remove or comment out the useEffect for filtering items as it will be handled by the context
  // useEffect(() => {
  //   if (searchQuery.trim() === "") {
  //     setFilteredItems([]);
  //     return;
  //   }
  //   const filtered = menudata?.flatMap((menu) =>
  //     menu?.sections.flatMap((section) =>
  //       section.items
  //         .filter((item) =>
  //           item.name.toLowerCase().includes(searchQuery.toLowerCase())
  //         )
  //         .map((item) => ({
  //           ...item,
  //           sectionName: section.sectionName,
  //           tabName: menu.tabName,
  //         }))
  //     )
  //   );
  //   setFilteredItems(filtered);
  // }, [searchQuery, menudata]);

  const logoutHandler = () => {
    localStorage.removeItem("token");
    navigate("/dashboard-login");
  };

  return (
    <div className="flex items-center justify-between bg-gray-100 text-gray-600 shadow px-6 py-4 z-10">
      <div className="relative w-2/4" ref={searchRef}>
        <HiOutlineSearch size={20} className="absolute top-2 left-2" />
        <input
          type="text"
          placeholder="Search by heading, subheading, or item name"
          className="pl-10 pr-3 py-2 w-full rounded border border-gray-300 focus:outline-none focus:border-blue-300"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {/* You can keep the dropdown for search results if needed */}
      </div>

      <div className="flex items-center gap-4">
        <div ref={notificationRef} className="relative">
          <HiOutlineBell
            size={24}
            className="cursor-pointer hover:text-blue-500"
            onClick={() => navigate(`/notifications/${id}`)}
          />
          <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs font-bold px-1 rounded-full">
            {count > 0 ? count : "-1"}
          </span>
        </div>

        {token && (
          <div ref={profileRef} className="relative">
            <HiOutlineUserCircle
              size={24}
              className="cursor-pointer hover:text-blue-500"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            />
            {showProfileDropdown && (
              <div className="absolute right-0 w-72 p-4 mt-2 bg-white text-gray-800 border border-gray-200 shadow-xl rounded-xl z-50">
                <div className="flex flex-col items-center text-center">
                  <img
                    src={
                      "https://ui-avatars.com/api/?name=Restaurant&background=ddd&color=333"
                    }
                    alt="Restaurant"
                    className="w-24 h-24 rounded-full mb-3 object-cover border"
                  />
                  <h3 className="text-lg font-semibold">
                    {outletData?.name || "Your Restaurant"}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    Owner: {user?.username}
                  </p>
                  <p className="text-sm text-gray-600">Email: {user?.email}</p>

                  <button
                    onClick={logoutHandler}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
