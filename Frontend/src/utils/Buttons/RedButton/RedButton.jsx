import React from 'react';
import css from './RedButton.module.css';

const RedButton = (props) => {
  const { txt, count, isActive, onClick,...restProps } = props;
  
  return (
    <div className={`${css.btn} ${css.redButton} ${isActive ? css.activeButton : ''}`} {...restProps} onClick={onClick} >
      {txt} <span className={css.count}>({count})</span>
    </div>
  );
};

export default RedButton;