import { FaReply, FaTrashAlt, FaArchive, FaStar } from "react-icons/fa";
import { IoArrowBackSharp } from "react-icons/io5";

function MailTopBar({ email, onBack, action, open, handle, id }) {
  return (
    <>
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white z-50 flex justify-between items-center p-3 shadow-md border-b border-gray-200">
        {/* Left Actions */}
        <div className="flex space-x-4">
          <button className="p-2 text-gray-600 hover:text-blue-500 transition text-2xl" onClick={onBack}>
            <IoArrowBackSharp />
          </button>
          <button className="p-2 text-gray-600 hover:text-blue-500 transition text-xl">
            <FaArchive title="Archive" onClick={() => handleActionOpen(email.id, "Drafts")} />
          </button>
          <button className="p-2 text-gray-600 hover:text-blue-500 transition text-xl">
            <FaTrashAlt title="Trash" onClick={() => handle(email._id)} />
          </button>
          <button className="p-2 text-gray-600 hover:text-blue-500 transition text-xl" onClick={open}>
            <FaReply title="Reply" />
          </button>
        </div>

        {/* Right Actions */}
        <button className="p-2 text-gray-600 hover:text-yellow-500 transition">
          <FaStar title="Star" />
        </button>
      </div>

      {/* Scrollable Content */}
      
    </>
  );
}

export default MailTopBar;
