import React from "react";
import css from "./AppendMsgHr.module.css";

const AppendMsgHr = ({ text }) => {
  return (
    <div className={css.horizontalRuler}>
      <div className={css.left}></div>
      <div className={css.midText}>{text}</div>

      <div className={css.right}></div>
    </div>
  );
};

export default AppendMsgHr;
