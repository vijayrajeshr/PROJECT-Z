import React, { useEffect, useState, useRef } from "react";
import Filter from "./Filter";
import Sorting from "./Sorting";
import { FaArrowRight, FaArrowLeft, FaSearch } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { FaBan } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaFontAwesomeFlag } from "react-icons/fa";
import { MdUpdate } from "react-icons/md";
import { AiOutlineClear } from "react-icons/ai";

const Listing = ({ categories, filter, handleSwitch, setResID = () => {} }) => {
  const [expanded, setExpanded] = useState(true);
  const [firms, setFirms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterWord, setFilterWord] = useState(null);
  const [sortWord, setSortWord] = useState(null);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const observer = useRef();

  const sortOptions = [
    { key: "newest", title: "Newest" },
    { key: "oldest", title: "Oldest" },
    { key: "recentUpdated", title: "Recently Updated" },
  ];

  const filterOptions = [
    { key: "menuLatestChange", title: "Menu" },
    { key: "offerLatestChange", title: "Offer" },
    { key: "reviewLatestChange", title: "Review" },
    { key: "mostOffers", title: "Most Offers" },
    { key: "isFlaged", title: "Flaged", icon: <FaFontAwesomeFlag /> },
    { key: "isBookMarked", title: "BookMarked", icon: <FaRegBookmark /> },
    { key: "isBanned", title: "Banned", icon: <FaBan /> },
    { key: "firmInfoChange", title: "Firm Info Changed", icon: <MdUpdate /> },
    { key: "clear", title: "Clear Filter", icon: <AiOutlineClear /> },
  ];

  const filteredFirms = firms.filter((firm) =>
    firm.restaurantInfo?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ListingSideBar = `
    ${expanded ? "w-[25%] min-w-[320px]" : "w-0"}
    h-full
    border-r border-gray-200
    sticky top-0
    bg-gray-50 
    overflow-hidden
    flex flex-col
    transition-all duration-300 ease-in-out
    shadow-sm
  `;

  const getFirmList = async (cursor = null, isLoadMore = false) => {
    if (!hasMore || loading) return;

    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/get-firm-names`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
          params: {
            sortBy: sortWord,
            filterBy: filterWord,
            lastId: cursor,
          },
        }
      );

      if (res.data.response === "ok") {
        const newFirms = res.data.restaurants || [];
        setFirms((prev) => (isLoadMore ? [...prev, ...newFirms] : newFirms));
        setNextCursor(res.data.nextCursor);
        setHasMore(!!res.data.nextCursor);
      } else {
        throw new Error("Failed to fetch firms");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch firms");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const lastFirmElementRef = useRef(null);
  useEffect(() => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !searchQuery) {
        getFirmList(nextCursor, true);
      }
    });

    if (lastFirmElementRef.current) {
      observer.current.observe(lastFirmElementRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [loading, hasMore, nextCursor, searchQuery]);

  useEffect(() => {
    setFirms([]);
    setNextCursor(null);
    setHasMore(true);
    getFirmList(null, false);
  }, [sortWord, filterWord]);

  const selectRes = (id) => {
    setResID(id);
  };

  return (
    <div className={ListingSideBar}>
      <div className="flex justify-between items-center p-3 border-b border-gray-200 bg-white flex-shrink-0">
        <AnimatePresence>
          {expanded && (
            <motion.h2 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="text-lg font-semibold text-gray-700 truncate"
            >
              Restaurants
            </motion.h2>
          )}
        </AnimatePresence>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          aria-label={expanded ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {expanded ? <FaArrowLeft size={16} /> : <FaArrowRight size={16} />}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col flex-grow overflow-hidden"
          >
            <div className="flex-shrink-0 bg-white border-b border-gray-200">
              <div className="p-3">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaSearch className="text-gray-400" size={14} />
                  </span>
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
              
              <div className="relative p-3 pt-0">
                <button
                  onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                  className="w-full text-sm text-left flex items-center justify-between p-2 border rounded-md bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-400"
                >
                  <span className="font-medium text-gray-700">Filters & Sorting</span>
                  <span>{isFilterDropdownOpen ? 
                    <motion.svg animate={{ rotate: 180 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></motion.svg> 
                    : 
                    <motion.svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></motion.svg> 
                  }</span>
                </button>
                <AnimatePresence>
                  {isFilterDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="mt-2 p-4 border rounded-md bg-white shadow-sm overflow-hidden"
                    >
                      <div className="mb-4">
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Filter By</h4>
                        <div className="space-y-2">
                          {filterOptions.map((option) => (
                            <label key={option.key} htmlFor={`filter-${option.key}`} className={`flex items-center text-sm p-1.5 rounded-md cursor-pointer transition-colors ${filterWord === option.key ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'}`}>
                              <input
                                type="radio"
                                id={`filter-${option.key}`}
                                name="filterGroup"
                                className="mr-2.5 focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                checked={filterWord === option.key}
                                onChange={() => {
                                  setFilterWord(option.key === 'clear' ? null : option.key);
                                }}
                              />
                              {option.icon && <span className="mr-1.5 opacity-70">{option.icon}</span>}
                              <span className="flex-grow">{option.title}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <hr className="my-4 border-gray-200" />

                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Sort By</h4>
                        <Sorting option={sortOptions} setSortWord={setSortWord} currentSort={sortWord} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto">
              {loading && !firms.length && (
                <div className="flex items-center justify-center py-8 h-full">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              )}

              {error && (
                <div className="px-4 py-3 m-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded-md text-center">
                  {error}
                </div>
              )}

              {!loading && !error && (
                <ul className="p-2 space-y-1">
                  {filteredFirms.map((firm, index) => {
                    const isLastElement = filteredFirms.length === index + 1;
                    return (
                      <motion.li
                        key={firm._id}
                        ref={isLastElement ? lastFirmElementRef : null}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.02 }}
                        className="rounded-md transition-colors"
                      >
                        <button
                          onClick={() => selectRes(firm._id)}
                          className={`w-full px-3 py-2.5 text-left flex items-center justify-between group border rounded-md transition-colors focus:outline-none focus:ring-1 focus:ring-blue-400 ${filterWord === firm._id ? 'bg-blue-100 border-blue-300' : 'border-gray-200 hover:bg-gray-100'}`}
                        >
                          <span className="text-sm text-gray-800 font-medium truncate">
                            {index + 1}. {firm.restaurantInfo?.name || "Unnamed Restaurant"}
                          </span>
                        </button>
                      </motion.li>
                    );
                  })}

                  {loading && firms.length > 0 && (
                    <li className="text-center text-gray-500 text-sm py-4">
                      Loading...
                    </li>
                  )}

                  {filteredFirms.length === 0 && !loading && firms.length > 0 && (
                    <li className="text-center text-gray-500 text-sm py-6 px-3">
                      No restaurants match your search or filters.
                    </li>
                  )}

                  {filteredFirms.length === 0 && !loading && firms.length === 0 && (
                    <li className="text-center text-gray-500 text-sm py-6 px-3">
                      No restaurants found.
                    </li>
                  )}

                  {!hasMore && firms.length > 0 && !searchQuery && (
                    <li className="text-center py-4 text-xs text-gray-400">
                      End of list
                    </li>
                  )}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Listing;
