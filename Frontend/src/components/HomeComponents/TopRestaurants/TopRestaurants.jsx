import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "../../../context/locationContext";
import CarouselUtil from "../../../utils/CarouselUtil/CarouselUtil";
import ShowcaseCard from "../../../utils/Cards/ShowcaseCard/ShowcaseCard";
import css from "./TopRestaurants.module.css";

const TopRestaurants = () => {
    const { currentLocation } = useLocation();
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopRestaurants = async () => {
            if (!currentLocation?.latitude || !currentLocation?.longitude) return;

            setLoading(true);
            try {
                const url = `${import.meta.env.VITE_SERVER_URL}/firm/getnearbyrest?lat=${currentLocation.latitude
                    }&lon=${currentLocation.longitude}&radius=20&limit=10&sortBy=HighToLow`;

                const response = await axios.get(url, { withCredentials: true });
                if (response.data.success) {
                    setRestaurants(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching top restaurants:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTopRestaurants();
    }, [currentLocation]);

    if (!currentLocation || (restaurants.length === 0 && !loading)) {
        return null;
    }

    const cityName = currentLocation?.address?.split(",")[0] || "your area";

    return (
        <div className={css.outerDiv}>
            <h2 className={css.title}>Top Restaurants in {cityName}</h2>

            {loading ? (
                <div className="flex gap-4 overflow-hidden">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="min-w-[350px] h-[350px] bg-gray-100 animate-pulse rounded-[20px]"></div>
                    ))}
                </div>
            ) : (
                <div className={css.carouselContainer}>
                    <CarouselUtil slidesToShow={3} slidesToScroll={3} dots={true}>
                        {restaurants.map((rest) => (
                            <div key={rest._id} className="px-1 flex justify-center">
                                <ShowcaseCard
                                    distance={rest.distance}
                                    restaurantId={rest._id}
                                    opening_hours={rest.opening_hours}
                                    priceRange={rest.restaurantInfo?.priceRange}
                                    cuisines={rest.restaurantInfo?.cuisines}
                                    address={rest.restaurantInfo?.address}
                                    time={rest.time || "25-30 min"}
                                    name={rest.restaurantInfo?.name || "N/A"}
                                    rating={rest.restaurantInfo?.ratings?.overall || "N/A"}
                                    imgSrc={rest.image_urls?.[0] || rest.image_urls?.[1] || "N/A"}
                                    link2={`/${(rest.restaurantInfo?.city || cityName).trim().replace(/\//g, "")}/${rest._id}/${(rest.restaurantInfo?.name || "restaurant").toLowerCase().replace(/\s+/g, "-")}/overview`}
                                />
                            </div>
                        ))}
                    </CarouselUtil>
                </div>
            )}
        </div>
    );
};

export default TopRestaurants;
