import React, { useState } from "react";
import { Link } from "react-router-dom";

import AddRestaurantMobileNavbar from "../../Navbars/AddRestaurantMobileNavbar/AddRestaurantMobileNavbar";
import Navbar from "../../Navbars/NavigationBar/NavigationBar";


import css from "./AddRestaurantHeader.module.css";
import banner from "/banners/banner2.jpg";

const AddRestaurantHeader = ({ onOpenRegistration }) => {
  const [toggleMenu, setToggleMenu] = useState(true);

  const toggleBanner = toggleMenu ? (
    <div className={css.banner}>
      <Navbar
        setToggleMenu={setToggleMenu}
        toogleMenu={toggleMenu}
        page="add-restaurant"
        helpTextClass="helpTextLeft" // Add a class to adjust the position
      />

      <div className={css.bannerInner}>
        <img src={banner} alt="banner" className={css.bannerImg} />
        <div className={css.bannerTxt}>
          <div className={css.title}>Register your restaurant on Zomato</div>
          <div className={css.tag}>for free and get more customers!</div>
          <div className={css.btns}>
            <button style={{ backgroundColor: "#02757A", color: "#ffffff" }}
              onClick={onOpenRegistration}
              className={css.btn}
            >
              Register your restaurant
            </button>
            <Link to="/restaurants" className={css.btn} style={{ backgroundColor: "#02757A", color: "#ffffff" }}>
              Restaurant already listed? Claim now
            </Link>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <AddRestaurantMobileNavbar
      setToggleMenu={setToggleMenu}
      toogleMenu={toggleMenu}
    />
  );

  return (
    <>
      {toggleBanner}
    </>
  );
};

export default AddRestaurantHeader;
