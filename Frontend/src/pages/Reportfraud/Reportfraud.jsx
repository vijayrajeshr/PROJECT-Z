import React, { useState, useEffect } from "react";
import styles from "./ReportFraud.module.css";
import ReportForm from "./ReportForm";
import Footer from "../../components/Footer/Footer";

const Reportfraud = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="w-full shadow-[0_-0.5px_0_0_rgb(232,232,232)_inset] box-border">
        <div className="flex justify-between items-center px-4 py-6 sm:px-6 md:px-8 lg:px-10 max-w-7xl mx-auto">
          <a
            href="/"
            className="text-2xl sm:text-3xl font-semibold text-gray-900"
          >
            Zomato
          </a>
          <div className="flex items-center gap-2 sm:gap-4">
            <img
              src="https://img.freepik.com/premium-vector/man-professional-business-casual-young-avatar-icon-illustration_1277826-622.jpg"
              alt="Profile"
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-full"
            />
            <h2 className="text-sm sm:text-lg font-bold font-['Okra',_Helvetica,_sans-serif] text-gray-900">
              Profile
            </h2>
          </div>
        </div>

        {/* Hero Section */}
        <div className="w-full bg-[#EF4F5F] flex justify-center items-center py-12 sm:py-16 md:py-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-white font-['Okra',_Helvetica,_sans-serif] font-medium">
            Report a potential fraud
          </h2>
        </div>

        {/* Back Link */}
        <div className="w-full py-4">
          <a href="/" className="block pl-4 sm:pl-6 md:pl-10">
            <h2 className="text-sm sm:text-base md:text-lg text-[#EF4F5F] font-medium font-['Okra',_Helvetica,_sans-serif]">
              Back to home
            </h2>
          </a>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-6 gap-6 lg:gap-10">
          {/* Left Content */}
          <div className="w-full lg:w-1/2">
            <ReportForm />
          </div>

          {/* Right Content */}
          <div className="w-full lg:w-1/2 h-[25rem]">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-medium font-['Okra',_Helvetica,_sans-serif] text-gray-900 mb-4">
                Disclaimer
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                Please use this form only for reporting potential frauds. For
                order or other general queries contact us here.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Reportfraud;
