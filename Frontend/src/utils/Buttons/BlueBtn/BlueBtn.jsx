import React from "react";
import css from "./BlueBtn.module.css";

const BlueBtn = ({ text, px = "", py = "", handleClick = () => {} }) => {
  return (
    <button
      type="button"
      className={css.btn}
      style={{ padding: `${py} ${px}` }}
      onClick={handleClick}
    >
      {text}
    </button>
  );
};

export default BlueBtn;
