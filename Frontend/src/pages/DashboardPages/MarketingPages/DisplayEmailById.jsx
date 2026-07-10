import React from "react";
import {
  FaReply,
  FaTrashAlt,
  FaArchive,
  FaStar,
  FaUserCircle,
} from "react-icons/fa";
import { useState } from "react";
import Reply from "./Reply";

import MailTopBar from "./MailTopBar";
import Axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import HtmlToPlainText from "./HtmlToPlainText";
import { useContextData } from "../../../context/OutletContext";
const DisplayEmailById = ({ email, onBack, action, open, close1 }) => {
  const { axiosApi } = useContextData();
  dayjs.extend(relativeTime);
  const [reply, setReply] = useState(false);
  const [replyType, setReplyType] = useState(true);
  const handleReplay = () => {
    setReply((prev) => !prev);
    if (reply) {
      setReplyType(false);
    }
  };
  const handleForward = () => {
    setReplyType(true);
    setReply(true);
  };

  const handleActionOpen = (emailId, take) => {
    open(false);
    action(emailId, take);
  };

  const handleTrash = (emailId) => {
    axiosApi
      .post(
        `${import.meta.env.VITE_SERVER_URL}/email/SentTrash`,
        { id: emailId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="w-full overflow-y-scroll h-[450px] bg-white rounded-sm">
      <MailTopBar
        email={email}
        onBack={onBack}
        action={handleActionOpen}
        open={handleReplay}
        handle={handleTrash}
        id={email._id}
      />

      <div className="i p-2">
        {/* First lorem text made bold */}
        <div className="ml-12 m-1 font-bold">
          <HtmlToPlainText htmlContent={email.preview} />
        </div>
        <div className="user p-2 m-1 flex items-center">
          {/* Using FaUserCircle as dummy user icon */}
          <FaUserCircle className="w-[45px] h-[45px] text-gray-500" />
          <div className="info-user p-2 m-1 flex justify-between w-[90%] items-center">
            <h1 className="font-bold text-lg">
              {email.user.username} ( <span>{email.receiverMailId} )</span>
            </h1>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base">
                {dayjs(email.createdAt).fromNow()}
              </span>
              <button className="p-2 text-gray-600 hover:text-yellow-500 transition">
                <FaStar title="Star" />
              </button>
              <button className="p-2 text-gray-600 hover:text-yellow-500 transition">
                <FaReply title="Reply" className="mt-1" />
              </button>
            </div>
          </div>
        </div>
        <div className="message flex flex-col items-center justify-center text-center">
          <img src={`data:image/jpeg;base64,${email.image}`} alt="" />
          <p>{email.subBody}</p>
          <HtmlToPlainText htmlContent={email.body} />
        </div>
      </div>

      {/* Reply Section */}
      {!reply ? (
        <div className="footer-info flex gap-5 p-2 m-10">
          <button
            className="flex items-center justify-center space-x-2 w-[130px] text-black transition duration-300 border-2 border-black rounded-3xl h-[40px] px-5"
            onClick={handleReplay}
          >
            <FaReply className="w-4 h-4" />
            <span className="text-sm">Reply</span>
          </button>

          <button
            className="flex items-center justify-center space-x-2 w-[130px] text-black transition duration-300 border-2 border-black rounded-3xl h-[40px] px-5"
            onClick={() => handleForward()}
          >
            <FaReply className="w-4 h-4 rotate-180" />
            <span className="text-sm">Forward</span>
          </button>
        </div>
      ) : (
        <div className="w-full">
          <Reply
            email={email.user.userId}
            mail={email}
            Replay={handleReplay}
            close1={close1}
            replayType={replyType}
          />
        </div>
      )}
    </div>
  );
};

export default DisplayEmailById;
