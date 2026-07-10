import React from "react";

import css from "./ViewGalleryImgCard.module.css";

const ViewGalleryImgCard = ({ imgSrc, onClick }) => {
  return (
    <div className={css.card} onClick={onClick}>
      <img src={imgSrc} alt="View Gallery" className={css.img} />
      <div className={css.overlay}>
        <span className={css.text}>View Gallery</span>
      </div>
    </div>
  );
};

export default ViewGalleryImgCard;
