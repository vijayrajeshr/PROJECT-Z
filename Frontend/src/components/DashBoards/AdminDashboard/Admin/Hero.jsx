import React, { useEffect, useState } from "react";
import { IoInformationCircleOutline } from "react-icons/io5";
import { IoArrowForward } from "react-icons/io5";
import { GrLocation } from "react-icons/gr";
import { FaEdit, FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import OpeningTime from "./OpeningTime";
import { FiImage } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import { MdLocalPhone } from "react-icons/md";
import { MdCopyAll } from "react-icons/md";
import copy from "copy-text-to-clipboard";
import { replace, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaRegTrashAlt } from "react-icons/fa";
import axios from "axios";

const Hero = ({ resData = {}, isEditable, setCurrResInfo = () => {} }) => {
  const [timing, setTiming] = useState(false);
  const [clone, setClone] = useState("");
  const [firmState, setFirmState] = useState({
    isBanned: resData.restaurantInfo.isBanned,
    isBookMarked: resData.restaurantInfo.isBookMarked,
    isFlaged: resData.restaurantInfo.isFlaged,
  });
  const navigate = useNavigate();

  useEffect(() => {
    setFirmState({
      isBanned: resData.restaurantInfo.isBanned,
      isBookMarked: resData.restaurantInfo.isBookMarked,
      isFlaged: resData.restaurantInfo.isFlaged,
    });
  }, [resData._id]);

  // Single Animation Variant for Simultaneous Animation
  const animateAll = {
    hidden: { opacity: 0, y: 20 }, // Start slightly below and invisible
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }, // All animate together
    },
  };

  const handleFormDataChange = function (evt) {
    const { name, value } = evt.target;
    setCurrResInfo((prev) => ({
      ...prev,
      restaurantInfo: {
        ...prev.restaurantInfo,
        [name]: value,
      },
    }));
  };

  const removeText = () => {
    setTimeout(() => {
      setClone("");
    }, [2000]);
  };

  const clipCopy = (text) => {
    console.log("I am copying data");
    copy(text);
    setClone(text);
    removeText();
  };

  const navigateTo = (location, resId) => {
    if (location === "dashboard") {
      navigate("/dashboard/tiffins/home", replace);
    } else if (location === "profile") {
      navigate(`/user/${resId}`, replace);
    } else {
      alert("Something want wrong, refresh the page");
    }
  };

  const handleActionBtn = async (action) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/update-firm-action/${
          resData._id
        }`,
        action,
        {
          withCredentials: true,
        }
      );

      if (res.data.response === true) {
        setFirmState({
          isBanned: res.data.firm.restaurantInfo.isBanned,
          isBookMarked: res.data.firm.restaurantInfo.isBookMarked,
          isFlaged: res.data.firm.restaurantInfo.isFlaged,
        });

        setCurrResInfo({ ...res.data.firm });
      }
    } catch (err) {
      console.log(err);
      alert("something went wrong click again");
    }
  };

  const editStateStyle = `w-auto focus:outline-0 bg-transparent border-2`;
  const visitBtnStyle = `rounded-md p-1 mt-2 text-medium text-[11px] active:shadow-lg focus:outline-none`;

  return (
    <>
      {isEditable ? (
        <div className="relative mx-auto max-w-7xl px-6 py-12 lg:flex lg:gap-8">
          {/* Left Section (Form) */}
          <motion.div
            className="flex flex-grow flex-col xl:w-[40%] w-full p-6 bg-white shadow-lg my-2"
            variants={animateAll}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 variants={animateAll} className="text-2xl font-semibold">
              <input
                type="text"
                value={resData.restaurantInfo.name}
                name="name"
                onChange={handleFormDataChange}
                className={`w-full border-b-2 focus:outline-none focus:border-blue-500 transition-all duration-300 ease-in-out ${editStateStyle}`}
                placeholder="Restaurant Name"
              />
            </motion.h1>

            <motion.div
              variants={animateAll}
              className="flex items-center gap-2 pt-4 opacity-80"
            >
              <GrLocation className="w-6 text-gray-500" />
              <input
                className={`text-sm flex-grow border-b-2 focus:outline-none focus:border-blue-500 transition-all duration-300 ease-in-out ${editStateStyle}`}
                value={resData.restaurantInfo.address}
                name="address"
                onChange={handleFormDataChange}
                placeholder="address"
              />
            </motion.div>

            {/* Social Media Links */}
            <motion.div
              variants={animateAll}
              className="flex items-center gap-4 mt-4"
            >
              <a
                href="https://facebook.com"
                className="text-blue-600 text-xl hover:opacity-80 transition-opacity duration-300"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://instagram.com"
                className="text-pink-600 text-xl hover:opacity-80 transition-opacity duration-300"
              >
                <FaInstagram />
              </a>
            </motion.div>

            {/* Description */}
            <motion.textarea
              variants={animateAll}
              className={`block text-sm w-full p-3 mt-4 border rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 ease-in-out ${editStateStyle}`}
              spellCheck={false}
              value={resData.restaurantInfo.overview}
              rows={4}
              name="overview"
              onChange={handleFormDataChange}
              placeholder="Describe your restaurant..."
            />

            {/* Contact Details */}
            <motion.div
              variants={animateAll}
              className="w-full mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200"
            >
              <div className="flex flex-col  gap-4 font-semibold text-sm">
                <div className="flex items-center w-full xl:w-1/2">
                  <HiOutlineMail className="text-lg mr-2 text-gray-600" />
                  Email:
                  <input
                    type="email"
                    value={resData.restaurantInfo.email || null}
                    name="email"
                    onChange={handleFormDataChange}
                    className="ml-2 border-b-2 focus:outline-none focus:border-blue-500 flex-grow transition-all duration-300 ease-in-out"
                    placeholder="example@email.com"
                  />
                </div>
                <div className="flex items-center w-full xl:w-1/2">
                  <MdLocalPhone className="text-lg mr-2 text-gray-600" />
                  Contact:
                  <input
                    type="text"
                    value={resData.restaurantInfo.phoneNo}
                    name="phoneNo"
                    onChange={handleFormDataChange}
                    className="ml-2 border-b-2 focus:outline-none focus:border-blue-500 flex-grow transition-all duration-300 ease-in-out"
                    placeholder="+1 234 567 890"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Section (Image) */}
          <motion.div
            className="lg:w-[350px] w-full flex items-center"
            variants={animateAll}
            initial="hidden"
            animate="visible"
          >
            <div className="relative">
              <div className="absolute top-2 right-2 z-40 text-white w-8 h-8 flex gap-1">
                <FaRegTrashAlt />
                <FaEdit />
              </div>
              <img
                src={resData.image_urls[0]}
                alt="Restaurant Image"
                className="w-full rounded-xl shadow-lg transition-transform duration-500 hover:scale-105 object-cover"
              />
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="flex mx-auto max-w-7xl px-2 py-6 gap-x-6 flex-col lg:flex-row">
          {/* Left Section */}
          <motion.div
            className="flex-grow flex flex-col flex-wrap xl:w-[35%] w-full justify-evenly"
            variants={animateAll}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={animateAll} className="text-blue-400 m-0">
              <Link
                to={`https://restaurantguru.com/link/inst42984078`}
                className="text-[9px] hover:underline"
              >
                {resData.restaurantInfo.website || "Your_website_url"}
              </Link>
            </motion.div>

            <motion.h1
              variants={animateAll}
              className="text-[28px] font-semibold flex gap-2 items-center"
            >
              <span>{resData.restaurantInfo.name}</span>
              <div className="flex gap-x-2">
                <button
                  className={`${visitBtnStyle} bg-blue-300 h-8 px-3 text-blue-700 rounded-md hover:bg-blue-400 transition-colors duration-300`}
                  onClick={() => navigateTo("dashboard", resData._id)}
                >
                  Dashboard
                </button>
                <button
                  className={`${visitBtnStyle} bg-green-300 h-8 px-3 text-green-700 rounded-md hover:bg-green-400 transition-colors duration-300`}
                  onClick={() => navigateTo("profile", resData._id)}
                >
                  Profile
                </button>
              </div>
              <div className="flex gap-2 text-sm">
                <button
                  className={`${visitBtnStyle} bg-gray-200`}
                  onClick={() =>
                    handleActionBtn({ isBanned: !firmState.isBanned })
                  }
                >
                  {firmState.isBanned ? "UnBan" : "Ban"}
                </button>
                <button
                  className={`${visitBtnStyle} bg-gray-200`}
                  onClick={() =>
                    handleActionBtn({ isBookMarked: !firmState.isBookMarked })
                  }
                >
                  {firmState.isBookMarked ? "UnBookmark" : "Bookmark"}
                </button>
                <button
                  className={`${visitBtnStyle} bg-gray-200`}
                  onClick={() =>
                    handleActionBtn({ isFlaged: !firmState.isFlaged })
                  }
                >
                  {firmState.isFlaged ? "UnFlag" : "Flag"}
                </button>
              </div>
            </motion.h1>

            <motion.div
              variants={animateAll}
              className="flex items-center gap-1 pt-2 opacity-50"
            >
              <GrLocation className="w-[28px]" />
              <span className="text-sm flex-grow">
                {resData.restaurantInfo.address}
              </span>
            </motion.div>

            <motion.div
              variants={animateAll}
              className="text-[12px] font-medium flex items-center relative mt-2"
            >
              Opening From
              <button
                className="ms-1 text-gray-500 hover:text-gray-800 transition-colors duration-300"
                onMouseOver={() => setTiming(true)}
                onMouseOut={() => setTiming(false)}
              >
                <IoInformationCircleOutline />
              </button>
              {timing && (
                <OpeningTime
                  time={Object.entries(resData.opening_hours)}
                  title={"Opening Time"}
                />
              )}
            </motion.div>

            <motion.div variants={animateAll} className="text-[12px] p-2">
              {resData.restaurantInfo.overview}
            </motion.div>

            <motion.div variants={animateAll} className="w-full">
              <div className="flex gap-2 flex-wrap p-4 bg-gray-100 font-semibold rounded-[12px] my-4 text-[14px]">
                <div className="flex items-center flex-wrap gap-1">
                  <HiOutlineMail className="text-[18px]" />
                  <div>{resData.restaurantInfo.email}</div>
                  <button
                    className="bg-transparent w-auto border-0 hover:scale-105 m-1 focus:outline-none"
                    onClick={() => clipCopy(resData.restaurantInfo.email)}
                  >
                    <MdCopyAll />
                  </button>
                  {clone === resData.restaurantInfo.email && (
                    <span className="bg-green-300 text-green-500 rounded text-[11px] px-1">
                      Copied
                    </span>
                  )}
                </div>

                <div className="flex items-center flex-wrap gap-1">
                  <MdLocalPhone className="text-[18px]" />
                  <div>{resData.restaurantInfo.phoneNo}</div>
                  <button
                    className="bg-transparent w-auto border-0 hover:scale-105 m-1 focus:outline-none"
                    onClick={() => clipCopy(resData.restaurantInfo.phoneNo)}
                  >
                    <MdCopyAll />
                  </button>
                  {clone === resData.restaurantInfo.phoneNo && (
                    <span className="bg-green-300 text-green-500 rounded text-[11px] px-1">
                      Copied
                    </span>
                  )}
                </div>

                <div className="text-[18px] lg:text-[14px] items-center flex gap-2 mx-2">
                  <a
                    href="https://facebook.com"
                    className="text-blue-600 hover:opacity-80 transition-opacity duration-300"
                  >
                    <FaFacebookF />
                  </a>
                  <Link
                    to={
                      resData.restaurantInfo.instagram &&
                      "https://instagram.com"
                    }
                    className="text-pink-600 hover:opacity-80 transition-opacity duration-300"
                  >
                    <FaInstagram />
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Section (Image) */}
          <motion.div
            className="lg:w-[350px] w-full flex items-center"
            variants={animateAll}
            initial="hidden"
            animate="visible"
          >
            <img
              src={resData.image_urls[0]}
              alt="Restaurant Image"
              className="w-full rounded-xl shadow-lg transition-transform duration-500 hover:scale-105 object-cover"
            />
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Hero;
