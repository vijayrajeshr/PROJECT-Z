import React, { useState, useEffect } from "react";
import axios from "axios";
import ShowcaseCard from "../../../../utils/Cards/ShowcaseCard/ShowcaseCard";
import UserProfileNoData from "../UserProfileNoData/UserProfileNoData";

export const Restaurant = ({ hashId }) => {
  const [restaurantData, setRestaurantData] = useState(null);

  useEffect(() => {
    const getFavRest = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/firm/user/liked-restaurants`,
          {
            withCredentials: true,
          }
        );
        setRestaurantData(response.data.restaurants);
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
              distance={item.distance}
              dingingStyle={item.restaurantInfo?.additionalInfo?.diningStyle}
              priceRange={item.restaurantInfo?.priceRange}
              additionalDetails={
                item.restaurantInfo?.additionalInfo?.additionalDetails
              }
              address={item.restaurantInfo?.address}
              promoted={item.promoted || false}
              time={item.time || "N/A"}
              offB={item.offB || false}
              proExtraB={item.proExtraB || false}
              off={item.off || "No offer"}
              proExtra={item.proExtra || "N/A"}
              name={item.restaurantInfo?.name || "N/A"}
              rating={item.restaurantInfo?.ratings?.overall || "N/A"}
              imgSrc={item.image_urls?.[1] || "N/A"}
              fav={item?.fav}
              link2={`/hyderabad/${item._id}/${item.restaurantInfo.name
                .toLowerCase()
                .replace(/\s+/g, "-")}/overview`}
            />
          </div>
        ))}
    </div>
  );
};
