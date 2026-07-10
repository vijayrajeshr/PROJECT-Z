import React from "react";
import css from "./SmallSearchBarUtil.module.css";
import searchIcon from "/icons/search.png";

const SmallSearchBarUtil = ({ placeholder, value, onChange }) => {
  return (
    <div className={css.outerDiv}>
      <div className={css.innerDiv}>
        <div className={css.searchBox}>
          <img src={searchIcon} alt="search icon" className={css.srchIcon} />
          <input
            type="search"
            placeholder={placeholder}
            className={css.inpt}
            value={value} // Controlled input value
            onChange={(e) => onChange(e.target.value)} // Trigger onChange with input value
          />
        </div>
      </div>
    </div>
  );
};

export default SmallSearchBarUtil;
