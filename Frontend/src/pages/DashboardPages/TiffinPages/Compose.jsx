import { useState, useRef } from "react";
import { CiTrash } from "react-icons/ci";
import { FaExpandAlt } from "react-icons/fa";
import { IoAddCircleSharp, IoCloseSharp } from "react-icons/io5";
import { CiImageOn } from "react-icons/ci";
import { MdCloseFullscreen } from "react-icons/md";


import RichTextEditor from "./TempleteEdit";
import { useContextData } from "../../../context/OutletContext";
function Compose({ close, move, mail, add, close1 }) {
  const { axiosApi } = useContextData();
  const emailTemplates = [
    {
      id: 1,
      mailID: "restaurant.owner@example.com",
      subject: "Add New Restaurant",
      body: `Dear User,

We are excited to invite you to add your restaurant to our platform. Please fill out the required details to join our growing community of restaurants.

Best Regards,
Admin Team`,
    },
    {
      id: 2,
      mailID: "event.client@example.com",
      subject: "Join Live Event Dinner",
      body: `Dear Client,

You are cordially invited to our exclusive live event dinner. Please RSVP to secure your spot at this special event.

Sincerely,
Admin Team`,
    },
    {
      id: 3,
      mailID: "user.support@example.com",
      subject: "User Help Request",
      body: `Dear User,

We noticed you need assistance. Please reply to this email or reach out to our support team, and we will be happy to help.

Best Wishes,
Support Team`,
    },
    {
      id: 4,
      mailID: "client.partner@example.com",
      subject: "Client Collaboration",
      body: `Dear Client,

We are thrilled to collaborate with you. Let's discuss how we can grow together. Please reply to this email to schedule a meeting.

Kind Regards,
Admin Team`,
    },
  ];

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [mailid, setMailId] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isExpanded, setIsExpand] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [edit, setEdit] = useState(true);
  const [emailSent, setEmailSent] = useState(false);

  const handleTemplateChange = (e) => {
    const selectedId = parseInt(e.target.value);
    const template = emailTemplates.find((t) => t.id === selectedId);
    setSelectedTemplate(template || null);
    setMailId(template?.mailID || "");
    setSubject(template?.subject || "");
    setBody(template?.body || "");
  };
  const handleEditorAction = (action) => {
    console.log(`Action: ${action}`);
  };

  const handleExpand = () => {
    setIsExpand(!isExpanded);
  };

  const handleSendMail = () => {
    const token = localStorage.getItem("token");
    const preview = body.substring(0, 50);

    const formData = new FormData();
    formData.append("emailId", mailid);
    formData.append("subject", subject);
    formData.append("body", body);
    formData.append("preview", preview);
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    axiosApi
      .post(`${import.meta.env.VITE_SERVER_URL}/email/sent`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Mail sent successfully", response.data);
        setEmailSent(true);
        alert("Mail is sent");
      })
      .catch((error) => {
        console.error("Error sending mail", error);
      });
  };
  const handleIconClick = () => {
    fileInputRef.current && fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      console.log(file);
    }
  };

  const handleCloseCompose = () => {
    if (!emailSent) {
      const token = localStorage.getItem("token");
      const preview = body.substring(0, 50);
      axiosApi
        .post(
          `${import.meta.env.VITE_SERVER_URL}/email/draft`,
          { emailId: mailid, subject, body, preview, image: selectedImage },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((response) => {
          console.log("Mail draft successfully", response.data);
          setEmailSent(true);
          alert("Mail is Draft");
        })
        .catch((error) => {
          console.error("Error sending mail", error);
        });
    }
    close();
  };

  return (
    <div
      className={`p-4 bg-white rounded-lg shadow-lg ${
        isExpanded
          ? "fixed top-12 left-40 w-[75%] h-[530px] z-50 shadow-black"
          : "w-[500px] relative right-10 h-[500px] overflow-y-scroll top-0"
      }`}
    >
      <div className="compose">
        <div className="flex justify-between bg-gray-100">
          <h2 className="text-lg font-bold text-gray-800 rounded-t-md p-1">
            {mail ? "Edit Message" : "New Message"}
          </h2>
          <div className="icons-expand flex p-1 rounded-t-md m-2 justify-evenly">
            {!isExpanded ? (
              <FaExpandAlt
                className="mr-3 cursor-pointer"
                onClick={handleExpand}
                size={16}
              />
            ) : (
              <MdCloseFullscreen
                className="mr-3 cursor-pointer"
                onClick={handleExpand}
                size={16}
              />
            )}
            <IoCloseSharp
              className="text-black cursor-pointer"
              onClick={handleCloseCompose}
              size={18}
            />
          </div>
        </div>
        <div className="space-y-3 mt-5">
          {!mail && (
            <div>
              <label className="block text-gray-600 font-medium mb-1">
                Choose Template
              </label>
              <select
                name="template"
                onChange={handleTemplateChange}
                className="w-full bg-gray-200 text-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select Template</option>
                {emailTemplates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.subject}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-gray-600 font-medium mb-1">To</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Recipient email"
              value={mailid}
              onChange={(e) => setMailId(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Subject
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="mb-10">
            <label className="block text-gray-600 font-medium ">Message</label>
            <div className="mt-4">
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="w-[50px] h-[50px]"
                />
              )}
              {/* <EditorToolbar onAction={handleAction} body={body} setBody={setBody}/> */}
              <RichTextEditor body={body} setBody={setBody} />
              {/* <textarea
                placeholder="Write your reply here..."
                className="w-full h-[100px] p-4 text-sm rounded-md shadow-sm resize-none focus:outline-none"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
              /> */}
            </div>
          </div>
          {/* <div className="container mx-auto p-4">
              <EditorToolbar onAction={handleEditorAction} />
          </div> */}
        </div>
        <div className="flex justify-between items-center mt-1">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={handleSendMail}
          >
            Send
          </button>
          <div>
            {/* Hidden file input */}
            <input
              type="file"
              name="image"
              id="image"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <button type="button" onClick={handleIconClick}>
              <CiImageOn className="w-6 h-6" />
            </button>
          </div>
          <CiTrash
            className="text-black cursor-pointer hover:text-red-500"
            size={24}
            onClick={handleCloseCompose}
          />
        </div>
      </div>
    </div>
  );
}

export default Compose;
