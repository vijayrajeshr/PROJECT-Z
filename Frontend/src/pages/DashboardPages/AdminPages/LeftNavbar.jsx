import React, { useContext, useEffect, useState } from "react";
import Axios from "axios";
import {
  MdMail,
  MdSend,
  MdDrafts,
  MdDelete,
  MdStar,
  MdAdd,
  MdLabelImportant,
  MdExpandMore,
  MdExpandLess,
} from "react-icons/md";
import { FaPen } from "react-icons/fa";
import { RiSpam2Line } from "react-icons/ri";
import { IoMdTime } from "react-icons/io";
import DisplayListMails from "./DisplayListMails";
import Compose from "./Compose";

import { EmailContent } from "../../../context/AdminContent/EmailDataInfo";
import Login from "../../../context/AdminContent/Login";
import { useContextData } from "../../../context/OutletContext";
const LeftNavbar = () => {
  const { axiosApi } = useContextData();
  const EmailData = useContext(EmailContent);
  const [showMore, setShowMore] = useState(false);
  const [showtype, setShowtype] = useState("Inbox");
  const [openCompose, setOpenCompose] = useState(false);
  const [active, setActive] = useState("Inbox");
  const [token, setToken] = useState("");
  const [mailData, setMailData] = useState([]);
  const [length, setLength] = useState("0");
  const [loginSet, setLoginSet] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  useEffect(() => {
    setToken(localStorage.getItem("token"));
    handleGetMails();
    const interval = setInterval(() => {
      handleGetMails();
    }, 1 * 60 * 1000);
    return () => clearInterval(interval);
  }, [currentPage, showtype]);
  const toggleMore = () => {
    setShowMore((prev) => !prev);
  };
  const handleOpenCompose = () => {
    setOpenCompose((prev) => !prev);
  };

  const handleEmail = () => {
    setMailData(EmailData);
  };

  const handleSentMessage = (msg) => {
    setMailData((prev) => [...prev, msg]);
    alert("addedd");
  };

  const handleList = (name) => {
    setShowtype(name), setActive(name);
    if (name === "Sent") {
      axiosApi
        .get(
          `${
            import.meta.env.VITE_SERVER_URL
          }/email/Sent?page=${currentPage}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          setMailData(response.data.findSentMails);
          setCurrentPage(response.data.currentPage);
          setTotalPages(response.data.totalPages);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const handleGetMails = () => {
    axiosApi
      .get(
        `${
          import.meta.env.VITE_SERVER_URL
        }/email/inbox?page=${currentPage}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((response) => {
        console.log(response.data);
        setMailData(response.data.mails);
        setLength(response.data.totalItems);
        setCurrentPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <div className="flex ">
      <div className="w-64 h-[87.5vh] bg-gray-100 shadow-md p-4 flex flex-col">
        {/* Compose Button */}
        {!token && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Please Log In</h2>
              <Login setLoginSet={setLoginSet} />
            </div>
          </div>
        )}
        <button
          className="mb-4 flex items-center justify-center gap-4 bg-blue-500 text-white rounded-3xl p-2 hover:bg-blue-600 h-[50px] text-base"
          onClick={handleOpenCompose}
        >
          <FaPen className="h-4 w-4" /> Compose
        </button>

        {/* Menu Items */}
        <ul className="space-y-3">
          {[
            { name: "Inbox", icon: <MdMail className="h-5 w-5" /> },
            { name: "Starred", icon: <MdStar className="h-5 w-5" /> },
            { name: "Sent", icon: <MdSend className="h-5 w-5" /> },
            { name: "Drafts", icon: <MdDrafts className="h-5 w-5" /> },
          ].map((item) => (
            <li
              key={item.name}
              className={`flex items-center gap-3 text-gray-700  p-2 rounded-lg cursor-pointer text-base
                ${
                  active === item.name
                    ? "text-bold bg-blue-100"
                    : "hover:bg-gray-200"
                }`}
              onClick={() => handleList(item.name)}
            >
              {item.icon} {item.name}{" "}
              {item.name === "Inbox" ? (
                <span className="ml-20 text-[14px]">
                  {mailData ? length : 0}
                </span>
              ) : null}
            </li>
          ))}

          {/* More/Less Button */}
          <li
            onClick={toggleMore}
            className="flex items-center gap-3 text-gray-700 hover:bg-gray-200 p-2 rounded-lg cursor-pointer"
          >
            {showMore ? (
              <>
                <MdExpandLess className="h-5 w-5" /> Less
              </>
            ) : (
              <>
                <MdExpandMore className="h-5 w-5" /> More
              </>
            )}
          </li>
          {showMore && (
            <>
              {[{ name: "Trash", icon: <MdDelete className="w-5 h-5" /> }].map(
                (item) => (
                  <li
                    key={item.name}
                    className={`flex items-center gap-3 text-gray-700 hover:bg-gray-200 p-2 rounded-lg cursor-pointer text-base
                  ${
                    active === item.name
                      ? "text-bold bg-blue-100"
                      : "hover:bg-gray-200"
                  }`}
                    onClick={() => handleList(item.name)}
                  >
                    {item.icon} {item.name}
                  </li>
                )
              )}
            </>
          )}
        </ul>
      </div>

      {/* Display Mail List */}
      <DisplayListMails
        title={showtype}
        mailData={mailData}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        setTotalPages={setTotalPages}
        close1={handleOpenCompose}
      />

      {openCompose && (
        <div className="fixed top-14 right-[150px]   w-[350px] h-[410px] transition-all duration-300 rounded-md">
          <Compose close={handleOpenCompose} add={handleSentMessage} />
        </div>
      )}
    </div>
  );
};

export default LeftNavbar;
