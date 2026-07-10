// import React, { useState, useEffect, useContext } from "react";
// import css from "./ReviewsComponent.module.css";
// import RateYourExperienceCard from "../../../../../utils/Cards/RestaurantBodyCards/RateYourExperienceCard/RateYourExperienceCard";
// import RestUserReviewedCard from "../../../../../utils/RestaurantUtils/RestUserReviewedCard/RestUserReviewedCard";
// import DropdownUtil from "../../../../../utils/RestaurantUtils/DropdownUtil/DropdownUtil";
// import { useAuth } from "../../../../../context/AuthContext";
// import { useParams, Link } from "react-router-dom";
// import { Info } from "lucide-react";
// // import MianReviewedComponent from "../../../../../utils/RestaurantUtils/RestUserReviewedCard/MainComponent";
// import profilepic from "/images/profilepic.jpg";
// import dropdownIcon from "/icons/down-arrow1.png";
// import menu from "/icons/menu.png";
// import Axios from "axios";

// const ReviewsComponent = () => {
//   const [data, setData] = useState([]);
//   const { id: firmId, reviewId } = useParams();
//   const { user, profileData } = useAuth();

//   const currentUserData = profileData?.email
//     ? profileData
//     : user
//     ? { username: user }
//     : null;

//   const [selectedFilter, setSelectedFilter] = useState("All Reviews");
//   const [sortOrder, setSortOrder] = useState("Newest First");

//   const filterReviews = (filter) => {
//     setSelectedFilter(filter);
//   };

//   const sortReviews = (order) => {
//     setSortOrder(order);
//     const sortedData = [...data].sort((a, b) => {
//       const dateA = new Date(a.createdAt || 0);
//       const dateB = new Date(b.createdAt || 0);
//       if (order === "Newest First") return dateB - dateA;
//       if (order === "Oldest First") return dateA - dateB;
//       if (order === "Highest Rated") return (b.rating || 0) - (a.rating || 0);
//       if (order === "Lowest Rated") return (a.rating || 0) - (b.rating || 0);
//       return 0;
//     });
//     setData(sortedData);
//   };

//   const handleReviewSubmit = (newReview) => {
//     setData([newReview, ...data]);
//   };

//   const handleAddComment = (reviewId, commentText) => {
//     if (commentText.trim() === "") return;
//     setData((prevData) =>
//       prevData.map((review) =>
//         review._id === reviewId
//           ? {
//               ...review,
//               comments: [
//                 ...(review.comments || []),
//                 { text: commentText, timestamp: new Date().toISOString() },
//               ],
//             }
//           : review
//       )
//     );
//   };

//   useEffect(() => {
//     const fetchRestaurants = async () => {
//       try {
//         const response = await Axios.get(
//           `${
//             import.meta.env.VITE_SERVER_URL
//           }/firm/restaurants/get-reviews/${firmId}`
//         );
//         setData(response.data.reviews); // Fallback to response.data if .data is undefined
//       } catch (err) {
//         console.error("Error fetching overview:", err);
//       }
//     };
//     fetchRestaurants();
//   }, [firmId]);

//   return (
//     <div className={css.outerDiv}>
//       <div className={css.innerDiv}>
//         <div className={css.right}>
//           {currentUserData?.email ? (
//             <RateYourExperienceCard
//               userData={currentUserData}
//               firmId={firmId}
//               onReviewSubmit={handleReviewSubmit}
//             />
//           ) : (
//             <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg shadow-sm text-center w-full max-w-lg mx-auto my-8">
//               <Info className="inline-block w-5 h-5 mr-2 mb-1" />
//               Please{" "}
//               <Link
//                 to="/login"
//                 className="font-semibold underline hover:text-blue-600"
//               >
//                 log in
//               </Link>{" "}
//               or{" "}
//               <Link
//                 to="/signup"
//                 className="font-semibold underline hover:text-blue-600"
//               >
//                 sign up
//               </Link>{" "}
//               to leave a review.
//             </div>
//           )}
//         </div>
//         <div className={css.left}>
//           <div className={css.dropDowns}>
//             <DropdownUtil
//               options={["All Reviews", "Popular"]}
//               icon2={dropdownIcon}
//               filFunc={filterReviews}
//             />
//             <DropdownUtil
//               options={[
//                 "Newest First",
//                 "Oldest First",
//                 "Highest Rated",
//                 "Lowest Rated",
//               ]}
//               icon1={menu}
//               icon2={dropdownIcon}
//               filFunc={sortReviews}
//             />
//           </div>
//           <div className={css.reviewListContainer}>
//             {/* {data && data.length > 0 ? (
//               data
//                 .filter((item) => selectedFilter === "All Reviews")
//                 .map((item) => (
//                   <MianReviewedComponent
//                     key={item._id}
//                     data={item}
//                     onAddComment={handleAddComment}
//                     currentUser={currentUserData}
//                   />
//                 ))
//             ) : (
//               <div className={css.noReviews}>No reviews found.</div>
//             )} */}
//             {reviewId ? (
//               <RestUserReviewedCard
//                 data={data.filter((e) => e._id === reviewId)[0]}
//                 onAddComment={handleAddComment}
//                 currentUser={currentUserData}
//               />
//             ) : data && data.length > 0 ? (
//               // data
//               //   .filter(
//               //     (item) =>
//               //       selectedFilter === "All Reviews" ||
//               //       item.reviewType === selectedFilter
//               //   )
//               data.map((item) => (
//                 <RestUserReviewedCard
//                   key={item._id}
//                   data={item}
//                   onAddComment={handleAddComment}
//                   currentUser={currentUserData}
//                 />
//               ))
//             ) : (
//               <div className={css.noReviews}>No reviews found.</div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReviewsComponent;

import { useState, useEffect } from "react";
import Axios from "axios";
import css from "./RestUserReviewedCard.module.css";

// Importing assets
import downArrowImg from "/icons/down-arrow.png";
import starImg from "/icons/star.png";
import shareImg from "/icons/share.png";
import likeImg from "/icons/like.png";
import likedImg from "/icons/liked.png";
import comment1 from "/icons/message.png";
import close from "/icons/close.png";

// Importing components
import RatingNumberBox from "../RatingNumberBox/RatingNumberBox";
import WhiteBtnHov from "../../Buttons/WhiteBtnHov/WhiteBtnHov";
import RedBtnHov from "../../Buttons/RedBtnHov/RedBtnHov";
import { useContextData } from "../../../context/OutletContext";
import { useAuth } from "../../../context/AuthContext";
import { MapPin } from "lucide-react";

const RestUserReviewedCard = (props) => {
  const { axiosApi } = useContextData();
  if (!props?.data) return <p>No reviews found.</p>;
  console.log(props)
  const {
    author_name,
    date,
    rating,
    comments,
    ownerReply,
    reviewer_location,
    usercomments,
    followers,
  reviewType,
    likes,
    _id,
  } = props.data;
  // States
  console.log(props.data);
  const [alertBoxCss, setAlertBoxCss] = useState(
    [css.alertBox, css.dnone].join(" ")
  );
  const [liked, setLiked] = useState(false);
  const [toggleDropDown, setToggleDropDown] = useState(false);
  const [toggleCommentBox, setToggleCommentBox] = useState(false);
  const [following, setFollowing] = useState(false);
  const [comment, setComment] = useState("");
  const [likeCount, setLikeCount] = useState(likes); // Initialize as 0 since likes not provided
  const [followerCount, setFollowerCount] = useState(followers); // Initialize as 0 since followers not provided
  const [commentList, setCommentList] = useState(usercomments || []);
  const [replyMap, setReplyMap] = useState({}); // Tracks replies by commentId
  const [visibleReplies, setVisibleReplies] = useState({}); // Tracks visible replies by commentId

  const { user, userId } = useAuth();
  const userImg =
    localStorage.getItem("userProfilePhoto") || "/icons/default-user.png"; // Fallback image

  // Handlers
  const toggleDropdown = () => {
    setToggleDropDown((prev) => !prev);
  };

  const shareURL = () => {
    navigator.clipboard.writeText(document.URL + `/${_id}`);
    setAlertBoxCss(css.alertBox);
    setTimeout(() => {
      setAlertBoxCss([css.alertBox, css.dnone].join(" "));
    }, 5000);
  };

  const closeAlert = () => {
    setAlertBoxCss([css.alertBox, css.dnone].join(" "));
  };

  const handleLike = () => {
    if(reviewType==='tiffin'){
      axiosApi
      .post(`/api/reviews/tiffin/${_id}/like`, {
        withCredentials: true,
      })
      .then((response) => {
        setLikeCount(response.data.likes);
        setLiked((prev) => !prev);
      })
      .catch((error) => {
        console.log(error);
      });
    }
    else{
      axiosApi
      .post(`/api/reviews/${_id}/like`, {
        withCredentials: true,
      })
      .then((response) => {
        setLikeCount(response.data.likes);
        setLiked((prev) => !prev);
      })
      .catch((error) => {
        console.log(error);
      });
    }
    
  };

  const handleFollow = () => {
    if(reviewType==='tiffin'){
        axiosApi
      .post(`/api/reviews/tiffin/${_id}/follow`, {
        withCredentials: true,
      })
      .then((response) => {
        setFollowerCount(response.data.followers);
        setFollowing((prev) => !prev);
      })
      .catch((error) => {
        console.log(error);
      });
    }
    else{
      axiosApi
      .post(`/api/reviews/${_id}/follow`, {
        withCredentials: true,
      })
      .then((response) => {
        setFollowerCount(response.data.followers);
        setFollowing((prev) => !prev);
      })
      .catch((error) => {
        console.log(error);
      });
    }
    
  };

  useEffect(() => {
    if (!props.data._id) {
      return;
    }
    const fetchReviewStatus = async () => {
      try {
        const response = await axiosApi.get(`/api/reviews/${_id}/status`, {
          withCredentials: true,
        });

        const { isFollow, isLike, followers, likes } = response.data.data;
        setFollowing(isFollow);
        setLiked(isLike);
        setFollowerCount(followers);
        setLikeCount(likes);
      } catch (error) {
        console.error("Error fetching review status:", error);
        setFollowing(false);
        setLiked(false);
      }
    };

    fetchReviewStatus();
  }, []);

  const handleComment = () => {
    if (!comment.trim()) return;
    if(reviewType=="tiffin"){
      axiosApi
      .post(`/api/reviews/tiffin/${_id}/comments`, {
        comment,
        user,
      })
      .then((response) => {
        const newReview = response.data.review;
        const latestComment =
          newReview.usercomments[newReview.usercomments.length - 1]; // Get the latest one
        setCommentList([...commentList, latestComment]); // Use backend-provided comment
        setComment(""); // Clear input
        setToggleCommentBox(true);
      })
      .catch((error) => {
        console.log(error);
      });
    }
    else{
      axiosApi
      .post(`/api/reviews/${_id}/comments`, {
        comment,
        user,
      })
      .then((response) => {
        const newReview = response.data.review;
        const latestComment =
          newReview.usercomments[newReview.usercomments.length - 1]; // Get the latest one
        setCommentList([...commentList, latestComment]); // Use backend-provided comment
        setComment(""); // Clear input
        setToggleCommentBox(true);
      })
      .catch((error) => {
        console.log(error);
      });
    }
  };

  const handleReply = async (commentId) => {
    const reply = replyMap[commentId];
    if (!reply?.trim()) return;
    if(reviewType==="tiffin"){
      try {
      const res = await axiosApi.post(
        `/api/reviews/tiffin/${_id}/comments/${commentId}/replies`,
        {
          reply,
          userId,
          user,
        }
      );

      const updatedComments = commentList.map((c) => {
        if (c.commentId === commentId) {
          return {
            ...c,
            replies: [
              ...(c.replies || []),
              {
                reply,
                username: user,
                createdAt: new Date().toISOString(),
              },
            ],
          };
        }
        return c;
      });

      setCommentList(updatedComments);
      setReplyMap({ ...replyMap, [commentId]: "" });
    } catch (err) {
      console.error("Failed to post reply", err);
    }
    }
    else{
      try {
      const res = await axiosApi.post(
        `/api/reviews/${_id}/comments/${commentId}/replies`,
        {
          reply,
          userId,
          user,
        }
      );

      const updatedComments = commentList.map((c) => {
        if (c.commentId === commentId) {
          return {
            ...c,
            replies: [
              ...(c.replies || []),
              {
                reply,
                username: user,
                createdAt: new Date().toISOString(),
              },
            ],
          };
        }
        return c;
      });

      setCommentList(updatedComments);
      setReplyMap({ ...replyMap, [commentId]: "" });
    } catch (err) {
      console.error("Failed to post reply", err);
    }
    }
  };

  const handleViewMoreReplies = (commentId) => {
    setVisibleReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId], // Toggle visibility
    }));
  };
  // Time Function
  function formatReviewDate(reviewDate) {
    // Handle "5 days ago on OpenTable" format
    if (typeof reviewDate === "string" && reviewDate.includes("ago")) {
      return reviewDate.split(" on ")[0]; // Extract "5 days ago"
    }
    const now = new Date();
    const then = new Date(reviewDate);
    const diffMs = now - then;

    const sec = Math.floor(diffMs / 1000);
    const min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);
    const days = Math.floor(hr / 24);

    if (days >= 7) {
      return then.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } else if (days >= 2) {
      return `${days} days`;
    } else if (days === 1) {
      return "Yesterday";
    } else if (hr >= 1) {
      return `${hr} hour${hr > 1 ? "s" : ""}`;
    } else if (min >= 1) {
      return `${min} minute${min > 1 ? "s" : ""}`;
    } else {
      return "Just now";
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition p-5 mb-6 w-full">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center text-white font-bold text-lg mr-4">
            {author_name ? (
              <span
                className="uppercase bg-gradient-to-br text-black bg-red-300 w-full h-full flex items-center justify-center"
                aria-label={`Avatar for ${author_name}`}
                title={author_name}
              >
                {author_name?.slice(0, 2).toUpperCase() || "?"}
              </span>
            ) : (
              <span
                className="uppercase bg-gradient-to-br text-black bg-red-300 w-full h-full flex items-center justify-center"
                aria-label="Avatar for Unknown User"
                title="Unknown User"
              >
                ?
              </span>
            )}
          </div>
          <div>
            <h3 className="text-md font-semibold text-gray-900">
              {author_name || "Unknown User"}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Reviews <span className="mx-2">•</span>
              {followerCount} Followers
            </p>
            {reviewer_location && (
              <div className="mt-2 flex gap-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4"></MapPin> {reviewer_location}
              </div>
            )}
          </div>
        </div>
        <div>
          <div>
            {!following ? (
              <WhiteBtnHov txt="Follow" onClick={() => handleFollow()} />
            ) : (
              <RedBtnHov txt="Following" onClick={() => handleFollow()} />
            )}
          </div>
        </div>
      </div>

      {/* Rating Box */}
      <div className="mt-2 flex items-center gap-3">
        <div className="bg-green-600 text-white text-sm font-semibold px-2 py-1 rounded flex items-center gap-1 border border-green-600">
          <span>{rating || "0.0"}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.782 1.402 8.174L12 18.896l-7.336 3.87 1.402-8.174L.132 9.21l8.2-1.192z" />
          </svg>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">{formatReviewDate(date)}</p>
      </div>

      {/* Review Text */}
      <p className="mt-3 text-base text-gray-800 leading-relaxed">
        {comments?.[0]
          ? comments[0].length > 200
            ? `${comments[0].slice(0, 200)}...`
            : comments[0]
          : "No review text provided"}
      </p>

      {/* Owner Reply */}
      {ownerReply?.reply.length > 0 ? (
        <div className="mt-4 border-l-4 border-blue-500 pl-4 bg-blue-50 py-2 rounded-md">
          <p className="text-sm text-blue-700 font-semibold mb-1">
            @{ownerReply.username}{" "}
            <span className="text-gray-500 font-normal ml-2">
              {formatReviewDate(ownerReply.createdAt)}
            </span>
          </p>
          <p className="text-sm text-gray-800">{ownerReply.reply}</p>
        </div>
      ) : (
        ""
      )}

      {/* Like + Comment Info */}
      <div className="mt-3 text-sm text-gray-500">
        <span>{likeCount} people found this helpful</span>
        <span className="mx-2">•</span>
        <span>{commentList?.length || 0} comments</span>
      </div>

      {/* Like / Comment / Share Row */}
      <div className="flex items-center mt-4 gap-8 text-sm text-gray-600">
        <div
          className="flex items-center gap-2 cursor-pointer hover:text-red-500 transition"
          onClick={() => handleLike()}
        >
          <img
            src={liked ? likedImg : likeImg}
            alt="Like"
            className="w-5 h-5"
          />
          <span>Like</span>
        </div>
        <div
          className="flex items-center gap-2 cursor-pointer hover:text-blue-500 transition"
          onClick={() => setToggleCommentBox((prev) => !prev)}
        >
          <img src={comment1} alt="Comment" className="w-5 h-5" />
          <span>Comment</span>
        </div>
        <div
          className="flex items-center gap-2 cursor-pointer hover:text-green-600 transition"
          onClick={shareURL}
        >
          <img src={shareImg} alt="Share" className="w-5 h-5" />
          <span>Share</span>
        </div>
      </div>

      {/* Comment Section */}
      {toggleCommentBox && (
        <div className="mt-4">
          {/* Scrollable Comment List */}
          {commentList?.length > 0 ? (
            <div
              className="max-h-64 overflow-y-auto border border-gray-200 rounded-md p-3 mb-4"
              style={{ scrollbarWidth: "thin" }}
            >
              {commentList.map((comment, index) => {
                const replyCount = comment.replies?.length || 0;
                const initialReplyLimit = 0; // Show only 2 replies initially
                const showAllReplies =
                  visibleReplies[comment.commentId] || false;
                const displayedReplies = showAllReplies
                  ? comment.replies
                  : comment.replies?.slice(0, initialReplyLimit);

                return (
                  <div key={index} className="flex flex-col mb-4 border-b pb-3">
                    {/* Comment Display */}
                    <div className="flex items-start">
                      <img
                        src={comment.author?.profileImage || userImg}
                        alt={comment.username || "User"}
                        className="w-8 h-8 rounded-full bg-gray-300 mr-3"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-gray-900">
                            {comment?.username || "Unknown User"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatReviewDate(comment?.date)}
                          </p>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">
                          {comment?.comment}
                        </p>

                        {/* Replies */}
                        {replyCount > 0 && (
                          <div className="mt-2 ml-4 border-l pl-3 border-gray-300">
                            {displayedReplies.map((r, ridx) => (
                              <div key={ridx} className="mb-2">
                                <p className="text-sm text-gray-800">
                                  <span className="font-semibold">
                                    {r?.username}:
                                  </span>{" "}
                                  {r.reply}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {formatReviewDate(r.createdAt)}
                                </p>
                              </div>
                            ))}
                            {replyCount > initialReplyLimit && (
                              <button
                                onClick={() =>
                                  handleViewMoreReplies(comment.commentId)
                                }
                                className="text-sm text-blue-500 hover:underline"
                              >
                                {showAllReplies
                                  ? `Hide replies`
                                  : `View ${
                                      replyCount - initialReplyLimit
                                    } more ${
                                      replyCount - initialReplyLimit === 1
                                        ? "reply"
                                        : "replies"
                                    }`}
                              </button>
                            )}
                          </div>
                        )}

                        {/* Reply Box */}
                        <div className="mt-2 flex items-start ml-4">
                          <input
                            type="text"
                            className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                            placeholder="Write a reply..."
                            value={replyMap[comment.commentId] || ""}
                            onChange={(e) =>
                              setReplyMap({
                                ...replyMap,
                                [comment.commentId]: e.target.value,
                              })
                            }
                          />
                          <button
                            onClick={() => handleReply(comment.commentId)}
                            className="ml-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                            disabled={!replyMap[comment.commentId]?.trim()}
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500 mb-4">No comments yet.</p>
          )}

          {/* Comment Input */}
          <div className="flex items-start">
            <img
              src={userImg}
              alt="User"
              className="w-10 h-10 rounded-full bg-gray-300 mr-3"
            />
            <div className="flex-1">
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                onClick={handleComment}
                className="mt-2 px-4 py-1.5 bg-blue-500 text-white rounded-md text-sm font-semibold hover:bg-blue-600 transition disabled:bg-gray-400"
                disabled={!comment.trim()}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Box */}
      <div className={alertBoxCss}>
        <div className="flex items-center justify-between px-4 py-2 bg-blue-100 text-blue-800 text-sm rounded mt-4">
          <p>Link copied to clipboard!</p>
          <button onClick={closeAlert}>
            <img src={close} alt="Close" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestUserReviewedCard;