import React, { useEffect, useState } from "react";
import css from "./GalleryImgCard.module.css";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const GalleryImgCard = ({ imgSrc, need, addtoFavorite, entityType, isFavorite }) => {
  const [isFavorited, setIsFavorited] = useState(isFavorite || false);
  const [userEmail, setUserEmail] = useState(null);
  const { id } = useParams();

  // Extract user email from localStorage and listen for storage changes
  useEffect(() => {
    const getUserEmail = () => {
      try {
        const userProfileData = localStorage.getItem('userProfileData');
        console.log("User profile data from localStorage:", userProfileData);
        
        if (userProfileData) {
          const userData = JSON.parse(userProfileData);
          // console.log("Parsed user data:", userData);
          // Extract email from user data
          setUserEmail(userData.email);
        } else {
          // Clear email if no user data found
          setUserEmail(null);
          setIsFavorited(false);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUserEmail(null);
        setIsFavorited(false);
      }
    };

    // Get email on component mount
    getUserEmail();

    // Listen for storage changes (when user logs out from other tabs/components)
    const handleStorageChange = (e) => {
      if (e.key === 'userProfileData' || e.key === null) {
        console.log("Storage changed, updating user email...");
        getUserEmail();
      }
    };

    // Listen for custom logout event (if your app uses it)
    const handleLogout = () => {
      console.log("Logout event detected");
      setUserEmail(null);
      setIsFavorited(false);
    };

    // Add event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('logout', handleLogout); // Custom event if your app uses it
    
    // Poll for changes (fallback)
    const interval = setInterval(getUserEmail, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('logout', handleLogout);
      clearInterval(interval);
    };
  }, []);

  // Fetch initial like status when component mounts or userEmail changes
  useEffect(() => {
    const fetchIsLiked = async () => {
      // Only fetch if user is logged in and we have an entity ID
      if (!userEmail || !id) {
        setIsFavorited(false);
        return;
      }

      try {
        if (entityType === 'firm') {
          const response = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/firm/user/${id}/islike`,
            { 
              params: { email: userEmail },
              withCredentials: true 
            }
          );
          setIsFavorited(response.data.islike);
        } else {
          const url = `${import.meta.env.VITE_SERVER_URL}/api/tiffins/${id}/isliked`;
          const response = await axios.get(url, { 
            params: { email: userEmail },
            withCredentials: true 
          });
          setIsFavorited(response.data.isLiked);
        }
      } catch (error) {
        console.error("Error fetching like status:", error);
        setIsFavorited(false);
      }
    };

    fetchIsLiked();
  }, [id, entityType, userEmail]);

  const handleClick = async () => {
    // Check if user is logged in
    if (!userEmail) {
      toast.info("Please login to like this restaurant.");
      return;
    }

    try {
      // Toggle local favorite UI state optimistically
      const newFavoriteState = !isFavorited;
      setIsFavorited(newFavoriteState);

      // Call the addtoFavorite function
      await addtoFavorite();

      // Show toast message based on the new state
      if (newFavoriteState) {
        toast.success("Added to favorites! ❤️");
      } else {
        toast.info("Removed from favorites");
      }
    } catch (error) {
      // Revert UI state if API call fails
      setIsFavorited(!isFavorited);
      toast.error("Failed to update favorites");
      console.error("Error updating favorite:", error);
    }
  };

  return (
    <div className={css.outerDiv}>
      <div className={css.innerDiv}>
        <img src={imgSrc} className={css.img} alt="Gallery" />
        {need && (
          <span onClick={handleClick}>
            {isFavorited ? (
              <MdFavorite className="text-red-600 w-8 h-8 absolute top-1 right-0 cursor-pointer" />
            ) : (
              <MdFavoriteBorder className="text-white w-8 h-8 absolute top-1 right-0 cursor-pointer" />
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default GalleryImgCard;