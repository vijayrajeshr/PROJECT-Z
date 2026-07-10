import React, { useState } from "react";
import { CiLocationOn } from "react-icons/ci";
import { FiEye, FiMessageSquare, FiDollarSign } from "react-icons/fi";
import { FiFacebook, FiInstagram, FiCopy } from "react-icons/fi";
import Menu from "./TittinMenu";
import CommentSection from "./TiffinComment";
import FeaturesPage from "./FeatureTiffin";

const TiffinDisplay = () => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert(`${text} copied to clipboard!`);
  };

  const [type, setType] = useState("Overview");

  const renderContent = () => {
    switch (type) {
      case "Overview":
        return (
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white shadow-md rounded-lg p-4 text-center">
              <FiEye className="text-3xl text-gray-500 mx-auto" />
              <h3 className="text-xl font-bold mt-2">671,120</h3>
              <p className="text-gray-500">3,780 last month</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4 text-center">
              <FiMessageSquare className="text-3xl text-gray-500 mx-auto" />
              <h3 className="text-xl font-bold mt-2">6,120</h3>
              <p className="text-gray-500">180 last month</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4 text-center">
              <FiDollarSign className="text-3xl text-gray-500 mx-auto" />
              <h3 className="text-xl font-bold mt-2">$671,120</h3>
              <p className="text-gray-500">23,780 last month</p>
            </div>
          </div>
        );

      case "Menu":
        return (
          <div className="p-4">
            <Menu/>
          </div>
        );

      case "Features":
        return (
          <div className="mt-6">
            <FeaturesPage/>
          </div>
        );

      case "Comments":
        return (
          <div className="mt-4">
            <CommentSection/>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 overflow-y-scroll h-[480px]">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        {/* Left Section */}
        <div className="w-2/3">
          <h1 className="text-3xl font-bold">Ocean Breeze Bistro</h1>
          <div className="flex items-center mt-2">
            <CiLocationOn className="text-xl" />
            <p className="ml-2 text-gray-600">456 Coastal Drive, Seaside City</p>
          </div>
          <p className="text-gray-500">Opening From 12:00 PM - 12:00 AM</p>
          <p className="mt-3 text-gray-700">
            Enjoy the freshest seafood and ocean views at Ocean Breeze Bistro.
          </p>
        </div>

        {/* Right Section */}
        <div className="w-96 h-52">
          <img
            src="https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="Restaurant"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
        <div className="text-gray-700">
          <p className="flex items-center">
            <span className="font-bold">Email:</span>
            <span className="ml-2">contact@oceanbreezebistro.com</span>
            <button
              onClick={() => copyToClipboard("contact@oceanbreezebistro.com")}
              className="ml-2 text-gray-500 hover:text-black"
            >
              <FiCopy />
            </button>
          </p>
          <p className="flex items-center mt-2">
            <span className="font-bold">Phone:</span>
            <span className="ml-2">+123-555-7890</span>
            <button
              onClick={() => copyToClipboard("+123-555-7890")}
              className="ml-2 text-gray-500 hover:text-black"
            >
              <FiCopy />
            </button>
          </p>
        </div>
        <div className="flex space-x-4">
          <a href="#" className="text-blue-500 hover:text-blue-700">
            <FiFacebook size={24} />
          </a>
          <a href="#" className="text-pink-500 hover:text-pink-700">
            <FiInstagram size={24} />
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-between mt-8 border-b">
        {["Overview", "Menu", "Features", "Comments"].map((tab) => (
          <button
            key={tab}
            className={`text-black-500 px-4 py-2 ${
              type === tab ? "border-b-2 border-red-500 text-red-500" : ""
            }`}
            onClick={() => setType(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Render Dynamic Content */}
      {renderContent()}
    </div>
  );
};

export default TiffinDisplay;
