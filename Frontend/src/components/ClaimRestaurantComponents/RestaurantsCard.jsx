import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { MapPin, Search, Store, X } from "lucide-react";
import css from "./ShowcaseCard.module.css";
import { useNavigate } from "react-router-dom";

const ShowcaseCard = (props) => {
  const {
    link2,
    distance,
    restaurantId,
    name,
    status,
    cuisines,
    address,
    time,
    imgSrc,
  } = props;

  const [visible, setVisible] = useState(false);
  const cardRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // stop observing once it's visible
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Handle restaurant claim
  const handleClaimRestaurant = (e, id) => {
    e.preventDefault(); // Prevent the Link's default navigation
    e.stopPropagation(); // Stop event bubbling to the Link
    if (id) {
      navigate(`/claim-restaurant/${id}`);
    } else {
      console.error("Restaurant ID is missing.");
    }
  };

  return (
    <Link
      className="w-auto h-auto min-w-[300px] min-h-[330px] max-w-[350px] max-h-[480px] max-md:max-w-[500px] m-3 rounded-[10px] cursor-pointer no-underline p-4 shadow-md hover:translate-y-4 transition-transform duration-300 ease-in-outbg-white"
      to={link2}
    >
      <div
        className={`${css.innerDiv} ${visible ? css.fadeIn : css.hidden} bg-white `}
        ref={cardRef}
      >
        <div className={css.imgBox}>
          <img className={css.img} src={imgSrc} alt="No Image Available" />
          <div className={css.duration}>{time} min</div>
        </div>
        <div className={css.txtBox}>
          <div className={css.titleBox}>
            <div className={css.title}>{name}</div>
          </div>
          <div className={css.tagBox}>
            <div className={css.tagTitle}>
              {cuisines?.join(",")?.slice(0, 20) + "..."}
            </div>
            <div className={css.tagTxt}></div>
          </div>
        </div>
        <div className={css.footer}>
          <div className={css.scroll1}>
            <div className="flex items-center justify-center text-gray-600 mb-1">
              <MapPin className="h-7 w-7 mr-2" />
              <span className=" text-sm">{address?.slice(0, 50) + "..."}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center w-full justify-center">
          {status === "claimed" ? (
            <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              Claimed
            </span>
          ) : (
            <button
              onClick={(e) => handleClaimRestaurant(e, restaurantId)}
              className="px-4 py-2 w-full bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            >
              Claim Now
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ShowcaseCard;
