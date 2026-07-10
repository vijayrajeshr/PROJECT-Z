import React from "react";
import { FaRegTrashAlt } from "react-icons/fa";

const DelBtn = ({ children, onBtnClick, isEditable = false }) => {
  return (
    <div className="w-auto h-auto relative">
      {isEditable && (
        <FaRegTrashAlt
          className="absolute -top-2  -right-1 text-red-500 w-5 h-5 bg-gray-300 p-[2px] rounded-full"
          onClick={onBtnClick}
        />
      )}

      {children}
    </div>
  );
};

export default DelBtn;
