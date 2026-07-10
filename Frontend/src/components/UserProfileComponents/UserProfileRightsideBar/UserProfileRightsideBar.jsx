import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useContextData } from "../../../context/OutletContext"; // Import context hook
import { Restaurant } from "../../../utils/UserProfileUtils/UserProfile/RestaurantFav/Restaurant";
// Remove the CSS module import
// import css from "./UserProfileRightsideBar.module.css";

import {
  reviewPage,
  photosPage,
  followersPage,
  recentlyviewedPage,
  bookmarksPage,
  blogpostsPage,
  orderhistoryPage,
  myaddressPage,
  favoriteordersPage,
  bookingsPage,
  resturant,
  takeawayorderPage,
  // Ensure 'notifications' and 'settings' constants are defined if used here
} from "../../../helpers/constants";

import ImgSrc from "/images/proandproplus.jpg"; // Placeholder/Default user image

import UserReviewedCard from "../../../utils/UserProfileUtils/UserProfile/Activity/UserReviewedCard/UserReviewedCard";
import UserPhotosCard from "../../../utils/UserProfileUtils/UserProfile/Activity/UserPhotosCard/UserPhotosCard";
import RecentlyViewed from "../../../utils/UserProfileUtils/UserProfile/Activity/RecentlyViewed/RecentlyViewed";
import UserBookmarks from "../../../utils/UserProfileUtils/UserProfile/Activity/UserBookmarks/UserBookmarks";
import UserBlogPosts from "../../../utils/UserProfileUtils/UserProfile/Activity/UserBlogPosts/UserBlogPosts";
import UserFollowersCard from "../../../utils/UserProfileUtils/UserProfile/Activity/UserFollowersCard/UserFollowersCard";
import OrderHistory from "../../../utils/UserProfileUtils/UserProfile/OnlineOrdering/OrderHistory/OrderHistory";
import MyAddresses from "../../../utils/UserProfileUtils/UserProfile/OnlineOrdering/MyAddresses/MyAddresses";
import FavoriteOrders from "../../../utils/UserProfileUtils/UserProfile/OnlineOrdering/FavoriteOrders/FavoriteOrders";
import YoursBooking from "../../../utils/UserProfileUtils/UserProfile/TableBooking/YoursBooking/YoursBooking";
import TakeawayOrders from "../../../utils/UserProfileUtils/UserProfile/OnlineOrdering/TakeawayOrders/TakeawayOrders";
import { TiffinOrders } from "../../../utils/UserProfileUtils/UserProfile/TiffinOrders"
import { Notification } from "./Notification"
import { TiffinOrdersFav } from "../../../utils/UserProfileUtils/UserProfile/TiffinFavOrders"
import FavTiffin from "../../../utils/UserProfileUtils/UserProfile/TiffinFav"
// Helper function to calculate days ago
// import { Restaurant } from "../../../utils/UserProfileUtils/UserProfile/RestaurantFav/Restaurant";
// Helper function to calculate days ago (you might want to move this to a utils file)
const calculateDaysAgo = (dateString) => {
  const reviewDate = new Date(dateString);
  const today = new Date();
  const differenceInTime = today.getTime() - reviewDate.getTime();
  const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
  if (isNaN(differenceInDays) || differenceInDays < 0) return "Invalid date";
  if (differenceInDays === 0) return "Today";
  if (differenceInDays === 1) return "1 day ago";
  return `${differenceInDays} days ago`;
};

let UserProfileRightsideBar = () => {
  const { axiosApi } = useContextData();
  const { userId, hashId } = useParams();

  const [currComp, setCurrComp] = useState(null);
  const [userReviews, setUserReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [reviewError, setReviewError] = useState(null);

  useEffect(() => {
    if (userId && (!hashId || hashId === reviewPage)) {
      const fetchReviews = async () => {
        setIsLoadingReviews(true);
        setReviewError(null);
        setUserReviews([]);
        console.log(`Fetching reviews for userId: ${userId}`);
        try {
          const response = axiosApi
            ? await axiosApi.get(`/api/reviews/user/profile`)
            : await fetch(`${import.meta.env.VITE_SERVER_URL}/api/reviews/user/profile`, {
              method: "GET",
              credentials: "include",
            });
          console.log(response.data);
          const data = axiosApi ? response.data?.reviews : await response?.reviews.json();
          if (!axiosApi && !response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          console.log("Reviews API Response:", data);
          setUserReviews(data || []);
        } catch (err) {
          console.error("Error fetching user reviews:", err);
          let errorMessage = "Failed to load reviews.";
          if (err.response && err.response.data && err.response.data.message) {
            errorMessage = err.response.data.message;
          } else if (err.message) {
            errorMessage = err.message;
          }
          setReviewError(errorMessage);
        } finally {
          setIsLoadingReviews(false);
        }
      };
      fetchReviews();
    }
  }, [userId, hashId, reviewPage, axiosApi]);

  useEffect(() => {
    switch (hashId) {
      case photosPage:
        setCurrComp(<UserPhotosCard hashId={hashId} />);
        break;
      case followersPage:
        setCurrComp(
          <UserFollowersCard
            hashId={hashId}
            userData={{ following: 0, followers: 0 }}
          />
        );
        break;
      case recentlyviewedPage:
        setCurrComp(<RecentlyViewed hashId={hashId} />);
        break;
      case bookmarksPage:
        setCurrComp(<UserBookmarks hashId={hashId} />);
        break;
      case "orders":
        setCurrComp(<TiffinOrders hashId={hashId} />);
        break;
      case "fav-Tiffin":
        setCurrComp(<FavTiffin />);
        break;
      case blogpostsPage:
        setCurrComp(<UserBlogPosts hashId={hashId} />);
        break;
      case "fav-restaurants":
        setCurrComp(<Restaurant hashid={hashId} />);
        break;
      case orderhistoryPage:
        setCurrComp(<OrderHistory hashId={hashId} />);
        break;
      case "fav-tiffin-orders":
        setCurrComp(<TiffinOrdersFav />);
        break;
      case myaddressPage:
        setCurrComp(<MyAddresses hashId={hashId} />);
        break;
      case favoriteordersPage:
        setCurrComp(<FavoriteOrders hashId={hashId} />);
        break;
      case "bookings":
        setCurrComp(<YoursBooking hashId={hashId} />);
        break;
      case "notification":
        setCurrComp(<Notification />);
        break;
      case resturant:
        setCurrComp(<Restaurant hashId={hashId} />);
        break;
      case takeawayorderPage:
        setCurrComp(<TakeawayOrders hashId={hashId} />);
        break;
      case reviewPage:
      default:
        if (isLoadingReviews) {
          setCurrComp(
            <div className="flex justify-center items-center h-48 bg-white rounded-lg shadow-md">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
              <p className="ml-4 text-gray-600">Loading reviews...</p>
            </div>
          );
        } else if (reviewError) {
          setCurrComp(
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline ml-2">{reviewError}</span>
            </div>
          );
        } else if (userReviews.length > 0) {
          setCurrComp(
            // Use a grid layout for review cards
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 w-auto p-2 ">
              {userReviews.reverse().map((review) => {
                const cardData = {
                  imgSrc: review.firmDetails?.imageUrl || ImgSrc,
                  title: review.firmDetails?.name || "Restaurant Name",
                  address:
                    review.firmDetails?.address || "Restaurant Address",
                  stars: review.rating || 0,
                  reviewText: review.comments[0] || "",
                  reviewType: review.reviewType || "N/A",
                  likes: review.likes || 0,
                  days: calculateDaysAgo(review.createdAt),
                  commentsCount: review.usercomments?.length || 0,
                  id: review._id,
                  authorName: review.authorId?.username || "Anonymous",
                  userImg: ImgSrc,
                  userId: review?.authorId?._id,
                };
                return <UserReviewedCard data={cardData} key={review._id} />;
              })}
            </div>
          );
        } else {
          setCurrComp(
            <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
              <p className="text-lg font-semibold">No reviews submitted yet.</p>
              <p className="text-sm mt-2">
                Share your first dining experience!
              </p>
            </div>
          );
        }
        break;
    }
  }, [hashId, userId, userReviews, isLoadingReviews, reviewError, reviewPage]);

  return (
    <div className="w-full">
      <div className="w-full">
        <div className="w-full">
          {currComp === null && !hashId ? (
            <div className="flex justify-center items-center h-48 bg-white rounded-lg shadow-md">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
              <p className="ml-4 text-gray-600">Loading profile data...</p>
            </div>
          ) : (
            currComp
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileRightsideBar;
