// // import React from "react";
// // import css from "./HeroComponent.module.css";
// // import { useParams } from "react-router-dom";
// // import { useState, useEffect } from "react";
// // import axios from "axios";
// // import food1Img from "/images/food1.jpg";
// // import food2Img from "/images/food2.jpg";
// // import food3Img from "/images/food3.jpg";

// // import GalleryImgCard from "../../../utils/Cards/RestaurantHeroCards/GalleryImgCard/GalleryImgCard";
// // import AddPhotosCard from "../../../utils/Cards/RestaurantHeroCards/AddPhotosCard/AddPhotosCard";
// // import ViewGalleryImgCard from "../../../utils/Cards/RestaurantHeroCards/ViewGalleryImgCard/ViewGalleryImgCard";

// // const HeroComponent = () => {
// //   const { id } = useParams();
// //   const [img, setImg] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [activeImageIndex, setActiveImageIndex] = useState(0);

// //   useEffect(() => {
// //     const fetchRestaurants = async () => {
// //       try {
// //         const response = await axios.get(
// //           `http://localhost:3000/firm/getOne/${id}`
// //         );
// //         setImg(response.data.image_urls || []);
// //         console.log(response.data);
// //       } catch (err) {
// //         console.error(err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchRestaurants();
// //   }, [id]);

// //   // Open modal with selected image
// //   const openModal = (index) => {
// //     setActiveImageIndex(index);
// //     setIsModalOpen(true);
// //   };

// //   // Close modal
// //   const closeModal = () => {
// //     setIsModalOpen(false);
// //   };

// //   // Next image
// //   const goToNext = (e) => {
// //     e.stopPropagation();
// //     setActiveImageIndex((prevIndex) =>
// //       prevIndex === img.length - 1 ? 0 : prevIndex + 1
// //     );
// //   };

// //   // Previous image
// //   const goToPrev = (e) => {
// //     e.stopPropagation();
// //     setActiveImageIndex((prevIndex) =>
// //       prevIndex === 0 ? img.length - 1 : prevIndex - 1
// //     );
// //   };

// //   // Keyboard controls
// //   useEffect(() => {
// //     const handleKeyDown = (e) => {
// //       if (e.key === "ArrowRight") goToNext(e);
// //       if (e.key === "ArrowLeft") goToPrev(e);
// //       if (e.key === "Escape") closeModal();
// //     };

// //     if (isModalOpen) {
// //       window.addEventListener("keydown", handleKeyDown);
// //     }
// //     return () => {
// //       window.removeEventListener("keydown", handleKeyDown);
// //     };
// //   }, [isModalOpen]);

// //   if (loading) {
// //     return <div>Loading...</div>;
// //   }

// //   return (
// //     <div className={css.outerDiv}>
// //       <div className={css.innerDiv}>
// //         <div className={css.scr1}>
// //           <GalleryImgCard
// //             imgSrc={img[0] || food1Img}
// //             onClick={() => openModal(0)}
// //           />
// //         </div>
// //         <div className={css.scr2}>
// //           <GalleryImgCard
// //             imgSrc={img[1] || food2Img}
// //             onClick={() => openModal(1)}
// //           />
// //           <ViewGalleryImgCard
// //             imgSrc={img[3] || food1Img} // Use an image from the array or fallback
// //             onClick={() => openModal(0)} // Opens modal starting at first image
// //           />
// //           <GalleryImgCard
// //             imgSrc={img[2] || food3Img}
// //             onClick={() => openModal(2)}
// //           />
// //           {/* <AddPhotosCard /> */}
// //         </div>
// //       </div>

// //       {/* Modal with Carousel */}
// //       {isModalOpen && (
// //         <div className={css.modalOverlay} onClick={closeModal}>
// //           {/* Previous Button */}
// //           <button
// //             onClick={goToPrev}
// //             className={css.navButton}
// //             style={{ left: "5%" }}
// //           >
// //             ❮
// //           </button>

// //           {/* Main Image */}
// //           <img
// //             src={img[activeImageIndex] || food1Img}
// //             alt={`Gallery Image ${activeImageIndex + 1}`}
// //             className={css.modalImage}
// //           />

// //           {/* Next Button */}
// //           <button
// //             onClick={goToNext}
// //             className={css.navButton}
// //             style={{ right: "5%" }}
// //           >
// //             ❯
// //           </button>

// //           {/* Close Button */}
// //           <button onClick={closeModal} className={css.closeButton}>
// //             ×
// //           </button>

// //           {/* Thumbnails */}
// //           <div className={css.thumbnailContainer}>
// //             {img.map((image, index) => (
// //               <img
// //                 key={index}
// //                 src={image || food1Img}
// //                 alt={`Thumbnail ${index + 1}`}
// //                 className={`${css.thumbnail} ${
// //                   activeImageIndex === index ? css.activeThumbnail : ""
// //                 }`}
// //                 onClick={(e) => {
// //                   e.stopPropagation();
// //                   setActiveImageIndex(index);
// //                 }}
// //               />
// //             ))}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default HeroComponent;

// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import css from "./HeroComponent.module.css";

// import food1Img from "/images/food1.jpg";
// import food2Img from "/images/food2.jpg";
// import food3Img from "/images/food3.jpg";

// import GalleryImgCard from "../../../utils/Cards/RestaurantHeroCards/GalleryImgCard/GalleryImgCard";
// import ViewGalleryImgCard from "../../../utils/Cards/RestaurantHeroCards/ViewGalleryImgCard/ViewGalleryImgCard";

// const HeroComponent = () => {
//   const { id } = useParams();
//   const [images, setImages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [activeImageIndex, setActiveImageIndex] = useState(0);
//   const [profileData, setProfileData] = useState("");
//   useEffect(() => {
//     const fetchImages = async () => {
//       let firmFetched = false;

//       // Try firm first
//       try {
//         const firmRes = await axios.get(
//           `${import.meta.env.VITE_SERVER_URL}/firm/getOne/${id}`
//         );
//         if (firmRes.data.image_urls?.length > 0) {
//           setImages(firmRes.data.image_urls);
//           firmFetched = true;
//         }
//       } catch (err) {
//         console.warn("Firm API failed:", err.message);
//       }

//       // If firm failed or had no images, try tiffin
//       if (!firmFetched) {
//         try {
//           const tiffinRes = await axios.get(
//             `${import.meta.env.VITE_SERVER_URL}/api/get-tiffin/${id}`
//           );
//           if (tiffinRes.data.tiffin?.images?.length > 0) {
//             setImages(tiffinRes.data.tiffin.images);
//             firmFetched = true;
//           }
//         } catch (err) {
//           console.warn("Tiffin API failed:", err.message);
//         }
//       }

//       // If both failed or had no images, fallback to defaults
//       if (!firmFetched) {
//         setImages([food1Img, food2Img, food3Img]);
//       }

//       setLoading(false);
//     };

//     fetchImages();
//   }, [id]);

//   const openModal = (index) => {
//     setActiveImageIndex(index);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => setIsModalOpen(false);

//   const goToNext = (e) => {
//     e.stopPropagation();
//     setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
//   };

//   const goToPrev = (e) => {
//     e.stopPropagation();
//     setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
//   };

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === "ArrowRight") goToNext(e);
//       if (e.key === "ArrowLeft") goToPrev(e);
//       if (e.key === "Escape") closeModal();
//     };

//     if (isModalOpen) window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [isModalOpen]);

//   if (loading) return <div>Loading...</div>;

//   const handleFav = async () => {
//     const saved = localStorage.getItem("userProfileData");
//     if (saved) {
//       setProfileData(JSON.parse(saved));
//     }
//     console.log(saved);
//     const url = `${import.meta.env.VITE_SERVER_URL}/firm/fav/${id}`;
//     console.log("Fetching URL:", url);

//     const response = await axios.post(url, { withCredentials: true });
//     const responseTiffin=await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/tiffins/${id}/like`)
//     alert("updated successfull");
//     console.log("Response:", response.data);
//   };

//   const checkIfFavorite = async () => {
//     try {
//       const url = `${import.meta.env.VITE_SERVER_URL}/firm/favCheck/${id}`;

//       const response = await axios.get(url, { withCredentials: true });
  
//       console.log("Response:", response.data);
//       return response.data;
//     } catch (error) {
//       console.error(
//         "Error checking favorite status:",
//         error.response?.data || error.message
//       );
//     }
//   };
//   const removeFavorite = async () => {
//     try {
//       const url = `${import.meta.env.VITE_SERVER_URL}/firm/favRemove/${id}`;

//       const response = await axios.post(url, { withCredentials: true });
//       console.log("Response:", response.data);
//       alert(response.data.message);
//     } catch (error) {
//       console.error(
//         "Error removing favorite:",
//         error.response?.data || error.message
//       );
//     }
//   };

//   const handleFavoriteClick = async () => {
//     const { isFavorite } = await checkIfFavorite();
//     console.log(isFavorite);
//     if (isFavorite) {
//       const confirmRemove = window.confirm(
//         "This item is already in your favorites. Do you want to remove it?"
//       );
//       if (confirmRemove) {
//         await removeFavorite();
//       }
//     } else {
//       await handleFav();
//     }
//   };

//   const addtoFavorite = async () => {
//     try {
//       await axios.post(
//         `${import.meta.env.VITE_SERVER_URL}/firm/users/${id}/liked`,
//         {},
//         {
//           withCredentials: true,
//         }
//       );
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div className={css.outerDiv}>
//       <div
//         className={`${css.innerDiv} max-xl:ml-12 max-h-[60vh] max-xl:mr-12 max-sm:mr-6 max-sm:ml-6`}
//       >
//         <div className={css.scr1}>
//           <GalleryImgCard
//             imgSrc={images[0]}
//             onClick={() => openModal(0)}
//             need={true}
//             addtoFavorite={addtoFavorite}
//             handleFavoriteClick={handleFavoriteClick}
//           />
//         </div>
//         <div className={css.scr2}>
//           <GalleryImgCard imgSrc={images[1]} onClick={() => openModal(1)} />
//           <ViewGalleryImgCard
//             imgSrc={images[3] || images[0]}
//             onClick={() => openModal(0)}
//           />
//           <GalleryImgCard imgSrc={images[2]} onClick={() => openModal(2)} />
//         </div>
//       </div>

//       {isModalOpen && (
//         <div className={css.modalOverlay} onClick={closeModal}>
//           <button
//             onClick={goToPrev}
//             className={css.navButton}
//             style={{ left: "5%" }}
//           >
//             ❮
//           </button>

//           <img
//             src={images[activeImageIndex]}
//             alt={`Gallery Image ${activeImageIndex + 1}`}
//             className={css.modalImage}
//           />

//           <button
//             onClick={goToNext}
//             className={css.navButton}
//             style={{ right: "5%" }}
//           >
//             ❯
//           </button>

//           <button onClick={closeModal} className={css.closeButton}>
//             ×
//           </button>

//           <div className={css.thumbnailContainer}>
//             {images.map((image, index) => (
//               <img
//                 key={index}
//                 src={image}
//                 alt={`Thumbnail ${index + 1}`}
//                 className={`${css.thumbnail} ${
//                   activeImageIndex === index ? css.activeThumbnail : ""
//                 }`}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setActiveImageIndex(index);
//                 }}
//               />
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HeroComponent;
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import css from "./HeroComponent.module.css";

import food1Img from "/images/food1.jpg";
import food2Img from "/images/food2.jpg";
import food3Img from "/images/food3.jpg";

import GalleryImgCard from "../../../utils/Cards/RestaurantHeroCards/GalleryImgCard/GalleryImgCard";
import ViewGalleryImgCard from "../../../utils/Cards/RestaurantHeroCards/ViewGalleryImgCard/ViewGalleryImgCard";
import {toast} from "react-toastify"
const HeroComponent = () => {
  const { id } = useParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [entityType, setEntityType] = useState(null);
  const [isTiffinLiked, setIsTiffinLiked] = useState(false);
  const [isFirmFavorite, setIsFirmFavorite] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
  // Example: check login via API
  const checkLogin = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/auth/check`, // your endpoint to check login
        { withCredentials: true }
      );
      setIsLoggedIn(response.data.loggedIn); // true/false from server
    } catch (err) {
      setIsLoggedIn(false);
    }
  };

  checkLogin();
}, []);

  useEffect(() => {
    const fetchImagesAndDetermineType = async () => {
      setLoading(true);
      let fetchedType = null;
      let fetchedImages = [];

      try {
        const firmRes = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/firm/getOne/${id}`
        );
        if (firmRes.data.image_urls?.length > 0) {
          fetchedImages = firmRes.data.image_urls;
          fetchedType = "firm";
          checkFirmFavoriteStatus(id);
        }
      } catch (err) {
        console.warn("Firm API failed:", err.message);
      }

      if (!fetchedType) {
        try {
          const tiffinRes = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/api/get-tiffin/${id}`
          );
          if (tiffinRes.data.tiffin?.images?.length > 0) {
            fetchedImages = tiffinRes.data.tiffin.images;
            fetchedType = "tiffin";
            checkTiffinLikedStatus(id);
          }
        } catch (err) {
          console.warn("Tiffin API failed:", err.message);
        }
      }

      if (!fetchedType) {
        setImages([food1Img, food2Img, food3Img]);
      } else {
        setImages(fetchedImages);
      }

      setEntityType(fetchedType);
      setLoading(false);
    };

    fetchImagesAndDetermineType();
  }, [id]);

  const openModal = (index) => {
    setActiveImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const goToNext = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToPrev = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") goToNext(e);
      if (e.key === "ArrowLeft") goToPrev(e);
      if (e.key === "Escape") closeModal();
    };

    if (isModalOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, images]);

  const checkFirmFavoriteStatus = async (firmId) => {
    try {
      const url = `${import.meta.env.VITE_SERVER_URL}/firm/favCheck/${firmId}`;
      const response = await axios.get(url, { withCredentials: true });
      setIsFirmFavorite(response.data.isFavorite);
      return response.data.isFavorite;
    } catch (error) {
      console.error(
        "Error checking firm favorite status:",
        error.response?.data || error.message
      );
      setIsFirmFavorite(false);
      return false;
    }
  };

  const handleFav = async () => {
    const url = `${import.meta.env.VITE_SERVER_URL}/firm/fav/${id}`;
    console.log("Fetching URL (Firm):", url);
    try {
      const response = await axios.post(url, {}, { withCredentials: true });
      toast.success("Firm favorite status updated successfully!");
      console.log("Firm Fav Response:", response.data);
      checkFirmFavoriteStatus(id);
    } catch (error) {
      console.error(
        "Error toggling firm favorite:",
        error.response?.data || error.message
      );
      alert("Failed to update firm favorite status.");
    }
  };

  const removeFavorite = async () => {
    try {
      const url = `${import.meta.env.VITE_SERVER_URL}/firm/favRemove/${id}`;
      console.log("Removing Firm Favorite URL:", url);
      const response = await axios.post(url, {}, { withCredentials: true });
      toast.success(response.data.message);
      console.log("Firm Fav Remove Response:", response.data);
      checkFirmFavoriteStatus(id);
    } catch (error) {
      console.error(
        "Error removing firm favorite:",
        error.response?.data || error.message
      );
      alert("Failed to remove firm favorite.");
    }
  };

  const checkTiffinLikedStatus = async (tiffinId) => {
    try {
      const url = `${import.meta.env.VITE_SERVER_URL}/api/tiffins/${tiffinId}/isliked`;
      const response = await axios.get(url, { withCredentials: true });
      setIsTiffinLiked(response.data.isLiked);
      return response.data.isLiked;
    } catch (error) {
      console.error(
        "Error checking Tiffin liked status:",
        error.response?.data || error.message
      );
      setIsTiffinLiked(false);
      return false;
    }
  };

// For Tiffin
const handleTiffinLikeToggle = async () => {
  try {
    const url = `${import.meta.env.VITE_SERVER_URL}/api/tiffins/${id}/like`;
    const response = await axios.post(url, {}, { withCredentials: true });
    setIsTiffinLiked(response.data.liked);
    toast.success(`Tiffin ${response.data.liked ? "liked" : "unliked"} successfully!`);
    return response; // <-- return response for status check
  } catch (error) {
    if (error.response?.status === 401) {
      toast.info("Please login to like the Tiffin.");
    } else {
       toast.success(`Tiffin ${response.data.liked ? "liked" : "unliked"} successfully!`);
      toast.error("Something went wrong while liking the Tiffin.");
    }
    return error.response;
  }
};

  const handleFavoriteClick = async () => {
    if (!entityType) {
      alert("Cannot perform favorite action: Entity type unknown.");
      return;
    }

    if (entityType === "firm") {
      const isFav = await checkFirmFavoriteStatus(id);
      if (isFav) {
        const confirmRemove = window.confirm(
          "This firm is already in your favorites. Do you want to remove it?"
        );
        if (confirmRemove) {
          await removeFavorite();
        }
      } else {
        await handleFav();
      }
    } else if (entityType === "tiffin") {
      await handleTiffinLikeToggle();
    } else {
      alert("Cannot perform favorite action: Unknown entity type.");
    }
  };

 // For Firm
const addtoFavorite = async () => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/firm/users/${id}/liked`,
      {},
      { withCredentials: true }
    );
    return response; // <-- important to return
  } catch (error) {
    return error.response; // <-- return error.response for 401
  }
};


  if (loading) return <div>Loading...</div>;
console.log(entityType === 'firm' ? isFirmFavorite : entityType === 'tiffin' ? isTiffinLiked : false)
  return (
    <div className={css.outerDiv}>
      <div
        className={`${css.innerDiv} max-xl:ml-12  max-h-[60vh] max-xl:mr-12 max-sm:mr-6 max-sm:ml-6`}
      >
        <div className={css.scr1}>
          <GalleryImgCard
            imgSrc={images[0]}
            onClick={() => openModal(0)}
            need={true}
            handleFavoriteClick={handleFavoriteClick}
            addtoFavorite={entityType === 'firm' ? addtoFavorite:handleTiffinLikeToggle}
            entityType={entityType}
            isFavorite={entityType === 'firm' ? isFirmFavorite : entityType === 'tiffin' ? isTiffinLiked : false}
            
          />
        </div>
        <div className={css.scr2}>
          <GalleryImgCard imgSrc={images[1]} onClick={() => openModal(1)} className={css.hideOnMobile} />
          <ViewGalleryImgCard
            imgSrc={images[3] || images[0]}
            onClick={() => openModal(0)}
          />
          <GalleryImgCard imgSrc={images[2]}   onClick={() => openModal(2)}    />
        </div>
      </div>

      {isModalOpen && (
        <div className={css.modalOverlay} onClick={closeModal}>
          <button
            onClick={goToPrev}
            className={css.navButton}
            style={{ left: "5%" }}
          >
            ❮
          </button>

          <img
            src={images[activeImageIndex]}
            alt={`Gallery Image ${activeImageIndex + 1}`}
            className={css.modalImage}
          />

          <button
            onClick={goToNext}
            className={css.navButton}
            style={{ right: "5%" }}
          >
            ❯
          </button>

          <button onClick={closeModal} className={css.closeButton}>
            ×
          </button>

          <div className={css.thumbnailContainer}>
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className={`${css.thumbnail} ${
                  activeImageIndex === index ? css.activeThumbnail : ""
                }`}
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

export default HeroComponent;