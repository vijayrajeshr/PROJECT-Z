import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import axios from "axios";
import { useParams } from "react-router-dom";
export default function RecentReviews() {
  const [reviewFilter, setReviewFilter] = useState("all");
  const [reviews, setReviews] = useState(null);
  const token = localStorage.getItem("token");
  const { id } = useParams();
  useEffect(() => {
    const getTopMostRecentReview = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_URL
          }/api/reviews/topmostrecentreviews/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setReviews(response.data.topReviews[0].reviews);
      } catch (error) {
        console.log(error);
      }
    };
    getTopMostRecentReview();
  }, [id]);

  //time Function
  function timeAgo(isoString) {
    const now = new Date();
    const then = new Date(isoString);
    const diffMs = now - then;

    const sec = Math.floor(diffMs / 1000);
    const min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);
    const days = Math.floor(hr / 24);

    if (days >= 7) {
      // Over a week, return full date
      return then.toLocaleDateString();
    } else if (days >= 2) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (days === 1) {
      return "yesterday";
    } else if (hr >= 1) {
      return `${hr} hr${hr > 1 ? "s" : ""} ago`;
    } else if (min >= 1) {
      return `${min} min${min > 1 ? "s" : ""} ago`;
    } else {
      return "just now";
    }
  }

  function getReviewStatus(rating) {
    if (rating > 3) return "Positive";
    if (rating === 3) return "Neutral";
    return "Negative";
  }
  function ReviewFilters(filter) {
    switch (filter) {
      case "all":
        return reviews;
      case "Positive":
        return reviews.filter((e) => e.rating > 3);
      case "Neutral":
        return reviews.filter((e) => e.rating === 3);
      case "Negative":
        return reviews.filter((e) => e.rating <= 2);
      default:
        return reviews;
    }
  }

  const getReviewFilterStyle = (filter) => {
    return `px-4 py-2 text-sm font-medium ${
      reviewFilter === filter
        ? "bg-blue-600 text-white"
        : "bg-white text-gray-700 hover:bg-gray-100"
    } rounded-md transition-colors duration-200`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* Header with Filter Buttons */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Recent Reviews Section (Top 5 reviews)
        </h2>
        <div className="flex space-x-2">
          <button
            className={getReviewFilterStyle("all")}
            onClick={() => setReviewFilter("all")}
          >
            All
          </button>
          <button
            className={getReviewFilterStyle("Positive")}
            onClick={() => setReviewFilter("Positive")}
          >
            Positive
          </button>
          <button
            className={getReviewFilterStyle("Neutral")}
            onClick={() => setReviewFilter("Neutral")}
          >
            Neutral
          </button>
          <button
            className={getReviewFilterStyle("Negative")}
            onClick={() => setReviewFilter("Negative")}
          >
            Negative
          </button>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Comment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ReviewFilters(reviewFilter)?.map((review) => (
              <tr key={review._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {review.author_name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600">
                    {review.reviewText}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      getReviewStatus(review.rating) === "Positive"
                        ? "bg-green-100 text-green-800"
                        : getReviewStatus(review.rating) === "Neutral"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {getReviewStatus(review.rating)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-xs text-gray-400">
                    {timeAgo(review.date)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {ReviewFilters(reviewFilter)?.length === 0 && (
          <div className="p-4 text-center text-gray-500 italic">
            No reviews found.
          </div>
        )}
      </div>
    </div>
  );
}
