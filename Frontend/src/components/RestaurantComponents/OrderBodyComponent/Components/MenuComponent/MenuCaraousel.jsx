import { Hide } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";

const MenuCarousel = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const images = [
    "/images/menucard.jpg",
    "/images/menucard.jpg",
    "/images/menucard.jpg",
    "/images/menucard.jpg",
    "/images/menucard.jpg",
  ];

  const openModal = (index) => {
    setActiveImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const goToNext = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrev = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") goToNext(e);
      if (e.key === "ArrowLeft") goToPrev(e);
      if (e.key === "Escape") closeModal();
    };

    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      {/* Add scrollbar styles inside a <style> tag */}
      <style>
        {`
      .thumbnail-container::-webkit-scrollbar {
        height: 8px;
      }
      .thumbnail-container::-webkit-scrollbar-thumb {
        background-color: #f44336;
        border-radius: 4px;
      }
      .thumbnail-container::-webkit-scrollbar-track {
        background-color: #f1f1f1;
      }
    `}
      </style>

      <div
        className="thumbnail-container"
        style={{
          display: "flex",
          gap: "12px",
          overflow: "scroll",
          overflowY: "hidden",
          overflowX: "scroll",
        }}
      >
        {data?.data?.menuImages?.map((image, index) => (
          <img
            key={index}
            src={image || "/images/placeholder.jpg"}
            alt={`Menu Card ${index + 1}`}
            style={{
              width: "150px",
              height: "250px",
              cursor: "pointer",
              borderRadius: "8px",
              transition: "transform 0.3s ease",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            onClick={() => openModal(index)}
          />
        ))}
      </div>

      {/* Modal (Carousel) */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={closeModal}
        >
          {/* Previous Button */}
          <button
            onClick={goToPrev}
            style={{
              position: "absolute",
              left: "5%",
              fontSize: "24px",
              color: "#fff",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            &#10094;
          </button>

          <img
            src={data.data.menuImages[activeImageIndex]}
            alt={`Menu Card ${activeImageIndex + 1}`}
            style={{
              maxWidth: "70%",
              maxHeight: "70%",
              borderRadius: "10px",
              boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
              transition: "opacity 0.5s ease-in-out",
            }}
          />

          {/* Next Button */}
          <button
            onClick={goToNext}
            style={{
              position: "absolute",
              right: "5%",
              fontSize: "24px",
              color: "#fff",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            &#10095;
          </button>

          {/* Close Button */}
          <button
            onClick={closeModal}
            style={{
              position: "absolute",
              top: "5%",
              right: "5%",
              fontSize: "24px",
              color: "#fff",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            &times;
          </button>

          {/* Thumbnail navigation inside modal (Reduced size) */}
          <div
            style={{
              position: "absolute",
              bottom: "5%",
              display: "flex",
              gap: "8px",
            }}
          >
            {data.data.menuImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index + 1}`}
                style={{
                  width: "50px",
                  height: "60px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  border:
                    activeImageIndex === index ? "2px solid #ff5a5f" : "none",
                  transition: "transform 0.3s ease",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex(index);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuCarousel;
