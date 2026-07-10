
import React, { useRef, useEffect } from "react";
import EditorToolbar from "./EditorToolbar";

const RichTextEditor = ({ body, setBody }) => {
  const editorRef = useRef(null);

  const handleAction = (action) => {
    if (action === "createLink") {
      const url = prompt("Enter the link URL:");
      if (url) {
        document.execCommand("createLink", false, url);
      }
    } else {
      document.execCommand(action, false, null);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      setBody(editorRef.current.innerHTML); // Update parent state with current content
    }
  };

  // Sync initial body content to the editor on mount
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== body) {
      editorRef.current.innerHTML = body; // Initialize editor content
    }
  }, [body]);

  return (
    <div className="p-4">
      {/* Toolbar */}
      <EditorToolbar onAction={handleAction} />

      {/* Editable Content */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-4 border rounded bg-white min-h-[200px] text-sm shadow-sm"
        style={{ outline: "none" }}
      ></div>
    </div>
  );
};

export default RichTextEditor;
