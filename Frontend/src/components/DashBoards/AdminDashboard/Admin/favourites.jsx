import React, { useEffect, useState } from "react";

export default function FavoriteRestaurantsTable() {
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favoriteRestaurants")) || [];
    setFavorites(stored);

    const updateFavorites = () => {
      const updated =
        JSON.parse(localStorage.getItem("favoriteRestaurants")) || [];
      setFavorites(updated);
    };

    window.addEventListener("favoritesUpdated", updateFavorites);
    return () =>
      window.removeEventListener("favoritesUpdated", updateFavorites);
  }, []);

  const removeFavorite = (id) => {
    const updated = favorites.filter((f) => f.id !== id);
    setFavorites(updated);
    localStorage.setItem("favoriteRestaurants", JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("favoritesUpdated"));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const filteredFavorites = favorites.filter(
    (r) =>
      r.restaurantName.toLowerCase().includes(searchQuery) ||
      r.restaurantAddress.toLowerCase().includes(searchQuery) ||
      r.contactNumber.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Favorite Restaurants</h2>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search restaurant, address or contact"
            className="border border-gray-300 rounded-lg px-3 py-2 w-72 focus:outline-none focus:ring focus:ring-blue-200"
          />
          <button
            onClick={clearSearch}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Clear
          </button>
        </div>
      </div>

      {filteredFavorites.length === 0 ? (
        <p className="text-gray-500 text-center">No favorite restaurants found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-400 bg-white rounded-lg">
            <thead className="bg-gray-100 border-b border-gray-400">
              <tr>
                <th className="py-3 px-4 border-r border-gray-400 text-left">#</th>
                <th className="py-3 px-4 border-r border-gray-400 text-left">Restaurant Name</th>
                <th className="py-3 px-4 border-r border-gray-400 text-left">Address</th>
                <th className="py-3 px-4 border-r border-gray-400 text-left">Contact</th>
                <th className="py-3 px-4 border-r border-gray-400 text-left">Description</th>
                <th className="py-3 px-4 border-gray-400 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFavorites.map((r, index) => (
                <tr
                  key={r.id}
                  className="hover:bg-gray-50 border-t border-gray-300"
                >
                  <td className="py-3 px-4 border-r border-gray-300">
                    {index + 1}
                  </td>
                  <td className="py-3 px-4 border-r border-gray-300 font-medium">
                    {r.restaurantName}
                  </td>
                  <td className="py-3 px-4 border-r border-gray-300">
                    {r.restaurantAddress}
                  </td>
                  <td className="py-3 px-4 border-r border-gray-300 text-pink-600">
                    {r.contactNumber}
                  </td>
                  <td className="py-3 px-4 border-r border-gray-300">
                    {r.description}
                  </td>
                  <td className="py-3 px-4 text-center border-gray-300">
                    <button
                      onClick={() => removeFavorite(r.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
