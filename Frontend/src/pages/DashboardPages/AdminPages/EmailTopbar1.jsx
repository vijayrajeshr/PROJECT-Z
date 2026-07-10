import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  MdExpandMore,
  MdExpandLess,
  MdArrowBack,
  MdArrowForward,
} from "react-icons/md";
import Axios from "axios";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
import { FaSearch } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";
import { useContextData } from "../../../context/OutletContext";

const EmailTopBar = ({
  count,
  page,
  onSearch,
  filter,
  onBack,
  onNext,
  emails,
  handleMailClick,
}) => {
  const { axiosApi } = useContextData();
  const [hoverShowMore, setHoverShowMore] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [filteredEmails, setFilteredEmails] = useState(emails);

  useEffect(() => {
    setFilteredEmails(emails);
  }, [emails]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    if (onSearch) onSearch(value);
  };

  const handleFilter = (filterValue) => {
    if (filter) filter(filterValue);
  };

  const handle = (email) => {
    setSearchText("");
    handleMailClick(email, "open");
  };

  const renderEmailSuggestions = () => {
    if (filteredEmails?.length > 0) {
      return filteredEmails.map((email, index) => (
        <div
          key={index}
          className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer m-2 flex items-center gap-4 transition-all duration-200 ease-in-out hover:shadow-md"
          onClick={() => handle(email)}
        >
          <AiFillMessage className="text-blue-500 text-lg" />
          <div>
            <h1 className="text-base font-semibold text-gray-700">
              {email.user.username}
            </h1>
            <p className="text-sm text-gray-500">{email.user.userId}</p>
          </div>
        </div>
      ));
    }
    return <div className="p-2 text-gray-500">No results found</div>;
  };

  return (
    <div className="w-full flex flex-wrap items-center justify-between gap-2 p-2">
      {/* Filter Button */}
      <div
        className="relative"
        onMouseEnter={() => setHoverShowMore(true)}
        onMouseLeave={() => setHoverShowMore(false)}
      >
        <button className="flex items-center rounded-lg hover:bg-gray-200 px-3 py-1 text-sm">
          <h1 className="text-black">Filter</h1>
          {hoverShowMore ? <MdExpandLess /> : <MdExpandMore />}
        </button>
        {hoverShowMore && (
          <div className="absolute bg-white shadow-md border rounded-lg p-2 w-32 z-10">
            <ul>
              <li
                className="hover:bg-gray-200 p-2 cursor-pointer"
                onClick={() => handleFilter("all")}
              >
                All
              </li>
              <li
                className="hover:bg-gray-200 p-2 cursor-pointer"
                onClick={() => handleFilter("read")}
              >
                Read
              </li>
              <li
                className="hover:bg-gray-200 p-2 cursor-pointer"
                onClick={() => handleFilter("unread")}
              >
                Unread
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative flex flex-1 min-w-[200px] max-w-full bg-slate-100 h-12 rounded-full shadow-md items-center px-4 gap-3">
        <FaSearch className="text-gray-500" />
        <input
          type="text"
          placeholder="Search for a particular email"
          value={searchText}
          onChange={handleSearchChange}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 border-none text-sm md:text-base"
        />

        {searchText && (
          <div className="absolute top-full left-0 mt-2 bg-white shadow-md rounded-lg w-full border border-gray-200 z-20">
            {/* Buttons Section */}
            <div className="flex flex-col sm:flex-row justify-start px-4 py-2 border-b border-gray-200 gap-2">
              <button
                className="w-full sm:w-auto px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded transition-all"
              >
                Last 7 days
              </button>
              <button
                className="w-full sm:w-auto px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded transition-all"
              >
                From Me
              </button>
            </div>

            {/* Render Email Suggestions */}
            <div className="p-3">{renderEmailSuggestions()}</div>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center text-gray-700 gap-2 text-sm sm:text-base">
        <span>
          {page} of {count}
        </span>
        <button
          disabled={page === 1}
          className={`p-2 rounded-full ${
            page === 1 ? "cursor-not-allowed opacity-50" : "text-black hover:bg-gray-200"
          }`}
          onClick={onBack}
        >
          <MdArrowBack />
        </button>
        <button
          disabled={page === count}
          className={`p-2 rounded-full ${
            page === count
              ? "cursor-not-allowed opacity-50"
              : "text-black hover:bg-gray-200"
          }`}
          onClick={onNext}
        >
          <MdArrowForward />
        </button>
      </div>
    </div>
  );
};

export default EmailTopBar;
