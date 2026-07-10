import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BannerCarousel.css"; // External CSS for styling
import prevBtn from "/icons/prev.png";
import nextBtn from "/icons/next.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <img
      src={prevBtn}
      alt="prev arrow"
      className={`custom-arrow prev ${className}`}
      style={{ ...style }} // adjust left as needed
      onClick={onClick}
    />
  );
};

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <img
      src={nextBtn}
      alt="next arrow"
      className={`custom-arrow next ${className}`}
      style={{ ...style }} // adjust right as needed
      onClick={onClick}
    />
  );
};

const BannerCarousel = ({ page }) => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_PATH}/banners/active`,
          {
            withCredentials: true,
          }
        );

        // Filter banners to only those meant for the prop pages
        const pageBanners = response.data.filter((banner) =>
          banner.pages.includes(page)
        );
        setBanners(pageBanners);
      } catch (err) {
        console.error("Error fetching banners:", err.message);
      }
    };

    fetchBanners();
  }, [page]);

  // Filter out banners without a valid photoWeb value.
  const validBanners = banners.filter(
    (banner) => banner.photoWeb && banner.photoWeb.trim() !== ""
  );

  if (validBanners.length === 0) {
    return null;
  }

  const settings = {
    dots: true,
    infinite: validBanners.length > 1, // allow looping only if there are multiple banners
    speed: 500, // animation duration in ms
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    autoplay: true,
  };

  const handleClick = async (banner) => {
    const id = banner._id;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_PATH}/banners/banner-click/${id}`,
        {
          method: "POST",
        }
      );
      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.log("Error while counting click", err.message);
    }
  };

  return (
    <div className="carousel">
      <Slider {...settings}>
        {validBanners.map((banner, index) => (
          <div key={index} className="image-wrapper">
            <img
              onClick={() => handleClick(banner)}
              src={banner.photoWeb}
              alt={`Banner ${index + 1}`}
              className="carousel-image"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BannerCarousel;
