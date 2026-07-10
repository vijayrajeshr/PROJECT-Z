import { useState, useEffect } from "react";
import css from "./FoodItemProduct.module.css";
import infoIcon from "/icons/info.png";
import AddToCartModal from "../../../Modals/AddtoCartModal/AddtoCartModal";
import { cartUpdateEvent } from "../../../components/Navbars/NavigationBar2/NavigationBar2";
import { useContextData } from "../../../context/OutletContext";
import { useCart } from "../../../context/CartCotent";
import { useParams } from "react-router-dom";

const FoodItemProduct = (props) => {
  const { addItemToCart, cart } = useCart();
  const { id: restaurantId } = useParams();
  const { restaurantName } = props;
  const {
    imgSrc,
    ttl,
    votes,
    itemType,
    price,
    originalPrice,
    desc,
    dishInfo,
    foodType,
    subcategoryId,
    categoryId,
    id1: productId,
  } = props.data;
  const dataset = props?.dataset;
  const [readMore, setReadMore] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showNotificationBar, setShowNotificationBar] = useState(false);
  const [notificationItem, setNotificationItem] = useState("");
  // Sync initial quantity from cart context
  useEffect(() => {
    const itemInCart = cart?.items?.find(
      (item) => item.productId === productId
    );
    if (itemInCart) {
      setQuantity(itemInCart.quantity);
    } else {
      setQuantity(0); // Ensure quantity is 0 if not in cart
    }
  }, [productId, cart]); // Depend on productId and cart

  const incrementLocalQuantity = () => {
    setQuantity((prev) => prev + 1);
    // window.dispatchEvent(new Event("storage")); // This event dispatch is for localStorage, no longer needed
  };

  const decrementLocalQuantity = () => {
    setQuantity((prev) => (prev > 0 ? prev - 1 : 0));
  };

  // Show a temporary notification bar
  const showNotification = (item) => {
    setNotificationItem(item);
    setShowNotificationBar(true);
    setTimeout(() => {
      setShowNotificationBar(false);
    }, 3000);
  };
  function parsePrice(priceStr) {
    if (!priceStr) return 0;

    // Match a number including optional minus and decimal
    const match = priceStr.match(/-?\d+(,\d{3})*(\.\d+)?/);

    if (!match) return 0;

    // Remove comma if any (e.g., "1,234.56")
    const numericStr = match[0].replace(/,/g, "");

    return parseFloat(numericStr);
  }
  // Handler for adding/updating item in cart using context
  const handleAddToCartConfirmation = async () => {
    if (quantity > 0) {
      const itemToAdd = {
        price: parsePrice(price),
        quantity,
        foodType,
        productId,
        categoryId,
        sourceEntityId: restaurantId,
        subcategoryId,
        itemType: "firm",
        sourceEntityName: "Firm",
        img: imgSrc,
        name: ttl,
        description: desc,
        productModelType: "Firm",
        userId: "67ee0bd23cf5e5dd298fa263", // This userId should ideally come from user context/auth
      };

      addItemToCart(itemToAdd); // Add or update item in cart context
      console.log("Item added/updated in cart:", itemToAdd);
      showNotification(`${quantity} x ${ttl}`);
    } else if (
      quantity === 0 &&
      cart.some((item) => item.productId === productId)
    ) {
      // If quantity becomes 0, and the item was previously in the cart, remove it
      addItemToCart({ productId, quantity: 0 }); // Call addItemToCart with quantity 0 to remove
      showNotification(`${ttl} removed from cart`);
    }
  };

  return (
   <div
  className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden p-4 flex flex-col justify-between"
>
  {/* Top Section */}
  <div className="flex flex-col space-y-2">
    {/* Title + Info */}
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-2">
        <img
          src={itemType}
          alt="food type"
          className="w-5 h-5 rounded-full border"
        />
        <h2 className="font-semibold text-gray-800 text-lg line-clamp-2">
          {ttl}
        </h2>
      </div>
      <div className="relative group">
        <img src={infoIcon} className="w-5 h-5 opacity-70" alt="info" />
        <span className="absolute right-0 top-6 z-10 hidden group-hover:block bg-gray-800 text-white text-xs p-2 rounded-md w-40">
          {dishInfo}
        </span>
      </div>
    </div>

    {/* Price */}
    <div className="flex items-center gap-2 text-gray-800">
      {originalPrice && (
        <span className="text-gray-400 line-through text-sm">
          {originalPrice}
        </span>
      )}
      <span className="text-lg font-bold text-teal-700">
        {price?.length > 0
          ? price.startsWith("$") || price.startsWith("CA$")
            ? price
            : "$" + price
          : "$N/A"}
      </span>
    </div>

    {/* Description */}
    <div className="text-gray-600 text-sm leading-relaxed">
      {readMore ? desc : desc?.substring(0, 100)}
      {!readMore && desc.length > 100 && (
        <span
          className="text-teal-700 font-medium cursor-pointer hover:underline ml-1"
          onClick={() => setReadMore(true)}
        >
          ...read more
        </span>
      )}
    </div>
  </div>

  {/* Image + Buttons */}
  <div className="mt-4 relative group">
    <img
      src={
    imgSrc
      ? "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80"
      : imgSrc
  }
      alt="food"
      className="w-full h-40 object-cover rounded-xl shadow-sm group-hover:opacity-90 transition"
    />

   {quantity === 0 ? (
  <button
    onClick={() => setQuantity(1)}
    className="absolute bottom-3 right-3 bg-teal-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-teal-700 transition-all"
  >
    ADD
  </button>
) : (
  <div className="absolute bottom-3 right-3 flex flex-col items-end gap-2">
    {/* Quantity Counter */}
    <div className="flex items-center justify-between bg-white shadow rounded-full border border-gray-200 w-[120px]">
      <button
        onClick={decrementLocalQuantity}
        className="px-3 py-1 text-lg font-bold text-gray-600 hover:text-teal-600"
      >
        −
      </button>
      <span className="w-6 text-center font-semibold text-gray-900 select-none">
        {quantity}
      </span>
      <button
        onClick={incrementLocalQuantity}
        className="px-3 py-1 text-lg font-bold text-gray-600 hover:text-teal-600"
      >
        +
      </button>
    </div>

    {/* Add/Update Button */}
    <button
      onClick={handleAddToCartConfirmation}
      className="bg-teal-600 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-teal-700 w-[120px]"
    >
      {cart?.items?.some((item) => item.productId === productId)
        ? "Update Cart"
        : "Add Item"}
    </button>
  </div>
)}

  </div>

  {/* Notification */}
  {showNotificationBar && (
    <div className="mt-3 bg-green-100 text-green-800 text-sm py-2 px-3 rounded-lg text-center">
      {notificationItem} added to cart
    </div>
  )}

  {/* Modal */}
  {showModal && (
    <AddToCartModal
      onClose={() => setShowModal(false)}
      data={props.data}
      quantity={quantity}
      showNotification={showNotification}
      restaurantName={restaurantName}
    />
  )}
</div>

  );
};

export default FoodItemProduct;
