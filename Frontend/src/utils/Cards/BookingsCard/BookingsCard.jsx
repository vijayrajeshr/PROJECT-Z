import React from "react";
import css from "./BookingsCard.module.css";

const BookingsCard = ({ title, address, status, timeSlot, img,guest }) => {
  return (
    <div className={css.outerDiv}>
      <div className={css.innerDiv}>
        <div className={css.header}>
          <div className={css.ttl}>{title}</div>
        </div>
        <div className={css.bdy}>
          <img src={img} alt="Restaurant" className={css.image} />
          <div className={css.address}>{address}</div>
          <div className={css.status}>Status: {status}</div>
          <div className={css.timeSlot}>Guests: {guest}</div>
          <div className={css.timeSlot}>Time Slot: {timeSlot}</div>
        </div>
        {/* <div className={css.footer}>
          <button className={css.btn}>View Booking</button>
        </div> */}
      </div>
    </div>
  );
};

export default BookingsCard;
