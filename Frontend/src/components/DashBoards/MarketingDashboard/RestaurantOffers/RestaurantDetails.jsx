import React, { useEffect, useState } from "react";
import { IoInformationCircleOutline } from "react-icons/io5";
import { GrLocation } from "react-icons/gr";
import { FaFacebookF } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { MdLocalPhone } from "react-icons/md";
import { MdCopyAll } from "react-icons/md";

const resData = [
  {
    image: "https://source.unsplash.com/500x300/?restaurant,gourmet",
    location: "123 Foodie Lane, Flavor Town",
    description: "Located in the heart of the city, The Golden Fork Bistro is a cozy yet modern restaurant offering a fusion of global flavors with a local touch. Known for its welcoming ambiance, this dining spot combines rustic decor with contemporary charm.", // shortened for brevity
    serviceTypes: ["Dine-Out", "Delivery", "NightLife"],
    features: [
      { id: 1, text: "Free Wi-Fi" },
      { id: 2, text: "Outdoor Seating" },
      { id: 3, text: "Valet Parking" },
    ],
    contact: {
      contactNumber: "+123-456-7890",
      email: "info@thegourmetkitchen.com",
      website: "www.thegourmetkitchen.com",
    },
    socialMedia: {
      facebook: "facebook.com/thegourmetkitchen",
      instagram: "instagram.com/thegourmetkitchen",
    },
    flexibleTime: "11:00 AM - 1:00 AM",
  }
];

const RestaurantDetails = () => {
  const [clone, setClone] = useState("");

  const removeText = () => {
    setTimeout(() => {
      setClone("");
    }, 2000);
  };

  const clipCopy = (text) => {
    navigator.clipboard.writeText(text);
    setClone(text);
    removeText();
  };

  // Added safety check for resData
  if (!resData || resData.length === 0) {
    return <div>Loading...</div>;
  }

  const restaurant = resData[0];

  return (
    <div className="flex m-2 gap-x-3 flex-col lg:flex-row">
      <div className="flex-grow flex justify-between flex-wrap xl:w-[35%] w-full gap-3">

        {/* Left */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center">
            <GrLocation />
            <span className="text-sm">{restaurant.location}</span>
          </div>

          <div className="flex items-center">
            <HiOutlineMail className="text-[18px] me-2" />
            <div>{restaurant.contact.email}</div>
            <button
              className="bg-transparent w-auto border-0 hover:scale-105 m-1 focus:outline-none"
              onClick={() => clipCopy(restaurant.contact.email)}
            >
              <MdCopyAll />
            </button>
            {clone === restaurant.contact.email && (
              <span className="bg-green-300 text-green-500 rounded text-[11px]">
                Copied
              </span>
            )}
          </div>

          <div className="flex items-center">
            <MdLocalPhone className="text-[18px] me-2" />
            <div>{restaurant.contact.contactNumber}</div>
          </div>

        </div>

        {/* right */}
        <div className="w-fit flex flex-col gap-4 text-sm text-gray-900 mr-16">

          <div className="flex gap-2">
            <b>Timing:</b>
            <span>{restaurant.flexibleTime}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <p className="w-fit bg-purple-300 px-2 py-[2px] rounded-md ">Dine In</p>
              <p className="w-fit bg-green-300 px-2 py-[2px] rounded-md">Delivery</p>
              <p className="w-fit bg-red-300 px-2 py-[2px] rounded-md">Tiffin services</p>
            </div>

            <div className="flex gap-2 flex-col justify-between h-full">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-full bg-green-700 px-2 py-[2px] text-white rounded flex gap-1 items-center"
                >
                  <span className="">4.5</span>
                  <FaStar />
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;