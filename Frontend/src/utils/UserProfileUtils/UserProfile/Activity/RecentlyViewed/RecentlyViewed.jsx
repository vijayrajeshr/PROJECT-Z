import { useState, useEffect } from "react";
import axios from "axios";
import css from "./RecentlyViewed.module.css";
import RecentlyViewedCard from "../../../../Cards/RecentlyViewedCard/RecentlyViewedCard";
import UserProfileNoData from "../../UserProfileNoData/UserProfileNoData";

const RecentlyViewed = ({ hashId }) => {
  const [isData, setIsData] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const recentlyviewedrestaurants = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/firm/getrecently-viewed`,
          { withCredentials: true }
        );
        console.log("Recently Viewed:", response.data);
        setData(response.data.recentlyViewed || []);
        setIsData(response.data.recentlyViewed?.length > 0);
      } catch (err) {
        console.error("Error Details:", {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });
        setIsData(false);
      }
    };
    recentlyviewedrestaurants();
  }, [hashId]);

  return (
    <div className={css.outerDiv}>
      {isData && data.length > 0 ? (
        <div className={css.innerDiv}>
          {data.map((item) => (
            <RecentlyViewedCard id={item.itemId} udata={item} />
          ))}
        </div>
      ) : (
        <UserProfileNoData hashId={hashId} />
      )}
    </div>
  );
};

export default RecentlyViewed;
