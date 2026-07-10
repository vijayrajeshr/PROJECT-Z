import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoArrowBack } from "react-icons/io5";

const AddressSearch = () => {
  const [city, setCity] = useState("");
  const [localityCounts, setLocalityCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [localityAddresses, setLocalityAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [selectedLocality, setSelectedLocality] = useState(null);

  const navigate = useNavigate();
  const { locality } = useParams();
  const location = useLocation();

  // Fetch city dynamically
  useEffect(() => {
    const fetchCity = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/location`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch location");
        }
        const data = await response.json();
        setCity(data.city);
      } catch (err) {
        console.error("Error fetching location:", err);
      }
    };

    fetchCity();
  }, []);

  // Fetch addresses for the city
  useEffect(() => {
    const fetchCityAddresses = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/addresses/${encodeURIComponent(
            city
          )}`
        );
        if (!response.ok) {
          throw new Error(
            `Failed to fetch addresses for ${city} (Status: ${response.status})`
          );
        }
        const data = await response.json();
        setLocalityCounts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (city) {
      fetchCityAddresses();
    }
  }, [city]);

  // Fetch addresses for a specific locality
  useEffect(() => {
    if (locality) {
      setSelectedLocality(locality);
      fetchLocalityAddresses(locality);
    }
  }, [locality]);

  const fetchLocalityAddresses = async (localityName) => {
    setLoadingAddresses(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/addresses/locality/${encodeURIComponent(localityName)}`
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch locality addresses (Status: ${response.status})`
        );
      }
      const data = await response.json();
      setLocalityAddresses(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleLocalityClick = (localityName) => {
    setSelectedLocality(localityName);
    navigate(`/addresses/${encodeURIComponent(localityName)}`);
  };

  const handleBack = () => {
    setSelectedLocality(null);
    navigate("/addresses");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      {selectedLocality ? (
        <div>
          <button
            onClick={handleBack}
            className="flex items-center text-blue-500 hover:text-blue-700 mb-4"
          >
            <IoArrowBack className="mr-2" />
            Back to Localities
          </button>
          <h2 className="text-2xl font-bold mb-4">
            {selectedLocality} Addresses
          </h2>
          {loadingAddresses ? (
            <div className="flex justify-center items-center py-8">
              <AiOutlineLoading3Quarters className="animate-spin text-blue-500" />
            </div>
          ) : localityAddresses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No addresses found in {selectedLocality}
            </div>
          ) : (
            <div className="space-y-3">
              {localityAddresses.map((address, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="font-medium">{address.address}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <h2 className="text-2xl font-bold">{city} Localities</h2>
            <p className="text-sm text-gray-500">
              Showing {localityCounts.length} unique localities
            </p>
          </div>
          {localityCounts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No localities found in {city}
            </div>
          ) : (
            <div className="space-y-3">
              {localityCounts.map((locality) => (
                <div
                  key={locality.name}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => handleLocalityClick(locality.name)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{locality.name}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        Example: {locality.sampleAddress}
                      </div>
                    </div>
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {locality.count}{" "}
                      {locality.count === 1 ? "address" : "addresses"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressSearch;
