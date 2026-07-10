import { useState } from "react";
import { TiShoppingCart } from "react-icons/ti";
import { FaMinus, FaPlus } from "react-icons/fa"; // Icons for increase/decrease
import css from "./Addtocart.module.css";

const AddToCart = ({ item }) => {
  const [cartCount, setCartCount] = useState(0);

  const handleAdd = () => {
    setCartCount(cartCount + 1);
  };

  const handleRemove = () => {
    if (cartCount > 0) setCartCount(cartCount - 1);
  };

  return (
    <div className={css.cartContainer}>
      {cartCount > 0 ? (
        <div className={css.cartActions}>
          <button className={css.cartBtn} onClick={handleRemove}>
            <FaMinus className={css.icon} />
          </button>
          <span className={css.cartCount}>{cartCount}</span>
          <button className={css.cartBtn} onClick={handleAdd}>
            <FaPlus className={css.icon} />
          </button>
        </div>
      ) : (
        <button className={css.addToCartBox} onClick={handleAdd}>
          <TiShoppingCart className={css.addToCartIcon} />
          <span className={css.addToCartText}>Add to Cart</span>
        </button>
      )}
    </div>
  );
};

export default AddToCart;
