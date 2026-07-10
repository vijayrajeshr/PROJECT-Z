import React, { useState, useEffect } from "react";
import axios from "axios";
import RichTextEditor from "./TempleteEdit";
import HtmlToPlainText from "./HtmlToPlainText";
import { useContextData } from "../../../context/OutletContext";
const PolicyManager = ({ title, title1, defaultPolicies, category }) => {
  const { axiosApi } = useContextData();
  const [policies, setPolicies] = useState(defaultPolicies);
  const [newPolicy, setNewPolicy] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editPolicy, setEditPolicy] = useState("");

  useEffect(() => {
    setPolicies(defaultPolicies);
  }, [defaultPolicies]);

  const handleAddPolicy = () => {
    if (newPolicy.trim() === "") {
      alert("Please enter a valid policy.");
      return;
    }
    setPolicies([...policies, newPolicy]);
    setNewPolicy("");

    axiosApi
      .post(
        `${import.meta.env.VITE_SERVER_URL}/policy/policy/add/${category}`,
        { message: newPolicy, type: title1 }
      )
      .then((response) => {
        console.log(response.data);
        alert("added successfully");
      })
      .catch((error) => {
        alert("failed");
        console.log(error);
      });
  };

  const handleEditPolicy = (index) => {
    setEditIndex(index);
    setEditPolicy(policies[index]);
  };

  const handleSaveEdit = async () => {
    if (editPolicy.trim() === "") {
      alert("Edited policy cannot be empty.");
      return;
    }
    try {
      const updatedPolicies = [...policies];
      updatedPolicies[editIndex] = editPolicy;

      await axiosApi.put(
        `${import.meta.env.VITE_SERVER_URL}/policy/policies/${category}`,
        {
          type: title1,
          index: editIndex,
          newPolicy: editPolicy,
        }
      );

      setPolicies(updatedPolicies);
      setEditIndex(null);
      setEditPolicy("");
      alert("Policy updated successfully.");
    } catch (error) {
      console.error("Error updating policy:", error);
      alert("Failed to update policy.");
    }
  };

  // Delete a Policy
  const handleDeletePolicy = async (index) => {
    if (window.confirm("Are you sure you want to delete this policy?")) {
      setPolicies(policies.filter((_, i) => i !== index));
      alert("Policy deleted successfully.");
    }
    try {
      await axiosApi.delete(
        `${import.meta.env.VITE_SERVER_URL}/policy/policies/${category}`,
        {
          data: { type: "privacyPolicies", index },
        }
      );

      setPolicies(policies.filter((_, i) => i !== index));
      alert("Policy deleted successfully.");
    } catch (error) {
      console.error("Error deleting policy:", error);
      alert("Failed to delete policy.");
    }
  };

  return (
    <div className="bg-white p-4 rounded-md w-full">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>

      {/* Display Policies */}
      <ul className="space-y-4 mt-4">
        {policies.map((policy, index) => (
          <li
            key={index}
            className="flex justify-between items-center border-b border-gray-300 pb-2"
          >
            {editIndex === index ? (
              <div className="flex w-full space-x-2">
                <input
                  type="text"
                  value={editPolicy}
                  onChange={(e) => setEditPolicy(e.target.value)}
                  className="flex-grow border border-gray-300 rounded-md p-2"
                />
                <button
                  onClick={handleSaveEdit}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                >
                  Save
                </button>
              </div>
            ) : (
              <HtmlToPlainText htmlContent={policy} />
              // <p className="text-gray-700 flex-grow">{policy}</p>
            )}
            {editIndex !== index && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditPolicy(index)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeletePolicy(index)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Add New Policy */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-800">
          Add a New Policy
        </h3>
        {/* <div className="flex mt-2 space-x-2">
          <input
            type="text"
            placeholder="Enter a new policy..."
            value={newPolicy}
            onChange={(e) => setNewPolicy(e.target.value)}
            className="flex-grow border border-gray-300 rounded-md p-2"
          />
          <button
            onClick={handleAddPolicy}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Add Policy
          </button>
        </div> */}
        <RichTextEditor body={newPolicy} setBody={setNewPolicy} />
        <button
          onClick={handleAddPolicy}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Add Policy
        </button>
      </div>
    </div>
  );
};

export default PolicyManager;
