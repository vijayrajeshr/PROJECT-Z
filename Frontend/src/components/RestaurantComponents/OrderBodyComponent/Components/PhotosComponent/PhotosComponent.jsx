import { useState } from "react";
import RedButton from "../../../../../utils/Buttons/RedButton/RedButton";
import WhiteButton from "../../../../../utils/Buttons/WhiteButton/WhiteButton";
import GalleryImgCard from "../../../../../utils/Cards/RestaurantHeroCards/GalleryImgCard/GalleryImgCard";
import biryaniImg from "/images/fortheloveofbiryani.jpg";
import css from "./PhotosComponent.module.css";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
const PhotosComponent = () => {
  const allPhotosData = [
    { imgSrc: biryaniImg },
    { imgSrc: biryaniImg },
    { imgSrc: biryaniImg },
    { imgSrc: biryaniImg },
    { imgSrc: biryaniImg },
    { imgSrc: biryaniImg },
    { imgSrc: biryaniImg },
    { imgSrc: biryaniImg },
  ];

  const foodPhotosData = [
    { imgSrc: biryaniImg },
    { imgSrc: biryaniImg },
    { imgSrc: biryaniImg },
  ];

  const ambiencePhotosData = [
    { imgSrc: biryaniImg },
    { imgSrc: biryaniImg },
    { imgSrc: biryaniImg },
    { imgSrc: biryaniImg },
    { imgSrc: biryaniImg },
  ];

  const [state, setState] = useState(allPhotosData);
  const [activeFilter, setActiveFilter] = useState("all"); // Track active filter

  const { id } = useParams();
  const [img, setImg] = useState([]);
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/firm/getOne/${id}`
        );
        setImg(response.data.image_urls || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [id]);

  const handleFilterClick = (filterType, data) => {
    setState(data);
    setActiveFilter(filterType); // Update active filter
  };

  return (
    <div className={css.outerDiv}>
      <div className={css.ttl}>Krupa Mess & Tiffins Photos</div>
      <div className={css.btns}>
        <RedButton
          txt="All"
          count={23}
          onClick={() => handleFilterClick("all", allPhotosData)}
          isActive={activeFilter === "all"} // Pass active state
        />
        {/* <WhiteButton
          txt="Food"
          count={17}
          onClick={() => handleFilterClick("food", foodPhotosData)}
          isActive={activeFilter === "food"} // Pass active state
        />
        <WhiteButton
          txt="Ambience"
          count={6}
          onClick={() => handleFilterClick("ambience", ambiencePhotosData)}
          isActive={activeFilter === "ambience"} // Pass active state
        /> */}
      </div>
      <div className={css.photoCards}>
        {img?.map((item, id) => (
          <div key={id} className={css.imgCard}>
            <GalleryImgCard imgSrc={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotosComponent;
