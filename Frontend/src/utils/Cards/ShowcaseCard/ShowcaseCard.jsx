import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import star from "/icons/star.png";

const ShowcaseCard = ({
  link2,
  opening_hours,
  restaurantId,
  distance,
  priceRange,
  name,
  rating,
  cuisines,
  address,
  time,
  imgSrc,
}) => {
  const [visible, setVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const extractPriceForTwo = (price) => {
    if (typeof price === "number") return price * 2;
    if (typeof price === "string") {
      const numbers = price.match(/\d+/g)?.map(Number) || [];
      if (numbers.length === 1) return numbers[0] * 2;
      if (numbers.length === 2) return ((numbers[0] + numbers[1]) / 2) * 2;
    }
    return null;
  };

  return (
    <Link
      // className="w-auto h-auto min-w-[300px] min-h-[330px] max-w-[350px] max-h-[480px] max-md:max-w-[500px] m-3 rounded-[10px] cursor-pointer no-underline p-4  hover:translate-y-4 transition-transform duration-300 ease-in-out bg-white bg-transparent"
      to={link2}
      ref={cardRef}
      className={`w-[350px] bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-3 cursor-pointer block transform hover:-translate-y-1 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      }`}
    >
      {/* Image Section */}
      <div className="relative w-full h-[180px] rounded-xl overflow-hidden">
        <img src={imgSrc} alt={name} className="w-full h-full object-cover" />

        {/* Blue Offer Banner */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-r from-blue-600/90 to-blue-400/80 text-white p-2 text-[13px] font-semibold">
          Prebooked <br /> 5% OFF
        </div>

        {/* Rating */}
        <div className="absolute top-3 right-3 bg-green-600 text-white px-2 py-[3px] rounded-md text-[12px] font-bold flex items-center gap-1">
          {rating}
          <img src={star} className="w-3 h-3 invert" />
        </div>
      </div>

      {/* Content */}
      <div className="mt-3">
        <h3 className="font-semibold text-[17px] text-gray-900 truncate">{name}</h3>

        {/* ✅ Cuisines left & Price right */}
        <div className="flex justify-between items-center text-sm mt-1">
          <p className="text-gray-500 text-sm truncate">
            {cuisines && cuisines.join(", ")}
          </p>

          <p className="text-gray-900 font-medium text-[14px] ml-2 whitespace-nowrap">
            CAN$ {extractPriceForTwo(priceRange)}
            <span className="text-gray-500 text-sm"> For two</span>
          </p>
        </div>

        {/* ✅ Address left & Distance right (1 decimal only) */}
        <div className="flex justify-between items-center text-sm mt-2 text-gray-500">
          <span className="truncate">{address?.slice(0, 28) + "..."}</span>
          <span>{Number(distance)?.toFixed(1)} km</span>
        </div>

        <p className="text-red-600 text-sm font-semibold mt-1">
          Open At {opening_hours || "7 AM"}
        </p>
      </div>
    </Link>
  );
};

export default ShowcaseCard;
