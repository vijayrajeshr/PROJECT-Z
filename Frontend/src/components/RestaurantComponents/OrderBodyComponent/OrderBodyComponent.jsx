import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import css from "./OrderBodyComponent.module.css";
import axios from "axios";
import BookaTableComponent from "./Components/BookaTableComponent/BookaTableComponent";
import MenuComponent from "./Components/MenuComponent/MenuComponent";
import OrderOnlineFieldComponent from "./Components/OrderOnlineFieldComponent/OrderOnlineFieldComponent";
import TiffinServiceComponent from "./Components/OrderOnlineTiffinFieldComponent/OrderOnlineTiffinFieldComponent";
import OverviewFieldComponent from "./Components/OverviewFieldComponent/OverviewFieldComponent";
import PhotosComponent from "./Components/PhotosComponent/PhotosComponent";
import ReviewsComponent from "./Components/ReviewsComponent/ReviewsComponent";

const OrderBodyComponent = () => {
  const [pageCompo, setPageComp] = useState(<OverviewFieldComponent />);
  const [features, setFeatures] = useState([]);
  const [serviceType, setServiceType] = useState("restaurant"); 
  const navigate = useNavigate();
  const { city, id, page, name } = useParams();

  const isActiveClass = (isActive) => {
    return isActive
      ? `${css.menuTxt} ${css.menuTxtActive}`
      : `${css.menuTxt} ${css.menuTxtHover}`;
  };

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/firm/getOne/${id}`
        );
        console.log("Overview API Response:", response.data);
        setFeatures(response.data.features || []);
        setServiceType(response.data.serviceType || "restaurant");
      } catch (err) {
        console.error("Error fetching overview:", err);
      }
    };
    fetchRestaurants();
  }, [id]);

  useEffect(() => {
    if (
      !page ||
      ![
        "overview",
        "order",
        "reviews",
        "photos",
        "menu",
        "bookatable",
        "tiffins",
      ].includes(page)
    ) {
      navigate(`/${city}/${id}/${name}/overview`, { replace: true });
    } else {
      switch (page) {
        case "overview":
          setPageComp(<OverviewFieldComponent />);
          break;
        case "order":
          setPageComp(<OrderOnlineFieldComponent />);
          break;
        case "reviews":
          setPageComp(<ReviewsComponent />);
          break;
        case "photos":
          setPageComp(<PhotosComponent />);
          break;
        case "menu":
          setPageComp(<MenuComponent />);
          break;
        case "bookatable":
          setPageComp(<BookaTableComponent />);
          break;
        case "tiffins":
          setPageComp(
            <TiffinServiceComponent setServiceType={setServiceType} />
          );
          break;
        default:
          setPageComp(<OverviewFieldComponent />);
      }
    }

    if (!page || page === "overview") {
      window.scrollTo({ top: 0 });
    } else {
      window.scrollTo({
        top: window.innerHeight / 2,
        behavior: "smooth",
      });
    }
  }, [city, id, page, name, navigate]);
  console.log(serviceType, "get");
  return (
<div className={`${css.outerDiv} w-full h-full px-2 pb-[10px] sm:px-4 lg:px-6 min-h-screen overflow-hidden justify-center  `}>
        <div className={`${css.innerDiv} w-full  h-full px-2 sm:px-4 lg:px-6 min-h-screen overflow-hidden justify-center max-xl:pl-12 max-xl:pr-12 max-sm:pl-6 max-sm:pr-6`}>
        <div className={`${css.menu}  items-center gap-x-12 border-b border-gray-200`}>
          {serviceType === "tiffins" ? (
            <>
              <NavLink
                to={`/${city}/${id}/${name}/tiffins`}
                className={({ isActive }) => isActiveClass(isActive)}
              >
                Tiffins
              </NavLink>
              <NavLink
                to={`/${city}/${id}/${name}/reviews`}
                className={({ isActive }) => isActiveClass(isActive)}
              >
                Reviews
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to={`/${city}/${id}/${name}/overview`}
                className={({ isActive }) => isActiveClass(isActive)}
              >
                Overview
              </NavLink>
              <NavLink
                to={`/${city}/${id}/${name}/menu`}
                className={({ isActive }) => isActiveClass(isActive)}
              >
                Menu
              </NavLink>
              <NavLink
                to={`/${city}/${id}/${name}/order`}
                className={({ isActive }) => isActiveClass(isActive)}
              >
                Takeaway
              </NavLink>
              <NavLink
                to={`/${city}/${id}/${name}/photos`}
                className={({ isActive }) => isActiveClass(isActive)}
              >
                Photos
              </NavLink>
              <NavLink
                to={`/${city}/${id}/${name}/reviews`}
                className={({ isActive }) => isActiveClass(isActive)}
              >
                Reviews
              </NavLink>
              <NavLink 
                to={`/${city}/${id}/${name}/bookatable`}
                className={({ isActive }) => isActiveClass(isActive)}
              >
                Book a Table
              </NavLink>
            </>
          )}
          {/* <div className={css.componentsBody}>{pageCompo}</div> */}
        </div>
        <div className={css.componentsBody}>{pageCompo}</div>
      </div> 
      {/* <div className={css.componentsBody}>{pageCompo}</div> */}
    </div>
  );
};

export default OrderBodyComponent;