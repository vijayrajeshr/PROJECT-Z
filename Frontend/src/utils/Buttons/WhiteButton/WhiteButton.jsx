import React from 'react';
import css from './WhiteButton.module.css';

const WhiteButton = (props) => {
  const { txt, count, isActive, onClick,...restProps } = props;
  console.log(` white button ${txt}   ${isActive} `)
  return (
    <div className={`${css.btn} ${css.whiteButton} ${isActive ? css.activeButton : ''}`} {...restProps} onClick={onClick} >
      {txt} <span className={css.count}>({count})</span>
    </div>
  );
};

export default WhiteButton;