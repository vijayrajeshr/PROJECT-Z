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
import { useContextData } from "../../../context/OutletContext";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RestaurantReviews = () => {
  const { axiosApi } = useContextData();
  const { id } = useParams();
  const [timeFilter, setTimeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingReply, setEditingReply] = useState(null);
  const token = localStorage.getItem("token");

  // Synchronize replyText when editingReply changes
  useEffect(() => {
    if (editingReply) {
      const review = reviews.find((rev) => rev._id === editingReply);
      if (review?.ownerReply?.reply) {
        setReplyText(review.ownerReply.reply);
      }
    }
  }, [editingReply, reviews]);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosApi.get(
          `/firm/restaurants/get-reviews/${id}`,
          {
            withCredentials: true,
          }
        );
        setReviews(
          response.data?.reviews?.map((r) => ({
            ...r,
            isHidden: r.isHidden || false,
          })) || []
        );
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError(err.response?.data?.error || err.message);
        toast.error(err.response?.data?.error || "Failed to fetch reviews");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [id]);

  const deleteReview = async (reviewId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this review permanently?"
      )
    ) {
      return;
    }
    try {
      await axiosApi.delete(`/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setReviews(reviews.filter((rev) => rev._id !== reviewId));
      toast.success("Review deleted successfully");
    } catch (err) {
      console.error("Error deleting review:", err);
      setError(err.response?.data?.error || "Failed to delete review");
      toast.error(err.response?.data?.error || "Failed to delete review");
    }
  };

  const toggleHideReview = async (reviewId, currentIsHidden) => {
    const newIsHidden = !currentIsHidden;
    try {
      await axiosApi.put(
        `/api/reviews/restaurant-owner/reviews-hide/${reviewId}`,
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
      toast.success(
        `Review ${newIsHidden ? "hidden" : "unhidden"} successfully`
      );
    } catch (err) {
      console.error("Error updating review visibility:", err);
      setError(
        err.response?.data?.error || "Failed to update review visibility"
      );
      toast.error(
        err.response?.data?.error || "Failed to update review visibility"
      );
    }
  };

  const submitReply = async (reviewId) => {
    try {
      await axiosApi.post(
        `/api/reviews/restaurant-owner/commentandedit-reply/${id}/${reviewId}`,
        {
          reply: replyText,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setReviews(
        reviews.map((rev) =>
          rev._id === reviewId
            ? { ...rev, ownerReply: { reply: replyText } }
            : rev
        )
      );
      setReplyText("");
      setReplyingTo(null);
      setEditingReply(null);
      toast.success("Reply submitted successfully");
    } catch (err) {
      console.error("Error submitting reply:", err);
      setError(err.response?.data?.error || "Failed to submit reply");
      toast.error(err.response?.data?.error || "Failed to submit reply");
    }
  };

  const filteredAndSortedReviews = useMemo(() => {
    const now = new Date();
    return reviews
      .filter((review) => {
        const reviewDate = new Date(review.date || review.createdAt);
        if (isNaN(reviewDate.getTime())) return false;
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
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "rating") {
          return b.rating - a.rating;
        }
        const dateA = new Date(a.date || a.createdAt);
        const dateB = new Date(b.date || b.createdAt);
        return dateB - dateA;
      });
  }, [reviews, timeFilter, sortBy]);

  const stats = useMemo(() => {
    const visibleReviews = filteredAndSortedReviews.filter((r) => !r.isHidden);
    const uniqueCustomers = new Set(
      visibleReviews.map((r) => r.email || r.authorName?._id)
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

  const renderStars = (rating) => {
    const getBadgeColor = () => {
      if (rating <= 2) return "bg-orange-600";
      if (rating < 4) return "bg-yellow-500";
      return "bg-green-800";
    };
    return (
      <div
        className={`flex items-center ${getBadgeColor()} text-white rounded px-2 py-0.5`}
      >
        <span className="font-bold mr-0.5">{Math.round(rating)}</span>
        <Star className="w-3 h-3 fill-current" />
      </div>
    );
  };

  if (loading) return <div className="text-center p-6">Loading reviews...</div>;
  if (error)
    return <div className="text-center p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">Restaurant Reviews</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-white rounded-lg border border-gray-200 flex items-center">
          <Star className="w-6 h-6 text-yellow-400" />
          <div className="ml-3">
            <div className="text-xl font-bold">{stats.avgRating}</div>
            <div className="text-sm text-gray-600">Avg Rating</div>
          </div>
        </div>
        <div className="p-4 bg-white rounded-lg border border-gray-200 flex items-center">
          <MessageSquare className="w-6 h-6 text-blue-500" />
          <div className="ml-3">
            <div className="text-xl font-bold">{stats.totalReviews}</div>
            <div className="text-sm text-gray-600">Total Reviews</div>
          </div>
        </div>
        <div className="p-4 bg-white rounded-lg border border-gray-200 flex items-center">
          <Users className="w-6 h-6 text-green-500" />
          <div className="ml-3">
            <div className="text-xl font-bold">{stats.uniqueCustomers}</div>
            <div className="text-sm text-gray-600">Unique Customers</div>
          </div>
        </div>
        <div className="p-4 bg-red-50 rounded-lg border border-gray-200 flex items-center">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <div className="ml-3">
            <div className="text-xl font-bold">{stats.attentionNeeded}</div>
            <div className="text-sm text-gray-600">Attention Needed</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <select
          className="p-2 border border-gray-300 rounded-lg min-w-[150px]"
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
        >
          <option value="all">All Time</option>
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
        </select>
        <select
          className="p-2 border border-gray-300 rounded-lg min-w-[150px]"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date">Sort by Date</option>
          <option value="rating">Sort by Rating</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4 text-gray-600">Customer Email</th>
              <th className="text-left p-4 text-gray-600">Rating</th>
              <th className="text-left p-4 text-gray-600">Date</th>
              <th className="text-left p-4 text-gray-600">Comment</th>
              <th className="text-left p-4 text-gray-600">Reply</th>
              <th className="text-left p-4 text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedReviews.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center p-6 text-gray-500 italic"
                >
                  No reviews found.
                </td>
              </tr>
            ) : (
              filteredAndSortedReviews.map((review) => (
                <tr
                  key={review._id}
                  className={`border-b hover:bg-gray-50 ${
                    review.isHidden ? "opacity-50 bg-gray-100" : ""
                  }`}
                >
                  <td className="p-4">
                    {review.email || review.authorName?.email || "N/A"}
                  </td>
                  <td className="p-4">{renderStars(review.rating)}</td>
                  <td className="p-4">
                    <div className="flex flex-col text-sm">
                      <span>
                        {new Date(
                          review.date || review.createdAt
                        ).toLocaleDateString()}
                      </span>
                      <span className="text-gray-500">
                        {new Date(
                          review.date || review.createdAt
                        ).toLocaleTimeString()}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 max-w-xs break-words">
                    {review.comments}
                  </td>
                  <td className="p-4">
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
                          className="mt-2 text-xs text-blue-600 hover:text-blue-800 flex items-center"
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
                          className="w-full p-2 border border-gray-300 rounded-lg text-sm"
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
                            className="text-xs text-gray-600 hover:text-gray-800 flex items-center"
                          >
                            <X className="w-3 h-3 mr-1" /> Cancel
                          </button>
                          <button
                            onClick={() => submitReply(review._id)}
                            className="text-xs text-green-600 hover:text-green-800 flex items-center"
                          >
                            <Save className="w-3 h-3 mr-1" /> Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setReplyingTo(review._id);
                          setReplyText("");
                          setEditingReply(null);
                        }}
                        className="flex items-center text-blue-500 hover:text-blue-700 text-sm"
                      >
                        <Reply className="w-4 h-4 mr-1" /> Reply
                      </button>
                    )}
                  </td>
                  <td className="p-4 space-y-2 flex flex-col items-start">
                    <button
                      onClick={() =>
                        toggleHideReview(review._id, review.isHidden)
                      }
                      className={`flex items-center text-sm px-2 py-1 rounded ${
                        review.isHidden
                          ? "text-yellow-600 hover:text-yellow-800"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      {review.isHidden ? (
                        <Eye className="w-4 h-4 mr-1" />
                      ) : (
                        <EyeOff className="w-4 h-4 mr-1" />
                      )}
                      {review.isHidden ? "Unhide" : "Hide"}
                    </button>
                    <button
                      onClick={() => deleteReview(review._id)}
                      className="flex items-center text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded"
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

export default RestaurantReviews;
