import React, { useEffect, useState } from "react";
import { CiTrash } from "react-icons/ci";
import { FaRegStar } from "react-icons/fa";
import { MdOutlineMarkEmailUnread, MdArchive } from "react-icons/md";
import EmailTopbar from "./EmailTopbar1";
import DisplayEmailById from "./DisplayEmailById";
import Axios from "axios";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import HtmlToPlainText from "./HtmlToPlainText"
const MailList = ({ title, mail: initialMails = [], move, mailData,currentPage,setCurrentPage,totalPages,setTotalPages,close1 }) => {
  const [mails, setMails] = useState(mailData);
  const [open, setOpen] = useState(false);
  const [selectedMail, setSelectedMail] = useState(null);
  const [filteredMails, setFilteredMails] = useState(mailData);
  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState("");
  const [length, setLength] = useState(null);
  const [search,setSearch]=useState(null);
  const limit=10
  dayjs.extend(relativeTime);


  console.log(mailData);


  useEffect(() => {
    handleTypeOfMail();
  }, [mailData, title, searchText, filter]);

  const handleTypeOfMail = () => {
    let filtered = [];
    switch (title.toLowerCase()) {
      case "starred":
        Axios.get(`${import.meta.env.VITE_SERVER_URL}/email/star?page=${currentPage}&limit=${limit}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
          .then((response) => {
            console.log(response.data)
            setFilteredMails(response.data.mails);
            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);
          })
          .catch((error) => {
            console.log(error);
          });
          break;
      case "trash":
        Axios.get(`${import.meta.env.VITE_SERVER_URL}/email/isTrashed?page=${currentPage}&limit=${limit}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
          .then((response) => {
            setFilteredMails(response.data.mails);
            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);
          })
          .catch((error) => {
            console.log(error);
          });
        return; // Exit early if using Axios
      case "drafts":
        Axios.get(`${import.meta.env.VITE_SERVER_URL}/email/isDraft?page=${currentPage}&limit=${limit}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
          .then((response) => {
            filtered = response.data.findSentMails;
            setFilteredMails(filtered);
            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);
          })
          .catch((error) => {
            console.log(error);
          });
        return;
      case "sent":
        Axios.get(`${import.meta.env.VITE_SERVER_URL}/email/Sent?page=${currentPage}&limit=${limit}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
          .then((response) => {
            filtered = response.data.findSentMails;
            setFilteredMails(filtered);
            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);
          })
          .catch((error) => {
            console.log(error);
          });
        return;
      default:
        filtered = mailData?.filter(
          (m) =>
            !m.receiverStatus.isTrashed &&
            !m.receiverStatus.isDraft &&
            m.senderStatus.isSent
        );
        break;
    }

    // Filter further based on the search text if provided
    if (searchText.trim() !== "") {
      filtered = filtered.filter(
        (m) =>
          (m.subject || "").toLowerCase().includes(searchText.toLowerCase()) ||
          (m.preview || "").toLowerCase().includes(searchText.toLowerCase()) ||
          (m.user.userId || "").toLowerCase().includes(searchText.toLowerCase()) ||
          (m.user.username || "").toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Apply additional filter criteria (e.g. read/unread) if provided
    if (filter.trim() !== "") {
      switch (filter.toLowerCase()) {
        case "read":
          filtered = filtered.filter((m) => m.receiverStatus.read); 
          break;
        case "unread":
          filtered = filtered.filter((m) => !m.receiverStatus.read);
          break;
        case "All":
          break;
        default:
          break;
      }
    }
    if(searchText.trim()!==""){
      setSearch(filtered);
    }
    else{
      setFilteredMails(filtered);
      setLength(filtered?.length);
    }
  
  };

  const updateMailProperty = (emailId, prop, value) => {
    const updatedMails = mails.map((mail) =>
      mail._id === emailId
        ? {
            ...mail,
            receiverStatus: {
              ...mail.receiverStatus,
              [prop]: value,
            },
          }
        : mail
    );
    setMails(updatedMails);

    const updatedFilteredMails = filteredMails.map((mail) =>
      mail._id === emailId
        ? {
            ...mail,
            receiverStatus: {
              ...mail.receiverStatus,
              [prop]: value,
            },
          }
        : mail
    );
    setFilteredMails(updatedFilteredMails);
  };

  const handleMailClick = (mail, action) => {
    // Mark the mail as read before proceeding
    mail.receiverStatus.read = true;
    Axios.post(
      `${import.meta.env.VITE_SERVER_URL}/email/inbox/read`,
      { id: mail._id },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    // If the click is only to mark as read, return early
    if (action === "read") return;

    setSelectedMail(mail);
    setOpen(true);
  };

  const handleBack = () => {
    setSelectedMail(null);
    setOpen(false);
  };

  const handleAction = (emailId, actionType) => {
    switch (actionType.toLowerCase()) {
      case "starred":
        updateMailProperty(emailId, "isStarred", true);
        Axios.post(
          `${import.meta.env.VITE_SERVER_URL}/email/SendStar`,
          { id: emailId },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        )
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
        break;
      case "trash":
        Axios.post(
          `${import.meta.env.VITE_SERVER_URL}/email/SentTrash`,
          { id: emailId },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        )
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
        break;
      case "drafts":
        updateMailProperty(emailId, "isDraft", true);
        break;
      default:
        break;
    }
    move(emailId, title, actionType);
  };
  const handleSearch = (text) => {
    setSearchText(text);
  };

  const handleFilter = (value) => {
    if (value) {
      setFilter(value);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
      console.log(currentPage);
    }
  };

  return (
    <div className="p-2 w-3/4 mx-auto rounded-lg shadow">
      <EmailTopbar
        onSearch={handleSearch}
        filter={handleFilter}
        onBack={handlePrevious}
        onNext={handleNext}
        count={totalPages}
        page={currentPage}
        emails={search}
        handleMailClick={handleMailClick}
      />
      {open && selectedMail ? (
        <DisplayEmailById
          email={selectedMail}
          onBack={handleBack}
          title={title}
          action={handleAction}
          open={setOpen}
          close1={close1}
        />
      ) : (
        <div className="mt-6 h-[386px] overflow-y-auto">
          <ul className="space-y-3">
            {filteredMails && filteredMails.length > 0 ? (
              filteredMails.map((m, index) => (
                <li
                  key={index}
                  className={`p-3 ${
                    m.receiverStatus.read ? "bg-slate-300" : "bg-slate-50"
                  } rounded-lg shadow hover:bg-gray-200 flex justify-between items-center group cursor-pointer`}
                >
                  {/* Left Section: Checkbox and Star */}
                  <div className="flex items-center space-x-2 mr-4">
                    <input
                      type="checkbox"
                      className="h-4 w-4 cursor-pointer focus:ring-blue-500"
                      // {m.receiverStatus.isStarred?active
                    />
                    <button
                      className="text-gray-500 hover:text-yellow-500 transition duration-200"
                      title="Star"
                      onClick={() => handleAction(m._id, "Starred")}
                    >
                      <FaRegStar className={`h-5 w-5 ${m.receiverStatus.isStarred?"text-yellow-500":"text-black"}`} />
                    </button>
                  </div>
                  {/* Middle Section: Name and Subject */}
                  <div className="w-4/5 flex" onClick={() => handleMailClick(m, "open")}>
                    <h2 className="font-bold text-[14px] text-gray-900 truncate w-[100px]">
                      {m.user.username}
                    </h2>
                    <p className="text-sm text-gray-700 truncate ml-10">
                    <HtmlToPlainText htmlContent={m.preview.slice(0,50)} />
                    </p>
                  </div>
                  {/* Right Section: Time and Action Buttons */}
                  <div className="flex items-center space-x-4">
                    <p className="text-xs text-gray-400 group-hover:hidden">
                      {dayjs(m.createdAt).fromNow()}
                    </p>
                    <div className="hidden group-hover:flex space-x-2">
                      <button
                        className="p-1 text-gray-500 hover:text-blue-500 transition duration-200"
                        title="Mark as Read"
                        onClick={() => handleMailClick(m, "read")}
                      >
                        <MdOutlineMarkEmailUnread className="h-5 w-5" />
                      </button>
                      <button
                        className="p-1 text-gray-500 hover:text-green-500 transition duration-200"
                        title="Archive"
                        onClick={() => handleAction(m._id, "Drafts")}
                      >
                        <MdArchive className="h-5 w-5" />
                      </button>
                      <button
                        className="p-1 text-gray-500 hover:text-red-500 transition duration-200"
                        title="Delete"
                        onClick={() => handleAction(m._id, "Trash")}
                      >
                        <CiTrash className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No mails to display.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MailList;
