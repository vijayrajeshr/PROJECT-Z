import React, { useState, useEffect } from "react";
import axios from "axios";
import ShowcaseCard from "../../Cards/ShowcaseCard/ShowcaseCard";
import UserProfileNoData from "./UserProfileNoData/UserProfileNoData";

const Restaurant = ({ hashId }) => {
  const [restaurantData, setRestaurantData] = useState(null);

  useEffect(() => {
    const getFavRest = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/tiffins/liked`,
          {
            withCredentials: true,
          }
        );
        setRestaurantData(response.data?.likedTiffins);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getFavRest();
  }, [hashId]);

  if (!restaurantData || restaurantData.length === 0) {
    return <UserProfileNoData hashId={hashId} />;
  }

  return (
    <div className="grid 2xl md:grid-cols-2  w-full">
      {restaurantData
        ?.slice()
        .reverse()
        .map((item, index) => (
          <div
            className=" flex justify-center items-center "
            key={item._id || index}
          >
            <ShowcaseCard
              key={item._id}
              promoted={true}
              time={item.operatingTimes?.Monday?.open || "N/A"}
              offB={true}
              proExtraB={false}
              off={
                item.offers && item.offers[0]
                  ? `${item.offers[0].discount}% OFF`
                  : "No offer"
              }
              proExtra="40"
              name={item.kitchenName}
              rating={item.ratings || 0}
              imgSrc={
                item.images?.[0] ||
                "http://localhost:5173/icons/Food/burger.png"
              }
              link2={`http://localhost:5173/hyderabad${`${"Toronto"}`
                }/${item._id}/${item.kitchenName
                  .toLowerCase()
                  .replace(/\s+/g, "-")}/tiffins`}
            />
          </div>
        ))}
    </div>
  );
};

export default Restaurant;