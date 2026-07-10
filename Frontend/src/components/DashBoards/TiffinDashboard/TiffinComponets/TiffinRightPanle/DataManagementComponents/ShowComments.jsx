// import React, { useState, useEffect } from "react";
// import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";
// import { IoMdSwitch } from "react-icons/io";
// // FaUndo not used, so it's removed from imports
// import { useNavigate } from "react-router-dom";
// import StarRating from "./StarRating"; // Assuming this component displays stars
// import { MdOutlineReadMore } from "react-icons/md";
// import Axios from "axios";

// // Helper function to render star icons based on a rating
// const renderStars = (rating) => {
//   const stars = [];
//   for (let i = 1; i <= 5; i++) {
//     if (rating >= i) {
//       stars.push(<IoIosStar key={i} className="text-yellow-500" />);
//     } else if (rating >= i - 0.5) {
//       stars.push(<IoIosStarHalf key={i} className="text-yellow-500" />);
//     } else {
//       stars.push(<IoIosStarOutline key={i} className="text-gray-300" />);
//     }
//   }
//   return stars;
// };

// // Function to format date (e.g., "July 18, 2025" or "2 days ago")
// const formatDate = (dateString) => {
//   try {
//     const date = new Date(dateString);
//     if (isNaN(date)) {
//       return "Invalid Date";
//     }
//     const now = new Date();
//     const diffTime = Math.abs(now.getTime() - date.getTime());
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//     if (diffDays === 0) return "Today";
//     if (diffDays === 1) return "1 day ago";
//     if (diffDays < 7) return `${diffDays} days ago`;
//     if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;

//     // Fallback to a readable date string
//     return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
//   } catch (e) {
//     console.error("Error formatting date:", e);
//     return dateString; // Return original string if parsing fails
//   }
// };

// const CommentList = ({
//   firmId, // <-- Pass firmId as a prop (this should be the tiffin ID)
//   fullWidth = true,
//   maxHeight = true,
//   limit = null,
//   toggleShowMore = false,
// }) => {
//   const [column, setColumn] = useState(1);
//   const [reviews, setReviews] = useState([]); // Initialize as empty array
//   const [originalReviews, setOriginalReviews] = useState([]); // Store original for reset
//   const [sortOrder, setSortOrder] = useState('none'); // 'none', 'desc' (for highest rating first)
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchTiffinReviews = async () => {
//       if (!firmId) {
//         console.warn("No firmId provided to CommentList. Cannot fetch reviews.");
//         setReviews([]);
//         setOriginalReviews([]);
//         return;
//       }

//       try {
//         const response = await Axios.get(
//           `${import.meta.env.VITE_SERVER_URL}/api/tiffin-Reviews/${firmId}`
//         );

//         let fetchedReviews = [];
//         if (response.data && Array.isArray(response.data.reviews)) {
//           fetchedReviews = response.data.reviews;
//         }

//         setReviews(fetchedReviews);
//         setOriginalReviews(fetchedReviews); // Store original for sorting reset
//       } catch (err) {
//         if (Axios.isAxiosError(err) && err.response && err.response.status === 404) {
//           console.log(`No tiffin reviews found for firm ID: ${firmId}`);
//         } else {
//           console.error("Error fetching tiffin reviews:", err);
//         }
//         setReviews([]); // Ensure reviews is empty on error
//         setOriginalReviews([]);
//       }
//     };
//     fetchTiffinReviews();
//   }, [firmId]); // Re-run effect when firmId changes

//   const calculateAverageRating = () => {
//     if (!reviews || reviews.length === 0) return 0;
//     const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
//     return (totalRating / reviews.length).toFixed(1);
//   };

//   const handleRatingSort = () => {
//     let sortedReviews = [...reviews];
//     if (sortOrder === 'none' || sortOrder === 'asc') {
//       sortedReviews.sort((a, b) => b.rating - a.rating); // Sort descending (highest rating first)
//       setSortOrder('desc');
//     } else {
//       sortedReviews = [...originalReviews]; // Reset to original fetched order
//       setSortOrder('none');
//     }
//     setReviews(sortedReviews);
//   };

//   const displayedReviews = limit ? reviews.slice(0, limit) : reviews;

//   const showMore = () => {
//     // Navigate to a dedicated reviews page for this specific tiffin (firmId)
//     // You'll need to create a route like /tiffin-dashboard/:firmId/reviews
//     navigate(`/tiffin-dashboard/${firmId}/reviews`);
//   };

//   if (!firmId) {
//     return <div className="p-4 text-gray-500">Please provide a Tiffin ID to load reviews.</div>;
//   }

//   if (reviews.length === 0) {
//     return <div className="p-4 text-gray-500">No reviews available for this Tiffin yet.</div>;
//   }

//   return (
//     <div
//       className={`overflow-auto overflow-y-auto ${
//         fullWidth ? "w-full" : "w-1/2"
//       } ${maxHeight ? "" : "max-h-[50vh]"}`}
//     >
//       {/* Average Rating and Filters */}
//       <div className="flex justify-between items-center mb-1 rounded-md bg-white px-2 py-3 shadow-sm">
//         <div className="flex items-center gap-2">
//           <div className="flex items-center text-lg text-gray-600">
//             <StarRating rating={parseFloat(calculateAverageRating())} />
//           </div>
//           <span className="text-sm text-gray-600">({reviews.length} Reviews)</span>
//         </div>
//         <div className="flex gap-2">
//           <button
//             className="rounded-full border border-gray-300 text-[14px] p-2 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center"
//             onClick={() => setColumn((prev) => (prev === 1 ? 2 : 1))}
//             title="Toggle Columns"
//           >
//             <IoMdSwitch size={18} />
//           </button>
//           <button
//             className={`rounded-2xl border border-gray-300 text-[14px] px-3 py-1 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center gap-1 ${sortOrder === 'desc' ? 'font-semibold bg-gray-200' : ''}`}
//             onClick={handleRatingSort}
//             title="Sort by Rating"
//           >
//             Rating {sortOrder === 'desc' ? '↓' : (sortOrder === 'asc' ? '↑' : '')}
//           </button>
//           {toggleShowMore && (
//             <button
//               className="rounded-2xl border border-gray-300 text-[14px] px-3 py-1 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center gap-1"
//               onClick={showMore}
//               title="Read More Reviews"
//             >
//               <MdOutlineReadMore size={18} /> Show All
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Reviews Grid */}
//       <div
//         className={`grid gap-2 p-1 ${
//           column === 1 ? "lg:grid-cols-1" : "lg:grid-cols-2"
//         } grid-cols-1`}
//       >
//         {displayedReviews.map((review) => (
//           <div
//             key={review._id || review.id} // Use MongoDB's _id or your custom 'id'
//             className="border border-gray-200 shadow-sm bg-white rounded-lg p-4 flex flex-col gap-3"
//           >
//             <div className="flex items-center gap-3">
//               {/* Reviewer Image/Initials */}
//               <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-semibold text-lg flex-shrink-0">
//                 {review.author_name ? review.author_name.charAt(0).toUpperCase() : 'U'}
//               </div>
//               <div className="flex flex-col">
//                 <div className="font-semibold text-gray-800">{review.author_name || "Unknown User"}</div>
//                 <div className="flex items-center gap-1 text-sm text-gray-600">
//                   {renderStars(review.rating)}
//                   <span className="ml-1">{review.rating?.toFixed(1) || 'N/A'}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Review Content */}
//             <div className="text-gray-700 text-sm leading-relaxed">
//               {/* Assuming 'comments' is an array in reviewSchema, join them. */}
//               {review.comments && review.comments.length > 0
//                 ? review.comments.join(" ").slice(0, 200) + (review.comments.join(" ").length > 200 ? '...' : '')
//                 : "No review content provided."}
//             </div>

//             {/* Date and other info */}
//             <div className="text-xs text-gray-500 mt-auto">
//               Reviewed on {formatDate(review.createdAt || review.date)}
//             </div>
//           </div>
//         ))}
//       </div>
//       {toggleShowMore && reviews.length > limit && (
//         <div className="text-center mt-4">
//           <button
//             className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             onClick={showMore}
//           >
//             Load All Reviews ({reviews.length})
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CommentList;

import React, { useState, useEffect, useMemo } from "react";
import {
  AlertTriangle,
  MessageSquare,
  Users,
  Star,
  Reply,
  Save,
  Edit,
  X,
  Trash,
  EyeOff,
  Eye,
} from "lucide-react";
import { useContextData } from "../../../../../../context/OutletContext"; // Assuming this context provides axiosApi
import { useParams } from "react-router-dom";

const TiffinReviews = () => {
  const { axiosApi } = useContextData();
  const { id } = useParams();
  const [timeFilter, setTimeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null); // Stores review._id that is being replied to
  const [editingReply, setEditingReply] = useState(null); // Stores review._id whose reply is being edited
  const token = localStorage.getItem("token"); // Assuming token is needed for authenticated requests

  // Synchronize replyText when editingReply changes
  useEffect(() => {
    if (editingReply) {
      const review = reviews.find((rev) => rev._id === editingReply);
      if (review?.ownerReply?.reply) {
        setReplyText(review.ownerReply.reply);
      }
    } else {
      setReplyText(""); // Clear replyText when not editing
    }
  }, [editingReply, reviews]);

  // Fetch Tiffin Reviews
  useEffect(() => {
    const fetchTiffinReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosApi.get(
          `/api/tiffin/email`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` }, // Add token if this is a protected route
          }
        );
        setReviews(
          response.data?.data?.reviews?.map((r) => ({
            ...r,
            isHidden: r.isHidden || false, // Ensure isHidden property exists
          })) || []
        );
      } catch (err) {
        console.error("Error fetching tiffin reviews:", err);
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTiffinReviews();
  }, [id, axiosApi, token]); // Add axiosApi and token to dependencies

  // Delete a review
  const deleteReview = async (reviewId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this review permanently?"
      )
    ) {
      return;
    }
    try {
      // Adjusted endpoint for deleting tiffin reviews
      await axiosApi.delete(`/api/reviews/tiffin/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setReviews(reviews.filter((rev) => rev._id !== reviewId));
    } catch (err) {
      console.error("Error deleting tiffin review:", err);
      setError(err.response?.data?.error || "Failed to delete tiffin review");
    }
  };

  // Toggle review visibility (hide/unhide)
  const toggleHideReview = async (reviewId, currentIsHidden) => {
    const newIsHidden = !currentIsHidden;
    try {
      // Adjusted endpoint for toggling tiffin review visibility
      await axiosApi.put(
        `/api/reviews/tiffin-owner/reviews-hide/${reviewId}`,
        { isHidden: newIsHidden },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setReviews(
        reviews.map((rev) =>
          rev._id === reviewId ? { ...rev, isHidden: newIsHidden } : rev
        )
      );
    } catch (err) {
      console.error("Error updating tiffin review visibility:", err);
      setError(
        err.response?.data?.error || "Failed to update tiffin review visibility"
      );
    }
  };

  // Submit or edit a reply to a review
  const submitReply = async (reviewId) => {
    if (!replyText.trim()) {
      alert("Reply cannot be empty.");
      return;
    }
    try {
      // Adjusted endpoint for tiffin owner reply
      await axiosApi.post(
        `/api/reviews/tiffin-owner/commentandedit-reply/${reviewId}`,
        {
          reply: replyText,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      // Optimistically update the UI
      setReviews(
        reviews.map((rev) =>
          rev._id === reviewId
            ? {
                ...rev,
                ownerReply: {
                  reply: replyText,
                  // Assuming backend will populate username and createdAt,
                  // otherwise you can add placeholders or re-fetch for accuracy
                  username: rev.ownerReply?.username || "You", // Placeholder for immediate UI update
                  createdAt: new Date().toISOString(), // Placeholder
                },
              }
            : rev
        )
      );
      setReplyText("");
      setReplyingTo(null);
      setEditingReply(null);
    } catch (err) {
      console.error("Error submitting reply:", err);
      setError(err.response?.data?.error || "Failed to submit reply");
    }
  };

  // Memoized filtered and sorted reviews for performance
  const filteredAndSortedReviews = useMemo(() => {
    const now = new Date();
    return reviews
      .filter((review) => {
        const reviewDate = new Date(review.date || review.createdAt); // Use createdAt if date is missing
        if (isNaN(reviewDate.getTime())) return false; // Skip invalid dates

        if (timeFilter === "week") {
          return (
            reviewDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          );
        }
        if (timeFilter === "month") {
          return (
            reviewDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          );
        }
        return true; // "all" time filter
      })
      .sort((a, b) => {
        if (sortBy === "rating") {
          return b.rating - a.rating; // Sort by rating descending
        }
        // Default to sorting by date descending (newest first)
        const dateA = new Date(a.date || a.createdAt);
        const dateB = new Date(b.date || b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
  }, [reviews, timeFilter, sortBy]);

  // Memoized statistics for performance
  const stats = useMemo(() => {
    const visibleReviews = filteredAndSortedReviews.filter((r) => !r.isHidden);
    const uniqueCustomers = new Set(
      visibleReviews.map((r) => r.email || r.authorId) // Use authorId as fallback if email is not guaranteed
    );
    return {
      avgRating:
        visibleReviews.length > 0
          ? (
              visibleReviews.reduce((sum, r) => sum + r.rating, 0) /
              visibleReviews.length
            ).toFixed(1)
          : "0.0",
      totalReviews: filteredAndSortedReviews.length,
      uniqueCustomers: uniqueCustomers.size,
      attentionNeeded: filteredAndSortedReviews.filter((r) => r.rating <= 2)
        .length,
    };
  }, [filteredAndSortedReviews]);

  // Helper function to render star badge
  const renderStars = (rating) => {
    const getBadgeColor = () => {
      if (rating <= 2) return "bg-red-600"; // Changed to red for more emphasis on low rating
      if (rating < 4) return "bg-orange-500"; // Changed to orange
      return "bg-green-700"; // Slightly darker green
    };
    return (
      <div
        className={`flex items-center ${getBadgeColor()} text-white rounded px-2 py-0.5`}
      >
        <span className="font-bold mr-0.5">{rating?.toFixed(1)}</span> {/* Show one decimal */}
        <Star className="w-3 h-3 fill-current" />
      </div>
    );
  };

  // Loading and Error States
  if (loading) return <div className="text-center p-6 text-lg text-gray-700">Loading Tiffin reviews...</div>;
  if (error)
    return <div className="text-center p-6 text-red-600 font-medium">Error: {error}. Please try again later.</div>;


  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Tiffin Reviews</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center">
          <Star className="w-7 h-7 text-yellow-500 flex-shrink-0" />
          <div className="ml-4">
            <div className="text-2xl font-bold text-gray-900">{stats.avgRating}</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center">
          <MessageSquare className="w-7 h-7 text-blue-500 flex-shrink-0" />
          <div className="ml-4">
            <div className="text-2xl font-bold text-gray-900">{stats.totalReviews}</div>
            <div className="text-sm text-gray-600">Total Reviews</div>
          </div>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center">
          <Users className="w-7 h-7 text-green-500 flex-shrink-0" />
          <div className="ml-4">
            <div className="text-2xl font-bold text-gray-900">{stats.uniqueCustomers}</div>
            <div className="text-sm text-gray-600">Unique Customers</div>
          </div>
        </div>
        <div className="p-4 bg-red-100 rounded-lg shadow-sm border border-red-300 flex items-center">
          <AlertTriangle className="w-7 h-7 text-red-600 flex-shrink-0" />
          <div className="ml-4">
            <div className="text-2xl font-bold text-red-800">{stats.attentionNeeded}</div>
            <div className="text-sm text-red-600">Reviews Needing Attention</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <select
          className="p-2 border border-gray-300 rounded-lg min-w-[180px] focus:ring-blue-500 focus:border-blue-500"
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
        >
          <option value="all">All Time</option>
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
        </select>
        <select
          className="p-2 border border-gray-300 rounded-lg min-w-[180px] focus:ring-blue-500 focus:border-blue-500"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date">Sort by Date (Newest)</option>
          <option value="rating">Sort by Rating (Highest)</option>
        </select>
      </div>

      {/* Reviews Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Customer Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Comment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Your Reply</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedReviews.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500 text-base">
                  No tiffin reviews found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredAndSortedReviews.map((review) => (
                <tr
                  key={review._id}
                  className={`transition-colors duration-200 ${
                    review.isHidden ? "bg-gray-50 opacity-60" : "hover:bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {review.email || review.author_name || "N/A"} {/* Prioritize author_name */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStars(review.rating)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col">
                      <span>
                        {new Date(
                          review.date || review.createdAt
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(
                          review.date || review.createdAt
                        ).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-sm break-words text-sm text-gray-700">
                    {Array.isArray(review.comments) && review.comments.length > 0
                      ? review.comments.join(", ")
                      : review.comments || "No comment provided."} {/* Handles string or array */}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {review.ownerReply && editingReply !== review._id ? (
                      <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                        <div className="text-xs font-medium text-blue-700 mb-1">
                          Manager Reply:
                        </div>
                        <div className="text-sm text-gray-800">
                          {review.ownerReply.reply}
                        </div>
                        <button
                          onClick={() => {
                            setEditingReply(review._id);
                            setReplyingTo(null);
                          }}
                          className="mt-2 text-xs text-blue-600 hover:text-blue-800 flex items-center transition-colors"
                        >
                          <Edit className="w-3 h-3 mr-1" /> Edit
                        </button>
                      </div>
                    ) : replyingTo === review._id ||
                      editingReply === review._id ? (
                      <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                        <div className="text-xs font-medium text-blue-700 mb-1">
                          {editingReply ? "Editing Reply:" : "Add Reply:"}
                        </div>
                        <textarea
                          className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 resize-y"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type your reply here..."
                          rows={3}
                        />
                        <div className="mt-2 flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setReplyingTo(null);
                              setEditingReply(null);
                              setReplyText("");
                            }}
                            className="text-xs text-gray-600 hover:text-gray-800 flex items-center px-2 py-1 rounded transition-colors"
                          >
                            <X className="w-3 h-3 mr-1" /> Cancel
                          </button>
                          <button
                            onClick={() => submitReply(review._id)}
                            className="text-xs text-green-600 hover:text-green-800 flex items-center px-2 py-1 rounded transition-colors"
                          >
                            <Save className="w-3 h-3 mr-1" /> Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setReplyingTo(review._id);
                          setReplyText(""); // Clear reply text when starting a new reply
                          setEditingReply(null); // Ensure not in editing mode
                        }}
                        className="flex items-center text-blue-500 hover:text-blue-700 text-sm px-2 py-1 rounded transition-colors"
                      >
                        <Reply className="w-4 h-4 mr-1" /> Reply
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 space-y-2 flex flex-col items-start">
                    <button
                      onClick={() =>
                        toggleHideReview(review._id, review.isHidden)
                      }
                      className={`flex items-center text-sm px-2 py-1 rounded transition-colors ${
                        review.isHidden
                          ? "text-yellow-600 hover:text-yellow-800 bg-yellow-50" // Highlight hidden state
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      {review.isHidden ? (
                        <Eye className="w-4 h-4 mr-1" /> // Show Eye to indicate it's currently hidden
                      ) : (
                        <EyeOff className="w-4 h-4 mr-1" /> // Show EyeOff to indicate it can be hidden
                      )}
                      {review.isHidden ? "Unhide" : "Hide"}
                    </button>
                    <button
                      onClick={() => deleteReview(review._id)}
                      className="flex items-center text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded transition-colors"
                    >
                      <Trash className="w-4 h-4 mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TiffinReviews;