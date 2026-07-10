import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { IoIosAdd, IoIosRemoveCircleOutline } from "react-icons/io";
import { cartUpdateEvent } from "../../components/Navbars/NavigationBar2/NavigationBar2";
import css from "./AddtoCart.module.css";

const AddToCartModal = ({
  data,
  quantity: initialQuantity,
  onClose,
  showNotification,
}) => {
  const isCombo = data.items && data.items.length > 0;
  const { ttl, price: basePrice, originalPrice, items, imgSrc } = data;
  const [selectedOption, setSelectedOption] = useState("3 Chapati");
  const [addOns, setAddOns] = useState([]);
  const [quantity, setQuantity] = useState(initialQuantity);
  const [totalPrice, setTotalPrice] = useState(
    isCombo ? basePrice : basePrice * quantity
  );

  useEffect(() => {
    if (!isCombo) {
      const addOnTotal = addOns.reduce((sum, addOn) => {
        const item = addOnOptions.find((opt) => opt.name === addOn);
        return item ? sum + item.price : sum;
      }, 0);
      setTotalPrice((basePrice + addOnTotal) * quantity);
    }
  }, [addOns, quantity, isCombo, basePrice]);

  const handleQuantityChange = (delta) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
  };

  const addOnOptions = [
    { name: "Roasted Papad", price: 30 },
    { name: "Butter Chapati (1pc)", price: 28 },
    { name: "Chapati (1 Pcs)", price: 24 },
    { name: "Steam Rice (500ml)", price: 110 },
    { name: "Jeera Rice (500ml)", price: 150 },
  ];

  const handleAddToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItemIndex = cart.findIndex(
      (item) => item.ttl === ttl && item.isCombo === isCombo
    );

    const cartItem = {
      ...data,
      quantity: isCombo ? 1 : quantity,
      selectedOption,
      addOns,
      totalPrice,
      isCombo,
      comboItems: isCombo ? items : undefined,
    };

    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += isCombo ? 1 : quantity;
      cart[existingItemIndex].totalPrice += totalPrice;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    // Dispatch event for cart update
    window.dispatchEvent(new Event("storage"));
    showNotification(ttl);
    onClose();
  };

  return (
    <div className={css.modalOverlay}>
      <div className={css.modalContent}>
        <div className={css.modalHeader}>
          <h2>Your cart from</h2>
          <h3>{ttl}</h3>
          <button onClick={onClose} className={css.closeBtn}>
            <IoClose size={24} />
          </button>
        </div>

        <div className={css.modalBody}>
          <div className={css.itemDetails}>
            <div className={css.itemImage}>
              <img src={imgSrc} alt={ttl} />
            </div>
            <div className={css.itemInfo}>
              <h4>{ttl}</h4>
              <p className={css.itemPrice}>₹{basePrice}</p>
            </div>
            <div className={css.quantityControls}>
              <button
                onClick={() => handleQuantityChange(-1)}
                className={css.quantityBtn}
                disabled={quantity <= 1}
              >
                <IoIosRemoveCircleOutline />
              </button>
              <span className={css.quantity}>{quantity}×</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className={css.quantityBtn}
              >
                <IoIosAdd />
              </button>
            </div>
          </div>

          {!isCombo && (
            <>
              <div className={css.optionsSection}>
                <h4>Choice of Breads / Rice</h4>
                <div className={css.optionsList}>
                  {["3 Chapati", "Jeera Rice"].map((option) => (
                    <label key={option} className={css.optionItem}>
                      <input
                        type="radio"
                        name="choice"
                        value={option}
                        checked={selectedOption === option}
                        onChange={(e) => setSelectedOption(e.target.value)}
                      />
                      <span className={css.optionLabel}>{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className={css.addOnsSection}>
                <h4>Add Ons (optional)</h4>
                <div className={css.addOnsList}>
                  {addOnOptions.map((addon) => (
                    <label key={addon.name} className={css.addOnItem}>
                      <div className={css.addOnInfo}>
                        <input
                          type="checkbox"
                          checked={addOns.includes(addon.name)}
                          onChange={() =>
                            setAddOns((prev) =>
                              prev.includes(addon.name)
                                ? prev.filter((item) => item !== addon.name)
                                : [...prev, addon.name]
                            )
                          }
                        />
                        <span className={css.addOnLabel}>{addon.name}</span>
                      </div>
                      <span className={css.addOnPrice}>+₹{addon.price}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className={css.modalFooter}>
          <button className={css.continueBtn} onClick={handleAddToCart}>
            Continue
            <span className={css.totalAmount}>₹{totalPrice.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCartModal;
