import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import css from "./Dining.module.css";
import Step1 from "./Step1";
import Step3 from "./Step3";
import Step4 from "./Step4";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { isValidPhoneNumber } from "libphonenumber-js";
const Dining = () => {
  const location = useLocation();
  const [serviceType, setServiceType] = useState("dining"); // Default to dining
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Step 1 fields
    restaurantName: "",
    ownerName: "",
    email: "",
    ownerPhoneNumber: "",
    ownerCountryCode: "+91",
    useNumberViaWhatsApp: false,
    useSamePhoneNumber: false,
    restaurantPhoneNumber: "",
    restaurantCountryCode: "+91",
    location: "",
    shopNo1: "",
    shopNo2: "",
    area: "",
    city: "",
    landmark: "",
    referred: false,
    referralEmail: "",
    latitude: null,
    longitude: null,

    // Step 3 placeholders (document details, etc.)
    commercialKitchen: "",
    foodHandlerCertificate: "",
    hourlyBasedKitchen: "",
    operatingCity: "",
    businessDetails: "",
    foodHandlerCertificateFile: null,

    // Step 4 placeholders (sample product info, etc.)
    productName: "",
    category: "",
    bestSeller: "",
    price: "",
    description: "",
    group: "",
    images: [],
    dietary: [],
    foodQualitySafety: "",

    // Checkboxes
    categoryVeg: false,
    categoryNonVeg: false,
    categoryBoth: false,

    serviceNightLife: false,
    serviceDineOut: false,
    serviceDelivery: false,
    serviceTiffin: false,

    // Cuisines
    cuisines: [],
    newCuisine: "",

    // Price range
    priceRange: "50",

    // Additional fields for Tiffin service
    cities: [],
    mealDays: [],
    flexibleOrderDates: false,
  });

  // Determine the service type from the URL or state passed from previous page
  useEffect(() => {
    // Extract service type from URL or location state
    const pathname = location.pathname.toLowerCase();
    if (pathname.includes("tiffin")) {
      setServiceType("tiffin");
    } else {
      // Check if there's state from the previous page
      if (location.state && location.state.serviceType) {
        setServiceType(location.state.serviceType);
      }
    }
  }, [location]);

  // Current step in the multi-step form
  const [activeStep, setActiveStep] = useState(0);

  // For final "success" modal
  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Scroll to top whenever step changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeStep]);

  // Update formData on input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "restaurantName") setError("");
  };

  // For file uploads (Step 3)
  const handleFileUpload = (e) => {
    setFormData((prev) => ({
      ...prev,
      foodHandlerCertificateFile: e.target.files[0],
    }));
  };

  // Called when user clicks "Next" (for step 0 or 1)
  const handleNext = () => {
    const formElement = document.getElementById("multiStepForm");

    if (formElement.reportValidity()) {
      if (activeStep === 0) {
        if (!formData.restaurantName.trim()) {
          setError("Restaurant name is required");
          return;
        }

        const fullOwnerNumber =
          formData.ownerCountryCode + formData.ownerPhoneNumber;
        if (!isValidPhoneNumber(fullOwnerNumber)) {
          alert("Invalid owner phone number");
          return;
        }
        console.log("Step 1 formData:", formData);
      }

      if (activeStep === 1) {
        if (!formData.documentValidation?.isValid) {
          alert("Please select the required documents before proceeding.");
          return;
        }
        if (!formData.productDescription.trim()) {
          alert("Product description is required.");
          return;
        }
        console.log("Step 3 formData:", formData);
      }

      if (activeStep < steps.length - 1) {
        setActiveStep((prev) => prev + 1);
        console.log("Navigating to step:", activeStep + 1);
      }
    }
  };

  const onSubmit = () => {
    navigate("/add-restaurant"); // Or redirect elsewhere
  };

  // Called when user clicks "Previous"
  const handlePrevious = () => {
    setActiveStep((prev) => prev - 1);
  };

  // const handleSubmit = async () => {
  //   const formElement = document.getElementById("multiStepForm");

  //   if (formElement.reportValidity()) {
  //     try {
  //       setSubmitted(true);
  //       setShowModal(true);
  //     } catch (error) {
  //       console.error("Error during form submission:", error);
  //       alert("Submission failed. Please try again.");
  //     }
  //   }
  // };
  const handleDocumentUpload = (documentType, file) => {
    setFormData((prev) => ({
      ...prev,
      uploadedDocs: {
        ...prev.uploadedDocs,
        [documentType]: { file, documentType, serviceType },
      },
    }));
  };

  // Close the success modal
  const closeModal = () => setShowModal(false);

  // Info for the side panel steps
  const businessType = serviceType === "tiffin" ? "Tiffin" : "Restaurant";
  const stepsDetails = [
    {
      title: `${businessType} information`,
      description: "Name, location and contact number",
    },
    {
      title: `${businessType} documents`,
      description: "Certificate of Registration",
    },
    {
      title: "Partner contract",
      description: "Agreement and terms",
    },
  ];

  // Each index of this array is one step
  const steps = useMemo(
    () => [
      <Step1
        key="step1"
        formData={formData}
        handleChange={handleChange}
        setFormData={setFormData}
        serviceType={serviceType}
      />,
      <Step3
        key="step3"
        formData={formData}
        handleChange={handleChange}
        setFormData={setFormData}
        handleDocumentUpload={handleDocumentUpload}
        serviceType={serviceType}
      />,
      <Step4
        key="step4"
        formData={formData}
        handleChange={handleChange}
        setFormData={setFormData}
        serviceType={serviceType}
      />,
    ],
    [formData, handleChange, setFormData, serviceType, handleDocumentUpload]
  );
  // Debug steps array
  useEffect(() => {
    console.log("Steps array initialized:", steps);
    console.log("setFormData type in AddOutletModal:", typeof setFormData);
  }, [steps]);

  return (
    <div className="">
      <div className="">
        <div className={css.diningContainer}>
          <div className={css.contentWrapper}>
            <div className={css.registrationCard}>
              <h2 className="font-bold text-left text-gray-800">
                Complete your registration
              </h2>
              <hr className="p-2 mt-2 my-1 border-t border-gray-300" />
              <ol className="relative text-gray-600 border-l border-gray-200">
                {stepsDetails.map((step, index) => {
                  const isDone =
                    activeStep > index ||
                    (submitted && index === steps.length - 1);
                  return (
                    <li
                      key={index}
                      className={`mb-10 pl-6 ${
                        isDone ? "font-bold" : "text-gray-600"
                      }`}
                    >
                      <span
                        className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4 ${
                          isDone
                            ? "bg-green-500 ring-white"
                            : "bg-gray-100 ring-white"
                        }`}
                      >
                        {isDone ? (
                          <svg
                            className="w-3.5 h-3.5 text-white"
                            fill="none"
                            viewBox="0 0 16 12"
                          >
                            <path
                              d="M1 5.917 5.724 10.5 15 1.5"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-3.5 h-3.5 text-gray-500"
                            fill="currentColor"
                            viewBox="0 0 18 20"
                          >
                            <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2Z" />
                          </svg>
                        )}
                      </span>
                      <h3 className="font-medium text-lg leading-tight">
                        {step.title}
                      </h3>
                      <p className="text-sm">{step.description}</p>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className={css.formWrapper}>
              <header className={css.header}>
                <h1 className="text-xl text-gray-800">
                  {serviceType === "tiffin"
                    ? "Tiffin Information"
                    : "Restaurant Information"}
                </h1>
                <p className="text-gray-600">
                  Expand your reach with Zomatos delivery and dining services.
                </p>
              </header>

              <form id="multiStepForm" className={css.form}>
                {steps[activeStep]}
              </form>

              <div className={css.buttonGroup}>
                {activeStep > 0 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md"
                  >
                    Previous
                  </button>
                )}
                {activeStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2 bg-blue-500 text-white rounded-md"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    onClick={onSubmit}
                    className="px-6 py-2 bg-green-500 text-white rounded-md"
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {showModal && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-lg text-center">
              <h2 className="text-lg font-bold text-gray-800">
                Registration Complete
              </h2>
              <p className="text-gray-600 mt-2">
                {serviceType === "tiffin"
                  ? "Your tiffin service has been successfully registered!"
                  : "Your restaurant has been successfully registered!"}
              </p>
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
    </div>
  );
};

export default Dining;
