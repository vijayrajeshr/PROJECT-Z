"use client";

import { useState, useEffect } from "react";
import {
  AiOutlineFilter,
  AiOutlinePlus,
  AiOutlineEdit,
  AiOutlineSync,
} from "react-icons/ai";
import AddOutletModal from "./AddOutletModal";
import EditOutletModal from "./EditOutletModal";
import OutletFilterModal from "./OutletFilterModal";
import OperatingHoursSection from "./OperatingHoursSection";
import { useUser } from "../../../context/userContent";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function OutletDashboard({ setSelectedOutlet }) {
  const [activeTab, setActiveTab] = useState("Outlet Management");
  const [selectedEditOutlet, setSelectedEditOutlet] = useState(null);
  const [outlets, setOutlets] = useState([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [filters, setFilters] = useState({ type: "", status: "" });
  const navigate = useNavigate();

  const [socialLinks, setSocialLinks] = useState({
    instagram: "",
    facebook: "",
    twitter: "",
    website: "",
  });
  const { id } = useParams();
  const { user } = useUser();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_SERVER_URL
          }/claim-rest/restaurants/multiple-firms/${user?.email}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            credentials: "include",
          }
        );
        const result = await response.json();
        const Restaurants = result.data;
        setOutlets(Restaurants);
        const targetOutlet = Restaurants.find((o) => o._id === id);

        if (targetOutlet?.restaurantInfo?.SocialMediaLinks) {
          const links = targetOutlet.restaurantInfo.SocialMediaLinks;

          setSocialLinks({
            instagram: links.instagram || "",
            facebook: links.facebook || "",
            twitter: links.twitter || "",
            website: links.website || "",
          });
        }
      } catch (error) {
        console.error("Error fetching outlets:", error);
        setOutlets([]);
      }
    };

    fetchOutlets();
  }, [token, user?.email]);

  const handleAddOutlet = (newOutlet) => {
    setOutlets([
      ...outlets,
      { ...newOutlet, _id: `temp_${outlets.length + 1}` },
    ]);
    setIsAddModalOpen(false);
    toast.success("Outlet added successfully!");
  };

  const handleEditOutlet = (updatedOutlet) => {
    setOutlets(
      outlets.map((outlet) =>
        outlet._id === updatedOutlet._id ? updatedOutlet : outlet
      )
    );
    setIsEditModalOpen(false);
    setSelectedEditOutlet(null);
    toast.success("Outlet updated successfully!");
  };

  const handleSwitchOutlet = (outletId) => {
    const outletData = outlets.find((o) => o._id === outletId);

    // Only proceed if the outlet exists and is Approved
    if (outletData && outletData.restaurantStatus === "Approved") {
      setSelectedOutlet(outletData);
      navigate(`/outlet-settings/${outletData._id}`);
    } else {
      // Optional: show an alert or toast
      alert("You can only switch to outlets that are Approved.");
    }
  };

  const handleSocialLinkChange = (platform, value) => {
    setSocialLinks((prev) => ({ ...prev, [platform]: value }));
  };

  const handleUpdateSocialLinks = async () => {
    if (
      !Object.values(socialLinks).some(
        (link) => link && /^https?:\/\//.test(link)
      )
    ) {
      toast.error("Please provide at least one valid social media URL");
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/outletAdditionalSettings/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            restaurantInfo: { SocialMediaLinks: socialLinks },
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update social links");
      }
      setOutlets((prevOutlets) =>
        prevOutlets.map((outlet) =>
          outlet._id === id
            ? {
                ...outlet,
                restaurantInfo: {
                  ...outlet.restaurantInfo,
                  SocialMediaLinks: socialLinks,
                },
              }
            : outlet
        )
      );
      toast.success("Social media links updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to update social links");
    }
  };

  const filteredOutlets = outlets.filter(
    (outlet) =>
      (!filters.type ||
        (Array.isArray(outlet.features) &&
          outlet.features.includes(filters.type))) &&
      (!filters.status || outlet.outletStatus === filters.status)
  );

  const tabs = ["Outlet Management", "Operating Hours", "Additional Settings"];

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex justify-center">
      <div className="max-w-5xl w-full bg-white rounded-lg shadow-lg">
        <ToastContainer />
        <div className="flex flex-wrap gap-2 p-4 border-b">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-semibold text-white rounded-lg transition ${
                activeTab === tab
                  ? "bg-red-700 hover:bg-red-800"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "Outlet Management" && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Outlet Management
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilters({ type: "", status: "" })}
                    className="flex items-center px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                    title="Reset Filters"
                  >
                    <AiOutlineSync className="h-5 w-5 mr-2" /> Reset
                  </button>
                  <button
                    onClick={() => setIsFilterModalOpen(true)}
                    className="flex items-center px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                    title="Filter Outlets"
                  >
                    <AiOutlineFilter className="h-5 w-5 mr-2" /> Filter
                  </button>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    title="Add New Outlet"
                  >
                    <AiOutlinePlus className="h-5 w-5 mr-2" /> Add Outlet
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                {filteredOutlets.map((outlet) => (
                  <div
                    key={outlet._id}
                    className="border rounded-lg p-4 bg-gray-50 hover:shadow-md"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">
                          {outlet?.restaurantInfo?.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {outlet?.restaurantInfo?.address ||
                            outlet?.restaurantInfo?.location ||
                            "No address"}
                        </p>
                      </div>
                      <div className="flex justify-center md:justify-start">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            outlet.outletStatus === "Open"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {Array.isArray(outlet.features)
                            ? outlet.features.includes("Takeaway") &&
                              outlet.features.includes("Dine In")
                              ? "Takeaway & Dine-in"
                              : outlet.features.includes("Takeaway")
                              ? "Takeaway"
                              : outlet.features.includes("Dine In")
                              ? "Dine-in"
                              : outlet.features.join(" & ")
                            : outlet.features || "N/A"}{" "}
                          - {outlet.outletStatus || "N/A"} -{" "}
                          <span
                            className={
                              outlet.restaurantStatus === "Approved"
                                ? "text-green-800"
                                : "text-red-800"
                            }
                          >
                            {outlet.restaurantStatus === "Approved"
                              ? "Approved"
                              : outlet.restaurantStatus}
                          </span>
                        </span>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleSwitchOutlet(outlet._id)}
                          className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                          title="Switch to this Outlet"
                        >
                          Switch
                        </button>
                        <button
                          onClick={() => {
                            setSelectedEditOutlet(outlet);
                            setIsEditModalOpen(true);
                          }}
                          className="flex items-center px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                          title="Edit Outlet"
                        >
                          <AiOutlineEdit className="h-5 w-5 mr-2" /> Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === "Operating Hours" && <OperatingHoursSection />}

          {activeTab === "Additional Settings" && (
            <div className="p-4">
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Social Media Links
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["instagram", "facebook", "twitter", "website"].map(
                    (platform) => (
                      <div key={platform} className="p-3 border rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </label>
                        <input
                          type="text"
                          value={socialLinks[platform]}
                          onChange={(e) =>
                            handleSocialLinkChange(platform, e.target.value)
                          }
                          placeholder={`https://${platform}.com/your-${
                            platform === "website" ? "site" : "profile"
                          }`}
                          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                    )
                  )}
                </div>
                <button
                  onClick={handleUpdateSocialLinks}
                  className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Save Social Media Links
                </button>
              </div>
            </div>
          )}
        </div>

        {isAddModalOpen && (
          <AddOutletModal
            onClose={() => setIsAddModalOpen(false)}
            onAdd={handleAddOutlet}
          />
        )}
        {isEditModalOpen && selectedEditOutlet && (
          <EditOutletModal
            outlet={selectedEditOutlet}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedEditOutlet(null);
            }}
            onEdit={handleEditOutlet}
          />
        )}
        {isFilterModalOpen && (
          <OutletFilterModal
            currentFilters={filters}
            onClose={() => setIsFilterModalOpen(false)}
            onApplyFilters={(newFilters) => {
              setFilters(newFilters);
              setIsFilterModalOpen(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
