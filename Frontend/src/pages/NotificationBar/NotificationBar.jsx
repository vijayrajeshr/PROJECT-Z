import { useState, useEffect } from "react";
import css from "./NotificationBar.module.css";

const NotificationBar = ({ item, count, onClose, onViewCart }) => {
  return (
    <div className={css.notificationBar}>
      <div className={css.text}>
        {count}{item} added to cart
        <button className={css.viewCartBtn} onClick={onViewCart}>View Cart</button>
      </div>
      <button className={css.closeBtn} onClick={onClose}>×</button>
    </div>
  );
};

export default NotificationBar;
