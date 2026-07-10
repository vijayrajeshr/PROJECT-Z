
// import { useState } from "react";
// // REMOVE THIS LINE: import css from "./GetTheApp.module.css"; // No longer needed
// import PhoneInput from "../../RestaurantComponents/OrderBodyComponent/Components/OrderOnlineTiffinFieldComponent/Phone_With_CountryCode";
// import mobileImg from "/images/mobile.png";
// import playstoreImg from "/icons/appstore.png"; // Assuming these are correctly named for app store icons
// import appstoreImg from "/icons/playstore.png"; // Assuming these are correctly named for app store icons
// import axios from "axios";
// const GetTheApp = () => {
//   const [inputType, setInputType] = useState(true); // Renamed `setInpuutType` to `setInputType` for consistency
//   const [validInpt, setValidInpt] = useState(true); // This state isn't currently used to trigger validation styling, but kept for future use.
//   const [email, setEmail] = useState("");
//   const [mobile,setMobile]=useState("");
//   const [message, setMessage] = useState(""); // State for success/error messages
//   const [showMessage, setShowMessage] = useState(false); // State to control message visibility

//   const handleSubmit = async () => {
//     if (inputType === true) {
//       if (!email) {
//         setMessage("Please enter your email address.");
//         setShowMessage(true);
//         setTimeout(() => setShowMessage(false), 3000); // Hide message after 3 seconds
//         return;
//       }

//       console.log("Sending email:", email);
//       try {
//         // Changed from axios.get to axios.post for sending data in the body
//         // Ensure VITE_SERVER_URL is correctly defined in your .env file
//         const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000"; // Fallback for demonstration

//         const response = await axios.post(
//           `${VITE_SERVER_URL}/api/send-app`,
//           { email: email }, // Data payload for POST request
//           { withCredentials: true }
//         );
//         console.log("Response:", response.data);
//         setMessage("App link sent successfully!");
//         setShowMessage(true);
//         setTimeout(() => setShowMessage(false), 3000); // Hide message after 3 seconds
//       } catch (error) {
//         console.error("Error while sending app link:", error);
//         setMessage("Error sending app link. Please try again.");
//         setShowMessage(true);
//         setTimeout(() => setShowMessage(false), 3000); // Hide message after 3 seconds
//       }
//     } else {
//       setMessage("Phone number submission is not yet implemented.");
//       setShowMessage(true);
//       setTimeout(() => setShowMessage(false), 3000); // Hide message after 3 seconds
//     }
//   };
//   return (
//     <div className="bg-orange-50 py-16"> {/* Light orange background for the section */}
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
//         {/* Left Section - Mobile Image */}
//         <div className="w-full md:w-1/3 flex justify-center">
//           <img
//             className="w-48 h-auto sm:w-64 md:w-full max-w-xs md:max-w-sm lg:max-w-md object-contain"
//             src={mobileImg}
//             alt="Mobile app screenshot"
//           />
//         </div>

//         {/* Right Section - Content */}
//         <div className="w-full md:w-2/3 text-center md:text-left">
//           <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
//             Get the Zomato App
//           </h2>
//           <p className="text-gray-600 text-lg sm:text-xl mb-8">
//             We'll send you a link, open it on your phone to download the app.
//           </p>

//           {/* Input Boxes */}
//           <div className="max-w-xl md:max-w-none mx-auto md:mx-0">
//             <div className="flex gap-6 mb-6 justify-center md:justify-start">
//               {/* Radio Buttons */}
//               <div
//                 className="flex items-center cursor-pointer"
//                 onClick={() => setInputType(true)}
//               >
//                 <input
//                   className="form-radio h-4 w-4 text-red-500 focus:ring-red-500 transition duration-150 ease-in-out"
//                   type="radio"
//                   name="contactMethod" // Changed name to avoid ID collision
//                   id="emailInput"
//                   checked={inputType} // Use 'checked' prop for controlled component
//                   onChange={() => setInputType(true)} // Added onChange handler for accessibility
//                 />
//                 <label className="ml-2 text-gray-700 text-lg cursor-pointer" htmlFor="emailInput">
//                   Email
//                 </label>
//               </div>
//               <div
//                 className="flex items-center cursor-pointer"
//                 onClick={() => setInputType(false)}
//               >
//                 <input
//                   className="form-radio h-4 w-4 text-red-500 focus:ring-red-500 transition duration-150 ease-in-out"
//                   type="radio"
//                   name="contactMethod" // Changed name to avoid ID collision
//                   id="phoneInput"
//                   checked={!inputType} // Use 'checked' prop for controlled component
//                   onChange={() => setInputType(false)} // Added onChange handler for accessibility
//                 />
//                 <label className="ml-2 text-gray-700 text-lg cursor-pointer" htmlFor="phoneInput">
//                   Phone
//                 </label>
//               </div>
//             </div>

//             {/* Input Field and Button */}
//             <div className="flex flex-col sm:flex-row gap-4 mb-8">
//               {inputType ? (
//                 <div className="flex-grow">
//                   <input
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-700"
//                     type="email"
//                     name="email"
//                     value={email}
//                     id="emailField" 
//                     placeholder="Enter your email"
//                     onChange={(e)=>setEmail(e.target.value)}
//                   />
//                   {!validInpt && ( // This `validInpt` state isn't dynamic currently
//                     <p className="text-red-500 text-sm mt-1 text-left">
//                       Please enter your email id
//                     </p>
//                   )}
//                 </div>
//               ) : (
//                 <div className="flex-grow">
//                   {/* PhoneInput component should ideally be styled internally with Tailwind */}
//                   <PhoneInput />
//                 </div>
//               )}
//               <button className="w-full sm:w-auto px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-200 shadow-md" onClick={handleSubmit}>
//                 Share App Link
//               </button>

//             </div>
//              {showMessage && (
//               <div className={`mt-4 p-3 rounded-lg text-center ${message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
//                 {message}
//               </div>
//             )}
//           </div>

//           {/* Download App Links */}
//           <div className="mt-8">
//             <p className="text-gray-600 text-lg sm:text-xl mb-4 text-center md:text-left">
//               Download app from
//             </p>
//             <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
//               <a href="#" className="block" target="_blank" rel="noopener noreferrer">
//                 <img className="h-12 sm:h-14 object-contain" src={appstoreImg} alt="Download on the App Store" />
//               </a>
//               <a href="#" className="block" target="_blank" rel="noopener noreferrer">
//                 <img className="h-12 sm:h-14 object-contain" src={playstoreImg} alt="Get it on Google Play" />
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GetTheApp;


import { useState } from "react";
import PhoneInput from "../../RestaurantComponents/OrderBodyComponent/Components/OrderOnlineTiffinFieldComponent/Phone_With_CountryCode";
import mobileImg from "/images/mobile.png";
import playstoreImg from "/icons/appstore.png";
import appstoreImg from "/icons/playstore.png";
import axios from "axios";

const GetTheApp = () => {
  const [inputType, setInputType] = useState(true);
  const [validInpt, setValidInpt] = useState(true);
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(false); // New loading state

  const handleSubmit = async () => {
    setLoading(true); // Set loading to true when submission starts
    const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL

    if (inputType === true) {
      if (!email) {
        setMessage("Please enter your email address.");
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
        setLoading(false); // Set loading to false if validation fails
        return;
      }
      try {
        const response = await axios.post(
          `${VITE_SERVER_URL}/api/send-app`,
          { email: email },
          { withCredentials: true }
        );
        setMessage(response.data.message || "App link sent successfully!");
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
        setEmail("");
      } catch (error) {
        console.error("Error while sending app link via email:", error);
        setMessage(error.response?.data?.message || "Error sending app link. Please try again.");
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
      } finally {
        setLoading(false); // Always set loading to false when request completes
      }
    } else {
      if (!mobile) {
        setMessage("Please enter your mobile number.");
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
        setLoading(false); // Set loading to false if validation fails
        return;
      }
      console.log(mobile?.target?.value?.fullNumber);
      const formattedMobile = String(mobile?.target?.value?.fullNumber).startsWith('+') ? mobile?.target?.value?.fullNumber : `+${mobile?.target?.value?.fullNumber}`;

      try {
        const response = await axios.post(
          `${VITE_SERVER_URL}/api/send-sms`,
          { mobile: mobile?.target?.value?.fullNumber, message: "Download our app here: [Your App Link]" },
          { withCredentials: true }
        );
        setMessage(response.data.message || "App link sent via SMS successfully!");
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
        setMobile("");
      } catch (error) {
        console.error("Error while sending app link via SMS:", error);
        setMessage(error.response?.data?.message || "Error sending app link via SMS. Please try again.");
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
      } finally {
        setLoading(false); // Always set loading to false when request completes
      }
    }
  };

  return (
    <div className="bg-[white] py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
        <div className="w-full md:w-1/3 flex justify-center">
          <img
            className="w-48 h-auto sm:w-64 md:w-full max-w-xs md:max-w-sm lg:max-w-md object-contain"
            src={mobileImg}
            alt="Mobile app screenshot"
          />
        </div>

        <div className="w-full md:w-2/3 text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-800 mb-4">
            Get the Zomato App
          </h2>
          <p className="text-gray-600 text-lg sm:text-xl mb-8">
            We'll send you a link, open it on your phone to download the app.
          </p>

          <div className="max-w-xl md:max-w-none mx-auto md:mx-0">
            <div className="flex gap-6 mb-6 justify-start md:justify-start">
              <div
                className="flex items-center cursor-pointer"
                onClick={() => setInputType(true)}
              >
                <input
                  className="form-radio h-4 w-4 text-primary focus:ring-primary transition duration-150 ease-in-out"
                  type="radio"
                  name="contactMethod"
                  id="emailInput"
                  checked={inputType}
                  onChange={() => setInputType(true)}
                />
                <label
                  className="ml-2 text-gray-700 text-lg cursor-pointer"
                  htmlFor="emailInput"
                >
                  Email
                </label>
              </div>
              <div
                className="flex items-center cursor-pointer"
                onClick={() => setInputType(false)}
              >
                <input
                  className="form-radio h-4 w-4 text-primary focus:ring-primary transition duration-150 ease-in-out"
                  type="radio"
                  name="contactMethod"
                  id="phoneInput"
                  checked={!inputType}
                  onChange={() => setInputType(false)}
                />
                <label
                  className="ml-2 text-gray-700 text-lg cursor-pointer"
                  htmlFor="phoneInput"
                >
                  Phone
                </label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {inputType ? (
                <div className="flex-grow">
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-gray-700"
                    type="email"
                    name="email"
                    value={email}
                    id="emailField"
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading} // Disable input while loading
                  />
                  {!validInpt && (
                    <p className="text-red-500 text-sm mt-1 text-left">
                      Please enter your email id
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex-grow">
                  <PhoneInput value={mobile} onChange={setMobile} disabled={loading} /> {/* Disable PhoneInput while loading */}
                </div>
              )}
              <button
                className="w-full sm:w-auto px-6 py-1 bg-[#02757A] text-white font-semibold rounded-lg hover:bg-[#02757A] transition duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed "
                onClick={handleSubmit}
                disabled={loading} // Disable button while loading
              >
                {loading ? 'Sending...' : 'Share App Link'} {/* Change button text */}
              </button>
            </div>
            {showMessage && (
              <div className={`mt-4 p-3 rounded-lg text-center ${message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                {message}
              </div>
            )}
          </div>

          <div className="mt-8">
            <p className="text-gray-600 text-lg sm:text-xl mb-4 text-left">
              Download app from
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-start gap-4">
              <a
                href="#"
                className="block"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="h-12 sm:h-14 object-contain"
                  src={appstoreImg}
                  alt="Download on the App Store"
                />
              </a>
              <a
                href="#"
                className="block"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="h-12 sm:h-14 object-contain"
                  src={playstoreImg}
                  alt="Get it on Google Play"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetTheApp;

