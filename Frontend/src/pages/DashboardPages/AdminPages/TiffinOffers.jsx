import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TiffinOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [acceptingOfferId, setAcceptingOfferId] = useState(null); // New state for tracking accepting offer

  const fetchOffers = async () => {
    setLoading(true);
    setError(null);
    setMessage('');
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/mail/offers/admin`);
      const data = response.data;

      const allUnacceptedOffers = data;
      setOffers(allUnacceptedOffers);
    } catch (err) {
      console.error("Error fetching offers:", err);
      setError("Failed to load offers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleAcceptOffer = async (offerId) => {
    setMessage('');
    setAcceptingOfferId(offerId); // Set the ID of the offer being accepted
    try {
      const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/mail/admin/accept/${offerId}`, { accept: true }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = response.data;
      setMessage(`Offer '${offerId}' accepted successfully!`);

      // Remove the accepted offer from the UI state
      setOffers(prevOffers => prevOffers.filter(offer => offer._id !== offerId));

    } catch (err) {
      console.error("Error accepting offer:", err);
      setMessage(`Error: ${err.message || 'An unknown error occurred.'}`);
    } finally {
      setAcceptingOfferId(null); // Reset the accepting state
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="ml-4 text-lg text-gray-700">Loading offers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-100 text-red-700 p-4 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans flex flex-col items-center">
      <div className="w-full  rounded-xl p-6">

        {message && (
          <div className={`p-3 mb-4 rounded-md text-center ${message.startsWith('Error') ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
            {message}
          </div>
        )}

        {offers.length === 0 ? (
          <p className="text-center text-gray-600 text-lg py-8">No unaccepted offers to display.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Code</th>
                  <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Type</th>
                  <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Discount</th>
                  <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Scope</th>
                  <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Meal Types</th>
                  <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Starts</th>
                  <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Ends</th>
                  <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => (
                  <tr key={offer._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-800">{offer.name}</td>
                    <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-800">{offer.code}</td>
                    <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-800">{offer.type}</td>
                    <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-800">{offer.discount}{offer.type === 'percentage' ? '%' : ' flat'}</td>
                    <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-800">{offer.scope}</td>
                    <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-800">
                      {offer.mealTypes && offer.mealTypes.length > 0 ? offer.mealTypes.map(mt => mt.label).join(', ') : 'N/A'}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-800">{new Date(offer.startDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-800">{new Date(offer.endDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-800">
                      <button
                        onClick={() => handleAcceptOffer(offer._id)}
                        disabled={acceptingOfferId === offer._id || loading} // Disable if currently accepting or overall loading
                        className={`py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out
                          ${acceptingOfferId === offer._id
                            ? 'bg-yellow-500 text-white cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }
                          ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                      >
                        {acceptingOfferId === offer._id ? 'Accepting...' : 'Accept Offer'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TiffinOffers;
