import React, { useState } from "react";
import css from "./OrderTitleComponent.module.css";
import RatingUtil from "../../../utils/RestaurantUtils/RatingUtil/RatingUtil";
import infoIcon from "/icons/info.png";
import { FaDirections, FaShareAlt, FaCommentDots } from "react-icons/fa";

const OrderTitleComponent = ({
  name,
  specials,
  address,
  openingStatus,
  todayTiming,
  fullTimings,
  ratings,
  onBookTable,
  onShare,
  onReviews,
  serviceDays,
}) => {
  console.log(openingStatus, todayTiming, fullTimings);
  return (
    <div className={css.outerDiv}>
      <h1 className={css.title}>{name}</h1>
      <div className={css.innerDiv}>
        <div className={css.left}>
          <div className={css.specials}>{specials}</div>
          <div className={css.address}>{address}</div>
          <div className={css.timings}>
            <span className={css.opORclo}>{openingStatus} -</span>

            <span className={css.time}>{todayTiming}</span>
            <span className={css.infoIconBox}>
              <img className={css.infoIcon} src={infoIcon} alt="Info" />
              <div className={css.infoTooltip}>
                <div className={css.ttil}>Opening Hours</div>
                <div className={css.ttim}>{fullTimings}</div>
              </div>
            </span>
            <span className={css.time}>({serviceDays})</span>
          </div>

          {/* Button Group + Ratings Below */}
          <div className={css.buttonRatingsContainer}>
            <div className={css.buttonGroup}>
              <button className={css.actionButton} onClick={onBookTable}>
                <FaDirections className={css.icon} />
                Book a Table
              </button>
              <button className={css.actionButton} onClick={onShare}>
                <FaShareAlt className={css.icon} />
                Share
              </button>
              <button className={css.actionButton} onClick={onReviews}>
                <FaCommentDots className={css.icon} />
                Reviews
              </button>
            </div>

            {/* Ratings moved slightly below, aligned right */}
            <div className={css.ratingsBelow}>
              {ratings.map((rating, index) => (
                <RatingUtil
                  key={index}
                  rating={rating.value}
                  count={rating.count}
                  txt={rating.label}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTitleComponent;
