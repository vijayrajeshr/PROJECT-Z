
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { useContextData } from "../context/OutletContext"; // Adjust path as needed
import {toast} from "react-toastify"
const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
    deliveryFee: 0,
    platformFee: 0,
    gstCharges: 0, // Ensure GST is also initialized
    totalPrice: 0, // Ensure totalPrice is also initialized
  });
  const { axiosApi } = useContextData();

  const fetchCart = useCallback(async () => {
    try {
      const response = await axiosApi.get(
        `${import.meta.env.VITE_SERVER_URL}/api/cart`
      );
      if (response.data) {
        setCart(response.data);
        console.log("Cart fetched successfully:", response.data);
      } else {
        console.warn(
          "Unexpected cart data format from /api/cart:",
          response.data
        );
        setCart({
          items: [],
          subtotal: 0,
          deliveryFee: 0,
          platformFee: 0,
          gstCharges: 0,
          totalPrice: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart({
        items: [],
        subtotal: 0,
        deliveryFee: 0,
        platformFee: 0,
        gstCharges: 0,
        totalPrice: 0,
      });
    }
  }, [axiosApi]);

 // Replace the current updateCartInContext with this
const updateCartInContext = useCallback(
  async (updatedCartOrItems) => {
    try {
      // Build payload: accept either an items array or a full cart object
      let payload;
      if (Array.isArray(updatedCartOrItems)) {
        payload = { items: updatedCartOrItems };
      } else if (
        updatedCartOrItems &&
        typeof updatedCartOrItems === "object" &&
        !Array.isArray(updatedCartOrItems)
      ) {
        // a full cart object (may include items, subtotal, etc.)
        payload = updatedCartOrItems;
      } else {
        throw new Error("updateCartInContext expects an items array or a cart object");
      }

      const response = await axiosApi.put(
        `${import.meta.env.VITE_SERVER_URL}/api/cart`,
        payload
      );

      if (response?.data) {
        setCart(response.data);
        toast.success("Cart updated successfully!");
        console.log("Cart updated via API (PUT):", response.data);
      } else {
        console.warn("Unexpected updateCartInContext response:", response.data);
        toast.error("Unexpected updateCartInContext");
        fetchCart();
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      // Fall back to fetching a fresh version from backend
      fetchCart();
    }
  },
  [axiosApi, fetchCart]
);


  const clearCart = useCallback(() => {
    setCart({
      items: [],
      subtotal: 0,
      deliveryFee: 0,
      platformFee: 0,
      gstCharges: 0,
      totalPrice: 0,
    });
    // Optionally, send a request to the backend to clear the server-side cart as well
    try {
      axiosApi.delete(`${import.meta.env.VITE_SERVER_URL}/api/cart/clear`);
    } catch (error) {
      console.error("Error clearing cart on backend:", error);
    }
  }, []);

  const addItemToCart = useCallback(
    async (itemToAdd) => {
      try {
        const response = await axiosApi.post(
          `${import.meta.env.VITE_SERVER_URL}/api/cart`,
          { itemToAdd }
        );
        if (response.data) {
          setCart(response.data);
          console.log("Item added to cart:", response.data);
          toast.success("Item added to Cart Success.!");
        } else {
          console.warn("Unexpected addItemToCart response:", response.data);
          toast.error("Unexpected addItemToCart");
          fetchCart();
        }
      } catch (error) {
        console.error("Error adding item to cart:", error);
        toast.error("Error adding item to cart");
        fetchCart();
      }
    },
    [axiosApi, fetchCart]
  );

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    console.log("Cart state updated in context:", cart);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount: cart?.items?.length,
        deliveryFee: cart?.deliveryFee,
        platformFee: cart?.platformFee,
        gstCharges: cart?.gstCharges,
        totalPrice: cart?.totalPrice,
        subtotal: cart?.subtotal,
        // Extract address from cart.address (set by backend) or fallback to cart items
        address: cart?.address || 
                 cart?.items?.[0]?.restaurantAddress || 
                 cart?.items?.[0]?.address || 
                 "",
        fetchCart,
        addItemToCart,
        updateCartInContext,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
