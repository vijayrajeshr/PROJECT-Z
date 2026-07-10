import { useState } from "react";

import css from "./GetTheApp2.module.css";

import mobileImg from "/images/mobile2.png";
import playstoreImg from "/icons/appstore.png";
import appstoreImg from "/icons/playstore.png";



const GetTheApp2 = ({ setModal }) => {
  const [inputType, setInputType] = useState(true);
  const [isValidInput, setIsValidInput] = useState(true);

  return (
    <div
      className="w-full bg-[#fff5f0] flex justify-center items-center py-8 sm:py-10 px-3 sm:px-4 rounded-md"
      onClickCapture={() => setModal(true)}
    >
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-center">
        {/* Left Section - Image */}
        <div className="flex justify-center items-center mb-6 md:mb-0 md:mr-10">
          <img
            className="w-[200px] h-[240px] sm:w-[240px] sm:h-[300px] md:w-[270px] md:h-[330px] object-contain"
            src={mobileImg}
            alt="mobile img"
          />
        </div>

        {/* Right Section - Content */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left w-full max-w-md">
          {/* Title */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-snug">
            Get the Zomato App
          </h2>

          {/* Tagline */}
          <p className="mt-2 text-gray-700 text-sm sm:text-base md:text-lg">
            We will send you a link, open it on your phone to download the app.
          </p>

          {/* Radio Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 w-full sm:w-auto justify-start items-start text-left">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="radio"
                checked={inputType}
                onChange={() => setInputType(true)}
                className="w-4 h-4 text-red-500 focus:ring-red-500"
              />
              <span className="text-gray-800 text-sm sm:text-base">Email</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="radio"
                checked={!inputType}
                onChange={() => setInputType(false)}
                className="w-4 h-4 text-red-500 focus:ring-red-500"
              />
              <span className="text-gray-800 text-sm sm:text-base">Phone</span>
            </label>
          </div>



          {/* Input + Button */}
          <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-3 mt-4 w-full">
            {inputType ? (
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 w-full px-4 py-2 sm:py-3 border rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            ) : (
              <input
                type="tel"
                placeholder="Enter your phone number"
                className="flex-1 w-full px-4 py-2 sm:py-3 border rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            )}
            <button className="bg-red-500 text-white font-medium px-5 sm:px-6 py-2 sm:py-3 rounded-md hover:bg-red-600 transition w-full sm:w-auto text-sm sm:text-base">
              Share App Link
            </button>
          </div>
          {!isValidInput && (
            <p className="text-red-500 text-xs sm:text-sm mt-2">
              Please enter a valid {inputType ? "email" : "phone number"}
            </p>
          )}

          {/* App Links */}
          <div className="mt-6 w-full">
            <p className="text-gray-600 mb-3 text-sm sm:text-base">
              Download app from
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start items-center sm:items-start">
              <img
                className="w-[120px] sm:w-[140px] h-[38px] sm:h-[42px] cursor-pointer rounded-md"
                src={appstoreImg}
                alt="App Store"
              />
              <img
                className="w-[120px] sm:w-[140px] h-[38px] sm:h-[42px] cursor-pointer rounded-md"
                src={playstoreImg}
                alt="Play Store"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetTheApp2;