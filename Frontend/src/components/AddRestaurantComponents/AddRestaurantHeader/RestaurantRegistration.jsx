// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import css from "./RestaurantRegistration.module.css";

// const RestaurantRegistration = ({ onClose }) => {
//   const navigate = useNavigate();
//   const [selectedServices, setSelectedServices] = useState([]); // Track selected services as an array

//   const handleCardSelect = (serviceType) => {
//     // If the service is already selected, remove it from the array
//     if (selectedServices.includes(serviceType)) {
//       setSelectedServices(selectedServices.filter((service) => service !== serviceType));
//     } else {
//       // Otherwise, add it to the array
//       setSelectedServices([...selectedServices, serviceType]);
//     }
//   };

//   const handleRegisterClick = () => {
//     // Navigate based on selected services
//     if (selectedServices.includes("both")) {
//       navigate("/Dining");
//     } else if (selectedServices.includes("delivery")) {
//       navigate("/Dining");
//     } else if (selectedServices.includes("dining")) {
//       navigate("/Dining");
//     } else if (selectedServices.includes("tiffin")) {
//       navigate("/tiffin");
//     }
//   };

//   const services = [
//     {
//       id: "both",
//       title: "Takeaway",
//       description: "List your restaurant on both the delivery and dining sections.",
//       imgSrc: "/Project Images/both.avif",
//     },
//     {
//       id: "dining",
//       title: "Dining",
//       description: "List your restaurant in the dining section only.",
//       imgSrc: "/Project Images/dining.avif",
//     },
//     {
//       id: "tiffin",
//       title: "Tiffin",
//       description: "List your Tiffin in the delivery section only.",
//       imgSrc: "/Project Images/food.avif",
//     },
//   ];

//   return (
//     <div className={css.modalOverlay}>
//       <div className={css.modalContent}>
//         <button className={css.closeBtn} onClick={onClose}>
//           ×
//         </button>
//         <h1>Select the service you want to register.</h1>

//         <div className={css.serviceContainer}>
//           {services.map((service) => (
//             <div
//               key={service.id}
//               className={`${css.serviceOption} ${
//                 selectedServices.includes(service.id) ? css.selected : ""
//               }`}
//               onClick={() => handleCardSelect(service.id)}
//             >
//               <div className={css.textContainer}>
//                 <h2>{service.title}</h2>
//                 <p>{service.description}</p>
//               </div>
//               <img
//                 src={service.imgSrc}
//                 alt={service.title}
//                 className={css.serviceImage}
//               />
//             </div>
//           ))}
//         </div>

//         <button
//           className={css.btn}
//           onClick={handleRegisterClick}
//           disabled={selectedServices.length === 0} // Disable button if no services are selected
//         >
//           Register Now
//         </button>
//       </div>
//     </div>
//   );
// };

// export default RestaurantRegistration;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Tailwind-converted and responsive RestaurantRegistration component.
 * Now fully responsive:
 * - Modal adapts width based on screen size (sm, md, lg)
 * - Service cards stack on small screens, switch to grid layout on md+
 * - Ensures usability on all devices
 */

const RestaurantRegistration = ({ onClose }) => {
  const navigate = useNavigate();
  const [selectedServices, setSelectedServices] = useState([]);

  const handleCardSelect = (serviceType) => {
    if (selectedServices.includes(serviceType)) {
      setSelectedServices(selectedServices.filter((s) => s !== serviceType));
    } else {
      setSelectedServices([...selectedServices, serviceType]);
    }
  };

  const handleRegisterClick = () => {
    const selectedService = selectedServices[0];

    if (selectedService === "tiffin") {
      navigate("/add-restaurant/tiffin", { state: { serviceType: "tiffin" } });
    } else {
      navigate("/dining", { state: { serviceType: selectedService } });
    }
  };

  const services = [
    {
      id: "both",
      title: "Takeaway",
      description:
        "List your restaurant on both the delivery and dining sections.",
      imgSrc: "/Project Images/both.avif",
    },
    {
      id: "dining",
      title: "Dining",
      description: "List your restaurant in the dining section only.",
      imgSrc: "/Project Images/dining.avif",
    },
    {
      id: "tiffin",
      title: "Tiffin",
      description: "List your Tiffin in the delivery section only.",
      imgSrc: "/Project Images/food.avif",
    },
  ];

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-[8px] px-4">
      <div
        className="relative bg-white rounded-[12px] p-5 w-full sm:w-[450px] md:w-[600px] lg:w-[700px] max-w-full text-center overflow-y-auto max-h-[90vh]"
        style={{ boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="close"
          className="absolute top-[10px] right-[10px] text-2xl text-[#999] hover:text-black"
        >
          ×
        </button>

        {/* Heading */}
        <h1 className="text-[20px] font-semibold mb-[15px] text-[#666666]">
          Select the service you want to register.
        </h1>

        {/* Services list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service) => {
            const isSelected = selectedServices.includes(service.id);

            return (
              <div
                key={service.id}
                onClick={() => handleCardSelect(service.id)}
                className={`relative flex items-center rounded-lg p-4 shadow-sm text-left cursor-pointer transition-all ${isSelected ? "border-2 border-[#256fef] bg-[#f0f8ff]" : "bg-white"
                  }`}
              >
                {/* Left gradient overlay (emulates ::before) */}
                <div className="absolute top-0 left-0 h-full w-16 rounded-l-lg z-0 bg-gradient-to-l from-white to-transparent" />

                {/* Right gradient overlay (emulates ::after) */}
                <div className="absolute top-0 right-0 h-full w-16 rounded-r-lg z-0 bg-gradient-to-r from-white to-[#ffede6]" />

                {/* Text */}
                <div className="flex-1 relative z-10">
                  <h2 className="text-[16px] font-semibold text-[#222] mb-1">
                    {service.title}
                  </h2>
                  <p className="text-[13px] text-[#555] mb-2">{service.description}</p>
                </div>

                {/* Image */}
                <img
                  src={service.imgSrc}
                  alt={service.title}
                  className="w-16 h-16 ml-4 relative z-10 object-cover"
                />
              </div>
            );
          })}
        </div>

        {/* Register button */}
        <button
          onClick={handleRegisterClick}
          disabled={selectedServices.length === 0}
          className="mt-6 text-[#256fef] font-medium hover:text-[#1747c4] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Register Now
        </button>
      </div>
    </div>
  );
};

export default RestaurantRegistration;