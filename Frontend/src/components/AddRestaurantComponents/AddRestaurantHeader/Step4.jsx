// import React, { useEffect, useState } from "react";
// import Modal from "react-modal";
// import axios from "axios";

// Modal.setAppElement("#root");

// export default function Step4({ formData, handleChange, setFormData }) {
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const [isChecked, setIsChecked] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   const handleAcceptTerms = async () => {
//     if (!isChecked) {
//       setError("You must agree to the terms and conditions");
//       return;
//     }

//     setIsSubmitting(true);
//     setError(null);

//     try {
//       const formDataObj = new FormData();
//       formDataObj.append("termsAccepted", "true");
//       formDataObj.append("formData", JSON.stringify(formData));
//       formDataObj.append(
//         "productDescription",
//         formData.productDescription || ""
//       );
//       formDataObj.append(
//         "documentTypes",
//         JSON.stringify(Object.keys(formData.uploadedDocs || {}))
//       );

//       // Append all queued documents
//       Object.entries(formData.uploadedDocs || {}).forEach(
//         ([documentType, doc]) => {
//           formDataObj.append(`documents[${documentType}]`, doc.file);
//         }
//       );

//       // Log FormData contents for debugging
//       for (let [key, value] of formDataObj.entries()) {
//         console.log(
//           `FormData: ${key} = ${value instanceof File ? value.name : value}`
//         );
//       }

//       const response = await axios.post(
//         "http://localhost:3000/api/terms/accept",
//         formDataObj,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       if (response.data.success) {
//         // Update upload status and file paths
//         const updatedStatus = {};
//         Object.keys(formData.uploadedDocs || {}).forEach((documentType) => {
//           updatedStatus[documentType] = {
//             status: "success",
//             message: "Document uploaded successfully!",
//             filePath: response.data.filePaths?.[documentType] || "",
//           };
//         });

//         setFormData((prev) => ({
//           ...prev,
//           uploadStatus: updatedStatus,
//           [formData.serviceType === "tiffin" ? "tiffinId" : "restaurantId"]:
//             response.data.restaurant.id,
//           ...Object.fromEntries(
//             Object.entries(response.data.filePaths || {}).map(
//               ([key, value]) => [`${key}Path`, value]
//             )
//           ),
//         }));

//         setSuccess(true);
//         setModalIsOpen(false);
//       }
//     } catch (err) {
//       console.error("Error accepting terms:", err);
//       setError(
//         err.response?.data?.message || "Failed to complete registration"
//       );

//       // Update upload status to error
//       const updatedStatus = {};
//       Object.keys(formData.uploadedDocs || {}).forEach((documentType) => {
//         updatedStatus[documentType] = {
//           status: "error",
//           message: err.response?.data?.message || "Failed to upload document",
//         };
//       });

//       setFormData((prev) => ({
//         ...prev,
//         uploadStatus: updatedStatus,
//       }));
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="px-4 max-w-3xl mx-auto font-sans">
//       {success && (
//         <div className="bg-green-100 text-green-800 p-4 rounded-md text-center">
//           <h3 className="text-lg font-bold">
//             Registration Completed Successfully!
//           </h3>
//           <p>Your restaurant has been registered. You can leave this page.</p>
//         </div>
//       )}

//       {error && (
//         <div className="bg-red-100 text-red-800 p-4 rounded-md text-center">
//           {error}
//         </div>
//       )}

//       {!success && (
//         <div>
//           <p className="text-gray-700 text-lg mb-4">
//             Please read and accept our terms and conditions to complete your
//             registration.
//           </p>
//           <p
//             className="text-blue-600 underline cursor-pointer mb-4 font-semibold"
//             onClick={() => setModalIsOpen(true)}
//           >
//             Read and Accept Terms and Conditions
//           </p>
//         </div>
//       )}

//       <Modal
//         isOpen={modalIsOpen}
//         onRequestClose={() => setModalIsOpen(false)}
//         className="fixed inset-0 flex items-center justify-center z-60"
//         overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
//       >
//         <div className="bg-white rounded-lg shadow-lg max-w-xl mx-auto p-6">
//           <h2 className="text-2xl font-semibold text-gray-800 mb-4">
//             Terms and Conditions
//           </h2>

//           <div className="mb-4">
//             <h3 className="font-bold text-lg mb-2">1. Partner Obligations</h3>
//             <p className="text-gray-700">
//               The Partner agrees to uphold responsibilities to maintain service
//               quality.
//             </p>
//           </div>

//           <div className="mb-4">
//             <h3 className="font-bold text-lg mb-2">2. Platform Obligations</h3>
//             <p className="text-gray-700">
//               The Platform provides technical support, payment processing, and
//               marketing services.
//             </p>
//           </div>

//           <div className="mb-4">
//             <h3 className="font-bold text-lg mb-2">3. Payment Terms</h3>
//             <p className="text-gray-700">
//               The Platform and Partner agree to a structured commission and
//               payout schedule.
//             </p>
//           </div>

//           <div className="mb-4">
//             <h3 className="font-bold text-lg mb-2">4. Termination Clauses</h3>
//             <p className="text-gray-700">
//               This Agreement remains valid unless terminated under specific
//               conditions.
//             </p>
//           </div>

//           <div className="flex items-center gap-4 mt-6">
//             <input
//               type="checkbox"
//               id="agreeCheckbox"
//               checked={isChecked}
//               onChange={() => setIsChecked(!isChecked)}
//               className="w-5 h-5 cursor-pointer"
//             />
//             <label
//               htmlFor="agreeCheckbox"
//               className="text-gray-700 font-medium cursor-pointer"
//             >
//               I agree to all Terms and Conditions.
//             </label>

//             <button
//               onClick={handleAcceptTerms}
//               disabled={!isChecked || isSubmitting}
//               className={`ml-auto px-4 py-2 rounded-md text-white ${
//                 isChecked ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400"
//               }`}
//             >
//               {isSubmitting ? "Processing..." : "Accept"}
//             </button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import PropTypes from "prop-types";

Modal.setAppElement("#root");

export default function Step4({
  formData = {},
  handleChange = () => {},
  setFormData = () => {},
  serviceType,
}) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Debug props on mount
  useEffect(() => {
    console.log("Step4 props:", {
      formData,
      handleChange,
      setFormData,
      serviceType,
    });
    console.log("setFormData type:", typeof setFormData);
  }, [formData, handleChange, setFormData, serviceType]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleAcceptTerms = async () => {
    if (!isChecked) {
      setError("You must agree to the terms and conditions");
      return;
    }

    if (typeof setFormData !== "function") {
      console.error("setFormData is not a function:", setFormData);
      setError("Internal error: Unable to update form data");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formDataObj = new FormData();
      formDataObj.append("termsAccepted", "true");
      formDataObj.append("formData", JSON.stringify(formData));
      formDataObj.append(
        "productDescription",
        formData.productDescription || ""
      );
      formDataObj.append(
        "documentTypes",
        JSON.stringify(Object.keys(formData.uploadedDocs || {}))
      );

      // Append all queued documents
      Object.entries(formData.uploadedDocs || {}).forEach(
        ([documentType, doc]) => {
          formDataObj.append(`documents[${documentType}]`, doc.file);
        }
      );

      // Log FormData contents for debugging
      for (let [key, value] of formDataObj.entries()) {
        console.log(
          `FormData: ${key} = ${value instanceof File ? value.name : value}`
        );
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/terms/accept/${serviceType}`,
        formDataObj,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        // Update upload status and file paths
        const updatedStatus = {};
        Object.keys(formData.uploadedDocs || {}).forEach((documentType) => {
          updatedStatus[documentType] = {
            status: "success",
            message: "Document uploaded successfully!",
            filePath: response.data.filePaths?.[documentType] || "",
          };
        });

        // setFormData((prev) => ({
        //   ...prev,
        //   uploadStatus: updatedStatus,
        //   [serviceType === "tiffin" ? "tiffinId" : "restaurantId"]:
        //     response.data.restaurant.id,
        //   ...Object.fromEntries(
        //     Object.entries(response.data.filePaths || {}).map(
        //       ([key, value]) => [`${key}Path`, value]
        //     )
        //   ),
        // }));

        setSuccess(true);
        setModalIsOpen(false);
      }
    } catch (err) {
      console.error("Error accepting terms:", err);
      setError(
        err.response?.data?.message || "Failed to complete registration"
      );

      // Update upload status to error
      const updatedStatus = {};
      Object.keys(formData.uploadedDocs || {}).forEach((documentType) => {
        updatedStatus[documentType] = {
          status: "error",
          message: err.response?.data?.message || "Failed to upload document",
        };
      });

      setFormData((prev) => ({
        ...prev,
        uploadStatus: updatedStatus,
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-4 max-w-3xl mx-auto font-sans">
      {success && (
        <div className="bg-green-100 text-green-800 p-4 rounded-md text-center">
          <h3 className="text-lg font-bold">
            Registration Completed Successfully!
          </h3>
          <p>Your restaurant has been registered. You can leave this page.</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-md text-center">
          {error}
        </div>
      )}

      {!success && (
        <div>
          <p className="text-gray-700 text-lg mb-4">
            Please read and accept our terms and conditions to complete your
            registration.
          </p>
          <p
            className="text-blue-600 underline cursor-pointer mb-4 font-semibold"
            onClick={() => setModalIsOpen(true)}
          >
            Read and Accept Terms and Conditions
          </p>
        </div>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="fixed inset-0 flex items-center justify-center z-60"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
      >
        <div className="bg-white rounded-lg shadow-lg max-w-xl mx-auto p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Terms and Conditions
          </h2>

          <div className="mb-4">
            <h3 className="font-bold text-lg mb-2">1. Partner Obligations</h3>
            <p className="text-gray-700">
              The Partner agrees to uphold responsibilities to maintain service
              quality.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="font-bold text-lg mb-2">2. Platform Obligations</h3>
            <p className="text-gray-700">
              The Platform provides technical support, payment processing, and
              marketing services.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="font-bold text-lg mb-2">3. Payment Terms</h3>
            <p className="text-gray-700">
              The Platform and Partner agree to a structured commission and
              payout schedule.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="font-bold text-lg mb-2">4. Termination Clauses</h3>
            <p className="text-gray-700">
              This Agreement remains valid unless terminated under specific
              conditions.
            </p>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <input
              type="checkbox"
              id="agreeCheckbox"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
              className="w-5 h-5 cursor-pointer"
            />
            <label
              htmlFor="agreeCheckbox"
              className="text-gray-700 font-medium cursor-pointer"
            >
              I agree to all Terms and Conditions.
            </label>

            <button
              onClick={handleAcceptTerms}
              disabled={!isChecked || isSubmitting}
              className={`ml-auto px-4 py-2 rounded-md text-white ${
                isChecked ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400"
              }`}
            >
              {isSubmitting ? "Processing..." : "Accept"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

Step4.propTypes = {
  formData: PropTypes.object,
  handleChange: PropTypes.func,
  setFormData: PropTypes.func.isRequired,
  serviceType: PropTypes.string,
};
