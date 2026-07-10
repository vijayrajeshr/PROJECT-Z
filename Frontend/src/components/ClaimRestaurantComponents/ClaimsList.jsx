import React, { useState, useEffect } from "react";
import axios from "axios";
import { Eye, Trash2, Check, X } from "lucide-react";

const ClaimsList = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/restaurant-claims`,

          {
            withCredentials: true,
          }
        );
        if (response.data && Array.isArray(response.data.data)) {
          setClaims(response.data.data);
        } else {
          setError("Invalid data format from server");
        }
      } catch (err) {
        setError("Failed to fetch claims");
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await axiosApi.put(
        `${import.meta.env.VITE_SERVER_URL}/api/restaurant-claims/${id}`,
        { status }
      );
      setClaims((prevClaims) =>
        prevClaims.map((claim) =>
          claim._id === id ? { ...claim, status } : claim
        )
      );
    } catch (err) {
      setError("Failed to update claim status");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosApi.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/restaurant-claims/${id}`
      );
      setClaims((prevClaims) => prevClaims.filter((claim) => claim._id !== id));
    } catch (err) {
      setError("Failed to delete claim");
    }
  };

  if (loading) return <div>Loading claims...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Restaurant Claims</h2>
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
              <th className="py-3 px-4 text-left">Restaurant Name</th>
              <th className="py-3 px-4 text-left">Owner</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {claims?.map((claim) => (
              <tr key={claim._id} className="border-b">
                <td className="py-3 px-4">{claim.name}</td>
                <td className="py-3 px-4">{claim.ownerName}</td>
                <td className="py-3 px-4">{claim.email}</td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      claim.status === "pending"
                        ? "bg-yellow-200 text-yellow-800"
                        : claim.status === "approved"
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {claim.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleStatusUpdate(claim._id, "approved")}
                      className="text-green-500 hover:text-green-700"
                    >
                      <Check size={20} />
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(claim._id, "rejected")}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(claim._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            )) || (
              <tr>
                <td colSpan="5" className="py-3 px-4 text-center text-gray-500">
                  No claims available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClaimsList;
