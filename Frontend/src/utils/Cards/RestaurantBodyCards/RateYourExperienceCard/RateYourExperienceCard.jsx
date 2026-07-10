import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { Star, Send, X, Loader2, Info } from "lucide-react";
import { useContextData } from "../../../../context/OutletContext";
import RadioBtn from "../../../FormUtils/RadioUtil/RadioUtil";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";

const StarRatingInput = ({ rating, setRating, disabled }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center space-x-1.5">
      {stars.map((star) => (
        <Star
          key={star}
          className={`w-7 h-7 cursor-pointer transition-all duration-150 ease-in-out transform hover:scale-110 ${
            (hoverRating || rating) >= star
              ? "text-yellow-400 fill-current"
              : "text-gray-300 hover:text-yellow-300"
          } ${
            disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
          }`}
          onMouseEnter={() => !disabled && setHoverRating(star)}
          onMouseLeave={() => !disabled && setHoverRating(0)}
          onClick={() => !disabled && setRating(star)}
        />
      ))}
    </div>
  );
};

const RateYourExperienceCard = ({ userData, firmId, onReviewSubmit }) => {
  const { axiosApi } = useContextData();
  const [stars, setStars] = useState(0);
  const [review, setReview] = useState("");
  const [reviewType, setReviewType] = useState("dining");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showReviewArea, setShowReviewArea] = useState(false);
  const { id } = useParams();
  const email = userData?.email;
  const username = userData?.username || "Guest";

  useEffect(() => {
    if (stars > 0 && !showReviewArea) {
      setShowReviewArea(true);
    }
  }, [stars, showReviewArea]);

  const handleReviewSubmit = async () => {
    if (stars === 0) {
      setError("Please select a star rating.");
      return;
    }
    if (review.trim() === "") {
      setError("Please share your experience.");
      return;
    }
    if (!email) {
      setError("Could not find user email. Please ensure you are logged in.");
      return;
    }
    if (!firmId) {
      setError("Restaurant ID is missing. Cannot submit review.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const reviewDataPayload = {
      email: email,
      date: new Date().toISOString(),
      rating: stars,
      reviewText: review,
      reviewType: reviewType,
      aspects: {},
      firm: firmId,
      tiffin: null,
    };

    try {
      const response =
        reviewType === "tiffin"
          ? await axiosApi.post(`/api/reviews/${id}`, {
              newReview: reviewDataPayload,
            })
          : await axiosApi.post(`/api/reviews/firm/${id}`, {
              newReview: reviewDataPayload,
            });

      if (onReviewSubmit && response.data && reviewType !== "tiffin") {
        onReviewSubmit(response.data.review);
      } else {
        if (onReviewSubmit && response.data) onReviewSubmit(response.data.review);
      }

      setReview("");
      setStars(0);
      setReviewType(reviewType);
      setShowReviewArea(false);
    } catch (err) {
      console.error("Error submitting review:", err);
      const errorMsg =
        err.response?.data?.error || err.message || "Failed to submit review.";
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setReview("");
    setStars(0);
    setError(null);
    setShowReviewArea(false);
  };

  return (
    <div className="bg-gray-50 sm:p-8 rounded-lg shadow-sm border border-gray-200 w-full max-w-lg mx-auto ">
      <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">
        Rate your experience
      </h2>

      <div className="mb-6 pb-4 border-b border-gray-200">
        <label className="block text-sm font-medium text-gray-600 mb-3 text-center">
          Type of Experience
        </label>
        <Formik initialValues={{ type: reviewType }} enableReinitialize>
          <Form
            className="flex flex-wrap justify-center gap-x-5 gap-y-3"
            onChange={(e) => setReviewType(e.target.value)}
          >
            <RadioBtn label="Dining" name="type" value="dining" />
            <RadioBtn label="Takeaway" name="type" value="takeaway" />
            <RadioBtn label="Tiffin" name="type" value="tiffin" />
          </Form>
        </Formik>
      </div>

      <div className="mb-6 flex flex-col items-center">
        <label className="block text-sm font-medium text-gray-600 mb-3">
          Your Rating
        </label>
        <StarRatingInput
          rating={stars}
          setRating={setStars}
          disabled={isSubmitting}
        />
      </div>

      <div
        key={showReviewArea ? "visible" : "hidden"}
        className={`transition-all duration-300 ease-out overflow-hidden ${
          showReviewArea
            ? "max-h-[500px] opacity-100 mt-5"
            : "max-h-0 opacity-0 mt-0"
        }`}
      >
        <div className="pt-4 border-t border-gray-200">
          <label
            htmlFor="reviewText"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Your Review for <span className="font-semibold">{reviewType}</span>
          </label>
          <textarea
            id="reviewText"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition duration-150 ease-in-out text-sm placeholder-gray-400"
            placeholder={`Share details of your experience, ${username}...`}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={4}
            disabled={isSubmitting}
            required
          />

          {error && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md flex items-center">
              <Info size={14} className="mr-1.5 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-400 transition duration-150 ease-in-out disabled:opacity-60"
              onClick={handleCancel}
              disabled={isSubmitting}
              title="Cancel review"
            >
              <X className="-ml-1 mr-1.5 h-4 w-4" /> Cancel
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleReviewSubmit}
              disabled={isSubmitting || review.trim() === ""}
              title="Submit your review"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />{" "}
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="-ml-1 mr-1.5 h-4 w-4" /> Submit Review
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {!showReviewArea && stars === 0 && (
        <div className="flex items-center justify-center text-sm text-gray-500 mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-md">
          <Info className="w-4 h-4 mr-2 text-indigo-400" />
          Select a star rating above to leave a review.
        </div>
      )}
    </div>
  );
};

RateYourExperienceCard.propTypes = {
  userData: PropTypes.shape({
    email: PropTypes.string,
    username: PropTypes.string,
  }),
  firmId: PropTypes.string.isRequired,
  onReviewSubmit: PropTypes.func,
};

RateYourExperienceCard.defaultProps = {
  userData: { username: "Guest" },
  onReviewSubmit: () => {},
};

export default RateYourExperienceCard;
