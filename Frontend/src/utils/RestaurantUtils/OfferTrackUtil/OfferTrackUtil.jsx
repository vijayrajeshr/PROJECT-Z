import React from 'react'
import css from './OfferTrackUtil.module.css';
import {useNavigate} from "react-router-dom";
import { useCart } from "../../../context/CartCotent";

const OfferTrackUtil = (props) => {
  const navigate=useNavigate();
  const {cartCount}=useCart();
  const {txt1, txt2,link, ...restProps} = props;

  const handleToGo=()=>{
      if(cartCount>0){
        navigate(link);
      }
      else{
        alret("please add a items to cart..");
      }
  }

  return(
  <div className={css.outerDiv} {...restProps} onClick={handleToGo}>
    <div className={css.txtB}>{txt1}</div>
    <div className={css.txt}>{txt2}</div>
  </div>
  )
}

export default OfferTrackUtil