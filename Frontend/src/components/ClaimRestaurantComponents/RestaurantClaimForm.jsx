import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Clock } from "lucide-react";
import ClaimForm from "./ClaimForm";
import Header from "./Header";
import axios from "axios";
const dayMap = {
  SundaySun: "Sunday",
  MondayMon: "Monday",
  TuesdayTue: "Tuesday",
  WednesdayWed: "Wednesday",
  ThursdayThu: "Thursday",
  FridayFri: "Friday",
  SaturdaySat: "Saturday",
};

export default function RestaurantClaimForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [restaurant, setrestaurant] = useState({
    name: "",
    location: "",
    cuisine: "",
    address: "",
    phone: "",
    email: "",
    proofOfOwnership: null,
    image: "",
    ownerName: "",
    hours: "",
  });

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/firm/getOne/${id}`,
          { withCredentials: true }
        );
        const data = await response.data;
        setrestaurant(data);
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Claim submitted successfully!");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  console.log(restaurant, "hello");

  return (
    <div className="bg-gray-50">
      <Header />
      <div className="mx-auto">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Restaurants
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
              {restaurant.name}
            </h1>

            <div className="mb-8 overflow-hidden rounded-xl bg-white shadow">
              <div className="relative h-72">
                <img
                  src={restaurant.image_urls?.[1]}
                  alt={restaurant.restaurantInfo.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {restaurant.restaurantInfo.name}
                  </h3>
                  <p className="text-white/90">
                    Cuisine{" "}
                    {restaurant.restaurantInfo.cuisines
                      ?.join(",")
                      ?.slice(0, 30) + "..."}{" "}
                  </p>
                </div>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white">
                <div className="flex   w-full items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-3 text-indigo-600" />
                  <span>{restaurant.restaurantInfo.address}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  {/* {Object.entries(restaurant.opening_hours).map(
                    ([dayKey, time]) => (
                      <div key={dayKey} className="flex justify-between py-1">
                        <span>{dayMap[dayKey] || dayKey}</span>
                        <span>
                          {" "}
                          <Clock className="w-5 h-5 mr-3 text-indigo-600" />{" "}
                          {time}
                        </span>
                      </div>
                    )
                  )} */}
                  <span className="flex items-center justify-center">
                    <Clock className="w-5 h-5 mr-3 text-indigo-600" />
                    {restaurant.opening_hours.SundaySun}
                  </span>
                </div>
              </div>
            </div>

            <ClaimForm
              restaurant={restaurant}
              setrestaurant={setrestaurant}
              handleSubmit={handleSubmit}
              navigate={navigate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
