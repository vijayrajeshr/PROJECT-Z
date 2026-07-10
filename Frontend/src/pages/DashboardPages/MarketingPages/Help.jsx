import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, BookOpen, MessageCircle, HelpCircle, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { Transition } from "@headlessui/react";

export default function Help() {
  const [faqs, setFaqs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openFAQIndex, setOpenFAQIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock categories for Help Cards provided in spec
  // 3.4 REPEATABLE UI ELEMENTS: "Help Cards Displays help categories"
  const categories = [
    { name: "Getting Started", icon: <BookOpen className="w-6 h-6 text-blue-500" />, desc: "Guide to the dashboard modules" },
    { name: "Campaigns", icon: <MessageCircle className="w-6 h-6 text-green-500" />, desc: "Managing emails & content" },
    { name: "Account & Settings", icon: <HelpCircle className="w-6 h-6 text-purple-500" />, desc: "Profile & Configuration" }
  ];

  useEffect(() => {
    const fetchFAQs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/faq`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        let faqsArray = [];
        // Handle various response structures
        if (Array.isArray(data)) faqsArray = data;
        else if (data && Array.isArray(data.data)) faqsArray = data.data;
        else if (data && Array.isArray(data.faqs)) faqsArray = data.faqs;

        if (!faqsArray) throw new Error("Could not find FAQ array in response.");

        // Filter for Marketing category as per requirement
        const marketingFAQs = faqsArray.filter(faq => faq.category === 'Marketing');
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

  const filteredFaqs = faqs.filter(faq =>
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8 space-y-8 font-sans text-gray-800">
      {/* 1. Help Home Header & Search */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-8 md:p-12 text-center text-white shadow-xl">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">How can we help you?</h1>
        <p className="text-blue-100 mb-8 max-w-2xl mx-auto">Browse through our help articles or search for specific questions.</p>

        <div className="max-w-2xl mx-auto relative group">
          <Search className="absolute left-4 top-4 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search for answers (e.g., 'Email templates')..."
            className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-400/50 shadow-lg transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* 2. Help Cards (Categories) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 group">
            <div className="bg-blue-50 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              {cat.icon}
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{cat.name}</h3>
            <p className="text-gray-500 text-sm">{cat.desc}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* 3. Help Articles / FAQs */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-4">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            Common Questions
          </h2>

          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-16 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          ) : error ? (
            <div className="text-red-600 bg-red-50 p-4 rounded-lg flex items-center gap-2">
              <span className="font-bold">Error:</span> {error}
            </div>
          ) : filteredFaqs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No matching help articles found for "{searchQuery}".</p>
              <p className="text-sm mt-2">Try searching for something else or contact support.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFaqs.map((faq, i) => (
                <div key={faq._id || i} className="border border-gray-200 rounded-lg overflow-hidden transition-all hover:border-blue-200">
                  <button
                    onClick={() => toggleFAQ(i)}
                    className="flex justify-between items-center w-full p-4 text-left bg-white hover:bg-gray-50 transition focus:outline-none"
                  >
                    <span className={`font-semibold text-gray-700 ${openFAQIndex === i ? 'text-blue-600' : ''}`}>
                      {faq.q}
                    </span>
                    {openFAQIndex === i ? <ChevronUp className="w-5 h-5 text-blue-500" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </button>
                  <Transition
                    show={openFAQIndex === i}
                    enter="transition-all duration-300 ease-out"
                    enterFrom="max-h-0 opacity-0"
                    enterTo="max-h-96 opacity-100" // Increased max-height for potential long content
                    leave="transition-all duration-200 ease-in"
                    leaveFrom="max-h-96 opacity-100"
                    leaveTo="max-h-0 opacity-0"
                  >
                    <div className="bg-gray-50 px-5 pb-5 pt-0 text-gray-600 text-sm border-t border-gray-100 leading-relaxed">
                      <div className="pt-3">{faq.a}</div>
                    </div>
                  </Transition>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. Support Call to Action */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-6 border border-blue-100 shadow-sm sticky top-6">
            <h3 className="font-bold text-gray-800 text-lg mb-2">Still need help?</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              If you couldn't find the answer in our documentation, our support team is ready to assist you.
            </p>
            <Link
              to="/dashboard/marketing/support"
              className="group block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 transform active:scale-95"
            >
              Raise Support Request <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
