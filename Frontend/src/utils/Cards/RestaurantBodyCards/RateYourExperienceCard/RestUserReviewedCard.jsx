import React, { useState } from "react";
import { FiSend } from "react-icons/fi"; // Icon from react-icons
import css from "./RestUserReviewedCard.module.css";

const RestUserReviewedCard = ({ data, onAddComment }) => {
  const [comment, setComment] = useState("");

  const handleAddComment = () => {
    if (comment.trim() === "") return;
    onAddComment(data.id, comment);
    setComment("");
  };

  return (
    <div className={css.reviewCard}>
      <h3>{data.title}</h3>
      <p>{data.address}</p>
      <p>Stars: {data.stars}</p>

      <div className={css.commentsSection}>
        <h4>Comments:</h4>
        {data.comments.map((comment, index) => (
          <p key={index}>
            {comment.text} — <i>{comment.timestamp}</i>
          </p>
        ))}
      </div>

      <div className={css.commentInputWrapper}>
        <input
          type="text"
          className={css.commentInput}
          placeholder="Add a comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleAddComment();
          }}
        />
        {comment.trim() && (
          <FiSend
            className={css.sendIcon}
            onClick={handleAddComment}
            title="Add Comment"
          />
        )}
      </div>
    </div>
  );
};

export default RestUserReviewedCard;
