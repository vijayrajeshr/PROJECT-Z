import { useState } from "react";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { MdExpandMore, MdEdit } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import DisplayContentEmail from "./DisplayContentEmail";
import Compose from "./Compose";
import Axios from "axios";
import { useContextData } from "../../../context/OutletContext";

function Reply({ email, mail, Replay, close1, replayType }) {
  const { axiosApi } = useContextData();
  const [emailId, setEmailId] = useState(replayType === true ? " " : email);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [replyContent, setReplyContent] = useState(""); // State for the textarea content

  const handleShow = () => {
    setShow((prev) => !prev);
  };
  const handleSentReply = () => {
    const token = localStorage.getItem("token");

    const preview = mail.preview;
    console.log(mail);
    axiosApi
      .post(
        `${import.meta.env.VITE_SERVER_URL}/email/sent`,
        {
          emailId: emailId,
          subject: mail.subject,
          body: replyContent,
          preview,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        console.log("Mail sent successfully", response.data);
        alert("reply is sent");
      })
      .catch((error) => {
        console.error("Error sending mail", error);
      });
  };
  const handleSubmitForward = () => {
    const token = localStorage.getItem("token");

    const preview = mail.preview;
    console.log(mail);
    axiosApi
      .post(
        `${import.meta.env.VITE_SERVER_URL}/email/sent`,
        {
          emailId: emailId,
          subject: mail.subject,
          body: mail.body,
          preview: mail.preview,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        console.log("Mail sent successfully", response.data);
        alert("reply is sent");
      })
      .catch((error) => {
        console.error("Error sending mail", error);
      });
  };

  return (
    <>
      <div className="bg-white p-6 w-full shadow-xl rounded-lg mt-7 max-w-2xl mx-auto border border-gray-300">
        <div>
          <div className="flex items-center justify-between border-b border-gray-300">
            <div className="relative group">
              <button
                className="flex items-center  px-4 py-2 rounded-lg hover:bg-gray-300 transition-all duration-200 shadow-sm"
                onClick={Replay}
              >
                <IoReturnUpBackOutline className="w-5 h-5 text-black mr-2" />
              </button>
              {/* Dropdown Edit Option */}
            </div>
            <div className="flex-1 ml-4">
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Recipients"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                className="w-full px-4 py-2 text-sm border  rounded-md shadow-sm focus:ring-2 border-none outline-none "
              />
            </div>
          </div>

          {/* Input Section */}
          <div className="mt-4">
            <textarea
              placeholder="Write your reply here..."
              className="w-full h-auto p-4 text-sm  border-gray-300 rounded-md shadow-sm resize-none  focus:outline-none"
              value={replyContent} // Bind state to textarea
              onChange={(e) => setReplyContent(e.target.value)} // Update state on change
              required
            />
            {show && (
              <div className="relative right-0shadow-lg rounded-md p-4 z-10 w-full">
                <DisplayContentEmail email={mail} />
              </div>
            )}
          </div>

          {/* Actions Section */}

          <div className="flex items-center justify-between mt-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-md"
              onClick={() => {
                replayType ? handleSubmitForward() : handleSentReply();
              }}
            >
              Send
            </button>
            <div className="relative">
              <BsThreeDots
                className="w-6 h-6 text-gray-500 cursor-pointer hover:text-gray-700"
                onClick={handleShow}
              />
              <button className="p-2 text-gray-600 hover:text-blue-500 transition">
                <FaTrashAlt title="Trash" onClick={Replay} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Reply;
