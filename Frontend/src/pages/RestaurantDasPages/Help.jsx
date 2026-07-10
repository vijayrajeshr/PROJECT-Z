import React, { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";

export default function RestaurantHelp() {
  const [faqs, setFaqs] = useState([]);
  const [openFAQIndex, setOpenFAQIndex] = useState(null);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState(null); // State for storing fetch errors

  useEffect(() => {
    const fetchFAQs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/faq`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched data:", data); // Log fetched data for debugging

        // Find the array within the response
        let faqsArray = null;
        if (Array.isArray(data)) {
          faqsArray = data;
        } else if (data && Array.isArray(data.data)) { // Check for { data: [...] }
          faqsArray = data.data;
        } else if (data && Array.isArray(data.faqs)) { // Check for { faqs: [...] }
          faqsArray = data.faqs;
        }

        // Ensure we found an array before filtering
        if (!faqsArray) {
          console.error("Could not find FAQ array in response:", data);
          throw new Error("Unexpected data format received from API. Could not find FAQ array.");
        }

        // Filter FAQs by category "Marketing"
        const marketingFAQs = faqsArray.filter(faq => faq.category === 'Restaurant Dashboard');
        setFaqs(marketingFAQs);
      } catch (error) {
        console.error("Failed to fetch FAQs:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const toggleFAQ = (i) => {
    setOpenFAQIndex(openFAQIndex === i ? null : i);
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-gray-700">Help & Support</h1>

      <div className="bg-white rounded shadow p-4 space-y-3">
        <p className="text-sm text-gray-600">
          Frequently Asked Questions and support resources:
        </p>

        {loading ? (
          <p className="text-sm text-gray-500">Loading FAQs...</p>
        ) : error ? (
          <p className="text-sm text-red-500">Error loading FAQs: {error}</p> // Display error message
        ) : faqs.length === 0 ? (
          <p className="text-sm text-gray-500">No marketing FAQs found.</p> // Specific message for no data
        ) : (
          faqs.map((item, i) => (
            <div key={item._id || i} className="border-b last:border-0 pb-2">
              <button
                onClick={() => toggleFAQ(i)}
                className="flex justify-between items-center w-full py-2 text-left text-gray-700 hover:text-red-500 transition"
              >
                <span className="font-medium">{`${i + 1}. ${item.q}`}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform ${
                    openFAQIndex === i ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <Transition
                show={openFAQIndex === i}
                enter="transition-all duration-300"
                enterFrom="max-h-0 opacity-0"
                enterTo="max-h-40 opacity-100"
                leave="transition-all duration-300"
                leaveFrom="max-h-40 opacity-100"
                leaveTo="max-h-0 opacity-0"
              >
                <p className="text-sm text-gray-600 px-2 mt-1 overflow-hidden">
                  {item.a}
                </p>
              </Transition>
            </div>
          ))
        )}

        <p className="text-sm text-gray-600 mt-4">
          For direct assistance, email us at{" "}
          <span className="text-blue-500 underline cursor-pointer">
            support@zomato-style-app.com
          </span>
        </p>
      </div>
    </div>
  );
}
