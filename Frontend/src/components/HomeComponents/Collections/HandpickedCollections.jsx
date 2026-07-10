import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CollectionsCard from "../../../utils/Cards/card2/CollectionsCard";
import { useContextData } from "../../../context/OutletContext";
import css from "./Collections.module.css";
import rightArrow from "/icons/right-arrow.png";

const HandpickedCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const { axiosApi } = useContextData();

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        const response = await axiosApi.get(
          `${import.meta.env.VITE_SERVER_URL}/api/marketing-dashboard/collections/active`
        );
        // Get only the first 4 collections for the handpicked section
        setCollections(response.data.slice(0, 4));
      } catch (error) {
        console.error("Error fetching collections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading collections...</div>;
  }

  if (collections.length === 0) {
    return null; // Don't show the section if there are no collections
  }

  return (
    <div className={css.outerDiv}>
      <div className={css.innerDiv}>
        <div className={css.headingBox}>
          <div className={css.heading}>Handpicked Collections</div>
          <div className={css.message}>
            Explore curated lists of top restaurants, cafes, pubs, and bars
          </div>
        </div>

        <div className={css.collectionCardBox}>
          {collections.map((collection) => (
            <CollectionsCard
              key={collection._id}
              id={collection._id}
              imgSrc={collection.photoWeb}
              title={collection.title}
              places={collection.restaurants?.length || "0"}
              description={collection.description}
            />
          ))}
        </div>

        <div className={css.seeMoreBox}>
          <Link to="/collections" className={css.seeMoreTxt}>
            See all collections
            <span className={css.rightArrowBox}>
              <img
                className={css.rightArrow}
                src={rightArrow}
                alt="right arrow"
              />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HandpickedCollections;