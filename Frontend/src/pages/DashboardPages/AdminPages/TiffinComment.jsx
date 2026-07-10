import React, { useState } from "react";

const commentsData = [
  {
    id: 1,
    name: "Michael Scott",
    profilePic: "https://via.placeholder.com/50",
    rating: 4.5,
    date: "2 days before",
    comment:
      "The ambiance was amazing, and the food was delicious! The staff was friendly, and the service was quick. I’ll definitely recommend this place to my friends and family.",
  },
  {
    id: 2,
    name: "Pam Beesly",
    profilePic: "https://via.placeholder.com/50",
    rating: 4,
    date: "2 days before",
    comment:
      "Great experience overall. The pasta was perfectly cooked, but the dessert options could use some variety. Still, a solid dining experience!",
  },
  {
    id: 3,
    name: "Jim Halpert",
    profilePic: "https://via.placeholder.com/50",
    rating: 3.8,
    date: "2 days before",
    comment:
      "Decent food but slightly overpriced for the portion sizes. The location is convenient, though, and the atmosphere is cozy.",
  },
];

const CommentSection = () => {
  const [expandedComments, setExpandedComments] = useState([]);

  const toggleComment = (id) => {
    setExpandedComments((prev) =>
      prev.includes(id)
        ? prev.filter((commentId) => commentId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      {commentsData.map((comment) => (
        <div
          key={comment.id}
          className="bg-white border rounded-lg p-4 mb-4 shadow-md"
        >
          <div className="flex items-center mb-3">
            <img
              src={comment.profilePic}
              alt={comment.name}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h3 className="font-semibold">{comment.name}</h3>
              <div className="flex items-center">
                <span className="text-yellow-500 text-lg mr-2">★</span>
                <span className="text-lg font-semibold">{comment.rating}</span>
              </div>
              <span className="text-gray-500 text-sm">{comment.date}</span>
            </div>
          </div>
          <p className="text-gray-800">
            {expandedComments.includes(comment.id)
              ? comment.comment
              : `${comment.comment.slice(0, 100)}...`}
          </p>
          <button
            onClick={() => toggleComment(comment.id)}
            className="text-blue-500 mt-2"
          >
            {expandedComments.includes(comment.id) ? "Show Less" : "Show More"}
          </button>
          <div className="flex justify-end mt-4 space-x-2">
            <button className="bg-green-500 text-white px-3 py-1 rounded-lg shadow-md">
              ✓
            </button>
            <button className="bg-red-500 text-white px-3 py-1 rounded-lg shadow-md">
              ✗
            </button>
            <button className="bg-gray-200 px-3 py-1 rounded-lg shadow-md">
              Reply
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentSection;
