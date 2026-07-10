import React, { useState } from "react";
import css from "./RestUserReviewedCard.module.css";

const RestUserReviewedCard = ({ data, onAddComment }) => {
  const [commentText, setCommentText] = useState("");

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      onAddComment(data.id, commentText);
      setCommentText("");
    }
  };

  return (
    <div className={css.reviewCard}>
      <h3>{data.title}</h3>
      <p>{data.address}</p>
      <p>Rating: {data.stars} Stars</p>

      <div className={css.commentsSection}>
        <h4>Comments:</h4>
        {data.comments.length > 0 ? (
          data.comments.map((comment, index) => (
            <p key={index} className={css.comment}>
              {comment.text} — {new Date(comment.timestamp).toLocaleString()}
            </p>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>

      <div className={css.commentInput}>
        <input
          type="text"
          value={commentText}
          placeholder="Add a comment..."
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button onClick={handleCommentSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default RestUserReviewedCard;
