import { useEffect, useState } from "react";

const RestaurantClaims = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchClaims = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/restaurant-claims`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        console.log("Fetched Claims:", data);
        if (data.success && Array.isArray(data.data)) {
          setClaims(data.data);
        } else {
          throw new Error("Invalid data format received");
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  // Approve claim handler
  const handleApprove = async (name) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/restaurant-claims/approve/${encodeURIComponent(name)}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
          body: JSON.stringify({ status: "approved" }), // Ensure correct body
        }
      );

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage.message || "Failed to approve claim");
      }

      setClaims((prevClaims) =>
        prevClaims.map((claim) =>
          claim.name === name ? { ...claim, status: "approved" } : claim
        )
      );
    } catch (error) {
      console.error("Error approving claim:", error.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Restaurant Claims</h2>
      {loading ? (
        <p>Loading...</p>
      ) : claims.length === 0 ? (
        <p>No claims found.</p>
      ) : (
        <ul className="space-y-4">
          {claims.map((claim) => (
            <li
              key={claim._id}
              className="p-4 border rounded-lg shadow-md bg-white flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-lg">{claim.name}</h3>
                <p className="text-gray-600">{claim.address}</p>
                <p className="mt-1">Owner: {claim.ownerName}</p>
                <p>
                  Status:{" "}
                  <span
                    className={`font-medium ${
                      claim.status === "approved"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {claim.status}
                  </span>
                </p>
              </div>
              {claim.status !== "approved" && (
                <button
                  onClick={() => handleApprove(claim.name)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Approve
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RestaurantClaims;
