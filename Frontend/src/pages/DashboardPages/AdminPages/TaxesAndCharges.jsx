// import { useState } from "react";
// import { FaEdit, FaPlus } from "react-icons/fa";
// import { MdDelete } from "react-icons/md";

// const initialTaxes = [
//   {
//     id: 1,
//     country: "Canada",
//     type: "GST",
//     rate: "5%",
//     description: "Applied across all provinces on restaurant meals",
//     status: "approved",
//   },
//   {
//     id: 2,
//     country: "Canada",
//     type: "HST",
//     rate: "13-15%",
//     description: "Combines GST and PST; varies by province",
//     status: "approved",
//   },
//   {
//     id: 3,
//     country: "Mexico",
//     type: "VAT",
//     rate: "16%",
//     description: "Standard nationwide for dine-in, takeout, and delivery",
//     status: "approved",
//   },
//   {
//     id: 4,
//     country: "United States",
//     type: "State Sales Tax",
//     rate: "2.9%-7.25%",
//     description: "Varies by state; applies to prepared foods",
//     status: "approved",
//   },
// ];

// const TaxesAndCharges = () => {
//   const [taxes, setTaxes] = useState(initialTaxes);
//   const [newTax, setNewTax] = useState({
//     country: "",
//     type: "",
//     rate: "",
//     description: "",
//   });
//   const [role, setRole] = useState("admin");
//   const [notification, setNotification] = useState("");

//   const handleInputChange = (e) => {
//     setNewTax({ ...newTax, [e.target.name]: e.target.value });
//   };

//   const handleAddTax = () => {
//     if (newTax.country && newTax.type && newTax.rate) {
//       setTaxes([
//         ...taxes,
//         { id: taxes.length + 1, ...newTax, status: "approved" },
//       ]);
//       setNewTax({ country: "", type: "", rate: "", description: "" });
//       setNotification("New tax added successfully!");
//     } else {
//       alert("Please fill in all fields.");
//     }
//   };

//   const handleDeleteTax = (id) => {
//     const updatedTaxes = taxes.filter((tax) => tax.id !== id);
//     setTaxes(updatedTaxes);
//     setNotification("Tax deleted successfully!");
//   };

//   const handleEditTax = (id) => {
//     const taxToEdit = taxes.find((tax) => tax.id === id);
//     setNewTax(taxToEdit);
//     setTaxes(taxes.filter((tax) => tax.id !== id));
//   };

//   const handleSubmitProposal = () => {
//     if (
//       role === "restaurant-owner" &&
//       newTax.country &&
//       newTax.type &&
//       newTax.rate
//     ) {
//       setTaxes([
//         ...taxes,
//         { id: taxes.length + 1, ...newTax, status: "pending" },
//       ]);
//       setNewTax({ country: "", type: "", rate: "", description: "" });
//       setNotification("Tax proposal submitted for approval.");
//     } else {
//       alert("Only restaurant owners can submit proposals.");
//     }
//   };

//   const handleApproveProposal = (id) => {
//     const updatedTaxes = taxes.map((tax) =>
//       tax.id === id ? { ...tax, status: "approved" } : tax
//     );
//     setTaxes(updatedTaxes);
//     setNotification("Tax proposal approved.");
//   };

//   const handleRejectProposal = (id) => {
//     const updatedTaxes = taxes.filter((tax) => tax.id !== id);
//     setTaxes(updatedTaxes);
//     setNotification("Tax proposal rejected.");
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 md:p-6">
//       {/* Notification */}
//       {notification && (
//         <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">
//           {notification}
//         </div>
//       )}

//       {/* Add/Propose Tax Form */}
//       <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//         <h3 className="text-lg font-semibold text-gray-700 mb-4">
//           {role === "admin" ? "Add New Tax" : "Propose Tax Change"}
//         </h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           <div>
//             <label className="block text-sm text-gray-600 mb-1">Country</label>
//             <input
//               type="text"
//               name="country"
//               placeholder="Country"
//               value={newTax.country}
//               onChange={handleInputChange}
//               className="w-full border rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
//             />
//           </div>
//           <div>
//             <label className="block text-sm text-gray-600 mb-1">Tax Type</label>
//             <input
//               type="text"
//               name="type"
//               placeholder="Tax Type"
//               value={newTax.type}
//               onChange={handleInputChange}
//               className="w-full border rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
//             />
//           </div>
//           <div>
//             <label className="block text-sm text-gray-600 mb-1">Rate</label>
//             <input
//               type="text"
//               name="rate"
//               placeholder="Rate"
//               value={newTax.rate}
//               onChange={handleInputChange}
//               className="w-full border rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
//             />
//           </div>
//           <div>
//             <label className="block text-sm text-gray-600 mb-1">
//               Description
//             </label>
//             <input
//               type="text"
//               name="description"
//               placeholder="Description"
//               value={newTax.description}
//               onChange={handleInputChange}
//               className="w-full border rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
//             />
//           </div>
//           <div className="md:col-span-2 lg:col-span-4 flex justify-end">
//             <button
//               onClick={role === "admin" ? handleAddTax : handleSubmitProposal}
//               className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center"
//             >
//               <FaPlus className="mr-2" />
//               {role === "admin" ? "Add Tax" : "Submit Proposal"}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Tax List Table */}
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="p-4 border-b border-gray-200">
//           <h3 className="text-lg font-semibold text-gray-700">Tax Rates</h3>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-50">
//               <tr className="text-gray-500">
//                 <th className="py-3 px-4 text-left">Country</th>
//                 <th className="py-3 px-4 text-left">Tax Type</th>
//                 <th className="py-3 px-4 text-left">Rate</th>
//                 <th className="hidden md:table-cell py-3 px-4 text-left">
//                   Description
//                 </th>
//                 <th className="py-3 px-4 text-left">Status</th>
//                 <th className="py-3 px-4 text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {taxes.map((tax) => (
//                 <tr key={tax.id} className="hover:bg-gray-50 transition">
//                   <td className="py-3 px-4">{tax.country}</td>
//                   <td className="py-3 px-4">{tax.type}</td>
//                   <td className="py-3 px-4">{tax.rate}</td>
//                   <td className="hidden md:table-cell py-3 px-4">
//                     {tax.description}
//                   </td>
//                   <td className="py-3 px-4">
//                     <span
//                       className={`px-2 py-1 text-xs font-semibold rounded-full ${
//                         tax.status === "approved"
//                           ? "bg-green-100 text-green-800"
//                           : "bg-yellow-100 text-yellow-800"
//                       }`}
//                     >
//                       {tax.status}
//                     </span>
//                   </td>
//                   <td className="py-3 px-4">
//                     <div className="flex justify-center space-x-2">
//                       {role === "admin" && tax.status === "pending" && (
//                         <>
//                           <button
//                             onClick={() => handleApproveProposal(tax.id)}
//                             className="text-green-600 hover:text-green-800 transition"
//                           >
//                             Approve
//                           </button>
//                           <button
//                             onClick={() => handleRejectProposal(tax.id)}
//                             className="text-red-600 hover:text-red-800 transition"
//                           >
//                             Reject
//                           </button>
//                         </>
//                       )}
//                       {role === "admin" && (
//                         <>
//                           <button
//                             onClick={() => handleEditTax(tax.id)}
//                             className="text-blue-600 hover:text-blue-800 transition"
//                           >
//                             <FaEdit className="w-4 h-4" />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteTax(tax.id)}
//                             className="text-red-600 hover:text-red-800 transition"
//                           >
//                             <MdDelete className="w-4 h-4" />
//                           </button>
//                         </>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//               {taxes.length === 0 && (
//                 <tr>
//                   <td colSpan="6" className="text-center py-4 text-gray-500">
//                     No taxes available. Add new taxes or submit proposals.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Dynamic Tax Card Grid */}
//       <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {taxes.map((tax) => (
//           <div key={tax.id} className="bg-white rounded-lg shadow-md p-4">
//             <div className="flex justify-between items-start mb-2">
//               <h4 className="font-semibold text-gray-700">{tax.country}</h4>
//               <span
//                 className={`px-2 py-1 text-xs font-semibold rounded-full ${
//                   tax.status === "approved"
//                     ? "bg-green-100 text-green-800"
//                     : "bg-yellow-100 text-yellow-800"
//                 }`}
//               >
//                 {tax.status}
//               </span>
//             </div>
//             <div className="text-sm text-gray-600">
//               <p>
//                 <span className="font-medium">Type:</span> {tax.type}
//               </p>
//               <p>
//                 <span className="font-medium">Rate:</span> {tax.rate}
//               </p>
//               <p className="mt-2">{tax.description}</p>
//             </div>
//             {role === "admin" && (
//               <div className="mt-4 flex justify-end space-x-2">
//                 {tax.status === "pending" && (
//                   <>
//                     <button
//                       onClick={() => handleApproveProposal(tax.id)}
//                       className="text-green-600 hover:text-green-800 transition"
//                     >
//                       Approve
//                     </button>
//                     <button
//                       onClick={() => handleRejectProposal(tax.id)}
//                       className="text-red-600 hover:text-red-800 transition"
//                     >
//                       Reject
//                     </button>
//                   </>
//                 )}
//                 <button
//                   onClick={() => handleEditTax(tax.id)}
//                   className="text-blue-600 hover:text-blue-800 transition"
//                 >
//                   <FaEdit className="w-4 h-4" />
//                 </button>
//                 <button
//                   onClick={() => handleDeleteTax(tax.id)}
//                   className="text-red-600 hover:text-red-800 transition"
//                 >
//                   <MdDelete className="w-4 h-4" />
//                 </button>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TaxesAndCharges;

import { useState, useEffect } from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from "axios";

const TaxesAndCharges = () => {
  const [taxes, setTaxes] = useState([]);
  const [newTax, setNewTax] = useState({
    country: "",
    type: "",
    rate: "",
    description: "",
  });
  const [role, setRole] = useState("admin");
  const [notification, setNotification] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

  useEffect(() => {
    fetchTaxes();
  }, []);

  const fetchTaxes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/taxes`);
      let taxesData = [];

      if (Array.isArray(response.data?.data)) {
        taxesData = response.data.data;
      } else if (Array.isArray(response.data)) {
        taxesData = response.data;
      } else if (Array.isArray(response.data?.taxes)) {
        taxesData = response.data.taxes;
      } else {
        setError("Unexpected data format from server.");
        setLoading(false);
        return;
      }

      const formattedTaxes = taxesData.map((tax) => ({
        id: tax._id,
        country: tax.countryName,
        type: tax.taxType,
        rate: tax.rate,
        description: tax.description,
      }));

      setTaxes(formattedTaxes);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching taxes:", err);
      setError("Failed to load taxes. Please try again later.");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewTax({ ...newTax, [e.target.name]: e.target.value });
  };

  const handleAddTax = async () => {
    if (newTax.country && newTax.type && newTax.rate) {
      try {
        const taxData = {
          countryName: newTax.country,
          taxType: newTax.type,
          taxRate: newTax.rate,
          description: newTax.description || "",
        };

        const response = await axios.post(`${API_URL}/api/taxes`, taxData);

        const addedTax = {
          id: response.data.data._id,
          country: response.data.data.countryName,
          type: response.data.data.taxType,
          rate: response.data.data.rate,
          description: response.data.data.description,
        };

        setTaxes([...taxes, addedTax]);
        setNewTax({ country: "", type: "", rate: "", description: "" });
        setNotification("New tax added successfully!");
        setTimeout(() => setNotification(""), 3000);
      } catch {
        setNotification("Failed to add tax. Please try again.");
        setTimeout(() => setNotification(""), 3000);
      }
    } else {
      setNotification("Please fill in all required fields.");
      setTimeout(() => setNotification(""), 3000);
    }
  };

  const handleDeleteTax = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/taxes/${id}`);
      setTaxes(taxes.filter((tax) => tax.id !== id));
      setNotification("Tax deleted successfully!");
      setTimeout(() => setNotification(""), 3000);
    } catch {
      setNotification("Failed to delete tax. Please try again.");
      setTimeout(() => setNotification(""), 3000);
    }
  };

  const handleEditTax = (id) => {
    const taxToEdit = taxes.find((tax) => tax.id === id);
    setNewTax(taxToEdit);
  };

  const handleUpdateTax = async () => {
    if (newTax.id && newTax.country && newTax.type && newTax.rate) {
      try {
        const taxData = {
          countryName: newTax.country,
          taxType: newTax.type,
          taxRate: newTax.rate,
          description: newTax.description || "",
        };

        const response = await axios.put(
          `${API_URL}/api/taxes/${newTax.id}`,
          taxData
        );

        const updatedTaxes = taxes.map((tax) =>
          tax.id === newTax.id
            ? {
                id: response.data.data._id,
                country: response.data.data.countryName,
                type: response.data.data.taxType,
                rate: response.data.data.rate,
                description: response.data.data.description,
              }
            : tax
        );

        setTaxes(updatedTaxes);
        setNewTax({ country: "", type: "", rate: "", description: "" });
        setNotification("Tax updated successfully!");
        setTimeout(() => setNotification(""), 3000);
      } catch {
        setNotification("Failed to update tax. Please try again.");
        setTimeout(() => setNotification(""), 3000);
      }
    } else {
      setNotification("Please fill in all required fields.");
      setTimeout(() => setNotification(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      {notification && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">
          {notification}
        </div>
      )}

      {/* Add/Edit Tax Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          {newTax.id ? "Edit Tax" : "Add New Tax"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 gap-y-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Country</label>
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={newTax.country}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Tax Type</label>
            <input
              type="text"
              name="type"
              placeholder="Tax Type"
              value={newTax.type}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Rate</label>
            <input
              type="text"
              name="rate"
              placeholder="Rate"
              value={newTax.rate}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Description
            </label>
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={newTax.description}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-4 flex flex-col sm:flex-row justify-end gap-3">
            {newTax.id ? (
              <>
                <button
                  onClick={() =>
                    setNewTax({ country: "", type: "", rate: "", description: "" })
                  }
                  className="w-full sm:w-auto bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateTax}
                  className="w-full sm:w-auto bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center"
                >
                  Update Tax
                </button>
              </>
            ) : (
              <button
                onClick={handleAddTax}
                className="w-full sm:w-auto bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center"
              >
                <FaPlus className="mr-2" />
                Add Tax
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tax List Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">Tax Rates</h3>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-4">Loading taxes...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : (
            <table className="w-full min-w-[600px] text-sm">
              <thead className="bg-gray-50">
                <tr className="text-gray-500">
                  <th className="py-3 px-2 sm:px-4 text-left">Country</th>
                  <th className="py-3 px-2 sm:px-4 text-left">Tax Type</th>
                  <th className="py-3 px-2 sm:px-4 text-left">Rate</th>
                  <th className="hidden md:table-cell py-3 px-2 sm:px-4 text-left">
                    Description
                  </th>
                  <th className="py-3 px-2 sm:px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {taxes.map((tax) => (
                  <tr key={tax.id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-2 sm:px-4">{tax.country}</td>
                    <td className="py-3 px-2 sm:px-4">{tax.type}</td>
                    <td className="py-3 px-2 sm:px-4">{tax.rate}</td>
                    <td className="hidden md:table-cell py-3 px-2 sm:px-4">
                      {tax.description}
                    </td>
                    <td className="py-3 px-2 sm:px-4">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleEditTax(tax.id)}
                          className="text-blue-600 hover:text-blue-800 transition"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTax(tax.id)}
                          className="text-red-600 hover:text-red-800 transition"
                        >
                          <MdDelete className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {taxes.length === 0 && !loading && (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">
                      No taxes available. Add new taxes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Tax Cards for Mobile/Tablet */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {taxes.map((tax) => (
          <div key={tax.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-gray-700">{tax.country}</h4>
            </div>
            <div className="text-sm text-gray-600">
              <p>
                <span className="font-medium">Type:</span> {tax.type}
              </p>
              <p>
                <span className="font-medium">Rate:</span> {tax.rate}
              </p>
              <p className="mt-2">{tax.description}</p>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => handleEditTax(tax.id)}
                className="text-blue-600 hover:text-blue-800 transition"
              >
                <FaEdit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteTax(tax.id)}
                className="text-red-600 hover:text-red-800 transition"
              >
                <MdDelete className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaxesAndCharges;
