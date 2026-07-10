import React, { useState, useEffect, useCallback } from "react";
import { IoIosAdd, IoIosRemoveCircleOutline } from "react-icons/io";
import { useParams } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useContextData } from "../../context/OutletContext";
import { useCart } from "../../context/CartCotent"; // Corrected typo if any

import css from "./Cart.module.css";

const Cart = ({ isOpen, onClose }) => {
  const { axiosApi } = useContextData();
  const { cart, updateCartInContext } = useCart();

  console.log("Cart component rendered.");
  console.log("Full Cart object from context:", cart);
  console.log("Cart items directly from context (cart?.items):", cart?.items);
  console.log("Is cart?.items a true Array?", Array.isArray(cart?.items));
  // --- END DEBUGGING LOGS ---

  const cartItems = Array.isArray(cart?.items) ? cart.items : [];
  const subtotal = typeof cart?.subtotal === "number" ? cart.subtotal : 0;
  const deliveryFee =
    typeof cart?.deliveryFee === "number" ? cart.deliveryFee : 0;
  const platformFee =
    typeof cart?.platformFee === "number"
      ? cart.platformFee
      : cart.overallPlatformFee;
  const backendGstCharges =
    typeof cart?.gstCharges === "number" ? cart.gstCharges : 0;
  const backendTotalPrice =
    typeof cart?.totalPrice === "number" ? cart.totalPrice : 0;

  const overallOtherTaxes =
    typeof cart?.overallOtherTaxes === "number" ? cart.overallOtherTaxes : 0;
  const allOtherChargesDetails = Array.isArray(cart?.allOtherChargesDetails)
    ? cart.allOtherChargesDetails
    : [];
  const taxDetails = Array.isArray(cart?.taxDetails) ? cart.taxDetails : [];

  const [loadingItemId, setLoadingItemId] = useState(null);
  const navigate = useNavigate();

  const aggregatedOtherTaxesForDisplay = taxDetails.flatMap((td) =>
    td.appliedTaxes.filter((tax) => tax.name?.toLowerCase() !== "gst")
  );

  // const fetchOtherCharges = useCallback(async () => {
  //   try {
  //     const response = await axiosApi.get(`${import.meta.env.VITE_SERVER_URL}/api/charges/get-Charges`);
  //     // Ensure response.data is an array before filtering
  //     const applicableCharges = Array.isArray(response.data)
  //       ? response.data.filter((charge) => charge.isApplicable)
  //       : [];
  //     setOtherCharges(applicableCharges);

  //     let total = 0;
  //     applicableCharges.forEach((charge) => {
  //       const chargeValue = parseFloat(charge.value || 0); // Ensure value is a number
  //       if (charge.type === "flat") {
  //         total += chargeValue;
  //       } else if (charge.type === "percentage") {
  //         total += (chargeValue / 100) * subtotal;
  //       }
  //     });
  //     setTotalOtherCharges(total);
  //   } catch (err) {
  //     console.error("Error fetching other charges:", err);
  //     setOtherCharges([]);
  //     setTotalOtherCharges(0);
  //   }
  // }, [axiosApi, subtotal]);

  // useEffect(() => {
  //   if (isOpen) {
  //     fetchOtherCharges();
  //   }
  // }, [isOpen, subtotal, fetchOtherCharges]);

  // Helper function to create a unique key for each item
  const getItemUniqueKey = useCallback((item) => {
    if (!item) return `invalid-item-${Math.random()}`; // Handle cases where item might be undefined/null
    // For restaurantMenu items, combine productId and sourceEntityId._id
    if (item.itemType === "restaurantMenu") {
      return `${item.productId || "no-prod-id"}-${
        item.sourceEntityId?._id || "no-source-id"
      }`;
    }
    // For tiffin items, combine all relevant fields to ensure uniqueness
    if (item.itemType === "tiffin") {
      const startDate = item.startDate
        ? new Date(item.startDate).getTime()
        : "no-start-date";
      const endDate = item.endDate
        ? new Date(item.endDate).getTime()
        : "no-end-date";
      return `${item.productId || "no-prod-id"}-${
        item.sourceEntityId?._id || "no-source-id"
      }-${item.mealType || "no-meal"}-${
        item.selectedPlan || "no-plan"
      }-${startDate}-${endDate}`;
    }
    return item.productId || `unknown-type-${Math.random()}`; // Fallback for other types
  }, []);

  // const handleRemove = useCallback(async (itemToRemove) => {
  //   const uniqueKey = getItemUniqueKey(itemToRemove);
  //   setLoadingItemId(uniqueKey);

  //   try {
  //     // Simulate API call to backend to remove item (replace with actual axios call)
  //     await new Promise(resolve => setTimeout(resolve, 700));

  //     const updatedItems = cartItems.filter((item) => getItemUniqueKey(item) !== uniqueKey);
  //     updateCartInContext(updatedItems);
  //   } catch (error) {
  //     console.error("Error removing item from cart:", error);
  //     // Implement user-friendly error feedback here
  //   } finally {
  //     setLoadingItemId(null);
  //   }
  // }, [cartItems, updateCartInContext, getItemUniqueKey]);

  // const handleQuantityChange = useCallback(async (itemToUpdate, delta) => {
  //   const uniqueKey = getItemUniqueKey(itemToUpdate);
  //   setLoadingItemId(uniqueKey);

  //   try {
  //     // Simulate API call to backend to update quantity (replace with actual axios call)
  //     await new Promise(resolve => setTimeout(resolve, 700));

  //     const updatedItems = cartItems
  //       .map((item) => {
  //         if (getItemUniqueKey(item) === uniqueKey) {
  //           const newQuantity = (item.quantity || 0) + delta; // Ensure quantity is handled as a number
  //           return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
  //         }
  //         return item;
  //       })
  //       .filter(Boolean); // Remove nulls (items with quantity 0 or less)

  //     updateCartInContext(updatedItems);
  //   } catch (error) {
  //     console.error("Error updating item quantity:", error);
  //     // Implement user-friendly error feedback here
  //   } finally {
  //     setLoadingItemId(null);
  //   }
  // }, [cartItems, updateCartInContext, getItemUniqueKey]);
  // const cartItems = cart?.items || [];
  // const subtotal = cart?.subtotal || 0;
  // const deliveryFee = cart?.deliveryFee || 0;
  // const platformFee = cart?.platformFee || 0;
  // const backendGstCharges = cart?.gstCharges || 0;
  // const backendTotalPrice = cart?.totalPrice || 0;
  // const taxDetails = cart?.taxDetails || []; // Access taxDetails
  const { id } = useParams();
  const [otherCharges, setOtherCharges] = useState([]);
  const [totalOtherCharges, setTotalOtherCharges] = useState(0);
  // const [loadingItemId, setLoadingItemId] = useState(null); // State for item-specific loading

  // const navigate = useNavigate();

  const fetchOtherCharges = useCallback(async () => {
    try {
      const response = await axiosApi.get(
        `${import.meta.env.VITE_SERVER_URL}/api/charges/get-Charges/${id}`
      );
      const applicableCharges = response.data.filter(
        (charge) => charge.isApplicable
      );
      setOtherCharges(applicableCharges);

      let total = 0;
      applicableCharges.forEach((charge) => {
        if (charge.type === "flat") {
          total += parseFloat(charge.value || 0);
        } else if (charge.type === "percentage") {
          total += (parseFloat(charge.value || 0) / 100) * subtotal;
        }
      });
      setTotalOtherCharges(total);
    } catch (err) {
      console.error("Error fetching other charges:", err);
      setOtherCharges([]);
      setTotalOtherCharges(0);
    }
  }, [axiosApi, subtotal]);

  useEffect(() => {
    if (isOpen) {
      fetchOtherCharges();
    }
  }, [isOpen, subtotal, fetchOtherCharges]);
  console.log(totalOtherCharges, otherCharges, "changes");
  // Helper function to create a unique key for each item
  // const getItemUniqueKey = useCallback((item) => {
  //   // For restaurantMenu items, combine productId and sourceEntityId._id
  //   if (item.itemType === "restaurantMenu") {
  //     return `${item.productId}-${item.sourceEntityId?._id}`;
  //   }
  //   // For tiffin items, combine all relevant fields to ensure uniqueness
  //   if (item.itemType === "tiffin") {
  //     return `${item.productId}-${item.sourceEntityId?._id}-${item.mealType}-${
  //       item.selectedPlan
  //     }-${new Date(item.startDate).getTime()}-${new Date(
  //       item.endDate
  //     ).getTime()}`;
  //   }
  //   return item.productId; // Fallback for other types
  // }, []);

  const handleRemove = useCallback(
    async (itemToRemove) => {
      const uniqueKey = getItemUniqueKey(itemToRemove);
      setLoadingItemId(uniqueKey); // Set loading for this specific item

      try {
        // **Simulate API call to backend to remove item**
        // In a real application, you would replace this with an actual axios.delete or axios.put call
        // to your backend API to update the cart on the server.
        await new Promise((resolve) => setTimeout(resolve, 700)); // Simulate network delay

        const updatedItems = cartItems.filter(
          (item) => getItemUniqueKey(item) !== uniqueKey
        );
        updateCartInContext(updatedItems); // Update the cart in context after successful API call
      } catch (error) {
        console.error("Error removing item from cart:", error);
        // You might want to add user-friendly error feedback here (e.g., a toast notification)
      } finally {
        setLoadingItemId(null); // Clear loading state regardless of success or failure
      }
    },
    [cartItems, updateCartInContext, getItemUniqueKey]
  );

  const handleQuantityChange = useCallback(
    async (itemToUpdate, delta) => {
      const uniqueKey = getItemUniqueKey(itemToUpdate);
      setLoadingItemId(uniqueKey); // Set loading for this specific item

      try {
        // **Simulate API call to backend to update quantity**
        // In a real application, you would replace this with an actual axios.put call
        // to your backend API to update the item quantity on the server.
        await new Promise((resolve) => setTimeout(resolve, 700)); // Simulate network delay

        const updatedItems = cartItems
          .map((item) => {
            if (getItemUniqueKey(item) === uniqueKey) {
              const newQuantity = item.quantity + delta;
              return newQuantity > 0
                ? { ...item, quantity: newQuantity }
                : null;
            }
            return item;
          })
          .filter(Boolean); // Remove nulls (items with quantity 0 or less)

        updateCartInContext(updatedItems); // Update the cart in context after successful API call
      } catch (error) {
        console.error("Error updating item quantity:", error);
        // You might want to add user-friendly error feedback here
      } finally {
        setLoadingItemId(null); // Clear loading state
      }
    },
    [cartItems, updateCartInContext, getItemUniqueKey]
  );

  const handleCheckout = useCallback(() => {
    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add items before checking out.");
      return;
    }
    onClose();
    navigate(`/orderpage/${id}`);
  }, [cartItems, onClose, navigate]);

 return (
<>
  {isOpen && <div className={css.overlay} onClick={onClose} />}
  <div className={`${css.cartSidebar} ${isOpen ? css.open : ""}`}>
    <div className={css.cartHeader}>
      <h2>Your cart</h2>
      <button
        onClick={onClose}
        className={css.closeBtn}
        aria-label="Close cart"
      >
        <IoClose size={24} />
      </button>
    </div>

    {cartItems.length === 0 ? (
      <div className={css.emptyCart}>
        <p>Your cart is empty</p>
      </div>
    ) : (
      <div className={css.cartContent}>
        {/* Scrollable Products Section */}
        <div className={css.productsSection}>
          <ul className={css.cartList}>
            {cartItems.map((item, index) => {
              const relatedTaxDetail = taxDetails.find(
                (td) =>
                  td.entityId === item.sourceEntityId ||
                  td.entityId === item.sourceEntityId?._id
              );
              const sourceName =
                relatedTaxDetail?.name || item.sourceEntityName || "Unknown";

              const itemUniqueKey = getItemUniqueKey(item);
              const isLoading = loadingItemId === itemUniqueKey;

              const itemTotalPrice =
                typeof item.price === "number" &&
                typeof item.quantity === "number"
                  ? item.price * item.quantity
                  : 0;

              return (
                <li
                  key={itemUniqueKey || `item-${index}`}
                  className={`${css.cartItem} ${
                    isLoading ? css.loading : ""
                  }`}
                >
                  <div className={css.itemInfo}>
                    <img
                      src={
                        item.img ||
                        item.productId?.image_url ||
                        "/placeholder-image.png"
                      }
                      alt={item?.name || "Cart item"}
                      className={css.itemImg}
                    />
                    <div className={css.itemContent}>
                      <div className={css.itemHeader}>
                        <h3 className={css.itemName}>{item?.name || "Unnamed Item"}</h3>
                        <p className={css.itemPrice}>
                          ${itemTotalPrice.toFixed(2)}
                        </p>
                      </div>
                      <p className={css.sourceName}>
                        From: {sourceName} (
                        {item.itemType === "restaurantMenu"
                          ? "Restaurant"
                          : "Kitchen"}
                        )
                      </p>
                      {item.itemType === "tiffin" && (
                        <div className={css.tiffinDetails}>
                          <span>Meal: {item.mealType?.name || "N/A"}</span>
                          <span>Plan: {item.selectedPlan?.name || "N/A"}</span>
                          <span>
                            Dates:{" "}
                            {item.startDate && item.endDate
                              ? `${new Date(
                                  item.startDate
                                ).toLocaleDateString()} - ${new Date(
                                  item.endDate
                                ).toLocaleDateString()}`
                              : "N/A"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={css.itemActions}>
                    {isLoading ? (
                      <div className={css.loader}></div>
                    ) : (
                      <>
                        <div className={css.quantityControls}>
                          <button
                            onClick={() => handleQuantityChange(item, -1)}
                            className={css.counterBtn}
                            aria-label="Decrease quantity"
                            disabled={isLoading}
                          >
                            <IoIosRemoveCircleOutline />
                          </button>
                          <span className={css.quantity}>
                            {item.quantity || 0}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item, 1)}
                            className={css.counterBtn}
                            aria-label="Increase quantity"
                            disabled={isLoading}
                          >
                            <IoIosAdd />
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemove(item)}
                          className={css.removeBtn}
                          aria-label="Remove item"
                          disabled={isLoading}
                        >
                          <MdDeleteOutline />
                        </button>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Static Footer Section */}
        <div className={css.cartFooter}>
          <div className={css.billDetails}>
            <div className={css.billRow}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {deliveryFee > 0 && (
              <div className={css.billRow}>
                <span>Delivery Fee</span>
                <span>${deliveryFee?.toFixed(2)}</span>
              </div>
            )}
            <div className={css.billRow}>
              <span>Platform Fee</span>
              <span>${platformFee?.toFixed(2)}</span>
            </div>

            {overallOtherTaxes > 0 && (
              <div className={css.billRow}>
                <span className={css.taxInfo}>
                  Other Taxes
                  {aggregatedOtherTaxesForDisplay.length > 0 && (
                    <div className={css.taxTooltip}>
                      {aggregatedOtherTaxesForDisplay.map((charge, idx) => (
                        <div key={idx} className={css.taxDetail}>
                          <p>
                            {charge.name}: ${charge.amount.toFixed(2)}
                            {charge.rate &&
                              ` (${parseFloat(charge.rate).toFixed(2)}%)`}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </span>
                <span>${overallOtherTaxes.toFixed(2)}</span>
              </div>
            )}

            {cart?.overallOtherCharges > 0 && (
              <div className={css.billRow}>
                <span className={css.taxInfo}>
                  Other Charges
                  {allOtherChargesDetails.length > 0 && (
                    <div className={css.taxTooltip}>
                      {allOtherChargesDetails.map((charge, idx) => (
                        <div key={idx} className={css.taxDetail}>
                          <p>
                            {charge.name}: $
                            {charge.value.toFixed(2) &&
                            charge.type === "percentage"
                              ? `${charge.value.toFixed(2)}%`
                              : charge.value.toFixed(2)}
                            {charge.type === "percentage" &&
                              charge.rate &&
                              ` (${parseFloat(charge.rate).toFixed(2)}%)`}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </span>
                <span>${cart.overallOtherCharges.toFixed(2)}</span>
              </div>
            )}

            <div className={css.billRow}>
              <span>GST</span>
              <span>${backendGstCharges.toFixed(2)}</span>
            </div>

            <div className={`${css.billRow} ${css.total}`}>
              <span>Total</span>
              <span>${backendTotalPrice.toFixed(2)}</span>
            </div>
          </div>

          <button className={css.checkoutBtn} onClick={handleCheckout}>
            Continue to Checkout
          </button>
        </div>
      </div>
    )}
  </div>
</>
);

};

export default Cart;
