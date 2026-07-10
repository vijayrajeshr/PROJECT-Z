import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDineinBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  
  useEffect(() => {
    const load = async () => {
      try {
     
        const { data } = await axios.get("/api/admin/dinein-bookings");

       
        setBookings(data || []);
      } catch (err) {
        console.error("Failed to fetch dine‑in bookings:", err);
        setError("Failed to load dine‑in bookings.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);


  if (loading) return <p className="p-6 text-lg font-medium">Loading bookings…</p>;
  if (error) return <p className="p-6 text-red-600 font-medium">{error}</p>;

  return (
    <section className="p-6 mt-8 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Dine‑in Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="border px-4 py-2">Customer</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Phone</th>
                <th className="border px-4 py-2">Guests</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Time</th>
                <th className="border px-4 py-2">Restaurant</th>
                <th className="border px-4 py-2">Address</th>
                <th className="border px-4 py-2">Rating</th>
                <th className="border px-4 py-2">Status</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((b) => {
                const firm = b.firm || {};
                const info = firm.restaurantInfo || {};
                const rating = info.ratings || {};

                return (
                  <tr key={b._id} className="border-t hover:bg-gray-50 text-center">
                    <td className="border px-4 py-2">{b.username || "—"}</td>
                    <td className="border px-4 py-2">{b.email || "—"}</td>
                    <td className="border px-4 py-2">{b.mobileNumber || "—"}</td>
                    <td className="border px-4 py-2">{b.guests}</td>
                    <td className="border px-4 py-2">
                      {new Date(b.date).toLocaleDateString()}
                    </td>
                    <td className="border px-4 py-2">{b.timeSlot}</td>
                    <td className="border px-4 py-2">{info.name || "—"}</td>
                    <td className="border px-4 py-2">{info.address || "—"}</td>
                    <td className="border px-4 py-2">{rating.overall ?? "—"}</td>
                    <td className="border px-4 py-2 capitalize">{b.status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default AdminDineinBookings;
