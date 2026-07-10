import React, { useState, useEffect } from "react";
import css from "./Dining.module.css";
import Step1 from "./Step1";
import Step3 from "./Step3";
import Step4 from "./Step4"; // Ensure this import is correct
 // Make sure this Step exists
// import Step2 from "./Step2";

const Tiffin = () => {
  const [formData, setFormData] = useState({
    restaurantName: "",
    ownerName: "",
    email: "",
    phoneNumber: "",
    location: "",
    area: "",
    city: "",
    referred: false,
    countryCode: "+91",
    commercialKitchen: "",
    foodHandlerCertificate: "",
    hourlyBasedKitchen: "",
    operatingCity: "",
    businessDetails: "",
    foodHandlerCertificateFile: null,
    productName: "",
    category: "",
    bestSeller: "",
    price: "",
    description: "",
    group: "",
    images: [],
    dietary: [],
    foodQualitySafety: "", // Ensure this property exists
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [activeStep, setActiveStep] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(false); // New state to track form submission

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileUpload = (e) => {
    setFormData({
      ...formData,
      foodHandlerCertificateFile: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true); // Show modal upon form submission
    setSubmitted(true); // Mark form as submitted
    console.log("Submitted Data:", formData);
  };

  const closeModal = () => setShowModal(false);

  // Step details array
  const stepsDetails = [
    {
      title: "Restaurant information",
      description: "Name, location and contact number",
    },
    {
      title: "Restaurant documents",
      description: "Certificate of Registration",
    },
    {
      title: "Partner contract",
      description: "Agreement and terms",
    },
  ];

  const steps = [
    <Step1 formData={formData} handleChange={handleChange} />,
    <Step3 formData={formData} handleChange={handleChange} handleFileUpload={handleFileUpload} />,
    <Step4 formData={formData} handleChange={handleChange} />,
    // <Step5 formData={formData} handleChange={handleChange} />, // Ensure formData is not undefined
  ];

  return (
    <div className={css.diningContainer}>
      <div className={css.contentWrapper}>
        {/* Left Side - Steps Indicator */}
        <div className={css.registrationCard}>
          <h2 className="font-bold text-left text-gray-800">Complete your registration</h2>
          <hr className="p-2 mt-2 my-1 border-t border-gray-300" />
          <ol className="relative text-gray-600 border-l border-gray-200">
            {stepsDetails.map((step, index) => (
              <li
                key={index}
                className={`mb-10 pl-6 ${activeStep > index || (submitted && index === steps.length - 1)
                  ? " font-bold"
                  : "text-gray-600"
                  }`}
              >
                <span
                  className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4 ${
                    activeStep > index || (submitted && index === steps.length - 1)
                      ? "bg-green-500 ring-white"
                      : "bg-gray-100 ring-white"
                  }`}
                >
                  {activeStep > index || (submitted && index === steps.length - 1) ? (
                    <svg
                      className="w-3.5 h-3.5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 16 12"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 5.917 5.724 10.5 15 1.5"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-3.5 h-3.5 text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 18 20"
                    >
                      <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2Z" />
                    </svg>
                  )}
                </span>
                <h3 className="font-medium text-lg leading-tight">{step.title}</h3>
                <p className="text-sm">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Right Side - Form */}
        <div className={css.formWrapper}>
          <header className={css.header}>
            <h1 className="text-xl text-gray-800">Partner with Zomato</h1>
            <p className="text-gray-600">Expand your reach with Zomato's delivery and dining services.</p>
          </header>

          <form onSubmit={handleSubmit} className={css.form}>
            {steps[activeStep]} {/* Rendering the active step */}
          </form>

          {/* Button Group */}
          <div className={css.buttonGroup}>
            {activeStep > 0 && (
              <button
                type="button"
                onClick={() => setActiveStep((prev) => prev - 1)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md"
              >
                Previous
              </button>
            )}
            {activeStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => setActiveStep((prev) => prev + 1)}
                className="px-6 py-2 bg-blue-500 text-white rounded-md"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 bg-green-500 text-white rounded-md"
                onClick={handleSubmit}
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg text-center">
            <h2 className="text-lg font-bold text-gray-800">Registration Complete</h2>
            <p className="text-gray-600 mt-2">Successfully registered!</p>
            <button
              onClick={closeModal}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tiffin;
