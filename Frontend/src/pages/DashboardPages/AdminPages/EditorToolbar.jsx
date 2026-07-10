
import React, { useRef } from "react";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaLink,
  FaUndo,
  FaRedo,
} from "react-icons/fa";
import {
  MdFormatSize,
  MdBrush,
  MdImage,
  MdTableChart,
  MdHorizontalRule,
} from "react-icons/md";
// import { IoFont } from "react-icons/io5";
import { BsSuperscript, BsSubscript } from "react-icons/bs"; // Correct imports for superscript and subscript
import { RiAlignCenter, RiAlignJustify, RiAlignLeft, RiAlignRight } from "react-icons/ri";

const EditorToolbar = ({ onAction,body,setBody }) => {
  const buttons = [
    { icon: <FaBold />, action: "bold", tooltip: "Bold" },
    { icon: <FaItalic />, action: "italic", tooltip: "Italic" },
    { icon: <FaUnderline />, action: "underline", tooltip: "Underline" },
    { icon: <FaLink />, action: "link", tooltip: "Insert Link" },
    { icon: <RiAlignLeft />, action: "align-left", tooltip: "Align Left" },
    { icon: <RiAlignCenter />, action: "align-center", tooltip: "Align Center" },
    { icon: <RiAlignRight />, action: "align-right", tooltip: "Align Right" },
    { icon: <RiAlignJustify />, action: "align-justify", tooltip: "Justify" },
    { icon: <FaUndo />, action: "undo", tooltip: "Undo" },
    { icon: <FaRedo />, action: "redo", tooltip: "Redo" },
    // { icon: <IoFont />, action: "font", tooltip: "Font" },
    { icon: <MdFormatSize />, action: "fontsize", tooltip: "Font Size" },
    { icon: <MdHorizontalRule />, action: "hr", tooltip: "Horizontal Rule" },
    { icon: <BsSuperscript />, action: "superscript", tooltip: "Superscript" },
    { icon: <BsSubscript />, action: "subscript", tooltip: "Subscript" },
  ];
  return (
    <div className="flex flex-wrap gap-3  p-1 rounded  shadow h-[70px]">
      {buttons.map((button, index) => (
        <button
          key={index}
          onClick={() => onAction(button.action)}
          className="p-1 bg-white border rounded hover:bg-gray-200"
          title={button.tooltip}
        >
          {button.icon}
        </button>
      ))}
    </div>
  );
};

export default EditorToolbar
