import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

function CategoryModal({ isOpen, setIsOpen, onSave }) {
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!categoryName.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      onSave(categoryName);
      setCategoryName("");
      setError("");
      setIsOpen(false);
    } catch (err) {
      setError("Failed to save category. Please try again.");
    }
  };

  return (
    <Transition show={isOpen}>
      <Dialog onClose={() => setIsOpen(false)}>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          {/* Overlay */}
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
          {/* Panel */}
          <div className="relative bg-white rounded p-6 w-full max-w-md">
            <Dialog.Title className="text-lg font-bold mb-4">
              Add Category
            </Dialog.Title>
            <input
              type="text"
              className="border w-full p-2 mb-4"
              placeholder="Category Name"
              value={categoryName}
              required
              onChange={(e) => {
                setCategoryName(e.target.value);
                setError("");
              }}
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 px-4 py-2"
                onClick={() => {
                  setCategoryName("");
                  setError("");
                  setIsOpen(false);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default CategoryModal;
