import { createPortal } from "react-dom";
import { useState } from "react";

import closeBtn from "/images/closeBtn.jpg";
import coverImage1 from "/images/collection1.avif";
import coverImage2 from "/images/collection2.jpg";
import coverImage3 from "/images/collection3.avif";
import coverImage4 from "/images/collection4.avif";

const SelectCoverModal = ({ setModal, onSelectCover }) => {
  const coverImages = [
    { id: 1, src: coverImage1 },
    { id: 2, src: coverImage2 },
    { id: 3, src: coverImage3 },
    { id: 4, src: coverImage4 },
  ];

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageSelect = (image) => {
    setSelectedImage(image);
  };

  const handleUpdate = () => {
    if (selectedImage) {
      onSelectCover(selectedImage.src);
      setModal(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/90 p-2">
      <div className="w-full max-w-[800px] max-h-[90vh] bg-white rounded-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 flex justify-between items-center border-b border-gray-200">
          <div className="text-xl font-medium text-[#1C1C1C]">
            Select Cover Image
          </div>
          <span
            className="w-6 h-6 cursor-pointer"
            onClick={() => setModal(false)}
          >
            <img src={closeBtn} alt="close button" className="w-full h-full" />
          </span>
        </div>

        {/* Images */}
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto max-h-[calc(90vh-180px)]">
          {coverImages.map((image) => (
            <div
              key={image.id}
              className={`relative rounded-lg overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-[1.02] ${
                selectedImage?.id === image.id ? "outline outline-[3px] outline-[#FC8181]" : ""
              }`}
              onClick={() => handleImageSelect(image)}
            >
              <img
                src={image.src}
                alt={`Cover ${image.id}`}
                className="w-full h-[200px] object-cover"
              />
              {selectedImage?.id === image.id && (
                <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-[#FC8181] text-white flex justify-center items-center text-sm">
                  ✓
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-between items-center border-t border-gray-200 bg-white">
          <button
            className="text-[#FC8181] text-[0.95rem] px-4 py-2 cursor-pointer"
            onClick={() => setModal(false)}
          >
            Back to Profile
          </button>
          <button
            className={`px-6 py-2 rounded text-white text-[0.95rem] transition-colors ${
              selectedImage
                ? "bg-[#FC8181] hover:bg-[#FB6B6B]"
                : "bg-gray-200 cursor-not-allowed"
            }`}
            onClick={handleUpdate}
            disabled={!selectedImage}
          >
            Update
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SelectCoverModal;
